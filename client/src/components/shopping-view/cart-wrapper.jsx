// client/src/components/shopping-view/cart-wrapper.jsx 

import { useEffect, useMemo } from 'react';
import { Loader2, ShoppingBag, ArrowRight, Percent } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { SheetTitle, SheetHeader, SheetContent } from '../ui/sheet';
import { fetchCartItems } from '@/store/shop/cart-slice';
import { Badge } from '../ui/badge';
import UserCartItemsContent from './cart-items-content';
import PropTypes from 'prop-types';

function UserCartWrapper({ setOpenCartSheet }) {
  const { cartItems, isLoading } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoized calculations for better performance
  const { totalPrice, totalItems, hasDiscounts } = useMemo(() => {
    if (!cartItems || cartItems.length === 0) {
      return { totalPrice: 0, totalItems: 0, hasDiscounts: false };
    }

    let total = 0;
    let itemCount = 0;
    let discountFound = false;

    cartItems.forEach((item) => {
      if (!item) return;
      
      const quantity = item.quantity || 1;
      const price = item.unit_price;
      
      total += (price || 0) * quantity;
      itemCount += quantity;
    });

    return {
      totalPrice: total,
      totalItems: itemCount,
      hasDiscounts: discountFound
    };
  }, [cartItems]);

  const handleCheckout = () => {
    navigate('/shop/checkout');
    setOpenCartSheet(false);
  };

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            dispatch(fetchCartItems(user?.id))
        }
    }, [dispatch, isAuthenticated, user?.id])

  // Loading state
  if (isLoading) {
    return (
      <SheetContent className="sm:max-w-md">
        <div className="flex flex-col justify-center items-center h-full space-y-4">
          <div className="relative">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
            <Loader2 className="absolute inset-0 h-12 w-12 animate-spin text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </SheetContent>
    );
  }

  const isEmpty = !cartItems || cartItems.length === 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full p-0 bg-gradient-to-b from-white to-gray-50/50">
      {/* Enhanced Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white shadow-sm">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-gray-600" />
              <SheetTitle className="text-xl font-bold text-gray-900">
                Your Cart
              </SheetTitle>
            </div>
            {!isEmpty && (
              <Badge 
                variant="secondary" 
                className="bg-blue-100 text-blue-800 font-semibold"
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          {hasDiscounts && !isEmpty && (
            <div className="flex items-center space-x-1 mt-2">
              <Percent className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                You're saving on some items!
              </span>
            </div>
          )}
        </SheetHeader>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Add some items to your cart to get started with your shopping.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setOpenCartSheet(false)}
              className="mt-4"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-4">
            {cartItems.map((item, index) => (
                <div 
                  key={item?.item_id || index} 
                  className="min-h-10 animate-fadeIn "
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <UserCartItemsContent cartItem={item} />
                </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Enhanced Footer */}
      {!isEmpty && (
        <div className="border-t border-gray-200 px-6 py-5 bg-white shadow-lg">
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 group"
              disabled={isEmpty}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            {/* Additional Info */}
            <p className="text-xs text-gray-500 text-center">
              Shipping and taxes calculated at checkout
            </p>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </SheetContent>
  );
}

UserCartWrapper.propTypes = {
  setOpenCartSheet: PropTypes.func.isRequired,
};

export default UserCartWrapper;