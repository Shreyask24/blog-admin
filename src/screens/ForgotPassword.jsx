import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FORGOTPASSWORD_ROUTE, HOST } from "../utils/constants";
import axios from "axios";
import OTPInput from "../components/OTP";

const ForgotPassword = () => {
    const [display, setDisplay] = useState(false)
    const [email, setEmail] = useState("")
    const { register, formState: { errors }, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            const email = data.email;
            setEmail(email)
            console.log(email)
            const response = await axios.post(`${HOST}/${FORGOTPASSWORD_ROUTE}/`, { email })
            console.log(response.data)
            alert(response.data.message)
            setDisplay(true)
        } catch (error) {
            console.log("Error:", error.message);
        }
    };



    return (
        <div className="bg-black w-full h-[100vh]">

            <div className="flex flex-col justify-center items-center pt-[20vh]">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[60vh] flex flex-col justify-center shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <input
                        className="mt-5 shadow appearance-none border rounded w-[50vh] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                        {...register("email", {
                            required: "Email Address is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address",
                            },
                        })}
                        aria-invalid={errors.email ? "true" : "false"}
                        placeholder="Enter email ID"
                    />
                    {errors.email && (
                        <p role="alert" className="text-red-500">{errors.email.message}</p>
                    )}

                    <div className="mt-5 flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Next
                        </button>

                    </div>
                </form>
            </div>

            <div>

                {
                    display === true ? (
                        <div className="bg-black mt-10">
                            <OTPInput email={email} />
                            <h1 className="text-white items-center justify-center flex mt-5">Please check your email and enter the OTP</h1>
                        </div>
                    ) : null
                }
            </div>
        </div>

    )

}


export default ForgotPassword