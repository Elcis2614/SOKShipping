// client/src/components/shopping-view/product-tile.jsx 
import { brandOptionsMap, categoryOptionsMap } from '@/config'
import { toast } from '@/hooks/use-toast'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/shop/cart-slice'
import { useToast } from '@/hooks/use-toast'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
    optimisticUpdateQuantity, 
    optimisticAddToCart, 
    confirmOptimisticAdd,
    rollbackOptimisticAdd } from '@/store/shop/cart-slice'
import { CardFooter, CardContent, Card } from '../ui/card'

function ShoppingProductTile({product}) 
{
    const [remainingStock, setRemainingStock] = useState(product?.totaltock || 0);
    const [ isUpdating, setIsUpdating ] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems} = useSelector((state) =>  state.shopCart);
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const {toast} = useToast();

    {/** Handle to display product details */}
    const handleGetProductDetails = (productId) => {
        if (!productId) {
          console.error("Product ID is undefined");
          return;
        }
        //dispatch(fetchProductDetails(getCurrentProductId))
        //  .catch((error) => console.error("fetchProductDetails error:", error));
        navigate(`/shop/product?id=${productId}`);
      };

    // Function to calculate remaining stock based on cart items
    const calculateRemainingStock = useCallback(() => {
        // if (!product?._id || !cartItems) return product?.totalStock || 1;
        
        // if (!Array.isArray(cartItems)){
        //     console.warn('cartItem is not an Array : ', cartItems);
        //     return product?.totalStock || 0;
        // }
        
        // // Ensure cartItems is an array and calculate remaining stock
        // const items = Array.isArray(cartItems) ? cartItems : [];
        // const cartItem = items.find(item => item?.productId === product._id);
        // const cartQuantity = cartItem?.quantity || 0;
        // const totalStock = product?.totalStock || 0;
        // const newStock = Math.max(0, totalStock - cartQuantity);
        // // Debug logging
        // // console.log('Stock calculation:', {
        // //     productId: product._id,
        // //     totalStock,
        // //     cartQuantity,
        // //     newStock,
        // //     cartItemFound: !!cartItem
        // // });
        
        return 10;
    }, [product?._id, product?.totalStock, cartItems]);
        
    // Update stock whenever cart items or product changes
    useEffect(() => {
        const newStock = calculateRemainingStock();
        if (newStock !== remainingStock) {
            // console.log('Updating remaining stock:', {
            //     productId: product?._id,
            //     oldStock: remainingStock,
            //     newStock,
            //     cartItems: cartItems?.length
            // });
            setRemainingStock(newStock);
        }
    }, [calculateRemainingStock, cartItems, product]);
    
    // Modified handleAddToCartClick
    const handleClick = () => {
        if (isUpdating || remainingStock <= 0) {
            return;
        }
        try {
            setIsUpdating(true);
            handleAddtoCart(product);
        } catch (error) {
            console.error('Add to cart error:', error);
            toast({
                title: "Error",
                description: "Failed to add item to cart",
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    {/** Handle Add product to Cart */}
    const handleAddtoCart = async(product) => {
        //Set loading state while adding to cart
        const tempId = `temp-${product._id}-${Date.now()}`;
        const isExistingItem = cartItems.some(item => item.productId?._id === product._id);
        if(isAuthenticated){
            setIsAddingToCart(true);
            dispatch(optimisticAddToCart({productData: product, quantity:1, userId:user?._id}))
            toast(`${product.title} added to cart!`, {
                duration: 2000,
                icon: '🛒'
            })
            setIsAddingToCart(false);
            dispatch(
                addToCart({       
                    userId: user?._id,     
                    productId: product?._id
            })
            ).then((result) => {  
                if(result.payload.data?.item && !isExistingItem)    
                dispatch(confirmOptimisticAdd({
                    tempId,
                    realItem: result.payload.data.item
            }));
          }).catch((err) => {
                dispatch(rollbackOptimisticAdd({
                    tempId: isExistingItem ? null : tempId,
                    productId: isExistingItem ? product?._id : null
                }));
                toast({
                    title: "Error",
                    description: err?.payload || "Failed to add to cart"
                });
          });
        }
        else{
            toast({
                title: "Error",
                description: "Please log in to add the items to the cart",
                variant: "destructive"
            });
        }
    }
    
    if (!product) return null;
    const isOutOfStock = remainingStock <= 0;
    const isLowStock = false //remainingStock > 0 && remainingStock < 10;
    const hasDiscount = product.salePrice < product.price;
    const categoryName = product?.category;
    return (
        <Card className="w-full max-w-sm mx-auto flex flex-col cursor-pointer">
            <div onClick = {() => {handleGetProductDetails(product?._id)}}>
                <div className="relative">
                    <img
                        id={product.id}
                        src={product?.primary_image}
                        alt={product?.title || 'Product Image'}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                    {isOutOfStock ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Out of Stock</Badge>
                    ) : isLowStock ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            {`Only ${remainingStock} left`}
                        </Badge>
                    ) : hasDiscount ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">Sale</Badge>
                    ) : null}
                </div>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">{categoryName || 'Unknown'}</span>
                        <span className="text-sm text-muted-foreground">{product?.brand || ''}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`${hasDiscount ? 'line-through' : ''} text-lg font-semibold text-primary`}>
                            ${product?.price}
                        </span>
                        {hasDiscount && (
                            <span className="text-lg font-semibold text-primary">${product?.salePrice}</span>
                        )}
                    </div>
                </CardContent>
            </div>
            
            <CardFooter>
                <Button
                    onClick={handleClick}
                    className={"w-full m-auto"}
                    disabled={isOutOfStock || isAddingToCart || isUpdating}
                    variant={isOutOfStock ? "secondary" : "default"}
                    >
                        {isAddingToCart || isUpdating ? (
                            'Adding...'
                        ) : isOutOfStock ? (
                            'Out of Stock'
                        ) : (
                            `Add to Cart`
                        )}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile;