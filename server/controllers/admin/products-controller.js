// server/controllers/admin/products-controller.js
import mongoose from 'mongoose';
import {imageUploadUtil, getSignature, destroyImages} from "../../helpers/cloudinary.js";
import {insertProduct, query, updateProduct, deleteProductById} from '../../db/index.js';

const getproductById = async (id, attributes=null) => {
    const qText = `SELECT ${attributes ? "*" : attributes.join(',')} FROM products where _id = $1`;
    const product = await query(qText, [id]);
    return product;
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
            data: result,
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
        const response = await getproductById(id, ['images']);
        console.log("The images ", response);
        if(!response) 
            return res.status(404).json({
                success : false,
                message : "Product not found",
            })
        await deleteProductById(id).then((res) => {
            console.log("Deleted product", id);
        });
        //TODO: delete the images from cloudinary
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