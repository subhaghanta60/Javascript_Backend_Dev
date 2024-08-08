import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null

            //Upload The File On Cloudinary

            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type:"auto"
            })
            //file has been uploaded successfully
           // console.log("File Is Uploaded on Cloudinary",response.url);
           fs.unlinkSync(localFilePath)
            return response;
            
        } catch (error) {
            fs.unlinkSync(localFilePath) // Remove the Locally Saved Temporrary File As the Upload operation failed

            return null;
            
        }

    }


    export {uploadOnCloudinary}