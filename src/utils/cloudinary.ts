// Cloudinary
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Upload Function
const cloudinaryUpload = async (
  file: File
): Promise<{ url: string } | null> => {
  try {
    // Convert the file to a base64 string
    const base64String = Buffer.from(await file.arrayBuffer()).toString(
      "base64"
    );

    // Upload the file to Cloudinary
    const data: UploadApiResponse | UploadApiErrorResponse = await new Promise(
      (resolve) => {
        cloudinary.uploader.upload(
          `data:${file.type};base64,${base64String}`,
          (error, result) => {
            resolve(result as UploadApiResponse | UploadApiErrorResponse);
          }
        );
      }
    );
    if ("error" in data) {
      throw new Error(data.error.message);
    }
    return { url: data.secure_url };
  } catch (error: any) {
    const err = error as UploadApiErrorResponse;
    console.error("Cloudinary Upload Error:", err.message || error);
    return null;
  }
};

export { cloudinary, cloudinaryUpload };
