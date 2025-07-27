// client/src/components/shopping-view/header.jsx 

import { shoppingViewHeaderMenuItems } from '@/config'
import { Menu} from 'lucide-react'
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { SheetContent, SheetTrigger, Sheet } from '../ui/sheet'
import logo from '../../assets/logo.jpg'
import { HeaderRightContent } from './right-header';

function MenuItems({ setOpen = undefined }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    {/** Organizing the header menu item to fecth the appropriete product category */ }
    function handleNavigate(getCurrentItemMenuItem) {
        sessionStorage.removeItem('filters')
        // help to navigate through the header link with appropriete pathname
        const currentFilter =
            getCurrentItemMenuItem.id !== 'home' &&
                getCurrentItemMenuItem.id !== 'products' &&
                getCurrentItemMenuItem.id !== 'search'
                ? {
                    category: [getCurrentItemMenuItem.id]
                } : null

        sessionStorage.setItem('filters', JSON.stringify(currentFilter));
        setOpen && setOpen(false);
        // help to navigate through the header link with appropriete pathname 
        if (location.pathname.includes('listing') && currentFilter !== null) {
            setSearchParams(new URLSearchParams(`?category=${getCurrentItemMenuItem.id}`));
        } else {
            navigate(getCurrentItemMenuItem.path);
        }
    }

    return <nav className="flex flex-col space-y-4 lg:space-y-0 lg:space-x-6 lg:flex-row justify-center">
        {
            shoppingViewHeaderMenuItems.map((menuItem) =>
            (
                <Label
                    onClick={() => handleNavigate(menuItem)}
                    key={menuItem.id}
                    className="text-sm font-medium hover:text-primary transition-colors text-left px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                    {menuItem.label}
                </Label>
            )
            )
        }
    </nav>
}

<<<<<<< HEAD
function HeaderRightContent(){
    const {user, isAuthenticated} = useSelector((state)=> state.auth);
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, isLoading, error } = useSelector((state) => state.shopCart);

    if (error) {
        return <div></div>;
    }

    function handleLogout(){
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
        <div className="flex items-center md:space-x-6 space-x-2 w-full lg:w-auto">
            {/* Cart Button */}
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
                <Button 
                    onClick={() => {setOpenCartSheet(true)}}
                    variant="outline" 
                    size="icon"
                    className="relative flex border-none hover:bg-transparent"
                    disabled={isLoading}
                >
                        <div className='flex'>
                            <ShoppingCart className="h-6 w-6 mr-1 items-center"/>
                            <div className='whitespace-nowrap underline font-semibold text-[16px] hidden md:block'>Cart</div>
                            {cartItems?.length > 0 && (
                                <span className="absolute top-[-5px] left-[1px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                    {cartItems.length}
                                </span>
                            )}
                        </div>
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
                        <LogOut className="mr-2 h-4 w-4 text-gray-600"/>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu> 
                :
                <Link to='/auth/login'>
                    <div className='flex pointer-cursor items-center'>
                        <div><User className='mr-1 h-6 w-6'/></div>
                        <div className='whitespace-nowrap underline font-semibold text-[16px] hidden md:block'>Sign in</div>
                    </div>
                </Link>
            }
        </div>
    );
}

function SearchBar(){
=======
function SearchBar() {
>>>>>>> versionE
    const navigate = useNavigate();
    function search(event) {
        const formData = new FormData(event.target).get("keyword");
        navigate(`/shop/search?keyword=${encodeURIComponent(formData)}`);
    }
    return (
        <div>
            <form onSubmit={search} className="w-full max-w-xl mx-auto">
                <div className='relative flex items-center rounded-full'>
                    <FaSearch className='absolute left-3 w-5 h-5 text-gray-500 pointer-events-none' />
                    <input
                        name='keyword'
                        className='w-full pl-12 pr-4 py-2 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0'
                        type="text"
                        placeholder="Search products (minimum 2 characters)..."
                    />
                </div>
            </form>
        </div>);
}

function ShoppingHeader() {
    // const {isAuthenticated} = useSelector(state=> state.auth)
    const [open, setOpen] = useState(false);
    const [isScrolled, setIscroll] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIscroll(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll);
    }, [])
    return (
        <header className={`fixed top-0 z-50 left-0 w-full bg-white  ${isScrolled ? "border-card-container border-b-[1px]" : ""}`}>
            <div className="flex items-center justify-between px-4 md:-6 bg-card-container">
                {/* Logo */}
                <Link to='/shop/home' className="flex h-16 items-center gap-2 ">
                    <div className="relative h-full w-full sm:w-auto max-w-full flex justify-center items-center">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] max-w-full max-h-[90%] object-contain"
                        />
                    </div>
                </Link>
                <div className="hidden lg:block w-full">
                    <SearchBar />
                </div>
                <div>
                    <HeaderRightContent className="hidden lg:block" />
                </div>
            </div>
            <div className="flex h-10 items-center justify-between px-4 md:-6 bg-white">
                {/* Mobile Menu Trigger */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only" > Toggle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs">
                        <MenuItems setOpen={setOpen} />
                    </SheetContent>
                </Sheet>
                <div className='lg:hidden'>
                    <SearchBar />
                </div>
                {/* Desktop Menu */}
                <div className="hidden lg:block justify-center w-full">
                    <MenuItems />
                </div>
            </div>
        </header>
    )
}

export default ShoppingHeader
