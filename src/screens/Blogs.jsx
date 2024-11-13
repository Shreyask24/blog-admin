import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from 'react';
import { ARCHIEVED_ROUTE, DELETE_POST_ROUTE, GET_ROUTE, HOST, SEARCH_POSTS_ROUTE, UPDATE_POST_ROUTE } from '../utils/constants';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Card } from '@mui/material';
import { Edit, Favorite, DeleteSharp, ArchiveOutlined, SearchOffOutlined, SearchOutlined } from '@mui/icons-material';
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { debounce } from "lodash";

const Blogs = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [blogs, setBlogs] = useState([]);
    const [editState, setEditState] = useState({});
    const [contentState, setContentState] = useState({});
    const [titleState, setTitleState] = useState({});
    const [summaryState, setSummaryState] = useState({});
    const [thumbnailUrl, setThumbnailUrl] = useState({});
    const [isArchived, setIsArchived] = useState({});
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem("access_token");
    const [isDeleted, setIsDeleted] = useState({});

    const [searchText, setSearchText] = useState("");


    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 5;

    const handleSearchDebounced = useCallback(
        debounce(async (searchValue) => {
            if (searchValue === "") {
                const { data } = await axios.get(`${HOST}/${GET_ROUTE}`, { headers });
                setBlogs(data);
            } else {
                const response = await axios.get(`${HOST}/${SEARCH_POSTS_ROUTE}/${searchValue}/`, { headers });
                setBlogs(response.data);
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
        if (!accessToken) {
            console.log("No access token found");
            return;
        }

        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${HOST}/${GET_ROUTE}`, { headers });
                setBlogs(data);

                const editStates = {};
                const contentStates = {};
                const titleStates = {};
                const summaryStates = {};
                const thumbnailUrls = {};
                const archivedStates = {};

                data.forEach(blog => {
                    editStates[blog.id] = false;
                    contentStates[blog.id] = blog.content;
                    titleStates[blog.id] = blog.title;
                    summaryStates[blog.id] = blog.summary;
                    thumbnailUrls[blog.id] = blog.thumbnail;
                    archivedStates[blog.id] = blog.is_archived;
                    isDeleted[blog.id] = blog.is_deleted;
                });

                setEditState(editStates);
                setContentState(contentStates);
                setTitleState(titleStates);
                setSummaryState(summaryStates);
                setThumbnailUrl(thumbnailUrls);
                setIsArchived(archivedStates);
                setIsDeleted(isDeleted)
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [accessToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const toggleEdit = (blogId) => {
        setEditState(prevState => {
            const newEditState = !prevState[blogId];

            // Update URL based on edit state
            if (newEditState) {
                navigate(`/blogs/${blogId}/edit`); // Navigate to the edit URL when editing
            } else {
                navigate(`/blogs`); // Go back to the main blogs list when not editing
            }

            return { ...prevState, [blogId]: newEditState };
        });
    };

    const handleContentChange = (content, blogId) => {
        setContentState(prevState => ({ ...prevState, [blogId]: content }));
    };

    const handleTitleChange = (e, blogId) => {
        const newTitle = e.target.value;
        setTitleState(prevState => ({ ...prevState, [blogId]: newTitle }));
    };

    const handleSummaryChange = (e, blogId) => {
        const newSummary = e.target.value;
        setSummaryState(prevState => ({ ...prevState, [blogId]: newSummary }));
    };

    const onSubmit = async (data, blogId) => {
        const updatedContent = contentState[blogId];
        const updatedTitle = titleState[blogId];
        const updatedSummary = summaryState[blogId];

        if (!updatedTitle || !updatedContent) {
            console.log("Title or content is missing.");
            return;
        }

        try {
            await axios.put(`${HOST}/${UPDATE_POST_ROUTE}/${blogId}/`, { title: updatedTitle, content: updatedContent, summary: updatedSummary, thumbnail: thumbnailUrl[blogId] }, { headers });
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
            const response = await axios.delete(`${HOST}/${DELETE_POST_ROUTE}/${blogId}/`, { headers });
            console.log(response.data)
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    const handleArchived = async (blogId) => {
        const newArchivedStatus = !isArchived[blogId];

        try {
            await axios.patch(`${HOST}/${ARCHIEVED_ROUTE}/${blogId}/`, { is_archived: newArchivedStatus }, { headers });
            setIsArchived(prevState => ({ ...prevState, [blogId]: newArchivedStatus }));
        } catch (error) {
            console.error("Error archiving blog:", error);
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
            <div className=" flex justify-center items-center mt-5 mb-5">
                <input type="search" placeholder="Search blogs by title" className="border border-purple-500 w-[40vh] h-[5vh] rounded-md" value={searchText} onChange={handleSearch} name="" id="" />

            </div>

            {currentBlogs.map(blog => (
                <Card key={blog.id} className="p-5">

                    <form onSubmit={handleSubmit(data => onSubmit(data, blog.id))} className="shadow-md p-8 bg-white rounded mb-4">
                        <div>
                            <div onClick={() => toggleEdit(blog.id)} className="text-white cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-md p-2 mt-[-5vh] w-11 items-center ml-[90vw] mb-5">
                                <Edit />
                            </div>

                            <div onClick={() => handleDelete(blog.id)} className="text-white cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-md p-2 mt-[2vh] w-11 items-center ml-[90vw] mb-5">
                                <DeleteSharp />
                            </div>

                            <div onClick={() => handleArchived(blog.id)} className="text-white cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-md p-2 mt-[2vh] w-11 items-center ml-[90vw] mb-5">
                                <ArchiveOutlined />
                            </div>
                        </div>
                        <div className="w-[40vw]">
                            <img src={thumbnailUrl[blog.id]} className="border border-none rounded-lg mb-5" alt="" />
                        </div>

                        <input
                            value={titleState[blog.id] || ""}
                            onChange={(e) => handleTitleChange(e, blog.id)}
                            disabled={!editState[blog.id]}
                            placeholder="Title"
                            className="border rounded w-full py-2 px-4 text-gray-700 mb-2"
                        />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                        <input
                            value={summaryState[blog.id] || ""}
                            onChange={(e) => handleSummaryChange(e, blog.id)}
                            disabled={!editState[blog.id]}
                            placeholder="Summary"
                            className="border rounded w-full py-2 px-4 text-gray-700 mb-2"
                        />
                        {errors.summary && <p className="text-red-500">{errors.summary.message}</p>}

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
                        <div>Archived: {isArchived[blog.id] ? 'Yes' : 'No'}</div>
                        <div>Soft Deleted: {isDeleted[blog.id] ? 'Yes' : 'No'}</div>
                    </form>
                </Card>
            ))}

            <div className="flex justify-center items-center  mt-5 mb-5">

                <Stack spacing={2}>
                    <Pagination color="secondary" count={Math.ceil(blogs.length / blogsPerPage)} page={currentPage} onChange={handlePageChange} />
                </Stack>
            </div>
        </div>
    );
};

export default Blogs;