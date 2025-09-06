// server/controllers/order-controller.js 
import paypal from '../../helpers/paypal.js';
import Order from '../../models/Order.js';
import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';
import { emailService } from '../../helpers/email-service.js';

const createOrderPaypal = async(req,res) =>{
    try {
        const {orderData} = req.body;

            const create_payment_json = {
                intent : 'sale',
                payer : {
                    payment_method: 'paypal'
                },
                redirect_urls : {
                    return_url : `${process.env.CLIENT_BASE_URL}/shop/paypal-return` ,
                    cancel_url : `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
                },
                transactions : [
                    {
                        item_list : {
                            items : cartItems.map((item)=>({
                                name : item.title,
                                sku: item.productId,
                                price : item.price.toFixed(2),
                                currency : 'USD',
                                quantity : item.quantity
                            }))
                        },
                        amount : {
                            currency : 'USD',
                            total : totalAmount.toFixed(2)
                        },
                        description : 'description'
                    }
                ]
            }
            
            paypal.payment.create(create_payment_json, async(error, paymentInfo)=>{
                if(error){
                    //console.log(error);
                    
                    return res.status(500).json({
                        success : false,
                        message: ' Error while creating paypal payment'
                    })
                }else{
                    const newlyCreatedOrder = new Order({
                        userId, 
                        cartId : finalCartId,  // Store cartId in the order
                        cartItems,
                        addressInfo,
                        orderStatus,
                        paymentMethod,
                        paymentStatus,
                        totalAmount,
                        orderDate,
                        orderUpdateDate,
                        payerId,
                        paymentId,
                    });
                    const savedOrder = await newlyCreatedOrder.save();
                    
                    // await newlyCreatedOrder.save();
                    
                    const approvalURL = paymentInfo.links.find((link) => link.rel === 'approval_url').href;
                    
                    res.status(201).json({
                        success: true,
                        approvalURL,
                        orderId: newlyCreatedOrder._id
                    })
                }
            })
        
    } catch (error) {
        //console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        })
        
    }

}


const createOrder = async(req,res) =>{
    try {
        const {cartItems} = req.body;
        await emailService.confirmOrder({
            destination: 'elisereflorbusole07@gmail.com',
            subject: 'ORDER CONFIRMATION',
            content: cartItems
        });
        res.status(201).json({
            success: true,
            approvalURL : "",
            orderId: "newlyCreatedOrder._id"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        })
        
    }

}

const capturePayment = async(req,res) =>{
    try {
        const { paymentId , payerId, orderId } = req.body;
        
        if (!paymentId || !payerId || !orderId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required payment information'
            });
        }
         // Find the order first
        let order = await Order.findById( orderId )
        
        if(!order){
            return res.status(404).json({
                success : false,
                message : 'Order can not be found'
            })
        }
        
        // Execute the PayPal payment
        const execute_payment_json = {
            payer_id: payerId,
            transactions: [{
                amount: {
                    currency: "USD",
                    total: order.totalAmount.toFixed(2)
                }
            }]
        };
        
        // Execute PayPal payment
        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
            if (error) {
                //console.error('PayPal execution error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to execute PayPal payment',
                    error: error.message
                });
            }
            
        // console.log("Order found:", order);
        
        try {
            // Update order status
            order.paymentStatus = "paid";
            order.orderStatus = "confirmed";
            order.paymentId = paymentId;
            order.payerId = payerId;

            // Update product stock and validate
            for (const item of order.cartItems) {
                const product = await Product.findById(item.productId);
                
                if (!product) {
                    return res.status(404).json({
                        success: false,
                        message: `Product not found: ${item.productId}`
                    });
                }

                if (product.totalStock < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Not enough stock for product: ${product.title}`
                    });
                }

                product.totalStock -= item.quantity;
                
                await product.save();
            }

            // Delete the cart after successful payment
            if (order.cartId) {
                await Cart.findByIdAndDelete(order.cartId);
            }

            // Save the updated order
            await order.save();

            return res.status(200).json({
                success: true,
                message: 'Payment captured successfully',
                data: order
            });
        } catch (error) {
            //console.error('Error updating order/products:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update order after payment',
                error: error.message
            });
        }
    });
} catch (error) {
    //console.error('Capture payment error:', error);
    return res.status(500).json({
        success: false,
        message: 'Failed to capture payment',
        error: error.message
     });
    }
};


const getAllOrdersByUser = async(req, res) =>{
    try{
        const {userId} = req.params;
        const orders = await Order.find({userId});
        
        // console.log('find orders:', orders);
        
        if(!orders.length){
            return res.status(404).json({
                success : false,
                message : 'No orders found!'
            })
        }
        
        res.status(200).json({
            success : true,
            data : orders
        })
    
    }catch (error) {
        //console.log(error);
        res.status(500).json({
            success : false, 
            message: 'Some Error occured!'
        });
    }
}
const getOrderDetails = async(req, res) =>{
    try{
        const { id } = req.params;
        //console.log('Fetching order details for ID:', id);
        
        const order = await Order.findById(id);
        
        if(!order) {
            return res.status(404).json({
                success : false,
                message : 'Order not found!'
            });
        }
        
        //console.log('Order details found:', order);
        
        res.status(200).json({
            success : true,
            data : order
        });
    
    } catch (error) {
        //console.error('Error in getOrderDetails:', error);
        res.status(500).json({
            success : false, 
            message: 'An error occurred while fetching order details',
            error: error.message
        });
    }
}

export {
    createOrder,
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails
};