import { ChangeEvent, useState } from "react"
import { FormData } from "../types"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fetchData from "../api/FetchApi";

const SimpleForm = () => {
    const [formData, setFormData] = useState<FormData>({
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
    })
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleHobbyChange = (
        index: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.target;
        const hobbies = [...formData.hobbies];
        hobbies[index]["name"] = value;
        setFormData({
            ...formData,
            hobbies,
        });
    };

    const handleAddHobby = () => {
        let updated = [...formData.hobbies]
        updated.push({ name: "" })
        setFormData({ ...formData, hobbies: updated })
    }

    const removeHobby = (index: number) => {
        const hobbies = [...formData.hobbies];
        hobbies.splice(index, 1);
        setFormData({
            ...formData,
            hobbies,
        });
    };

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({});
        const newErrors: any = {};

        if (!formData.firstName) newErrors.firstName = "First Name is required";
        if (!formData.lastName) newErrors.lastName = "Last Name is required";
        if (!formData.email.match(/^\S+@\S+$/i))
            newErrors.email = "Invalid email address";
        if (formData.age < 18) newErrors.age = "You must be at least 18 years old";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.address.city)
            newErrors.address = { city: "City is required" };
        if (!formData.address.state)
            newErrors.address = { ...newErrors.address, state: "State is required" };

        formData.hobbies.forEach((hobby, index) => {
            if (!hobby.name) {
                if (!newErrors.hobbies) newErrors.hobbies = [];
                newErrors.hobbies[index] = { name: "Hobby name is required" };
            }
        });

        if (formData.subscribe && !formData.referral)
            newErrors.referral = "Referral source is required if subscribing";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetchData(formData)
            console.log(res)
        } catch (error) {
            console.error(error)
        }
        finally {
            setIsSubmitting(false)
        }
    }
    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <div>
                <label>First Name:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                {errors.firstName && (
                    <p style={{ color: "orangered", fontSize: "small" }}>{errors.firstName}</p>
                )}
            </div>
            <div>
                <label>Last Name:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
                <label>Age:</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} />
            </div>
            <div>
                <label>Gender:</label>
                <select name="gender" onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div>
                <label>Address:</label>
                <input type="text" placeholder="city" name="city" value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { city: e.target.value, state: formData.address.state } })} />
                <input type="text" placeholder="state" name="state" value={formData.address.state} onChange={(e) => setFormData({ ...formData, address: { state: e.target.value, city: formData.address.city } })} />
            </div>
            <div>
                <label>Start Date:</label>
                <DatePicker selected={formData.startDate} onChange={(date: Date | null) => setFormData({ ...formData, startDate: date || new Date() })} />
            </div>
            <div>
                <label>Hobbies:</label>
                {formData.hobbies.map((hobby, index) => {
                    return (
                        <div key={index}>
                            <input type="text" value={hobby.name} onChange={(e) => handleHobbyChange(index, e)} placeholder="Enter Hobby" />
                            {formData.hobbies.length > 1 && (
                                <button className="bg-gray-300 px-2 py-1 rounded" type="button" onClick={() => removeHobby(index)}>
                                    Remove Hobby
                                </button>
                            )
                            }
                        </div>
                    )
                })}
                <button onClick={handleAddHobby} className="bg-gray-300 px-2 py-1 rounded">Add Hobby</button>
            </div>
            <div>
                <label>Subscribe to Newsletter:</label>
                <input
                    type="checkbox"
                    checked={formData.subscribe}
                    onChange={(e) =>
                        setFormData({ ...formData, subscribe: e.target.checked })
                    } />
            </div>
            {formData.subscribe && (
                <div>
                    <label>Referral Source:</label>
                    <input
                        type="text"
                        placeholder="How did you hear about us?"
                        value={formData.referral}
                        onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                    />
                </div>
            )}
            <button type="submit" className="bg-gray-300 p-2 rounded" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    )
}

export default SimpleForm