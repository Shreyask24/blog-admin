import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HOST, GET_ROUTE, POST_ROUTE, UPLOAD_IMAGE_ROUTE, SEARCH_POSTS_ROUTE } from '../utils/constants';
import { AddCircle, RemoveCircleOutline } from '@mui/icons-material';
import JoditEditor from 'jodit-react';
import Navbar from '../components/Navbar';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { debounce } from 'lodash';
import { toast } from 'sonner';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [summary, setSummary] = useState("");
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);

    const blogsPerPage = 5;

    const navigate = useNavigate();
    const accessToken = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    const handleSearchDebounced = useCallback(
        debounce(async (searchValue) => {
            try {
                if (searchValue === "") {
                    const { data } = await axios.get(`${HOST}/${GET_ROUTE}`, { headers });
                    setBlogs(data);
                } else {
                    const { data } = await axios.get(`${HOST}/${SEARCH_POSTS_ROUTE}/?q=${searchValue}`, { headers });
                    setBlogs(data);
                }
                setCurrentPage(1);
                setErrorMessage(null);
            } catch (error) {
                setErrorMessage('Error searching blogs');
                toast.error(errorMessage)
            }
        }, 500),
        []
    );

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchText(searchValue);
        handleSearchDebounced(searchValue);
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get(`${HOST}/${GET_ROUTE}`, { headers });
                setBlogs(data);
                setErrorMessage(null);
            } catch (error) {
                setErrorMessage('Error fetching blog');
                toast.error(errorMessage)
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const onSubmit = async () => {
        try {
            const response = await axios.post(`${HOST}/${POST_ROUTE}/`, { title, content, summary, thumbnail: thumbnailUrl }, { headers });
            console.log(response.data);
            window.location.reload();
            setErrorMessage(null);
            toast.success("Created a new post");
        } catch (error) {
            setErrorMessage('Please fill all fields');
            toast.error(errorMessage)

        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            try {
                const response = await axios.post(`${HOST}/${UPLOAD_IMAGE_ROUTE}/`, formData, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                setThumbnailUrl(response.data.image_url);
                setErrorMessage(null);
            } catch (error) {
                setErrorMessage('Error uploading image');
                toast.error(errorMessage)
            }
        }
    };

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center mt-5 mb-5">
                <input
                    type="search"
                    placeholder="Search blogs by title"
                    className="border border-purple-500 w-[40vh] h-[5vh] rounded-md"
                    value={searchText}
                    onChange={handleSearch}
                />
            </div>

            <div className="flex justify-center bg-purple-500 h-[92vh] items-center">
                <div className="flex justify-center text-white flex-col">
                    {currentBlogs.map((blog) => (
                        <div
                            className="cursor-pointer font-serif"
                            key={blog.id}
                            onClick={() => navigate(`/blogs/${blog.id}`)}
                        >
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
                            <button
                                onClick={onSubmit}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div
                onClick={() => setShowForm(!showForm)}
                className="cursor-pointer hover:bg-purple-900 bg-purple-700 rounded-md p-[1vh] w-[7vh] fixed items-center ml-[95vw] bottom-5 justify-center flex"
            >
                {showForm ? <RemoveCircleOutline className="text-white" /> : <AddCircle className="text-white" />}
            </div>

            <div className="flex justify-center items-center mt-5 mb-5">
                <Stack spacing={2}>
                    <Pagination
                        color="secondary"
                        count={Math.ceil(blogs.length / blogsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                </Stack>
            </div>
        </>
    );
};

export default BlogList;