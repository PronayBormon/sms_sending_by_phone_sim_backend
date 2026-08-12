import { Link, usePage } from '@inertiajs/react';
import { home, logout } from '@/routes';
import type { SideNavItem } from '@/types';
import { useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';


interface MenuItem extends SideNavItem {
    icon_name?: string;
    icon?: string;
    children?: MenuItem[];
}

// const { setting } = usePage().props as any;

// console.log(setting + "===========================")

const items: MenuItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon_name: 'dashboard',
        icon: 'material-symbols-outlined menu-icon',
    },

    {
        title: 'Users',
        href: '/admin/users',
        icon_name: 'group',
        icon: 'material-symbols-outlined menu-icon',
    },

    {
        title: 'Teams',
        href: '/admin/teams',
        icon_name: 'corporate_fare',
        icon: 'material-symbols-outlined menu-icon',
    },

    {
        title: 'Contacts',
        href: '/admin/contacts',
        icon_name: 'contacts',
        icon: 'material-symbols-outlined menu-icon',
    },

    {
        title: 'Contact Lists',
        href: '/admin/contact-lists',
        icon_name: 'list_alt',
        icon: 'material-symbols-outlined menu-icon',
    },

    {
        title: 'Message Templates',
        href: '/admin/message-templates',
        icon_name: 'sms',
        icon: 'material-symbols-outlined menu-icon',
    },

    {
        title: 'Devices & SIMs',
        href: '/admin/devices',
        icon_name: 'sim_card',
        icon: 'material-symbols-outlined menu-icon',
    },

    {
        title: 'Campaigns',
        href: '/admin/campaigns',
        icon_name: 'campaign',
        icon: 'material-symbols-outlined menu-icon',
    },

    {
        title: 'Content',
        href: '',
        icon_name: 'article',
        icon: 'material-symbols-outlined menu-icon',
        children: [
            {
                title: 'FAQs',
                href: '/admin/faq/list',
            },
            {
                title: 'Privacy Policy',
                href: '/admin/page/privacy-policy',
            },
            {
                title: 'Terms & Conditions',
                href: '/admin/page/terms-and-conditions',
            },
        ],
    },

    {
        title: 'Queue Management',
        href: '',
        icon_name: 'queue',
        icon: 'material-symbols-outlined menu-icon',
        children: [
            {
                title: 'Pending Jobs',
                href: '/admin/queues',
            },
            {
                title: 'Failed Jobs',
                href: '/admin/failed-jobs',
            },
        ],
    },

    {
        title: 'System',
        href: '',
        icon_name: 'monitoring',
        icon: 'material-symbols-outlined menu-icon',
        children: [
            {
                title: 'Error Logs',
                href: '/admin/logs',
            },
        ],
    },

    {
        title: 'Settings',
        href: '',
        icon_name: 'settings',
        icon: 'material-symbols-outlined menu-icon',
        children: [
            {
                title: 'System Settings',
                href: '/admin/settings/system',
            },
            {
                title: 'SMTP Settings',
                href: '/admin/settings/smtp',
            },
            {
                title: 'Stripe Settings',
                href: '/admin/settings/stripe',
            },
        ],
    },

    // {
    //     title: 'Profile',
    //     href: '/admin/profile',
    //     icon_name: 'account_circle',
    //     icon: 'material-symbols-outlined menu-icon',
    // },
];

