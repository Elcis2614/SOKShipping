import { useEffect, useState } from 'react'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { resetTokenAndCredentials } from '@/store/auth-slice'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { Loader2Icon, LogOut, ShoppingCart, UserCog, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarFallback, Avatar } from '../ui/avatar'
import { DropdownMenu } from '../ui/dropdown-menu'
import UserCartWrapper from './cart-wrapper'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Sheet } from '../ui/sheet'

export function HeaderRightContent() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, isLoading, error } = useSelector((state) => state.shopCart);

    if (error) {
        return <div></div>;
    }

    function handleLogout() {
        // dispatch(logoutUser());
        dispatch(resetTokenAndCredentials())
        sessionStorage.clear()
        navigate('/auth/login');
    }

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            dispatch(fetchCartItems(user?.id));
        }
    }, [dispatch, isAuthenticated, user?.id]);

    return (
        <div className="flex items-center md:space-x-6 space-x-2 w-full lg:w-auto ">
            {/* Cart Button */}
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                <Button
                    onClick={() => { setOpenCartSheet(true) }}
                    variant="outline"
                    size="icon"
                    className="relative flex border-none bg-transparent hover:bg-transparent"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                        <div className='flex'>
                            <ShoppingCart className="h-6 w-6 mr-1 items-center" color="white"/>
                            <div className='whitespace-nowrap font-normal hover:underline text-[16px] hidden text-primary-foreground md:block'>Cart</div>
                            {cartItems?.length > 0 && (
                                <span className="absolute top-[-5px] left-[1px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
                    )}
                    <span className="sr-only">User Cart</span>
                </Button>
                {/* Pass cartItems to the cart wrapper */}
                <UserCartWrapper
                    setOpenCartSheet={setOpenCartSheet}
                    isLoading={isLoading}
                    cartItems={!isLoading && cartItems?.length > 0 ? cartItems : []}
                />
            </Sheet>

            {isAuthenticated ?
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="bg-black hover:bg-black cursor-pointer">
                            <AvatarFallback className="text-gray-900 font-extrabold">
                                {user?.userName ? user.userName[0].toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56 mt-2 z-50 bg-white shadow-lg rounded-lg"
                    >
                        <DropdownMenuLabel
                            className="text-gray-700 font-semibold px-4 py-2 mt-2 mb-2"
                        >
                            Logged in as {user?.userName}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate('/shop/account')}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors gap-2"
                        >
                            <UserCog className="mr-2 h-4 w-4 text-gray-600" />
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors gap-2"
                        >
                            <LogOut className="mr-2 h-4 w-4 text-gray-600" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                :
                <Link to='/auth/login'>
                    <div className='flex pointer-cursor items-center'>
                        <div><User className='mr-1 h-6 w-6' color="white"/></div>
                        <div className='whitespace-nowrap  font-normal hover:underline text-[#f8f8f8] text-[16px] hidden md:block'>Sign in</div>
                    </div>
                </Link>
            }
        </div>
    );
}