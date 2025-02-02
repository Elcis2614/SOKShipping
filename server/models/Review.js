// server/models/Review.js

import mongoose from "mongoose";
const ProductReviewSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  userName: String,
  reviewValue: Number,
  reviewMessage: String,
},
{
    timestamps: true
});

export default mongoose.model('ProductReview', ProductReviewSchema);
