// server/helpers/cloudinary.js 

import cloudinary from 'cloudinary';

import multer from 'multer';

// cloudinary.config({   // save the keys in .env 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET    // Click 'View API Keys' above to copy your API secret
//     });
    
    
const storage = new multer.memoryStorage();

export async function imageUploadUtil(file){
    const result = await cloudinary.v2.uploader.upload(file, {
        resource_type : 'auto',
    });
    return  result;
}

export async function getSignature(){
    const timestamp = Math.round((new Date()).getTime()/1000);
    const signature = await cloudinary.utils.api_sign_request(
        {
            timestamp : timestamp
        },
        process.env.CLOUDINARY_API_SECRET
    )
    return {timestamp, signature};
}

export const upload = multer({storage});