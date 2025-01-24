<!-- Dash ProfilePage Code without upload file utility -->

import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import {
updateStart,
updateSuccess,
updateFailure,
deleteUserStart,
deleteUserSuccess,
deleteUserFailure,
signOutSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
const { currentUser, error, loading } = useSelector((state) => state.user);
const [imageFile, setImageFile] = useState(null);
const [imageFileUrl, setImageFileUrl] = useState(null);
const [imageFileUploading, setImageFileUploading] = useState(false);
const [imageFileUploadError, setImageFileUploadError] = useState(null);
const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
const [updateUserError, setUpdateUserError] = useState(null);
const [formData, setFormData] = useState({});
const [showModal, setShowModal] = useState(false);
const dispatch = useDispatch();
// console.log(imageFileUploadProgress + "%");
// console.log("image uploading :", imageFileUploading);

const filePickerRef = useRef();

const handleImageChange = (e) => {
const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }

};

const handleChange = (e) => {
setFormData((prevFormData) => ({
...prevFormData,
[e.target.id]: e.target.value,
}));
};

// console.log("form data :", formData);

const handleSubmit = async (e) => {
e.preventDefault();

    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Changes Made..");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload..");
      return;
    }

    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }

};

const handleDeleteUser = async () => {
setShowModal(false);

    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      // console.log(error);
    }

};

const handleSignOut = async () => {
try {
const res = await fetch("/api/user/signout", {
method: "POST",
});

      const data = await res.json();
      console.log("signout :", data);

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }

};

useEffect(() => {
if (imageFile) {
uploadImageToCloudinary();
}
}, [imageFile]);

const uploadImageToCloudinary = async () => {
setImageFileUploading(true);
setImageFileUploadError(null);

    const imageFormData = new FormData();
    imageFormData.append("file", imageFile);
    imageFormData.append("upload_preset", "althaf");
    imageFormData.append("cloud_name", "muhammadalthaf");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/muhammadalthaf/image/upload`,
        imageFormData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setImageFileUploadProgress(progress);
          },
        }
      );
      const imageUrl = res.data.secure_url;
      setImageFileUrl(imageUrl); // Use the uploaded image URL

      setFormData((prevFormData) => ({
        ...prevFormData,
        profilePicture: imageUrl,
      }));

      setImageFileUploading(false);
      // console.log("Image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageFileUploadError("Failed to upload image. Please try again.");
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
    }

};

return (

<div className="max-w-lg mx-auto p-3 w-full mt-28">
<h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "loading.." : "Update"}
        </Button>

        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>

      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}

      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />

        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Are you sure u want to delete your account..{" "}
            </h3>

            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, Im sure
              </Button>

              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>

);
}

# search text functionality

# Okay, let's break down how to implement search functionality within your blog content, highlighting the matching text in yellow, using MERN (MongoDB, Express, React, Node.js). This will involve both frontend and backend work.

Core Concepts

Backend (Node.js/Express):

API Endpoint: Create an endpoint that receives the user's search query.

Database Search: Query your MongoDB database to find blog posts containing the search query.

Return Results: Send back the blog posts that match.

Frontend (React):

Search Input: Implement a search bar or text field for user input.

API Call: Send the search query to the backend API.

Display Results: Render the returned blog posts, highlighting the matching text in yellow.

Step-by-Step Implementation

1. Backend (Node.js/Express)

Install necessary packages:

npm install express cors dotenv mongoose
content_copy
download
Use code with caution.
Bash

Create your Express app (server.js or similar):

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('Connected to MongoDB'));

// Blog Post Schema and Model
const blogPostSchema = new mongoose.Schema({
title: String,
content: String,
// Add other fields as needed
});
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Search Route
app.get('/api/search', async (req, res) => {
const { query } = req.query; // Get search query from query params
try {
if (!query) {
// if no query
const blogs = await BlogPost.find();
return res.status(200).json({ blogs });
}
// Search for blog posts where either title or content matches the query (case-insensitive)
const blogs = await BlogPost.find({
$or: [
{ title: { $regex: query, $options: 'i' } },
{ content: { $regex: query, $options: 'i' } },
],
});

    res.json({ blogs });

} catch (error) {
console.error(error);
res.status(500).json({ message: 'Error searching blogs.' });
}
});

// Example route to return all blogs.
app.get('/api/blogs', async (req, res) => {
try {
const blogs = await BlogPost.find();
res.json({ blogs });
} catch (error) {
console.error(error);
res.status(500).json({ message: 'Error getting blogs' });
}
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
content_copy
download
Use code with caution.
JavaScript

.env file (in the root of your project):

PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
content_copy
download
Use code with caution.
Env

(Replace YOUR_MONGODB_CONNECTION_STRING with your actual MongoDB connection string)

2. Frontend (React)

Install necessary packages:

npm install axios
content_copy
download
Use code with caution.
Bash

Create the Blog page (components/Blog.js):

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Blog() {
const [blogs, setBlogs] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [loading, setLoading] = useState(false);

useEffect(() => {
fetchBlogs();
}, []);

const fetchBlogs = async () => {
setLoading(true);
try {
const response = await axios.get('http://localhost:5000/api/blogs');
setBlogs(response.data.blogs);
} catch (error) {
console.error('Error fetching blogs:', error);
} finally {
setLoading(false);
}
};

const handleSearchChange = (e) => {
setSearchQuery(e.target.value);
};

const handleSearch = async () => {
setLoading(true);
try {
const response = await axios.get(
`http://localhost:5000/api/search?query=${searchQuery}`
);
setBlogs(response.data.blogs);
} catch (error) {
console.error('Error searching blogs:', error);
} finally {
setLoading(false);
}
};

