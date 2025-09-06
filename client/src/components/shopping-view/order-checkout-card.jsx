// client/src/components/shopping-view/order-checkout-card.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewOrder } from '@/store/shop/order-slice';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { CreditCard, CheckCircle, Clock, Mail } from 'lucide-react'

function OrderCheckOutCard({currentSelectedAddress}) {
    const [paymentOption, setPaymentOption] = useState('now');
    const [isReservingOrder, setIsReservingOrder] = useState(false);
    const { cartItems, _id: cartId } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const dispatch = useDispatch()
            // Calculate total price with a valid fallback for an empty cart
    const totalPrice = cartItems && cartItems.length > 0
        ? cartItems.reduce((sum, item) => sum + (
            item?.salePrice > 0
                ? item?.salePrice
                : item?.price
        ) * item.quantity, 0)
        : 0;
    // Calculate subtotal and potential savings
    const subtotal = cartItems && cartItems.length > 0
        ? cartItems.reduce((sum, item) => sum + (item?.price * item.quantity), 0)
        : 0;
    
    const savings = subtotal - totalPrice;

    const getOrderData = () => {
         return({
            userId: user?.id,
            cartId: cartId,
            cartItems: cartItems.map((singleCartItem) => ({
                product_id: singleCartItem?.product_id,
                title: singleCartItem?.product_title,
                image: singleCartItem?.product_image,
                price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
                total_price: singleCartItem?.total_price,
                unit_price: singleCartItem?.unit_price,
                quantity: singleCartItem?.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes
            },
            orderStatus: 'pending',
            paymentMethod: 'paypal',
            paymentStatus: 'pending',
            totalAmount: totalPrice,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: '',
            payerId: '',
        })
    }
    const handleReserveOrder = async ({}) => {
        setIsReservingOrder(true);
        try {
            const orderData = getOrderData();
            await dispatch(createNewOrder(orderData)).then((response) => {
            if (response.success) {
                // Show success message
                toast({
                    title: "Order Reserved Successfully",
                    description: "Check your email for payment instructions.",
                    variant: "success"
                });
                // Redirect or clear cart
            }
            else{
                throw new Error("Failed");
            }
        })}
        catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to reserve order. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsReservingOrder(false);
        }
    };
     function handleInitiatePaypalPayment() {        
        if (currentSelectedAddress === null) {
            toast({
                title: "Please Select one address to proceed.",
                variant: 'destructive',
            })
            return;
        }
        if (cartItems.length === 0) {
            toast({
                title: 'Your cart is empty. Please select items',
                variant: 'destructive',
            })
        }
        const orderData = getOrderData();

        console.log("AddressInfo being sent:", orderData.addressInfo);

        dispatch(createNewOrder(orderData)).then((data) => {
            console.log("Sending order data:", orderData);

            if (data?.payload?.success) {
                console.log("Response from createNewOrder:", data);
                setIsPaymentStart(true)
            } else {
                setIsPaymentStart(false)
            }
        })
    }

    return (
        <div className='lg:col-span-1' >
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6'>
                <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                    <h2 className='text-lg font-semibold text-gray-900'>Order Summary</h2>
                </div>

                <div className='p-6 space-y-4'>
                    {/* Price Breakdown */}
                    <div className='space-y-3'>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Subtotal ({cartItems?.length || 0} items)</span>
                            <span className='text-gray-900'>${subtotal.toFixed(2)}</span>
                        </div>

                        {savings > 0 && (
                            <div className='flex justify-between text-sm'>
                                <span className='text-green-600'>Savings</span>
                                <span className='text-green-600'>-${savings.toFixed(2)}</span>
                            </div>
                        )}

                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Shipping</span>
                            <span className='text-green-600'>FREE</span>
                        </div>

                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Tax</span>
                            <span className='text-gray-900'>Calculated at checkout</span>
                        </div>
                    </div>

                    <div className='border-t border-gray-200 pt-4'>
                        <div className='flex justify-between items-center'>
                            <span className='text-lg font-semibold text-gray-900'>Total</span>
                            <span className='text-2xl font-bold text-gray-900'>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Options Section */}
                    <div className='border-t border-gray-200 pt-6 space-y-4'>
                        <h3 className='text-md font-medium text-gray-900'>Choose Payment Option</h3>

                        {/* Payment Method Selection */}
                        <div className='space-y-3'>
                            {/* Pay Now Option */}
                            <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentOption === 'now'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setPaymentOption('now')}
                            >
                                <div className='flex items-center gap-3'>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentOption === 'now'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-300'
                                        }`}>
                                        {paymentOption === 'now' && (
                                            <div className='w-2 h-2 rounded-full bg-white'></div>
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2'>
                                            <CreditCard className='h-4 w-4 text-blue-600' />
                                            <span className='font-medium text-gray-900'>Pay Now</span>
                                            <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>Recommended</span>
                                        </div>
                                        <p className='text-sm text-gray-600 mt-1'>
                                            Secure payment with instant order confirmation
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pay Later Option */}
                            <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentOption === 'later'
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setPaymentOption('later')}
                            >
                                <div className='flex items-center gap-3'>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentOption === 'later'
                                        ? 'border-amber-500 bg-amber-500'
                                        : 'border-gray-300'
                                        }`}>
                                        {paymentOption === 'later' && (
                                            <div className='w-2 h-2 rounded-full bg-white'></div>
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2'>
                                            <Clock className='h-4 w-4 text-amber-600' />
                                            <span className='font-medium text-gray-900'>Pay Later</span>
                                        </div>
                                        <p className='text-sm text-gray-600 mt-1'>
                                            Reserve your order and pay when convenient
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pay Later Information */}
                        {paymentOption === 'later' && (
                            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                                <div className='flex items-start gap-3'>
                                    <Mail className='h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0' />
                                    <div className='text-sm'>
                                        <p className='font-medium text-amber-800 mb-1'>Pay Later Process:</p>
                                        <ul className='text-amber-700 space-y-1'>
                                            <li>• Your order will be reserved for 48 hours</li>
                                            <li>• We'll send payment instructions to your email</li>
                                            <li>• Complete payment to confirm your order</li>
                                            <li>• Unpaid orders will be automatically cancelled</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Security Badge */}
                    <div className='bg-gray-50 rounded-lg p-4'>
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <CheckCircle className='h-4 w-4 text-green-500' />
                            <span>Secure 256-bit SSL encryption</span>
                        </div>
                    </div>

                    {/* Dynamic Checkout Button */}
                    {paymentOption === 'now' ? (
                        <Button
                            onClick={() => {}}
                            disabled={isPaymentStart || cartItems?.length === 0}
                            className='w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isPaymentStart ? (
                                <div className='flex items-center gap-2'>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    Processing Payment...
                                </div>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <CreditCard className='h-5 w-5' />
                                    Pay Now - ${totalPrice.toFixed(2)}
                                </div>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleReserveOrder}
                            disabled={isReservingOrder || cartItems?.length === 0}
                            className='w-full h-12 text-lg font-medium bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isReservingOrder ? (
                                <div className='flex items-center gap-2'>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    Reserving Order...
                                </div>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <Clock className='h-5 w-5' />
                                    Reserve Order - Pay Later
                                </div>
                            )}
                        </Button>
                    )}

                    <div className='text-xs text-gray-500 text-center mt-3'>
                        By placing your order, you agree to our{' '}
                        <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>)
}
export default OrderCheckOutCard;