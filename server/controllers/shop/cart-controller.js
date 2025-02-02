// server/controllers/shop/cart-controller.js
import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';

const addToCart = async(req, res) => {

    try {
        const { userId, productId, quantity } = req.body;
        
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided!',
            });
        }
          const product = await Product.findById(productId);
          
          if(!product){
            return res.status(404).json({
                success : false,
                message : 'Product not found!'
            })
          }
          
          let cart = await Cart.findOne({ userId });
          
          if(!cart){
            cart = new Cart({ userId, items: [] });
          }
          
          const findCurrentProductIndex  = cart.items.findIndex(
            (item) => item.productId.toString() === productId
            );
          
          if(findCurrentProductIndex === -1 ){
            cart.items.push({ productId, quantity });
          } else {
            cart.items[ findCurrentProductIndex ].quantity += quantity;
          }
          
          await cart.save(); 
          
          // Populate the cart items with product details
            await cart.populate('items.productId');
    
            const populatedItems = cart.items.map(item => ({
                productId: item.productId._id,
                title: item.productId.title,
                price: item.productId.price,
                quantity: item.quantity
            }));

            res.status(200).json({
                success: true,
                data: {
                    ...cart.toObject(),
                    items: populatedItems
                },
            });
              
        } catch (error) {
            //console.log("Error adding to cart:", error);
            res.status(500).json({
                success: false,
                message: 'Error adding item to cart',
            });
        }
}

const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User Id is required!'
            });
        }

        let cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: "image title price salePrice"
        });
        
        if (!cart) {
            // If cart doesn't exist, create an empty one
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }
        
        const validItems = cart.items.filter(productItem => productItem.productId);
        
        const populatedCartItems = validItems.map((item) => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.quantity
        }));
        
        res.status(200).json({
            success: true,
            data: {
                ...cart.toObject(),
                items: populatedCartItems
            }
        });
        
    } catch (error) {
        //console.error("Error fetching cart items:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart items',
            error: error.message
        });
    }
};

const updateCartItemQty = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided!'
            });
        }
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found!'
            });
        }
    
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found!'
            });
        }
        
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        
        // Populate the cart items with product details
        await cart.populate({
            path: 'items.productId',
            select: 'image title price salePrice'
        });
        
        const populatedCartItems = cart.items.map(item => ({
            productId: item.productId._id,
            image: item.productId.image,
            title: item.productId.title,
            price: item.productId.price,
            salePrice: item.productId.salePrice,
            quantity: item.quantity
        }));
        
        res.status(200).json({
            success: true,
            data: {
                ...cart.toObject(),
                items: populatedCartItems
            }
        });
        
    } catch (error) {
        //console.error('Error updating cart item quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart item quantity',
            error: error.message
        });
    }
};

const deleteCartItem = async(req, res) => {

    try {
        const {userId, productId } = req.params;
        if (!userId || !productId ){
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
            
            });
        }
        const cart = await Cart.findOne({userId}).populate({
            path: "items.productId",
            select: "image title price salePrice",
                });
        
        if(!cart){
            return res.status(404).json({
                success : false,
                message : 'Cart not found!'
            })
        }
        
        cart.items = cart.items.filter(
        (item)=> item.productId._id.toString() !== productId);
        
        await cart.save();
        
        await cart.populate({
            path : 'items.productId',
            select: "image title price salePrice",
        })
        
        const populateCartItems = cart.items.map((item)=>({
            productId: item.productId? item.productId._id : null, 
            image : item.productId? item.productId.image : null,
            title : item.productId? item.productId.title : "Product no found!",
            price : item.productId? item.productId.price : null,
            salePrice : item.productId? item.productId.salePrice : null,
            quantity : item.quantity
        }))
        
        res.status(200).json({
            success: true,
            data: {
                ...cart._doc, 
                items: populateCartItems,
            }
        })
        
        } catch (error) {
            //console.log(error);
            res.status(500).json({
                success : false,
                message: 'Error'
        
        })
    }
}

export {
    fetchCartItems,
    updateCartItemQty,
    deleteCartItem,
    addToCart,
    
}