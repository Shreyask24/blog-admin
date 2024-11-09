import { useForm } from "react-hook-form";
import React, { useEffect, useState, useRef } from 'react';
import { GET_ROUTE, HOST, UPDATE_POST_ROUTE } from '../utils/constants';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Card } from '@mui/material';
import { Edit, Favorite } from '@mui/icons-material';
import JoditEditor from "jodit-react";

const Blogs = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [blogs, setBlogs] = useState([]);
    const [editState, setEditState] = useState({});
    const [contentState, setContentState] = useState({});
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

        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get(`${HOST}/${GET_ROUTE}`, { headers });
                setBlogs(data);

                const editStates = {};
                const contentStates = {};
                data.forEach(blog => {
                    editStates[blog.id] = false;
                    contentStates[blog.id] = blog.content;
                });
                setEditState(editStates);
                setContentState(contentStates);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, [accessToken]);

    const toggleEdit = (blogId) => {
        setEditState(prevState => ({ ...prevState, [blogId]: !prevState[blogId] }));
    };

    const handleContentChange = (content, blogId) => {
        setContentState(prevState => ({ ...prevState, [blogId]: content }));
    };

    const onSubmit = async (data, blogId) => {
        const updatedContent = contentState[blogId];
        if (!data.title || !updatedContent) {
            console.log("Title or content is missing.");
            return;
        }

        try {
            await axios.put(`${HOST}/${UPDATE_POST_ROUTE}/${blogId}/`, { title: data.title, content: updatedContent }, { headers });
            toggleEdit(blogId);
            window.location.reload();
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    };

    return (
        <div className="w-full">
            {blogs.map(blog => (
                <Card key={blog.id} className="p-5">
                    <form onSubmit={handleSubmit(data => onSubmit(data, blog.id))} className="shadow-md p-8 bg-white rounded mb-4">

                        {/* Edit Icon */}
                        <div onClick={() => toggleEdit(blog.id)} className="text-white cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-md p-2 mt-[-5vh] w-11 items-center ml-[90vw] mb-5">
                            <Edit />
                        </div>

                        {/* Title Input */}
                        <input
                            defaultValue={blog.title}
                            onChange={(e) => setValue("title", e.target.value)}
                            disabled={!editState[blog.id]}
                            {...register("title", { required: "Title is required" })}
                            placeholder="Title"
                            className="border rounded w-full py-2 px-4 text-gray-700 mb-2"
                        />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                        {/* Content Editor */}
                        {editState[blog.id] ? (
                            <JoditEditor
                                value={contentState[blog.id]}
                                onChange={(content) => handleContentChange(content, blog.id)}
                            />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
                        )}

                        {/* Update Button */}
                        {editState[blog.id] && (
                            <button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4">
                                Update
                            </button>
                        )}

                        {/* Blog Info */}
                        <div className="flex items-center mt-4">
                            <Favorite /> <span className="ml-2">{blog.likes_count}</span>
                        </div>
                        <div>Created: {new Date(blog.created_at).toLocaleString()}</div>
                        <div>Updated: {new Date(blog.updated_at).toLocaleString()}</div>
                    </form>
                </Card>
            ))}
        </div>
    );
};

export default Blogs;
