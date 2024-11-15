import Navbar from '../components/Navbar'
import { HOST, POST_ROUTE, UPLOAD_IMAGE_ROUTE } from '../utils/constants'


import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { AddCircle, RemoveCircleOutline } from '@mui/icons-material';
import Blogs from './Blogs';


const Home = () => {
    const [title, setTitle] = useState("")
    const [blogs, setBlogs] = useState(false)

    const [thumbnailUrl, setThumbnailUrl] = useState("")
    const [summary, setSummary] = useState("")

    const editor = useRef(null);
    const [content, setContent] = useState('');


    const accessToken = localStorage.getItem("access_token");

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };

    const onSubmit = async () => {
        const thumbnail = thumbnailUrl
        try {
            const response = await axios.post(`${HOST}/${POST_ROUTE}/`, { title, content, summary, thumbnail }, { headers })
            console.log(response.data)
            window.location.reload()
        } catch (error) {
            console.log("Error:", error.message);
        }
    };


    const handleImage = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("image", file); // Append the actual file object

            try {
                const response = await axios.post(`${HOST}/${UPLOAD_IMAGE_ROUTE}/`, formData, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                console.log(response.data);
                setThumbnailUrl(response.data.image_url)
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    };

    return (
        <div>
            <Navbar />

            <Blogs />

            {
                blogs === true ?
                    <div className="bg-gray-200 w-full h-[90vh] flex items-center justify-center">
                        <div className="w-full flex justify-center items-center">
                            <div className="bg-white w-[150vh] p-10 flex flex-col justify-center shadow-md rounded mb-4">
                                <input
                                    className="mt-5 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-black"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                <input type="file" placeholder="Upload thumbnail" onChange={handleImage}
                                    accept='.png, .jpg, .jpeg, .svg, .webp' className="border rounded w-full py-2 px-4 text-gray-700 mb-2" />


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
                                        // config={config}
                                        onChange={newContent => { setContent(newContent) }}
                                    />
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <button onClick={onSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div> : null
            }

            <div onClick={() => setBlogs(!blogs)} className='cursor-pointer hover:bg-purple-700 bg-purple-500 rounded-md p-[1vh] w-[7vh] fixed items-center ml-[95vw] bottom-5 justify-center flex'>
                {blogs === false ? <AddCircle className=' text-white' /> : <RemoveCircleOutline className='text-white' />}
            </div>

        </div>
    )
}

export default Home
