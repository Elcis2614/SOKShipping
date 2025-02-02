// server/middleware/orderValidation.js

const validateOrder = (req, res, next) => {
    try {
        const { 
            userId, 
            cartItems,
            addressInfo,
            paymentMethod,
            totalAmount
        } = req.body;

        // Required fields validation
        if (!userId || !cartItems || !addressInfo || !paymentMethod || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required order fields'
            });
        }

        // Validate cartItems
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart items must be a non-empty array'
            });
        }

        // Validate each cart item
        for (const item of cartItems) {
            if (!item.productId || !item.title || !item.quantity || !item.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid cart item data'
                });
            }
            if (item.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Item quantity must be greater than 0'
                });
            }
        }

        // Validate address info
        const requiredAddressFields = ['address', 'city', 'pincode', 'phone'];
        for (const field of requiredAddressFields) {
            if (!addressInfo[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required address field: ${field}`
                });
            }
        }

        // Validate payment method
        const validPaymentMethods = ['paypal', 'stripe', 'paystack'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method'
            });
        }

        // Validate total amount
        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid total amount'
            });
        }

        // Calculate and validate total amount
        const calculatedTotal = cartItems.reduce((sum, item) => {
            const itemPrice = item.salePrice > 0 ? item.salePrice : item.price;
            return sum + (itemPrice * item.quantity);
        }, 0);

        if (Math.abs(calculatedTotal - totalAmount) > 0.01) { // Allow small floating point differences
            return res.status(400).json({
                success: false,
                message: 'Total amount does not match cart items'
            });
        }

        next();
    } catch (error) {
        console.error('Order validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error validating order'
        });
    }
};

const validatePaymentCapture = (req, res, next) => {
    const { paymentId, payerId, orderId } = req.body;

    if (!paymentId || !payerId || !orderId) {
        return res.status(400).json({
            success: false,
            message: 'Missing required payment capture information'
        });
    }

    next();
};

module.exports = {
    validateOrder,
    validatePaymentCapture
};