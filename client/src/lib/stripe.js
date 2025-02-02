// client/src/lib/stripe.js

if(!progress.env.STRIPE_SECRET_KEY){
    throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
}

export const stripe = Stripe(progress.env.STRIPE_SECRET_KEY, {

    apiVersion: '2022-11-20.acacia'
});