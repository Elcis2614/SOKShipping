// server/controllers/shop/products-controller.js 

//const Product = require("../../models/Product");
import { query } from 'express';
import * as db from '../../db/index.js';

export const getFilteredProducts = async (req, res) => {
    try {
        const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;
        
        let filters = {};
        
        // Building filters
        if (category.length) {
            filters.category = { $in: category.split(',') };
        }
        if (brand.length) {
            filters.brand = { $in: brand.split(',') };
        }
        
        // Building sort options
        let sort = {};
        switch (sortBy) {
            case "price-lowtohigh": // Enclosed in quotes
                sort.price = 1;
                break;
            case "price-hightolow": 
                sort.price = -1;
                break;
            case "title-atoz":  // Enclosed in quotes
                sort.title = 1;
                break;
            case "title-ztoa":    // Enclosed in quotes
                sort.title = -1;
                break;
            default:
                sort.price = 1;
                break;
        }
        
        // Fetching products with filters and sorting
        const qText = 'SELECT * from products limit 25';
        const products = await db.query(qText);
        res.status(200).json({
            success: true,
            data: products,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred',
        });
    }
};

export const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching for id : ", id);
        //const product = await Product.findById(id);
        const qText = 'SELECT * FROM products where _id = $1';
        const product = await db.query(qText, [id]);
        console.log("Fetched for product : ", product);
        if (!product) return res.status(404).json({
            success: false,
            message: 'Product not found!',
        });
        res.status(200).json({
            success: true,
            data: product,  // Ensure the response contains the `data` field with the product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred',
        });
    }
};
