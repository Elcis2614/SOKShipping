// server/controllers/shop/product-review-controller.js
import Order from '../../models/Order.js';
import Product from '../../models/Product.js';
import ProductReview from '../../models/Review.js';

export const addProductReview = async(req, res)=>{
    try {
        const {
            userId,
            productId,
            userName, 
            reviewValue, 
            reviewMessage
            } = req.body
            
            const order = await Order.findOne({
                userId,
                'cartItems.productId' : productId,
                orderStatus: 'confirmed'
            })
            console.log(order)
            
            if(!order){
                return res.status(400).json({
                    success: false,
                    message: 'You need to purchase this product to review it.'
                })
            }
            
            const checkExistingReview = await ProductReview.findOne({
            
                productId, userId});
                
                if(checkExistingReview){
                    return res.false(400).json({
                        success: false,
                        message: 'You have already reviewed this product.'
                    })
                }
                
        const newReview = new ProductReview({
            productId,
            userId,
            userName,
            reviewValue,
            reviewMessage
        })
        await newReview.save();
        
        // calculate average review value
        const reviews = await ProductReview.find({productId});
        const totalReviews = reviews.length;
        const averageReviewValue = reviews.reduce(
            (sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviews;
            
        // update product schema
        await Product.findByIdAndUpdate(productId, {averageReviewValue})
        
        res.status(200).json({
            success: true,
            data: newReview,
            message: 'Review added successfully.'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong.'
            
            })
    }

}

export const getProductReviews = async(req, res)=>{
    try {
    
        const { productId } = req.params;    // will pass the productId
        
        const reviews = await ProductReview.find({productId}).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            data: reviews,
            message: 'Reviews fetched successfully.'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong.'
            
            })
    }

}