export default function UserSidebar() {
    const page = usePage();
    const { setting } = page.props as any;

    const theme = document.body.getAttribute('data-theme');

    const [openMenu, setOpenMenu] = useState<string | null>(
        null
    );
    const { resolvedAppearance } = useAppearance();

    const logo =
        resolvedAppearance === 'dark'
            ? setting?.dark_logo
            : setting?.light_logo;

    const toggleSidebar = () => {
        const current = document.body.getAttribute('sidebar-data-theme');

        document.body.setAttribute(
            'sidebar-data-theme',
            current === 'sidebar-hide' ? 'sidebar-show' : 'sidebar-hide',
        );
    };

    return (
        <div className="sidebar-area" id="sidebar-area">
            <div className="logo position-relative d-flex align-items-center justify-content-between">

                <Link
                    className="d-block text-decoration-none position-relative"
                    href={home()}
                >
                    <img
                        src={
                            logo
                                ? `/${logo}`
                                : '/backend/assets/images/seller1.png'
                        }
                        alt="Logo"
                        style={{
                            maxHeight: '100px',
                            width: 'auto',
                        }}
                    />

                </Link>

                {/* sidebar collaps button  */}
                <button
                    aria-label="Expand sidebar"
                    className="sidebar-burger-menu-close bg-transparent py-3 border-0 opacity-0 z-n1 position-absolute top-50 end-0 translate-middle-y"
                    id="sidebar-burger-menu-close"
                    onClick={toggleSidebar}
                    type="button"
                >
                    <span className="border-1 d-block for-dark-burger" style={{
                        borderBottom: "1px solid #475569", height: "1px", width: "25px", transform: "rotate(45deg)"
                    }}>
                    </span>
                    <span className="border-1 d-block for-dark-burger" style={{
                        borderBottom: "1px solid #475569", height: "1px", width: "25px", transform: "rotate(-45deg)"
                    }}>
                    </span>
                </button>
                <button
                    aria-label="Collapse sidebar"
                    className="sidebar-burger-menu bg-transparent p-0 border-0"
                    id="sidebar-burger-menu"
                    onClick={toggleSidebar}
                    type="button"
                >
                    <span className="border-1 d-block for-dark-burger" style={{ borderBottom: "1px solid #475569", height: "1px", width: "25px" }}>
                    </span>
                    <span className="border-1 d-block for-dark-burger" style={{ borderBottom: "1px solid #475569", height: "1px", width: "25px" }}>
                    </span>
                    <span className="border-1 d-block for-dark-burger" style={{ borderBottom: "1px solid #475569", height: "1px", width: "25px" }}>
                    </span>
                </button>
            </div>

            <aside
                className="layout-menu menu-vertical menu "
                data-simplebar=""
                id="layout-menu"
            >
                <ul className="menu-inner">
                    {items.map((item, index) => {
                        const hasChildren =
                            item.children &&
                            item.children.length > 0;

                        const isActive =
                            item.href !== '#' &&
                            page.url.startsWith(
                                item.href as string
                            );

                        const isChildActive =
                            item.children?.some((child) =>
                                page.url.startsWith(
                                    child.href as string
                                )
                            );

                        const isOpen =
                            openMenu === item.title ||
                            isChildActive;

                        return (
                            <li
                                key={index}
                                className={`menu-item ${isActive || isChildActive
                                    ? 'open'
                                    : ''
                                    }`}
                            >
                                {hasChildren ? (
                                    <>
                                        <a
                                            className={`menu-link menu-toggle ${isOpen ? 'active' : ''
                                                }`}
                                            href="javascript:void(0);"
                                            onClick={() =>
                                                setOpenMenu(
                                                    isOpen ? null : item.title
                                                )
                                            }
                                        >
                                            <span className={item.icon}>
                                                {item.icon_name}
                                            </span>

                                            <span className="title">
                                                {item.title}
                                            </span>
                                        </a>

                                        <ul
                                            className="menu-sub"
                                            style={{
                                                display: isOpen ? 'block' : 'none',
                                            }}
                                        >
                                            {item.children?.map(
                                                (child, childIndex) => {
                                                    const childActive =
                                                        page.url.startsWith(
                                                            child.href as string
                                                        );

                                                    return (
                                                        <li
                                                            className={`menu-item mb-1 ${childActive
                                                                ? 'active'
                                                                : ''
                                                                }`}
                                                            key={childIndex}
                                                        >
                                                            <Link
                                                                className={`menu-link ${childActive
                                                                    ? 'active'
                                                                    : ''
                                                                    }`}
                                                                href={child.href}
                                                            >
                                                                {child.title}
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </>
                                ) : (
                                    <Link
                                        className={`menu-link ${isActive
                                            ? 'active'
                                            : ''
                                            }`}
                                        href={item.href}
                                    >
                                        <span
                                            className={item.icon}
                                        >
                                            {item.icon_name}
                                        </span>

                                        <span className="title">
                                            {item.title}
                                        </span>
                                    </Link>
                                )}
                            </li>
                        );
                    })}

                    <li className="menu-item">
                        <Link
                            className="menu-link"
                            href={logout()}
                            method="post"
                            as="button"
                        >
                            <span className="material-symbols-outlined menu-icon">
                                logout
                            </span>

                            <span className="title">
                                Logout
                            </span>
                        </Link>
                    </li>
                </ul>
            </aside>
        </div>
    );
}
