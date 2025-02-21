// client/src/pages/shopping-view/listing.jsx 

import ProductFilter from '@/components/shopping-view/filter';
import { Button } from '@/components/ui/button';
import { ArrowUpDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from '@/config';
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from 'react';
import { fetchAllFilteredProducts } from '@/store/shop/products-slice';
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addToCart } from '@/store/shop/cart-slice';
import { fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from '@/hooks/use-toast';

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',');
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join('&');
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Move all hook declarations to the top
  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchparams] = useSearchParams();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const categorySearchParams = searchParams.get('category') // will diplay appropriete items when navigating through header links

  const handleSort = (value) => setSort(value);

  const handleFilter = (getSectionId, getCurrentOption) => {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem('filters', JSON.stringify(cpyFilters)); // Save filters in sessionStorage
  };

  const handleGetProductDetails = (getCurrentProductId) => {
    if (!getCurrentProductId) {
      console.error("Product ID is undefined");
      return;
    }
    dispatch(fetchProductDetails(getCurrentProductId))
      .catch((error) => console.error("fetchProductDetails error:", error));
  };

  const handleAddtoCart = useCallback(async (getCurrentProductId, getTotalStock) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart",
        variant: "destructive"
      });
      return;
    }


    // Validate inputs
    if (!getCurrentProductId || !getTotalStock) {
      toast({
        title: "Error",
        description: "Invalid product information",
        variant: "destructive"
      });
      return;
    }

    // Find the product and current cart item
    const items = Array.isArray(cartItems) ? cartItems : [];
    const currentCartItem = items.find(item => item.productId === getCurrentProductId);
    const currentQuantity = currentCartItem?.quantity || 0;

    // Validate stock
    if (currentQuantity >= getTotalStock) {
      toast({
        title: "Stock limit reached",
        description: `Only ${getTotalStock} items available`,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAddingToCart(true);

      const result = await dispatch(addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1
      })).unwrap();

      if (result.success) {
        await dispatch(fetchCartItems(user?.id));

        toast({
          title: "Success",
          description: "Item added to cart",
        });
      } else {
        throw new Error(result.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [user?.id, cartItems, isAuthenticated, dispatch]);



  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [user, dispatch]);

  // Rest of your component logic follows here
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {

      toast({
        title: "Session expired",
        description: "Please log in again.",
        status: "error",
      });
      navigate('/auth/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchparams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchparams]);

  useEffect(() => {
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }
  }, [dispatch, sort, filters]);


  // console.log(productList , "product list");
  // console.log("Fetched cartItems:", cartItems);
  // console.log("Adding product:", productId, "with total stock:", getTotalStock);



  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter key={filters.id} filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}  // Ensure a unique key
                product={productItem}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
                isAddingToCart={isAddingToCart}
                isAuthenticated={isAuthenticated}
              />
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
