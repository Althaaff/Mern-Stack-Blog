import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImageToCloudinary } from "../utils/cloudinaryUploader.js"; // Import the utility functiony
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // console.log("post id :", postId);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);

        const data = await res.json();
        console.log("data :", data);

        if (!res.ok) {
          console.log(data.message);
          setUpdateError(data.message);

          return;
        }
        if (res.ok) {
          setUpdateError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);

      // Use the utility function to upload the image
      const imageUrl = await uploadImageToCloudinary(
        file,
        "althaf", // upload preset
        "muhammadalthaf", // cloud name
        (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setImageUploadProgress(progress.toFixed(0));
        }
      );

      // Set the image URL in the form data
      setImageUploadProgress(null);
      setImageUploadError(null);
      setFormData({ ...formData, image: imageUrl });
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log("slug data :", data);

      if (!res.ok) {
        setUpdateError(data.message);
        return;
      }
      if (res.ok) {
        setUpdateError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setUpdateError("Something went wrong..");
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                title: e.target.value,
              }))
            }
          />
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                category: e.target.value,
              }))
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          value={formData.content}
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              content: value,
            }));
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update Post
        </Button>

        {updateError && (
          <Alert color="failure" className="mt-5">
            {updateError}
          </Alert>
        )}
      </form>
    </div>
  );
}
