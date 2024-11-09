import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOST, PROFILE_ROUTE, UPDATE_PROFILE_ROUTE } from "../utils/constants";
import { ArrowBack, Edit, HolidayVillage } from "@mui/icons-material";

const Profile = () => {
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const { register, formState: { errors }, handleSubmit, setValue, watch } = useForm();
    const accessToken = localStorage.getItem("access_token");

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    useEffect(() => {
        if (!accessToken) {
            console.log("No access token found");
            return;
        }

        async function getData() {
            try {
                const response = await axios.get(`${HOST}/${PROFILE_ROUTE}/`, { headers });
                console.log(response.data);
                setValue("fullName", response.data.name);
                setValue("email", response.data.email);
            } catch (error) {
                console.log("Error fetching profile data:", error);
            }
        }

        getData();
    }, [setValue]);

    const onSubmit = async (data) => {
        const name = watch("fullName"); // Get the latest value of fullName

        // Check if name is empty and log data for debugging
        if (!name) {
            console.log("Error: Name is empty.");
            return;
        }
        console.log("Form Data Submitted:", data); // Debugging payload

        try {
            setEdit(!edit)
            const response = await axios.patch(`${HOST}/${UPDATE_PROFILE_ROUTE}/`, { name }, { headers });
            console.log(response.data);
        } catch (error) {
            console.log("Error updating profile:", error);
        }
    };

    const handleEdit = () => {
        setEdit(!edit);
    };

    return (
        <div className="bg-slate-500 w-full h-[100vh] flex items-center justify-center">
            <div className="w-full flex justify-center">
                <div onClick={() => navigate("/blogs")} className="text-white h-max cursor-pointer absolute right-[61vw] mt-4 hover:bg-purple-700 bg-purple-500 rounded-md  p-[1vh] w-[6vh]">
                    <ArrowBack />

                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white w-[60vh] flex flex-col justify-center shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="flex items-center justify-center mb-4 text-2xl font-serif">Profile</h1>
                    <div onClick={handleEdit} className="text-white ml-[48vh] cursor-pointer mb-7 hover:bg-purple-700 bg-purple-500 rounded-md p-[1vh] w-[6vh]">
                        <Edit />
                    </div>

                    <input
                        onChange={(e) => setValue("fullName", e.target.value)} // Directly update react-hook-form value
                        disabled={!edit}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                        {...register("fullName", {
                            required: "Name is required",
                            minLength: { value: 3, message: "Name must be at least 3 characters" }
                        })}
                        aria-invalid={errors.fullName ? "true" : "false"}
                        placeholder="Enter full name"
                    />
                    {errors.fullName && <p role="alert" className="text-red-500">{errors.fullName?.message}</p>}

                    <input
                        disabled
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
                    {errors.email && <p role="alert" className="text-red-500">{errors.email.message}</p>}

                    <div className="mt-5 flex items-center justify-between">
                        <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Update
                        </button>

                        <div>

                            <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-purple-500 hover:text-purple-800">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                </form>
            </div>
        </div >
    );
};

export default Profile;
