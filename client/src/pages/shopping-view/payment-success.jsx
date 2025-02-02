
// client/src/pages/shopping-view/payment-success.jsx 

import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { CheckCircle2, ShoppingBag } from 'lucide-react';

function PaymentSuccessPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center pb-2">
                    <div className="mb-4 flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-600">
                        Payment Successful!
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p className="text-gray-600">
                        Thank you for your purchase. Your order has been successfully processed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={() => navigate('/shop/account')}
                            className="flex items-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            View Orders
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/shop/home')}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default PaymentSuccessPage
