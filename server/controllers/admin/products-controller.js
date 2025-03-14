// server/controllers/admin/products-controller.js
import mongoose from 'mongoose';
import {imageUploadUtil, getSignature} from "../../helpers/cloudinary.js";
import Product from '../../models/Product.js'; // Add this line if it's missing



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
            image,
            title,  // Make sure this is coming from the request body
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;
        
        // Check if title is present and valid
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required!",
            });
        }

        const newlyCreatedProduct = new Product({
            image,
            title,  // Pass the title to the new product
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
        });
        
        await newlyCreatedProduct.save();
        
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct
        });
        
    } catch (error) {
        //console.log(error)
        res.status(500).json({
            success : false,
            message : 'Error occured'
        })
        
    }
}

// fetch all products 
const fetchAllProducts = async(req, res) => {
    try {
        listOfProducts = await Product.find({});
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
            image,
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
        findProduct.image = image || findProduct.image;
        
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