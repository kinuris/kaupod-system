import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Package, MessageCircle, DollarSign, Users, UserCog, ShoppingBag, ShoppingCart } from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavItems = (isAdmin: boolean): NavItem[] => {
    const baseItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (isAdmin) {
        baseItems.push(
            {
                title: 'Manage Kit Requests',
                href: '/admin/kit-orders',
                icon: Package,
            },
            {
                title: 'Health Store Products',
                href: '/admin/products',
                icon: ShoppingBag,
            },
            {
                title: 'Product Orders',
                href: '/admin/product-orders',
                icon: ShoppingCart,
            },
            {
                title: 'Manage Consultations',
                href: '/admin/consultation-requests',
                icon: MessageCircle,
            },
            {
                title: 'Client Management',
                href: '/admin/clients',
                icon: UserCog,
            },
            {
                title: 'Partner Doctors',
                href: '/admin/partner-doctors',
                icon: Users,
            },
            {
                title: 'Pricing Settings',
                href: '/admin/pricing',
                icon: DollarSign,
            }
        );
    }

    return baseItems;
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const mainNavItems = getMainNavItems(auth.user?.role === 'admin');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
