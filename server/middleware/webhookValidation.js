// server/middleware/webhookValidation.js

const validateStripeWebhook = (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
        return res.status(400).json({
            success: false,
            message: 'Missing Stripe signature'
        });
    }
    next();
};

const validatePaystackWebhook = (req, res, next) => {
    const hash = req.headers['x-paystack-signature'];
    if (!hash) {
        return res.status(400).json({
            success: false,
            message: 'Missing Paystack signature'
        });
    }
    next();
};

module.exports = {
    validateStripeWebhook,
    validatePaystackWebhook
};