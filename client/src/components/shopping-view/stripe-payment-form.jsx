// client/src/components/shopping-view/stripe-payment-form.jsx 

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const StripePaymentForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`, {
        amount: amount * 100, // Convert to cents
        currency: "usd",
      });

      const { clientSecret } = response.data;

      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        setErrorMessage(paymentResult.error.message);
        setPaymentSuccess(false);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setPaymentSuccess(false);
    }

    setIsProcessing(false);
  };

  return (
    <div className="stripe-payment-form">
      {paymentSuccess ? (
        <div className="success-message">
          <h2>Payment Successful!</h2>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardElement options={{ hidePostalCode: true }} />
          <button
            type="submit"
            className="btn btn-primary mt-4"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </form>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default StripePaymentForm;
