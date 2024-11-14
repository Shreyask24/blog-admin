import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import Button from '@mui/material/Button'
import { useState } from "react";
import axios from "axios";
import { HOST, RESETPASSWORD_ROUTE, SIGNUP_ROUTE } from "../utils/constants";
import { toast } from "sonner";

export default function ResetPassword() {
    const location = useLocation();
    const accessToken = localStorage.getItem("access_token"); // Ensure resetToken has a default empty value
    console.log("Received resetToken:", accessToken); // Check if the token is being received

    const [show, setShow] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { register, formState: { errors }, handleSubmit, watch } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            const token = accessToken
            const confirm_password = data.confirm_password;
            const password = data.password;

            console.log(token, password, confirm_password)
            const response = await axios.post(`${HOST}/${RESETPASSWORD_ROUTE}/`, { token, password, confirm_password })
            console.log(response.data)
            toast.success(response.data.message)
        } catch (error) {
            console.log("Error:", error.message);
        }
    };


    return (
        <div className="bg-slate-500 w-full h-[100vh] flex items-center justify-center">
            <div className="w-full flex justify-center">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[60vh] flex flex-col justify-center shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="flex items-center justify-center mb-4 text-2xl font-serif">Reset Password</h1>



                    <input className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                        type={show === true ? "text" : "password"} {...register("password", {
                            required: "Password is required",
                            minLength: { value: 8, message: "Password must be at least 8 characters" }
                        })}
                        aria-invalid={errors.password ? "true" : "false"} placeholder="Enter password"
                    />
                    <Button className="absolute bottom-9 left-[41vh] w-[10vh]" variant="text" onClick={() => setShow(!show)} color="primary">
                        {show === false ? "Show" : "Hide"}
                    </Button>
                    {errors.password && <p role="alert" className="text-red-500 mt-[-5vh]">{errors.password?.message}</p>}


                    <input className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                        type={showConfirmPassword === true ? "text" : "password"} {...register("confirm_password", {
                            required: "Confirm Password is required",
                            minLength: { value: 8, message: "Password must be at least 8 characters" },
                            validate: value => value === password || "Passwords do not match"
                        })}
                        aria-invalid={errors.confirm_password ? "true" : "false"} placeholder="Enter confirm Password"
                    />
                    <Button className="absolute bottom-9 left-[41vh] w-[10vh]" variant="text" onClick={() => setShowConfirmPassword(!showConfirmPassword)} color="primary">
                        {showConfirmPassword === false ? "Show" : "Hide"}
                    </Button>
                    {errors.confirm_password && <p role="alert" className="text-red-500 mt-[-5vh]">{errors.confirm_password?.message}</p>}


                    <div className="mt-5 flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Reset Password
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}
