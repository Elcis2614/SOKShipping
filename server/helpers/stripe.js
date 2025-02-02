// server/helpers/stripe.js
import stripe from stripe;
stripe = stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentSession = async (items, orderId, successUrl, cancelUrl) => {
    try {
        // Ensure orderId is converted to string
        const orderIdString = orderId.toString();
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title || 'Product',
                        images: item.image ? [item.image] : [],
                        metadata: {
                            productId: item.productId?.toString()
                        }
                    },
                    unit_amount: Math.round((item.price || 0) * 100), // Convert to cents
                },
                quantity: item.quantity || 1,
            })),
            mode: 'payment',
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            metadata: {
                orderId: orderIdString
            }
        });

        //console.log('Created Stripe session:', {
        //    sessionId: session.id,
        //    metadata: session.metadata,
        //    orderId: orderIdString
        //});

        return session;
    } catch (error) {
        console.error('Stripe session creation error:', error);
        throw error;
    }
};

const verifyPayment = async (sessionId) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return {
            isPaid: session.payment_status === 'paid',
            orderId: session.metadata?.orderId
        };
    } catch (error) {
        console.error('Stripe payment verification error:', error);
        throw error;
    }
};

export {
    createPaymentSession,
    verifyPayment
};