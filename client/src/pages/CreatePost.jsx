import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../utils/cloudinaryUploader.js";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [generatingContent, setGeneratingContent] = useState(false);
  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);

      const imageUrl = await uploadImageToCloudinary(
        file,
        "althaf",
        "muhammadalthaf",
        (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setImageUploadProgress(progress.toFixed(0));
        }
      );

      setImageUploadProgress(null);
      setImageUploadError(null);
      setFormData({ ...formData, image: imageUrl });
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleGenerateContent = async () => {
    try {
      if (!formData.category) {
        setPublishError("Please select a category to generate content.");
        return;
      }

      setGeneratingContent(true);
      setPublishError(null);

      const res = await fetch("/api/generate/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: formData.category }),
      });

      const data = await res.json();
      // console.log("Generated Content Response:", data);

      if (!res.ok) {
        setPublishError(data.message || "Failed to generate content.");
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        content: data.content,
      }));
    } catch (error) {
      setPublishError("Something went wrong while generating content.");
      console.error(error);
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.title || !formData.category || !formData.content) {
        setPublishError("Please fill all required fields.");
        return;
      }

      // console.log("Form Data submitted:", formData);

      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      // console.log("Backend Response:", data);

      if (!res.ok) {
        setPublishError(data.message || "Failed to publish the post.");
        return;
      }

      if (res.ok) {
        setPublishError(null);
        // console.log("Navigating to:", `/post/${data.slug}`);
        console.log("post is created!");
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      console.error("Publish Error:", error);
      setPublishError("Something went wrong while publishing the post.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen mt-9">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                title: e.target.value,
              }))
            }
          />
          <Select
            onChange={(e) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                category: e.target.value,
              }))
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.Js</option>
            <option value="nextjs">Next.Js</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="ai">AI</option>
            <option value="devops">Devops</option>
            <option value="nodejs">Node Js</option>
            <option value="dsa">DSA</option>
            <option value="cs">Cyber Security</option>
            <option value="sde">SDE</option>
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
            onClick={handleUploadImage}
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
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          value={formData.content || ""}
          onChange={(value) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              content: value,
            }));
          }}
        />
        <div className="flex gap-4">
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            onClick={handleGenerateContent}
            disabled={generatingContent}
          >
            {generatingContent ? "Generating..." : "Generate Content"}
          </Button>
          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish
          </Button>
        </div>
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
