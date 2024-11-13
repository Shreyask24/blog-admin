import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CHANGE_PASSWORD_ROUTE, HOST } from "../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const location = useLocation();
    const { userId } = location.state || {};

    const navigate = useNavigate();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const { register, formState: { errors }, handleSubmit, setError } = useForm();

    const accessToken = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    const onSubmit = async (data) => {
        const { currentPassword, newPassword } = data;

        if (currentPassword === newPassword) {
            setError("newPassword", {
                type: "manual",
                message: "New password should not be the same as the current password"
            });
            return;
        }

        try {
            const response = await axios.post(`${HOST}/${CHANGE_PASSWORD_ROUTE}/${userId}/`, { currentPassword, newPassword }, { headers });

            console.log(response.data);

            alert(response.data.message);
            navigate("/profile");
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-[100vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[80vh] flex flex-col justify-center shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="flex items-center justify-center mb-4 text-2xl font-serif">Change Password</h1>

                {/* Current Password Input */}
                <input
                    className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                    type={showCurrentPassword ? "text" : "password"}
                    {...register("currentPassword", {
                        required: "Current Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" }
                    })}
                    aria-invalid={errors.currentPassword ? "true" : "false"}
                    placeholder="Enter Current password"
                />
                <Button className="absolute bottom-9 left-[61vh] w-[10vh]" variant="text" onClick={() => setShowCurrentPassword(!showCurrentPassword)} color="primary">
                    {showCurrentPassword ? "Hide" : "Show"}
                </Button>
                {errors.currentPassword && <p role="alert" className="text-red-500 mt-[-5vh]">{errors.currentPassword.message}</p>}

                {/* New Password Input */}
                <input
                    className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword", {
                        required: "New Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" }
                    })}
                    aria-invalid={errors.newPassword ? "true" : "false"}
                    placeholder="Enter New password"
                />
                <Button className="absolute bottom-9 left-[61vh] w-[10vh]" variant="text" onClick={() => setShowNewPassword(!showNewPassword)} color="primary">
                    {showNewPassword ? "Hide" : "Show"}
                </Button>
                {errors.newPassword && <p role="alert" className="text-red-500 mt-[-5vh]">{errors.newPassword.message}</p>}

                <div className="mt-5 flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;