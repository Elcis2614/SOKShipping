// client/src/pages/shopping-view/checkout.jsx 

import UserCartItemsContent from '@/components/shopping-view/cart-items-content'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Address from '@/components/shopping-view/address'
import OrderCheckOutCard from '@/components/shopping-view/order-checkout-card'
import { ShoppingCart, CreditCard, MapPin, Package, CheckCircle } from 'lucide-react'

function ShoppingCheckout() {
    const { cartItems, _id: cartId } = useSelector((state) => state.shopCart);
    const { approvalURL } = useSelector((state) => state.shopOrder)
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)

    if (approvalURL) {
        window.location.href = approvalURL;
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <div className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                    <div className='flex items-center gap-3'>
                        <ShoppingCart className='h-8 w-8 text-blue-600' />
                        <div>
                            <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
                            <p className='text-gray-600 mt-1'>Review your order and complete your purchase</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className='flex items-center justify-center space-x-8 mb-8'>
                    <div className='flex items-center space-x-2'>
                        <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
                            <CheckCircle className='h-5 w-5 text-white' />
                        </div>
                        <span className='text-sm font-medium text-blue-600'>Cart</span>
                    </div>
                    <div className='w-16 h-0.5 bg-blue-600'></div>
                    <div className='flex items-center space-x-2'>
                        <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
                            <MapPin className='h-5 w-5 text-white' />
                        </div>
                        <span className='text-sm font-medium text-blue-600'>Address</span>
                    </div>
                    <div className='w-16 h-0.5 bg-gray-300'></div>
                    <div className='flex items-center space-x-2'>
                        <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                            <CreditCard className='h-5 w-5 text-gray-500' />
                        </div>
                        <span className='text-sm font-medium text-gray-500'>Payment</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left Column - Address & Items */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Address Section */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                            <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                                <div className='flex items-center gap-3'>
                                    <MapPin className='h-5 w-5 text-gray-600' />
                                    <h2 className='text-lg font-semibold text-gray-900'>Delivery Address</h2>
                                </div>
                            </div>
                            <div className='p-6'>
                                <Address 
                                    selectedId={currentSelectedAddress} 
                                    setCurrentSelectedAddress={setCurrentSelectedAddress} 
                                />
                            </div>
                        </div>

                        {/* Cart Items Section */}
                        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                            <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <Package className='h-5 w-5 text-gray-600' />
                                        <h2 className='text-lg font-semibold text-gray-900'>Order Items</h2>
                                    </div>
                                    <span className='text-sm text-gray-500'>
                                        {cartItems?.length || 0} item{cartItems?.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                            <div className='divide-y divide-gray-100'>
                                {cartItems && cartItems.length > 0 ? (
                                    cartItems.map((item, index) => (
                                        <div key={item.productId} className='p-6'>
                                            <UserCartItemsContent cartItem={item} />
                                        </div>
                                    ))
                                ) : (
                                    <div className='p-12 text-center'>
                                        <ShoppingCart className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                                        <h3 className='text-lg font-medium text-gray-900 mb-2'>Your cart is empty</h3>
                                        <p className='text-gray-500'>Add some items to your cart to continue</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <OrderCheckOutCard currentSelectedAddress/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCheckout