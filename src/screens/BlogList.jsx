// BlogList.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HOST, GET_ROUTE, POST_ROUTE, UPLOAD_IMAGE_ROUTE } from '../utils/constants';
import { AddCircle, RemoveCircleOutline } from '@mui/icons-material';
import JoditEditor from 'jodit-react';
import Navbar from '../components/Navbar';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [summary, setSummary] = useState("");
    const editor = useRef(null);
    const [content, setContent] = useState('');

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get(`${HOST}/${GET_ROUTE}`, { headers });
                setBlogs(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const onSubmit = async () => {
        const thumbnail = thumbnailUrl;
        try {
            const response = await axios.post(`${HOST}/${POST_ROUTE}/`, { title, content, summary, thumbnail }, { headers });
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                const response = await axios.post(`${HOST}/${UPLOAD_IMAGE_ROUTE}/`, formData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                console.log(response.data);
                setThumbnailUrl(response.data.image_url);
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="flex justify-center bg-purple-500 h-[92vh] items-center">
                <div className="flex justify-center text-white flex-col">
                    {blogs.map((blog) => (
                        <div className="cursor-pointer font-serif" key={blog.id} onClick={() => navigate(`/blogs/${blog.id}`)}>
                            <h2 className="text-2xl font-bold">{blog.title}</h2>
                            <img src={blog.thumbnail} alt="" style={{ width: '100px', height: 'auto' }} />
                            <p className="mb-10">{blog.summary}</p>
                        </div>
                    ))}
                </div>
            </div>

            {showForm && (
                <div className="bg-gray-200 w-full h-[90vh] flex items-center justify-center">
                    <div className="w-full flex justify-center items-center">
                        <div className="bg-white w-[150vh] p-10 flex flex-col justify-center shadow-md rounded mb-4">
                            <input
                                className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                                type="file"
                                placeholder="Upload thumbnail"
                                onChange={handleImage}
                                accept=".png, .jpg, .jpeg, .svg, .webp"
                                className="border rounded w-full py-2 px-4 text-gray-700 mb-2"
                            />
                            <input
                                className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                                placeholder="Summary"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                            <div>
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    onChange={(newContent) => setContent(newContent)}
                                />
                            </div>
                            <div className="mt-5 flex items-center justify-between">
                                <button onClick={onSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div
                onClick={() => setShowForm(!showForm)} // Toggle showForm on icon click
                className="cursor-pointer hover:bg-purple-900 bg-purple-700 rounded-md p-[1vh] w-[7vh] fixed items-center ml-[95vw] bottom-5 justify-center flex"
            >
                {showForm ? <RemoveCircleOutline className="text-white" /> : <AddCircle className="text-white" />}
            </div>
        </>
    );
};

export default BlogList;