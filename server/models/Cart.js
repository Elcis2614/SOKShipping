// server/modles/Cart.js

import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true 
    },
    items : [
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product',
                required : true
            },
            quantity : {
                type : Number,
                required : true,
                min : 1,
            },
        },
    ],
    },
    {
        timestamps : true,
    }
)

export default mongoose.model('Cart', CartSchema);