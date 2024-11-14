import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button'
import { useState } from "react";
import axios from "axios";
import { HOST, SIGNUP_ROUTE } from "../utils/constants";
import { toast } from "sonner";

export default function SignUp() {
    const [show, setShow] = useState(false)
    const { register, formState: { errors }, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            const name = data.fullName;
            const email = data.email;
            const password = data.password;

            console.log(name, email, password)
            const response = await axios.post(`${HOST}/${SIGNUP_ROUTE}/`, { name, email, password })
            console.log(response.data)
            toast.success(response.data.message)
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    const handleBtn = () => {
        setShow(!show)
    }

    return (
        <div className="bg-slate-500 w-full h-[100vh] flex items-center justify-center">
            <div className="w-full flex justify-center">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[60vh] flex flex-col justify-center shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="flex items-center justify-center mb-4 text-2xl font-serif">Sign Up</h1>

                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                        {...register("fullName", {
                            required: "Name is required",
                            minLength: { value: 3, message: "Password must be at least 3 characters" }
                        })}
                        aria-invalid={errors.fullName ? "true" : "false"} placeholder="Enter full name"
                    />
                    {errors.fullName && <p role="alert" className="text-red-500">{errors.fullName?.message}</p>}


                    <input
                        className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
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


                    <input className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                        type={show === true ? "text" : "password"} {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "Password must be at least 8 characters" }
                        })}
                        aria-invalid={errors.password ? "true" : "false"} placeholder="Enter password"
                    />
                    <Button className="absolute bottom-9 left-[41vh] w-[10vh]" variant="text" onClick={handleBtn} color="primary">
                        {show === false ? "Show" : "Hide"}
                    </Button>
                    {errors.password && <p role="alert" className="text-red-500 mt-[-5vh]">{errors.password?.message}</p>}

                    <div className="mt-5 flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Sign Up
                        </button>
                        <Link to="/sign-in" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            Have an account? Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
