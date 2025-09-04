// client/src/components/shopping-view/cart-items-content.jsx
import { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash2, Loader2, RefreshCw, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';
import PropTypes from 'prop-types';

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-2 border-blue-200" />
          <Loader2 className="absolute inset-0 h-10 w-10 animate-spin text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">Updating…</span>
      </div>
    </div>
  );
}

function ErrorOverlay({ error, onRetry }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 p-4 backdrop-blur-md">
      <div className="max-w-xs space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-red-200 shadow-sm">
          <RefreshCw className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-900">Something went wrong</h4>
          <p className="mt-1 text-sm font-medium leading-relaxed text-red-700">{error}</p>
        </div>
        <Button
          size="sm"
          onClick={onRetry}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

function SaleBadge() {
  return (
    <div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-1.5 py-0.5 text-xs font-bold text-white shadow-md animate-pulse sm:-top-2 sm:-right-2 sm:px-2 sm:py-1">
      SALE
    </div>
  );
}

function QuantityControls({ value, onIncrease, onDecrease, disabledIncrease, disabledDecrease }) {
  return (
    <div className="mx-auto flex w-fit items-center justify-center rounded-full border border-gray-200 bg-white p-1 shadow-sm transition-all hover:shadow-md sm:mx-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDecrease}
        disabled={disabledDecrease}
        className="h-7 w-7 rounded-full p-0 hover:bg-gray-100 disabled:opacity-40 sm:h-8 sm:w-8"
      >
        <Minus className="h-4 w-4 text-gray-600" />
      </Button>
      <span className="mx-3 min-w-[2ch] text-base font-semibold text-gray-900 sm:mx-4 sm:min-w-[3ch] sm:text-lg">
        {value}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onIncrease}
        disabled={disabledIncrease}
        className="h-7 w-7 rounded-full p-0 hover:bg-gray-100 disabled:opacity-40 sm:h-8 sm:w-8"
      >
        <Plus className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  );
}

