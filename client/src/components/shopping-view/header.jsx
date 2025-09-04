// client/src/components/shopping-view/header.jsx 

import { shoppingViewHeaderMenuItems } from '@/config'
import { 
    Menu, 
    Search, 
    X
} from 'lucide-react'
import { useCallback, useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { SheetContent, SheetTrigger, Sheet } from '../ui/sheet'
import { Input } from '../ui/input'
import logo from '../../assets/logo.jpg'
import { HeaderRightContent } from './right-header';

function MenuItems({ setOpen = undefined }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()

    const handleNavigate = useCallback((getCurrentItemMenuItem) => {
        sessionStorage.removeItem('filters')
        
        const currentFilter = 
            getCurrentItemMenuItem.id !== 'home' &&
            getCurrentItemMenuItem.id !== 'products' &&
            getCurrentItemMenuItem.id !== 'search'
                ? { category: [getCurrentItemMenuItem.id] }
                : null

        if (currentFilter) {
            sessionStorage.setItem('filters', JSON.stringify(currentFilter))
        }
        
        setOpen?.(false)
        
        if (location.pathname.includes('listing') && currentFilter !== null) {
            setSearchParams(new URLSearchParams(`?category=${getCurrentItemMenuItem.id}`))
        } else {
            navigate(getCurrentItemMenuItem.path)
        }
    }, [location.pathname, navigate, setSearchParams, setOpen])

    return (
        <nav className="flex flex-col space-y-1 lg:space-y-0 lg:space-x-1 lg:flex-row lg:justify-center">
            {shoppingViewHeaderMenuItems.map((menuItem) => {
                const isActive = location.pathname === menuItem.path
                return (
                    <Button
                        key={menuItem.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavigate(menuItem)}
                        className={`justify-start lg:justify-center px-4 py-2 text-sm font-medium transition-all duration-200 border border-transparent ${
                            isActive 
                                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 font-semibold border-blue-500/30 shadow-inner' 
                                : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600/50'
                        }`}
                    >
                        {menuItem.label}
                    </Button>
                )
            })}
        </nav>
    )
}

function SearchBar({ isMobile = false }) {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const searchInputRef = useRef(null)

    const handleSearch = useCallback((event) => {
        event.preventDefault()
        const keyword = searchTerm.trim()
        
        if (keyword.length < 2) {
            searchInputRef.current?.focus()
            return
        }
        
        navigate(`/shop/search?keyword=${encodeURIComponent(keyword)}`)
        setSearchTerm('')
        searchInputRef.current?.blur()
    }, [navigate, searchTerm])

    const clearSearch = useCallback(() => {
        setSearchTerm('')
        searchInputRef.current?.focus()
    }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !isMobile) {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
        }
        
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isMobile])

    return (
        <form onSubmit={handleSearch} className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-2xl'} mx-auto`}>
            <div className={`relative flex items-center rounded-full border-2 transition-all duration-300 ${
                isSearchFocused 
                    ? 'ring-2 ring-blue-400/30 border-blue-400 shadow-lg shadow-blue-500/10 bg-slate-800/80' 
                    : 'border-slate-600/50 hover:border-slate-500/70 hover:shadow-md bg-slate-800/50'
            } backdrop-blur-sm`}>
                <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                    ref={searchInputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-12 pr-12 py-3 rounded-full border-0 bg-transparent placeholder:text-slate-400 text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    type="text"
                    placeholder={`Search products${!isMobile ? ' (⌘K)' : ''}...`}
                    maxLength={100}
                />
                {searchTerm && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="absolute right-2 h-7 w-7 rounded-full hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Clear search</span>
                    </Button>
                )}
            </div>
        </form>
    )
}

function ShoppingHeader() {
    const [open, setOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    
    useEffect(() => {
        let ticking = false
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 20)
                    ticking = false
                })
                ticking = true
            }
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 z-50 left-0 w-full transition-all duration-300 ${
            isScrolled 
                ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md shadow-2xl border-b border-slate-700/50' 
                : 'bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm'
        }`}>
            {/* Top Section - Logo and Desktop Search */}
            <div className="flex items-center justify-between px-4 lg:px-6 h-16 border-b border-slate-700/30">
                {/* Logo */}
                <Link 
                    to='/shop/home' 
                    className="flex items-center gap-2 min-w-0 flex-shrink-0 group"
                    aria-label="Go to homepage"
                >
                    <div className="relative flex justify-center items-center p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="h-8 w-auto sm:h-10 md:h-12 max-w-[100px] sm:max-w-[130px] md:max-w-[160px] object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-lg"
                            loading="eager"
                        />
                    </div>
                </Link>

                {/* Desktop Search Bar */}
                <div className="hidden lg:block flex-1 max-w-3xl mx-8">
                    <SearchBar />
                </div>

                {/* Desktop Header Right Content */}
                <div className="hidden lg:block flex-shrink-0">
                    <HeaderRightContent />
                </div>
            </div>

            {/* Bottom Section - Navigation and Mobile Search */}
            <div className="flex items-center justify-between px-4 lg:px-6 h-14 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50">
                {/* Mobile Menu Trigger */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="lg:hidden h-9 w-9 p-0 border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/80 hover:border-slate-500 text-slate-200 transition-all duration-200"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                        <div className="mt-8">
                            <MenuItems setOpen={setOpen} />
                        </div>
                        <div className="mt-12 pt-6 border-t border-slate-700 lg:hidden">
                            <HeaderRightContent />
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Mobile Search Bar */}
                <div className="lg:hidden flex-1 mx-4">
                    <SearchBar isMobile={true} />
                </div>

                {/* Desktop Navigation Menu */}
                <div className="hidden lg:flex justify-center flex-1">
                    <MenuItems />
                </div>

                {/* Mobile Header Right Content */}
                <div className="lg:hidden">
                    <HeaderRightContent />
                </div>
            </div>
        </header>
    )
}

export default ShoppingHeader