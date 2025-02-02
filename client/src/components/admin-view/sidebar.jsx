// client/src/components/admin-view/sidebar.jsx 

import { LayoutDashboard, ShoppingBasket, BadgeCheck, GanttChartSquare } from 'lucide-react'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '../ui/sheet'

const adminSidebarMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <LayoutDashboard />,
  },
  {
    id: 'products',
    label: 'Products',
    path: '/admin/products',
    icon: <ShoppingBasket />
  },
  {
    id: 'orders',
    label: 'Orders',
    path: '/admin/orders',
    icon: <BadgeCheck />,
  }
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map(menuItem => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) {
              setOpen(false);
            }
          }}
          className="flex text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Fragment>
      {/* Mobile Sidebar (Drawer) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <GanttChartSquare size={30} />
                <span>Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="w-64 flex-col border-r bg-background p-6 hidden lg:flex">
        <div
          onClick={() => navigate('/admin/dashboard')}
          className="flex cursor-pointer items-center gap-2">
          <GanttChartSquare size={30} />
          <h1 className="text-2xl font-extrabold">Admin panel</h1>
        </div>
        <MenuItems setOpen={setOpen} />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;