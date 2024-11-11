import { useForm } from "react-hook-form";
import React, { useEffect, useState } from 'react';
import { DELETE_POST_ROUTE, GET_ROUTE, HOST, UPDATE_POST_ROUTE } from '../utils/constants';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Card } from '@mui/material';
import { Edit, Favorite, DeleteSharp } from '@mui/icons-material';
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Blogs = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [blogs, setBlogs] = useState([]);
    const [editState, setEditState] = useState({});
    const [contentState, setContentState] = useState({});
    const [titleState, setTitleState] = useState({});
    const accessToken = localStorage.getItem("access_token");

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 5;

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
                const titleStates = {};

                data.forEach(blog => {
                    editStates[blog.id] = false;
                    contentStates[blog.id] = blog.content;
                    titleStates[blog.id] = blog.title;
                });

                setEditState(editStates);
                setContentState(contentStates);
                setTitleState(titleStates);
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

    const handleTitleChange = (e, blogId) => {
        const newTitle = e.target.value;
        setTitleState(prevState => ({ ...prevState, [blogId]: newTitle }));
    };

    const onSubmit = async (data, blogId) => {
        const updatedContent = contentState[blogId];
        const updatedTitle = titleState[blogId];

        if (!updatedTitle || !updatedContent) {
            console.log("Title or content is missing.");
            return;
        }

        try {
            await axios.put(`${HOST}/${UPDATE_POST_ROUTE}/${blogId}/`, { title: updatedTitle, content: updatedContent }, { headers });
            toggleEdit(blogId);

            setBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog.id === blogId ? { ...blog, title: updatedTitle, content: updatedContent } : blog
                )
            );
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    };

    const handleDelete = async (blogId) => {
        try {
            await axios.delete(`${HOST}/${DELETE_POST_ROUTE}/${blogId}/`, { headers });
            setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
            navigate("/recycle-bin");
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="w-full">
            {currentBlogs.map(blog => (
                <Card key={blog.id} className="p-5">
                    <form onSubmit={handleSubmit(data => onSubmit(data, blog.id))} className="shadow-md p-8 bg-white rounded mb-4">
                        <div onClick={() => toggleEdit(blog.id)} className="text-white cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-md p-2 mt-[-5vh] w-11 items-center ml-[90vw] mb-5">
                            <Edit />
                        </div>

                        <div onClick={() => handleDelete(blog.id)} className="text-white cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-md p-2 mt-[2vh] w-11 items-center ml-[90vw] mb-5">
                            <DeleteSharp />
                        </div>

                        <input
                            value={titleState[blog.id] || ""}
                            onChange={(e) => handleTitleChange(e, blog.id)}
                            disabled={!editState[blog.id]}
                            placeholder="Title"
                            className="border rounded w-full py-2 px-4 text-gray-700 mb-2"
                        />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                        {editState[blog.id] ? (
                            <JoditEditor
                                value={contentState[blog.id]}
                                onChange={(content) => handleContentChange(content, blog.id)}
                            />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
                        )}

                        {editState[blog.id] && (
                            <button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4">
                                Update
                            </button>
                        )}

                        <div className="flex items-center mt-4">
                            <Favorite /> <span className="ml-2">{blog.likes_count}</span>
                        </div>
                        <div>Created: {new Date(blog.created_at).toLocaleString()}</div>
                        <div>Updated: {new Date(blog.updated_at).toLocaleString()}</div>
                    </form>
                </Card>
            ))}

            <div className="flex justify-center items-center">
                <Stack spacing={2} className="mt-4 mb-4 bg-transparent border-none">
                    <Pagination
                        count={Math.ceil(blogs.length / blogsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="secondary"
                    />
                </Stack>
            </div>
        </div>
    );
};

export default Blogs;