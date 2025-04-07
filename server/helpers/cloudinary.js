// server/helpers/cloudinary.js 

import cloudinary from 'cloudinary';
import 'dotenv/config';
import multer from 'multer';



const options = {
    'cloud_name': process.env.CLOUDINARY_CLOUD_NAME,  
    'api_key': process.env.CLOUDINARY_API_KEY, 
    'api_secret': process.env.CLOUDINARY_API_SECRET
}
cloudinary.config(options);
    
    
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

export async function destroyImages(images){
    const ids = images.map((item) => {
        const public_id = item.split("/").at(-1)?.split('.')[0];
        console.log(public_id);
        return public_id;
    })
    const response = await cloudinary.v2.api.delete_resources(ids).then((res) => res);
    const undeleted = Object.keys(response?.deleted)?.filter((item) => response.deleted[item] !== 'deleted');
    if (undeleted?.length > 0){
        console.error("Couldn't deleted some images ", undeleted);
    }
    return response;
}

export const upload = multer({storage});