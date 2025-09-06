import { useState } from 'react'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { resetTokenAndCredentials } from '@/store/auth-slice'
import { Loader2Icon, LogOut, ShoppingCart, UserCog, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarFallback, Avatar } from '../ui/avatar'
import { DropdownMenu } from '../ui/dropdown-menu'
import UserCartWrapper from './cart-wrapper'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Sheet } from '../ui/sheet'

export function HeaderRightContent() {
    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const [openCartSheet, setOpenCartSheet] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cartItems, isLoading, error } = useSelector((state) => state.shopCart)

    if (error) {
        return <div className="text-destructive text-sm">Error loading cart</div>
    }

    function handleLogout() {
        dispatch(resetTokenAndCredentials())
        sessionStorage.clear()
        navigate('/auth/login')
    }


    return (
        <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Cart Button */}
            <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
                <Button
                    onClick={() => setOpenCartSheet(true)}
                    variant="ghost"
                    size="sm"
                    className="relative h-10 px-3 text-slate-100 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group border border-slate-600/30 hover:border-slate-500/50"
                    disabled={isLoading}
                >
                    <div className='flex items-center gap-2'>
                        <div className="relative">
                            <ShoppingCart className="h-5 w-5 group-hover:scale-105 transition-transform drop-shadow-sm" />
                            
                        </div>
                        <span className='hidden md:block text-sm font-medium'>
                            Cart
                        </span>
                    </div>
                </Button>
                <UserCartWrapper
                    setOpenCartSheet={setOpenCartSheet}
                    isLoading={isLoading}
                />
            </Sheet>

            {/* User Account Section */}
            {isAuthenticated ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50">
                            <Avatar className="h-8 w-8 border-2 border-slate-600 hover:border-blue-400 transition-colors">
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-sm shadow-inner">
                                    {user?.userName ? user.userName[0].toUpperCase() : 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56 mt-2 p-1 bg-slate-800 border-slate-700 shadow-2xl"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="px-3 py-2">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-slate-100">
                                    {user?.userName}
                                </p>
                                <p className="text-xs leading-none text-slate-400">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                            onClick={() => navigate('/shop/account')}
                            className="cursor-pointer px-3 py-2 text-slate-200 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                        >
                            <UserCog className="mr-3 h-4 w-4 text-blue-400" />
                            <span>Account Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:text-red-300 focus:bg-red-900/20"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-10 px-3 text-slate-100 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group border border-slate-600/30 hover:border-slate-500/50"
                >
                    <Link to='/auth/login' className="flex items-center gap-2">
                        <User className='h-5 w-5 group-hover:scale-105 transition-transform drop-shadow-sm' />
                        <span className='hidden md:block text-sm font-medium'>
                            Sign in
                        </span>
                    </Link>
                </Button>
            )}
        </div>
    )
}