function StockStatusBadge({ isOut, isLow, remainingStock, available }) {
  if (isOut) {
    return (
      <div className="inline-flex items-center rounded-full border border-red-300/50 bg-gradient-to-r from-red-100 to-red-200 px-2 py-1 sm:px-3 sm:py-1.5">
        <div className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-red-500 sm:mr-2" />
        <span className="text-xs font-semibold text-red-700 sm:text-sm">Out of Stock</span>
      </div>
    );
  }

  if (isLow) {
    return (
      <div className="inline-flex items-center rounded-full border border-amber-300/50 bg-gradient-to-r from-amber-100 to-orange-100 px-2 py-1 sm:px-3 sm:py-1.5">
        <div className="mr-1.5 h-2 w-2 animate-bounce rounded-full bg-amber-500 sm:mr-2" />
        <span className="text-xs font-semibold text-amber-700 sm:text-sm">
          Only {remainingStock} left!
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center text-xs font-medium text-gray-400 sm:text-sm">
      <ShoppingCart className="mr-1 h-3 w-3" />
      {available} available
    </div>
  );
}

function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector(state => state.auth);
  const { productList } = useSelector(state => state.shopProducts);

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const product = useMemo(
    () => productList.find(p => p._id === cartItem.product_id),
    [productList, cartItem.product_id]
  );

  const { currentStock, remainingStock, isLowStock, isOutOfStock } = useMemo(() => {
    const stock = product?.totalStock ?? cartItem.totalStock ?? 0;
    const remaining = Math.max(0, stock - cartItem.quantity);
    return {
      currentStock: stock,
      remainingStock: remaining,
      isLowStock: remaining > 0 && remaining <= 5,
      isOutOfStock: stock === 0,
    };
  }, [product, cartItem.totalStock, cartItem.quantity]);

  const clearError = useCallback(() => setError(null), []);

  const handleCartItemDelete = useCallback(async () => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      clearError();

      await dispatch(
        deleteCartItem({
          userId: user?.id,
          productId: cartItem._id,
        })
      ).unwrap();

      toast({ title: 'Item removed from cart', variant: 'default' });
    } catch (err) {
      const msg = err?.message || 'Failed to remove item from cart';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  }, [dispatch, cartItem._id, toast, isUpdating, clearError, user?.id]);

  const handleUpdateQuantity = useCallback(
    async increment => {
      if (isUpdating) return;

      const newQty = increment ? cartItem.quantity + 1 : cartItem.quantity - 1;
      if (newQty < 1 || newQty > currentStock) {
        toast({
          title: 'Stock limit reached',
          description: `Only ${currentStock} items available`,
          variant: 'destructive',
        });
        return;
      }

      try {
        setIsUpdating(true);
        clearError();
        await dispatch(
          updateCartQuantity({
            productId: cartItem._id,
            quantity: increment ? 1 : -1,
          })
        ).unwrap();
      } catch (err) {
        const msg = err?.message || 'Failed to update quantity';
        setError(msg);
        toast({ title: 'Error', description: msg, variant: 'destructive' });
      } finally {
        setIsUpdating(false);
      }
    },
    [dispatch, cartItem._id, cartItem.quantity, currentStock, toast, isUpdating, clearError]
  );

  const handleRetry = () => clearError();

  if (!cartItem) return null;

  const unitPrice = cartItem.unit_price;
  const totalItemPrice = (unitPrice * cartItem.quantity).toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-r from-white via-gray-50/30 to-white shadow-sm transition-all duration-300 hover:border-gray-300/80 hover:shadow-lg">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4 sm:p-5">
        {/* Image */}
        <div className="relative mx-auto flex-shrink-0 sm:mx-0">
          <div className="h-20 w-20 overflow-hidden rounded-md bg-gradient-to-br from-gray-100 to-gray-200 ring-1 ring-gray-200/60 shadow-sm sm:h-24 sm:w-24">
            <img
              src={cartItem.product_image}
              alt={cartItem.primary_image_alt || cartItem.product_title}
              className="h-full w-full object-cover"
              onError={e => {
                e.target.src = '/placeholder-image.png';
              }}
            />
          </div>
          {cartItem.salePrice > 0 && <SaleBadge />}
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className="line-clamp-2 text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-gray-700 sm:text-lg"
                title={cartItem.product_title}
              >
                {cartItem.product_title}
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-lg font-bold text-transparent sm:text-xl">
                  ${unitPrice}
                </span>
                <span className="text-xs font-medium text-gray-500 sm:text-sm">each</span>
                {cartItem.salePrice > 0 && (
                  <span className="ml-1 text-xs font-medium text-gray-400 line-through sm:text-sm">
                    ${cartItem.salePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartItemDelete}
              disabled={isUpdating}
              className="flex-shrink-0 p-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
              aria-label="Remove item from cart"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <QuantityControls
              value={cartItem.quantity}
              onIncrease={() => handleUpdateQuantity(true)}
              onDecrease={() => handleUpdateQuantity(false)}
              disabledIncrease={isUpdating || cartItem.quantity >= currentStock || isOutOfStock}
              disabledDecrease={isUpdating || cartItem.quantity <= 1}
            />

            <div className="text-center sm:text-right">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Item Total</div>
              <div className="text-lg font-bold text-gray-900 sm:text-xl">${totalItemPrice}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <StockStatusBadge
              isOut={isOutOfStock}
              isLow={isLowStock}
              remainingStock={remainingStock}
              available={currentStock - cartItem.quantity}
            />
          </div>
        </div>
      </div>

      {isUpdating && <LoadingOverlay />}
      {error && <ErrorOverlay error={error} onRetry={handleRetry} />}
    </div>
  );
}

UserCartItemsContent.propTypes = {
  cartItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    product_id: PropTypes.string.isRequired,
    product_title: PropTypes.string.isRequired,
    product_image: PropTypes.string,
    primary_image_alt: PropTypes.string,
    unit_price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    totalStock: PropTypes.number,
  }).isRequired,
};

export default UserCartItemsContent;
