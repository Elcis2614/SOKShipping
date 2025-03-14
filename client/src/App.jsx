// client/src/App.jsx

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AdminLayout from './components/admin-view/layout'
import AuthLayout from './components/auth/layout'
import CheckAuth from './components/common/check-auth'
import { checkAuth } from "./store/auth-slice";
import ShoppingLayout from './components/shopping-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminFeatures from './pages/admin-view/features'
import AdminOrders from './pages/admin-view/orders'
import AdminProducts from './pages/admin-view/products'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import NotFound from './pages/NotFound'
import ShoppingAccount from './pages/shopping-view/account'
import ShoppingCheckout from './pages/shopping-view/checkout'
import ShoppingHome from './pages/shopping-view/home'
import ProductDetails from './pages/shopping-view/product-details'
import ShoppingListing from './pages/shopping-view/listing'
import UnAuthPage from './pages/unauth-page'
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPages from './pages/shopping-view/paypal-return'
import PayementSuccessPage from './pages/shopping-view/payment-success'
import SearchProduct from './pages/shopping-view/search'


function App() {
  
  const { user, isAuthenticated, isLoading } = useSelector(state => {
    return state.auth;
  });
  
  const dispatch = useDispatch();
  
  // Hooks should always be called unconditionally
  // useEffect(() => {
  //   // get the token from sessionStorage
  //   const token = JSON.parse(sessionStorage.getItem('token'));
  //   dispatch(checkAuth(token)).then((action) => {
  //     console.log("checkAuth result:", action);
  //   });
  // }, [dispatch]);
  

  // if (isLoading) {
  //   return <Skeleton className="w-[600px] h-[600px] rounded-full" />;
  // }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
    {/** common component */}
    <Routes>
      <Route
        path="/"
        element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
          ></CheckAuth>
        }
      />
          
      <Route 
        path="/auth" 
        element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AuthLayout/>
        </CheckAuth>
      }>
      
        <Route path="login" element={<AuthLogin/>} />
        <Route path="register" element={<AuthRegister/>}/>
      </Route>
      
      <Route path="admin" element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AdminLayout/>
        </CheckAuth>
      } >
        <Route path="dashboard" element={<AdminDashboard/>}/>
        <Route path="products" element={<AdminProducts/>}/>
        <Route path="orders" element={<AdminOrders/>}/>
        <Route path="features" element={<AdminFeatures/>}/>
      </Route>
      
      <Route path="/shop" element={
          <ShoppingLayout />
      }> 
      
        <Route path="account" element={<ShoppingAccount/>} />
        <Route path="checkout" element={<ShoppingCheckout/>} />
        <Route path="home" element={<ShoppingHome />}/>
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="product" element={<ProductDetails/>}/>
        <Route path="paypal-return" element={<PaypalReturnPages/>} />
        <Route path="payment-success" element={<PayementSuccessPage/>} />
        <Route path="search" element={<SearchProduct/>} />
        
      </Route>
      
      <Route path="*" element={<NotFound/>}/>
      <Route path="unauth-page" element={<UnAuthPage />} />
    </Routes>
    
    </div>
  )
}

export default App
