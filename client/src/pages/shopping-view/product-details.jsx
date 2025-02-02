import { useSearchParams, useParams} from 'react-router-dom';
// client/src/components/shopping-view/product-details.jsx

import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from '@/store/shop/products-slice'

import { Label } from "../../components/ui/label";
import StarRatingComponent from "../../components/common/star-rating";

import { useCallback, useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useToast } from "@/hooks/use-toast";

import PropTypes from 'prop-types';

function ProductDetails() {
  const [productDetails, setProductDetails] = useState({});
  const [profile, setProfile] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);       
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { isLoading } = useSelector((state) => state.shopCart);

  const { toast } = useToast();
  const [remainingStock, setRemainingStock ] = useState(productDetails?.totalStock || 0);
  
  // calculate the remaining product in stock
  const calculateRemainingStock = useCallback(() => {
      if(!productDetails?._id ) return productDetails?.totalStock || 0;
      
  // ensure cartItems is Array
  const items = Array.isArray(cartItems) ? cartItems : [];
  
  const cartItem = items.find((item)=> item._id === productDetails?._id);
  const cartQuantity = cartItem?.quantity || 0;
  const totalStock = productDetails?.totalStock || 0;
  
  return Math.max(0, totalStock - cartQuantity);
    
  },[productDetails, cartItems])


  useEffect(() => {
    const pId = searchParams.get("id");
    dispatch(fetchProductDetails(pId)).then((res) => {
      setProductDetails(res.payload.data[0]);
      setProfile(res.payload.data[0].images[0]);
    });
  }, [])
  
  useEffect(()=>{
    const newStock = calculateRemainingStock();
    setRemainingStock(newStock); 
  }, [calculateRemainingStock, cartItems, productDetails]);

  // Handle Add to Cart with proper type checking
  const handleAddtoCart = useCallback((product) => {
    // Set loading state while adding to car
    setIsAddingToCart(true);
  
    dispatch(
      addToCart({            
        product: product
      })
    ).then(() => {      
        toast({
          title: "Product added to cart",
        });
      }
    ).finally(() => {
        setIsAddingToCart(false);  // Ensure we reset the loading state
      });
   }, [cartItems, dispatch]);
  
   // Handle Rating Change
   function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // Modified handleAddReview function for ProductDetailsDialog
  const handleAddReview = async () => {
    if (!rating || !reviewMsg.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both a rating and a review message",
        variant: "destructive"
      });
      return;
    }
  
    try {
      const result = await dispatch(addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg.trim(),
        reviewValue: rating
      })).unwrap();
    
      if (result.success) {
        setRating(0);
        setReviewMsg("");
        await dispatch(getReviews(productDetails?._id));
        
        toast({
          title: "Success",
          description: "Review added successfully!"
        });
      } else {
        throw new Error(result.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Review error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add review. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Fetch reviews when the product is loaded
  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);

  const averageReview = reviews && reviews.length > 0 ? 
    reviews.reduce( (sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length : 0;
    
  // Add a review submission validation check
  const canSubmitReview = rating > 0 && reviewMsg.trim().length > 0;
  
  return (
    <div className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
    <div className="relative overflow-hidden rounded-lg">
      <img
        src={profile|| "https://via.placeholder.com/600x600?text=No+Image"}
        alt={productDetails?.title || "Product Image"}
        width={600}
        height={600}
        className="aspect-square w-full object-cover"
      />
    </div>
    
    <div className="">
       {/* Product details section */}
        <div>
          <h1 className="text-3xl font-extrabold">
            {productDetails?.title || "Product Title"}
          </h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
            {productDetails?.description || "Description not available."}
          </p>
        </div>
      
        <div className="flex items-center justify-between">
          <p
            className={`text-3xl font-bold text-primary ${
              productDetails?.salePrice > 0 ? "line-through" : ""
            }`}
          >
            ${productDetails?.price || "N/A"}
          </p>
          {productDetails?.salePrice > 0 && (
            <p className="text-2xl font-bold text-muted-foreground">
              ${productDetails?.salePrice}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            <StarRatingComponent rating={averageReview} />
           </div>
           <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
        
        </div>
      
      
        {/* Updated Add to Cart button section (!productDetails?.totalStock || productDetails?.totalStock === 0 ?)*/}
        <div className="mt-5 mb-5">
          { remainingStock <= 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed">
              Out of Stock
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() =>
                {handleAddtoCart(productDetails)}
              }
            >
              Add to Cart
            </Button>
          )}
        </div>
        
        <Separator />
      
      <div className="max-h-[300px] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        <div className="grid gap-6">
        
          { reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => ( 
                <div 
                  key={reviewItem._id || `${reviewItem.userId}-${reviewItem.productId}`}
                  className="flex gap-4">
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>
                      {reviewItem?.userName?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <h3 className="font-bold">
                      {reviewItem?.userName || 'Anonymous'}
                    </h3>
                      <StarRatingComponent
                          rating={reviewItem?.reviewValue || 0}
                          readonly={true}
                        />
                        
                        <p className="text-muted-foreground">
                          {reviewItem?.reviewMessage || 'No comment provided'}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {new Date(reviewItem?.createdAt).toLocaleDateString()}
                        </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <h3>No Reviews Yet</h3>
                <p className="text-sm">Be the first to review this product!</p>
              </div>
          )} 
          
          {/* Review Form */}
          {/* // Update the reviews section JSX */}
          <div className="mt-10 flex-col flex gap-2">
            <Label>Write a review</Label>
            <div className="flex gap-2">
              <StarRatingComponent
                rating={rating}
                handleRatingChange={handleRatingChange}
              />
              <span className="text-sm text-muted-foreground">
                {rating > 0 ? `${rating} stars` : 'Select rating'}
              </span>
            </div>
              <Input 
                name='reviewMsg'
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
                disabled={!rating}
                className="mt-2"
              />
              
           <Button
              onClick={handleAddReview}
              disabled={!canSubmitReview || isLoading}
              className="mt-2"
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </Button> 
          </div>
       </div>
      
     </div>
  </div>
</div>
  );
}

export default ProductDetails;