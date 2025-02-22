// client/src/components/auth/layout.jsx 

import { Outlet } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import { Link} from 'react-router-dom'
function AuthLayout() {
    return (
        <div className="flex flex-col min-h-screen justify-center">
            <div className='md:flex  w-full justify-center '>
                <div className='md:w-1/2 w-full'>
                    <Link to="/shop/home">
                        <div className=''><img src={logo} className='relative'></img></div>
                    </Link>   
                </div>
                <div className="border flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 rounded-lg">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
