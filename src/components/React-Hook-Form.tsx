import { FormData } from "../types"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fetchData from "../api/FetchApi";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";


const ReactHookForm = () => {
    const { register, getValues, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            age: 18,
            gender: "",
            address: { city: "", state: "" },
            hobbies: [{ name: "" }],
            startDate: new Date(),
            subscribe: false,
            referral: ""
        }
    })

    const { fields, append, remove } = useFieldArray({ control, name: "hobbies" })

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const res = await fetchData(data)
            console.log(res)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit((onSubmit))}>
            <div>
                <label>First Name:</label>
                <input {...register("firstName", { required: "First Name is required" })} />
                {errors.firstName && (
                    <p style={{ color: "orangered", fontSize: "small" }}>{errors.firstName.message}</p>
                )}
            </div>
            <div>
                <label>Last Name:</label>
                <input {...register("lastName", { required: "Last Name is required" })} />
                {errors.lastName && (
                    <p style={{ color: "orangered", fontSize: "small" }}>{errors.lastName.message}</p>
                )}
            </div>
            <div>
                <label>Email:</label>
                <input {...register("email", { required: "Email is required" })} />
            </div>
            <div>
                <label>Age:</label>
                <input {...register("age", { required: "Age is required", min: { value: 18, message: "you must be above 18" } })} />
            </div>
            <div>
                <label>Gender:</label>
                <select {...register("gender", { required: "Gender is required" })}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div>
                <label>Address:</label>
                <input {...register("address.city", { required: "City is required" })} placeholder="City" />
                <input {...register("address.state", { required: "State is required" })} placeholder="State" />
            </div>
            <div>
                <label>Start Date:</label>
                <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                        <DatePicker
                            placeholderText="Select date"
                            onChange={(date: Date | null) => field.onChange(date)}
                            selected={field.value}
                        />
                    )}
                />
            </div>
            <div>
                <label>Hobbies:</label>
                {fields.map((hobby, index) => {
                    return (
                        <div key={hobby.id}>
                            <input {...register(`hobbies.${index}.name`)} placeholder="Enter Hobby" />
                            {fields.length > 1 && (
                                <button className="bg-gray-300 px-2 py-1 rounded" type="button" onClick={() => remove(index)}>
                                    Remove Hobby
                                </button>
                            )
                            }
                        </div>
                    )
                })}
                <button onClick={() => append({ name: "" })} className="bg-gray-300 px-2 py-1 rounded">Add Hobby</button>
            </div>
            <div>
                <label>Subscribe to Newsletter:</label>
                <input
                    type="checkbox"
                    {...register("subscribe")}
                />
            </div>
            {getValues("subscribe") && (
                <div>
                    <label>Referral Source:</label>
                    <input
                        {...register("referral", { required: "Referral is required" })}
                        placeholder="How did you hear about us?"
                    />
                </div>
            )}
            <button type="submit" className="bg-gray-300 p-2 rounded" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    )
}

export default ReactHookForm