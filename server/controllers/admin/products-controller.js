// server/controllers/admin/products-controller.js
import mongoose from 'mongoose';
import {imageUploadUtil, getSignature} from "../../helpers/cloudinary.js";
import {insertProduct, query} from '../../db/index.js';


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
        
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID",
            });
        }
        
        const {
            images,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;
        
        let findProduct = await Product.findById(id);
        if(!findProduct) return res.status(404).json({
            success: false,
            message: "product not found",
        });
        
        // Update product fields
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === '' ? 0 : price || findProduct.price;
        findProduct.salePrice = salePrice === '' ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.images = images || findProduct.images;
        
        await findProduct.save();
        res.status(200).json({
            success : true,
            data: findProduct,
        })
        
    } catch (error) {
        //console.log(error)
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
        const product = await Product.findByIdAndDelete(id); // Use findByIdAndDelete for deletion
        
        if(!product) return res.status(404).json({
            success : false,
            message : "Product not found",
        
        })
        
        res.status(200).json({
            success : true,
            message : "Product deleted successfully"
        })
        
    } catch (error) {
        //console.log(error)
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