import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { HOST, SIGNIN_ROUTE } from "../utils/constants";
import { toast } from "sonner";

export default function SignIn() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)

    const { register, formState: { errors }, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        try {
            const email = data.email;
            const password = data.password;

            console.log(email, password)
            const response = await axios.post(`${HOST}/${SIGNIN_ROUTE}/`, { email, password })
            console.log(response.data)

            toast.success(response.data.message)
            localStorage.setItem("access_token", response.data.access)
            window.location.reload()
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
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[80vh] flex flex-col justify-center shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="flex items-center justify-center mb-4 text-2xl font-serif">Sign In</h1>

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
                    <Button className="absolute bottom-9 left-[61vh] w-[10vh]" variant="text" onClick={handleBtn} color="primary">
                        {show === false ? "Show" : "Hide"}
                    </Button>
                    {errors.password && <p role="alert" className="text-red-500 mt-[-5vh]">{errors.password?.message}</p>}
                    <div className="mt-5 flex items-center justify-between">
                        <div>

                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Sign In
                            </button>
                        </div>
                        <div>

                            <Link to="/sign-up" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                                Don't Have an account? Sign Up
                            </Link>
                        </div>
                        <div>

                            <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