const highlightSearchText = (text, query) => {
if (!query) {
return text;
}

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <span key={index} style={{ backgroundColor: 'yellow' }}>
            {part}
          </span>
        );
      }
      return part;
    });

};

return (

<div>
<input
        type="text"
        placeholder="Search blogs"
        value={searchQuery}
        onChange={handleSearchChange}
      />
<button onClick={handleSearch} disabled={loading}>
Search
</button>

      {loading && <p>Loading Blogs...</p>}
      {!loading &&
        blogs.map((blog) => (
          <div key={blog._id}>
            <h2>{highlightSearchText(blog.title, searchQuery)}</h2>
            <p>{highlightSearchText(blog.content, searchQuery)}</p>
          </div>
        ))}
    </div>

);
}

export default Blog;
content_copy
download
Use code with caution.
Jsx

Explanation

Backend:

The /api/search endpoint uses a MongoDB query with $regex to search for the query within the title or content of the blog posts. The i option makes the search case-insensitive.

The /api/blogs endpoint is used to get all the blogs.

Frontend:

useEffect Hook: Fetches all blogs on component mount

highlightSearchText Function:

Takes the blog post content or title and the search query as input.

Uses a regular expression to find all occurrences of the search query (case-insensitive) within the content.

Wraps each found search term in a <span> with a yellow background.

Renders the text with the highlighted parts.

handleSearch Function:

Sends a GET request with the query as a query parameter to your backend API when the button is clicked.

It fetches blogs based on search query.

Updates the state with the fetched blogs.

UI:

Displays blog posts, highlighting any text matching the current search query in each title and content.

To Run the Application

Backend:

Navigate to your backend directory.

Run: npm install && npm start

Frontend:

Navigate to your frontend directory.

Run: npm install && npm start

Important Notes

Error Handling: Always add proper error handling in both backend and frontend.

Performance: For very large datasets, consider using indexing and more efficient search algorithms in the database.

Sanitization: Be sure to sanitize the user inputs to prevent security issues.

Deployment: This is a basic example. You'll need to deploy your backend and frontend code separately when you are ready.

Let me know if you have any other questions. Good luck with your blog app!
