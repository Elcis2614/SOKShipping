// client/src/pages/shopping-view/paypal-return.jsx 

import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { capturePayment } from "@/store/shop/order-slice";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom'


function PaypalReturnPages() {
    
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    
    
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId'); // paymentId from the checkout link
    const payerId = params.get('PayerID');  // PayerID from the checkout link "http://localhost:5173/shop/paypal-return?paymentId=PAYID-M4IMXKQ1H634345XV0941105&token=EC-3MN091130P8606104&PayerID=TR5JFEZN2ZYWN"
    
    useEffect(()=>{
        async function processPayment() {
            if (!paymentId || !payerId) {
                setStatus('error');
                setErrorMessage('Invalid payment information');
                return;
            }
                
            try {
                const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
                if (!orderId) {
                    throw new Error('Order information not found');
                }

                const result = await dispatch(capturePayment({ paymentId, payerId, orderId })).unwrap();
                
                if (result?.success) {
                    sessionStorage.removeItem("currentOrderId");
                    setStatus('success');
                    setTimeout(() => {
                        navigate('/shop/payment-success');
                    }, 1500);
                } else {
                    throw new Error(result?.message || 'Payment capture failed');
                }
            } catch (error) {
                console.error('Error during payment capture:', error);
                setStatus('error');
                setErrorMessage(error.message || 'An error occurred while processing your payment');
            }
        }

        processPayment();
    }, [paymentId, payerId, dispatch, navigate]);
    
    const statusConfigs = {
        processing: {
            icon: <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />,
            title: 'Processing Payment',
            message: 'Please wait while we process your payment...',
            color: 'text-blue-600'
        },
        success: {
            icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
            title: 'Payment Successful',
            message: 'Redirecting to order confirmation...',
            color: 'text-green-600'
        },
        error: {
            icon: <AlertCircle className="h-16 w-16 text-red-500" />,
            title: 'Payment Failed',
            message: errorMessage,
            color: 'text-red-600'
        }
    };
    
    const currentStatus = statusConfigs[status];
    
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center pb-2">
                    <div className="mb-4 flex justify-center">
                        {currentStatus.icon}
                    </div>
                    <CardTitle className={`text-2xl font-bold ${currentStatus.color}`}>
                        {currentStatus.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p className="text-gray-600">
                        {currentStatus.message}
                    </p>
                    {status === 'error' && (
                        <div className="flex justify-center">
                            <Button 
                                variant="destructive"
                                onClick={() => navigate('/shop/checkout')}
                                className="flex items-center gap-2"
                            >
                                Return to Checkout
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
export default PaypalReturnPages
