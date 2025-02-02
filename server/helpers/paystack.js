// server/helpers/paystack.js
import axios from 'axios';

const initializePaystackPayment = async (email, amount) =>{
    try {
        const response = await axios.post( 'https://api.paystack.co/transaction/initialize', {
            email,
            amount: amount * 100,
            currency: 'NGN',
            callback_url: `${process.env.CLIENT_BASE_URL}/shop/payment-success`
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            
        });
        return response.data.data.authorization_url;
        
    } catch (error) {
    
        console.error('Error initializing Paystack payment:', error);
        throw new Error('Error initializing Paystack payment');
        
    }

}

export { initializePaystackPayment };