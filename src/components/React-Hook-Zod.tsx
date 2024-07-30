import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fetchData from "../api/FetchApi";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";


const formSchema = z.object({
    firstName: z.string().min(1, "Enter FirstName"),
    lastName: z.string().min(1, "Enter LastName"),
    email: z.string().email("Enter valid email address"),
    age: z.number().min(18, "Age must be greater than or equal to 18"),
    gender: z.enum(["male", "female", "others"], { message: "Gender is Required" }),
    address: z.object({
        city: z.string().min(1, "Enter city name"),
        state: z.string().min(1, "Enter state name")
    }),
    hobbies: z.array(
        z.object({
            name: z.string().min(1, "Enter hobby")
        })
    ),
    startDate: z.date(),
    subscribe: z.boolean(),
    referral: z.string().default("")
})

type FormData = z.infer<typeof formSchema>

const ReactHookFormZod = () => {
    const { register, getValues, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            age: 18,
            gender: undefined,
            address: { city: "", state: "" },
            hobbies: [{ name: "" }],
            startDate: new Date(),
            subscribe: false,
            referral: ""
        },
        resolver: zodResolver(formSchema)
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
                <input {...register("firstName")} />
                {errors.firstName && (
                    <p style={{ color: "orangered", fontSize: "small" }}>{errors.firstName.message}</p>
                )}
            </div>
            <div>
                <label>Last Name:</label>
                <input {...register("lastName")} />
                {errors.lastName && (
                    <p style={{ color: "orangered", fontSize: "small" }}>{errors.lastName.message}</p>
                )}
            </div>
            <div>
                <label>Email:</label>
                <input {...register("email")} />
            </div>
            <div>
                <label>Age:</label>
                <input {...register("age")} />
            </div>
            <div>
                <label>Gender:</label>
                <select {...register("gender")}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div>
                <label>Address:</label>
                <input {...register("address.city")} placeholder="City" />
                <input {...register("address.state")} placeholder="State" />
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
                        {...register("referral")}
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

export default ReactHookFormZod