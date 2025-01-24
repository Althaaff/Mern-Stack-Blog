import axios from "axios";

/**
 * Uploads an image to Cloudinary.
 * @param {File} imageFile - The image file to be uploaded.
 * @param {string} uploadPreset - The Cloudinary upload preset.
 * @param {string} cloudName - The Cloudinary cloud name.
 * @param {Function} onUploadProgress - Optional callback for tracking upload progress.
 * @returns {Promise<string>} - A promise that resolves with the secure URL of the uploaded image.
 */

export const uploadImageToCloudinary = async (
  imageFile,
  uploadPreset,
  cloudName,
  onUploadProgress
) => {
  const imageFormData = new FormData();
  imageFormData.append("file", imageFile);
  imageFormData.append("upload_preset", uploadPreset);
  imageFormData.append("cloud_name", cloudName);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      imageFormData,
      {
        onUploadProgress,
      }
    );

    return response.data.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload image. Please try again.");
  }
};
