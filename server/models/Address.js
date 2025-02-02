// server/models/Address.js 

import mongoose from 'mongoose';

const AddressSchem = new mongoose.Schema(
    {
        userId: String,
        address: String,
        city: String,
        pincode: String,
        phone: String,
        notes: String,
    },
    { 
    timestamps: true
    }
);

export default mongoose.model("Address", AddressSchem);