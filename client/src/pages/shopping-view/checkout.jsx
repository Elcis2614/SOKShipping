// client/src/pages/shopping-view/checkout.jsx 

import UserCartItemsContent from '@/components/shopping-view/cart-items-content'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import img from '../../assets/account.jpg'
import Address from '@/components/shopping-view/address'
import { Button } from '@/components/ui/button'
import { createNewOrder } from '@/store/shop/order-slice'
import { toast } from '@/hooks/use-toast'

function ShoppingCheckout() {
    const { cartItems, _id: cartId } = useSelector((state) => state.shopCart);  // Retrieve cartId directly from the state
    const { user } = useSelector((state) => state.auth);
    const { approvalURL } = useSelector((state) => state.shopOrder)   // Paypal approvalURL
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
    const [isPaymentStart, setIsPaymentStart] = useState(false)
    const dispatch = useDispatch()

    console.log(currentSelectedAddress, 'cart current SelectedAddress checkout');

    // Calculate total price with a valid fallback for an empty cart
    const totalPrice = cartItems && cartItems.length > 0
        ? cartItems.reduce((sum, item) => sum + (
            item?.salePrice > 0
                ? item?.salePrice
                : item?.price
        ) * item.quantity, 0)
        : 0;


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

        const orderData = {
            userId: user?.id,
            cartId: cartId,
            cartItems: cartItems.map((singleCartItem) => ({
                productId: singleCartItem?.productId,
                title: singleCartItem?.title,
                image: singleCartItem?.image,
                price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
                salePrice: singleCartItem?.salePrice,
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


        }
        // console.log(orderData, ': Order Data' );
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

    if (approvalURL) {
        window.location.href = approvalURL;
    }

    // console.log("CartId before creating order:", cartId);

    return (
        <div className='flex flex-col'>
            {/* Hero Image */}
            <div className='col-span-full pt-9'>
                <p className='text-2xl font-bold'>Order Confirmation & follow up</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5'>
                <div>
                    <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
                </div>

                {/* Cart Items */}
                <div className='flex flex-col gap-4'>
                    {
                        cartItems && cartItems.length > 0 ?
                            cartItems.map((item) => (
                                <UserCartItemsContent key={item.productId} cartItem={item} />
                            ))
                            : (
                                <p> Your cart is empty </p>
                            )
                    }

                    {cartItems.length > 0 && (
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                    <div className='mt-4 w-full'>
                        <Button
                            onClick={handleInitiatePaypalPayment}
                            className='w-full'
                        >
                            {
                                isPaymentStart ? 'Processing Paypal Payment...' : 'Confirm order'
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCheckout
