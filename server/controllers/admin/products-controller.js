// server/controllers/admin/products-controller.js
import {imageUploadUtil, getSignature, destroyImages} from "../../helpers/cloudinary.js";
import {insertProduct, query, updateProduct, deleteProductById} from '../../db/index.js';

const getproductById = async (id, attributes=null) => {
    const qText = `SELECT ${attributes?.length == 0 ? "*" : attributes.join(',')} FROM products where _id = $1`;
    const images = await query(qText, [id]);
    return images;
}

const handleImageUpload = async(req, res) => {
    try{
        const {signature, timestamp} = await getSignature();
        res.status(201).json({signature, timestamp})
    } catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "error occured",
        });
    }
    
};

// ad a new product
const addProduct = async(req, res) =>{
    try {
        const {
            images,
            title,  // Make sure this is coming from the request body
            description,
            category,
            price,
            salePrice,
            totalStock,
            tags
        } = req.body;
        
        // Check if the form is complete is present and valid
        if (!title || !description || !category || !price || !totalStock ||
            tags?.length == 0 && images.length == 0) {
            console.log("Executed");
            return res.status(400).json({
                success: false,
                message: "Incorrect form was submitted",
            });
        }
        const newlyCreatedProduct =  await insertProduct({
            images,
            title,
            description,
            category,
            price,
            salePrice,
            totalStock,
            tags
        });
        
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Error occured'
        })
        
    }
}

// fetch all products 
const fetchAllProducts = async(req, res) => {
    try {
        const listOfProducts = await query(`SELECT * FROM products`);
        res.status(200).json({
            success : true,
            data : listOfProducts
        });
        
    } catch (error) {
        //console.log(error)
        res.status(500).json({
            success : false,
            message : 'Error occured'
        })
        
    }

}

//edit a products 
const editProduct = async(req, res) => {
    try {
        const {id} = req.params;
        const product = await query("SELECT * FROM products WHERE _id=$1", [id]);
        if(!product) return res.status(404).json({
            success: false,
            message: "product not found",
        });
        const {
            images,
            title,  // Make sure this is coming from the request body
            description,
            category,
            price,
            salePrice,
            totalStock,
            tags
        } = req.body;
        const imagesToDelete = product[0].images.filter((item) => !images.includes(item));
        // Update product fields
        product.title = title || product.title;
        product.description = description || product.description;
        product.category = category || product.category;
        product.price = price === '' ? 0 : price || product.price;
        product.salePrice = salePrice === '' ? 0 : salePrice || product.salePrice;
        product.totalStock = totalStock || product.totalStock;
        product.images = images.length !== 0 ? images : product.images;
        product.tags = tags.length !== 0 ? tags : product.tags;

        const result = await updateProduct({images,title,description,category,price,salePrice,totalStock,tags}, id);
        const deleteImages = await destroyImages(imagesToDelete);
        return res.status(200).json({
            success : true,
            data: {...result, ...deleteImages},
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : 'Error occured'
        })
        
    }
}

// delete a product 
const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params
        const images = await getproductById(id, ['images']).then(res => res[0]?.images);
        if(!images) 
            return res.status(404).json({
                success : false,
                message : "Product not found",
            })
        const imaDeleter = await destroyImages(images);
        await deleteProductById(id).then((res) => {
            console.log("Deleted product", id);
        });
        return res.status(200).json({
            success : true,
            message : "Product deleted successfully"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : 'Error occured'
        })
        
    }


}

export {
    handleImageUpload,
    deleteProduct,
    editProduct,
    addProduct, 
    fetchAllProducts,
}