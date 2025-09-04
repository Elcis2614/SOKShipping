import { useSearchParams, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from '@/store/shop/products-slice';
import { Label } from "../../components/ui/label";
import StarRatingComponent from "../../components/common/star-rating";
import { useCallback, useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useToast } from "@/hooks/use-toast";
import PropTypes from 'prop-types';
import ImagesView from '@/components/shopping-view/product-images';

function ProductDetails() {
  const [productDetails, setProductDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, isLoading: isCartLoading } = useSelector((state) => state.shopCart);
  const { reviews, isLoading: isReviewLoading } = useSelector((state) => state.shopReview);
  const { toast } = useToast();
  
  const [remainingStock, setRemainingStock] = useState(0);
  
  // Calculate the remaining product in stock
  const calculateRemainingStock = useCallback(() => {
    if (!productDetails?.id && !productDetails?._id) return 0;
    
    // Ensure cartItems is Array
    const items = Array.isArray(cartItems) ? cartItems : [];
    
    // Use the correct ID field (id or _id based on your API response)
    const productId = productDetails.id || productDetails._id;
    const cartItem = items.find((item) => 
      (item.id || item._id) === productId || 
      (item.product_id || item.productId) === productId
    );
    
    const cartQuantity = cartItem?.quantity || 0;
    const totalStock = productDetails?.total_stock || productDetails?.totalStock || 0;
    
    return Math.max(0, totalStock - cartQuantity);
  }, [productDetails, cartItems]);

  // Fetch product details
  useEffect(() => {
    const pId = searchParams.get("id");
    if (!pId) {
      setProductError("No product ID provided");
      setIsLoadingProduct(false);
      return;
    }

    setIsLoadingProduct(true);
    setProductError(null);

    dispatch(fetchProductDetails(pId))
      .then((res) => {
        if (res.payload?.success && res.payload?.data) {
          // Handle both single product and array response
          const product = Array.isArray(res.payload.data) 
            ? res.payload.data[0] 
            : res.payload.data.product || res.payload.data;
          
          setProductDetails(product);
          console.log("Product details received:", product);
          
          // Fetch reviews for this product
          const productId = product.id || product._id;
          if (productId) {
            dispatch(getReviews(productId));
          }
        } else {
          setProductError("Product not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setProductError("Failed to load product details");
      })
      .finally(() => {
        setIsLoadingProduct(false);
      });
  }, [dispatch, searchParams]);

  // Update remaining stock when dependencies change
  useEffect(() => {
    const newStock = calculateRemainingStock();
    setRemainingStock(newStock);
  }, [calculateRemainingStock, cartItems, productDetails]);

  // Fetch cart items on component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, user?.id]);

  // Handle Add to Cart
  const handleAddtoCart = useCallback(async (product) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    if (remainingStock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive"
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      const result = await dispatch(addToCart({
        productId: product.id || product._id,
        quantity: 1,
        // Include any other required fields based on your API
        product: product
      })).unwrap();

      if (result.success) {
        toast({
          title: "Product added to cart",
          description: `${product.title} has been added to your cart`
        });
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add product to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [dispatch, user?.id, remainingStock, toast]);

  // Handle Rating Change
  const handleRatingChange = useCallback((getRating) => {
    setRating(getRating);
  }, []);

  // Handle Add Review
  const handleAddReview = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a review",
        variant: "destructive"
      });
      return;
    }

    if (!rating || !reviewMsg.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both a rating and a review message",
        variant: "destructive"
      });
      return;
    }

    try {
      const productId = productDetails.id || productDetails._id;
      const result = await dispatch(addReview({
        productId: productId,
        userId: user.id,
        userName: user.userName || user.name,
        reviewMessage: reviewMsg.trim(),
        reviewValue: rating
      })).unwrap();

      if (result.success) {
        setRating(0);
        setReviewMsg("");
        await dispatch(getReviews(productId));
        
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

  // Calculate average review
  const averageReview = reviews && reviews.length > 0 ? 
    reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length : 0;
    
  // Review submission validation
  const canSubmitReview = rating > 0 && reviewMsg.trim().length > 0 && user?.id;

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (productError || !productDetails) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Product Not Found</h2>
          <p className="text-muted-foreground">{productError || "The requested product could not be found."}</p>
        </div>
      </div>
    );
  }

  // Get price values with fallbacks
  const regularPrice = productDetails.price || 0;
  const salePrice = productDetails.sale_price || productDetails.salePrice || 0;
  const isOnSale = salePrice > 0 && salePrice < regularPrice;
  const effectivePrice = isOnSale ? salePrice : regularPrice;

  return (
    <div className="lg:flex gap-6 sm:px-12 sm:py-6 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] mx-auto">
      {/* Product Images */}
      <ImagesView images={productDetails?.images || []} />
      
      <div className="lg:w-1/2 mt-4 lg:mt-0">
        {/* Product details section */}
        <div>
          <h1 className="text-3xl font-extrabold">
            {productDetails.title || "Product Title"}
          </h1>
          <p className="text-muted-foreground text-lg mb-4 mt-3 leading-relaxed">
            {productDetails.description || "Description not available."}
          </p>
        </div>
      
        {/* Price section */}
        <div className="flex items-center gap-4 mb-3">
          <p className={`text-3xl font-bold ${isOnSale ? "line-through text-muted-foreground" : "text-primary"}`}>
            ${regularPrice.toFixed(2)}
          </p>
          {isOnSale && (
            <p className="text-3xl font-bold text-primary">
              ${salePrice.toFixed(2)}
            </p>
          )}
          {isOnSale && (
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium">
              {Math.round((1 - salePrice / regularPrice) * 100)}% OFF
            </span>
          )}
        </div>
        
        {/* Rating section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            <StarRatingComponent rating={averageReview} />
          </div>
          <span className="text-muted-foreground">
            ({averageReview.toFixed(1)}) • {reviews?.length || 0} review{reviews?.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Stock status */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">
            Stock: <span className={remainingStock > 0 ? "text-green-600" : "text-destructive"}>
              {remainingStock > 0 ? `${remainingStock} available` : "Out of stock"}
            </span>
          </p>
        </div>
      
        {/* Add to Cart button */}
        <div className="mb-4">
          <Button
            className="w-full"
            onClick={() => handleAddtoCart(productDetails)}
            disabled={remainingStock <= 0 || isAddingToCart || !user?.id}
            size="lg"
          >
            {isAddingToCart ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding to Cart...
              </>
            ) : remainingStock <= 0 ? (
              "Out of Stock"
            ) : !user?.id ? (
              "Login to Add to Cart"
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
        
        <Separator className="mb-4" />
      
        {/* Reviews section */}
        <div className="max-h-[400px] overflow-auto">
          <h2 className="text-xl font-bold mb-3">
            Customer Reviews ({reviews?.length || 0})
          </h2>
          
          <div className="grid gap-4">
            {reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => ( 
                <div 
                  key={reviewItem._id || reviewItem.id || `${reviewItem.userId}-${Date.now()}`}
                  className="flex gap-4 p-4 border rounded-lg"
                >
                  <Avatar className="w-10 h-10 border">
                    <AvatarFallback>
                      {reviewItem?.userName?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {reviewItem?.userName || 'Anonymous'}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {reviewItem?.createdAt ? new Date(reviewItem.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <StarRatingComponent
                      rating={reviewItem?.reviewValue || 0}
                      readonly={true}
                    />
                    <p className="text-sm text-muted-foreground">
                      {reviewItem?.reviewMessage || 'No comment provided'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-6 border rounded-lg">
                <h3 className="font-medium mb-2">No Reviews Yet</h3>
                <p className="text-sm">Be the first to review this product!</p>
              </div>
            )}
          </div>
          
          {/* Review Form */}
          {user?.id && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <Label className="text-base font-semibold">Write a Review</Label>
              <div className="flex items-center gap-2 mt-3">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
                <span className="text-sm text-muted-foreground">
                  {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                </span>
              </div>
              <Input 
                name='reviewMsg'
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Share your thoughts about this product..."
                disabled={!rating}
                className="mt-3"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">
                  {reviewMsg.length}/500 characters
                </span>
                <Button
                  onClick={handleAddReview}
                  disabled={!canSubmitReview || isReviewLoading}
                  size="sm"
                >
                  {isReviewLoading ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          )}

          {!user?.id && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30 text-center">
              <p className="text-muted-foreground">
                Please log in to write a review
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;