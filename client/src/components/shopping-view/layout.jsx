// client/src/components/shopping-view/layout.jsx 


import { Outlet } from 'react-router-dom'
import ShoppingHeader from './header'

function ShoppingLayout() {
    return (
        <div className="flex flex-col bg-white overflow-hidden">
            {/** common header */}
            <ShoppingHeader />
            <main className="relative flex flex-col w-full pt-26">
                <Outlet />
            </main>
        </div>
    )
}

export default ShoppingLayout
