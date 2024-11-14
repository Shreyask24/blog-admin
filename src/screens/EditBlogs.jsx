import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { HOST, GET_ROUTE, UPDATE_POST_ROUTE, DELETE_POST_ROUTE, ARCHIEVED_ROUTE } from '../utils/constants';
import DOMPurify from 'dompurify';
import JoditEditor from 'jodit-react';
import { Edit, DeleteSharp, ArchiveOutlined, Favorite } from '@mui/icons-material';
import { toast } from 'sonner';

const EditBlogs = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const accessToken = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`${HOST}/${UPDATE_POST_ROUTE}/${blogId}/`, { headers });
                setBlog(data);
                setTitle(data.title);
                setSummary(data.summary);
                setContent(data.content);
                setThumbnailUrl(data.thumbnail);
                setErrorMessage(null);
            } catch (error) {
                setErrorMessage(error.response?.data?.detail || 'Error fetching blog');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${HOST}/${UPDATE_POST_ROUTE}/${blogId}/`, { title, summary, content }, { headers });
            setEditMode(false);
            setBlog({ ...blog, title, summary, content });
            setErrorMessage(null);
            toast.success("Post updated successfully");
        } catch (error) {
            setErrorMessage(error.response?.data?.detail || 'Error updating blog');
        }
    };

    const handleToggleEdit = () => setEditMode(!editMode);

    const handleDelete = async () => {
        try {
            await axios.delete(`${HOST}/${DELETE_POST_ROUTE}/${blogId}/`, { headers });
            setErrorMessage(null);
            toast.success('Blog deleted successfully');
        } catch (error) {
            setErrorMessage(error.response?.data?.detail || 'Error deleting blog');
        }
    };

    const handleArchive = async () => {
        try {
            const archivedStatus = !blog.is_archived;
            await axios.patch(`${HOST}/${ARCHIEVED_ROUTE}/${blogId}/`, { is_archived: archivedStatus }, { headers });
            setBlog({ ...blog, is_archived: archivedStatus });
            setErrorMessage(null);

            archivedStatus === true ? toast.success("Archived Successfully!") : toast.success("Unarchived successfully");
        } catch (error) {
            setErrorMessage(error.response?.data?.detail || 'Error archiving blog');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (errorMessage) return <div>{errorMessage}</div>;
    if (!blog) return <div>Blog not found</div>;

    return (
        <>
            <div>
                <div className='flex justify-end bg-white'>
                    <div className="text-white cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-md mr-4 p-2 w-11 items-center mb-5" onClick={handleToggleEdit}>
                        <Edit />
                    </div>
                    <div onClick={handleDelete} className="text-white cursor-pointer hover:bg-purple-700 bg-purple-500 mr-4 rounded-md p-2 w-11 items-center mb-5">
                        <DeleteSharp />
                    </div>
                    <div onClick={handleArchive} className="text-white cursor-pointer hover:bg-purple-700 mr-4 bg-purple-500 rounded-md p-2 w-11 items-center mb-5">
                        <ArchiveOutlined />
                    </div>
                </div>
                {editMode ? (
                    <form onSubmit={handleUpdate} className="shadow-md p-8 bg-white rounded mb-4">
                        <div className="w-[40vw]">
                            <img src={thumbnailUrl} className="border border-none rounded-lg mb-5" alt="" />
                        </div>

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="border rounded w-full py-2 px-4 text-gray-700 mb-2"
                        />
                        <input
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Summary"
                            className="border rounded w-full py-2 px-4 text-gray-700 mb-2"
                        />
                        <JoditEditor
                            value={content}
                            onChange={(newContent) => setContent(newContent)}
                        />
                        <button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Update
                        </button>
                    </form>
                ) : (
                    <div className='p-5'>
                        <h1 className='text-2xl font-bold'>{blog.title}</h1>
                        <img src={blog.thumbnail} alt="" />
                        <h2 className='text-lg font-semibold'>{blog.summary}</h2>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
                    </div>
                )}
                <div className='p-5'>
                    <div className="flex items-center">
                        <Favorite /> <span className="ml-2">{blog.claps}</span>
                    </div>
                    <div>Created: {new Date(blog.created_at).toLocaleString()}</div>
                    <div>Updated: {new Date(blog.updated_at).toLocaleString()}</div>
                    <div>Archived: {blog.is_archived ? 'Yes' : 'No'}</div>
                    <div>Soft Deleted: {blog.is_deleted ? 'Yes' : 'No'}</div>
                </div>
            </div>
        </>
    );
};

export default EditBlogs;