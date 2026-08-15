import { useAppearance } from '@/hooks/use-appearance';
import { logout } from '@/routes';
import { Link, usePage } from '@inertiajs/react';


export default function MainNavbar() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { setting } = usePage().props as any;
    const { auth } = usePage().props;

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <header
                className="header-area bg-white mb-4 rounded-10 border border-white"
                id="header-area">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="left-header-content">
                            <ul className="d-flex align-items-center ps-0 mb-0 list-unstyled justify-content-center justify-content-md-start">
                                <li className="d-xl-none">
                                    <button
                                        className="header-burger-menu bg-transparent p-0 border-0 position-relative top-3"
                                        id="header-burger-menu"
                                        type="button"
                                    >
                                        <span
                                            className="border-1 d-block for-dark-burger"
                                            style={{
                                                borderBottom: "1px solid #475569",
                                                height: "1px",
                                                width: "25px",
                                            }}
                                        />

                                        <span
                                            className="border-1 d-block for-dark-burger"
                                            style={{
                                                borderBottom: "1px solid #475569",
                                                height: "1px",
                                                width: "25px",
                                                margin: "6px 0",
                                            }}
                                        />

                                        <span
                                            className="border-1 d-block for-dark-burger"
                                            style={{
                                                borderBottom: "1px solid #475569",
                                                height: "1px",
                                                width: "25px",
                                            }}
                                        />
                                    </button>
                                </li>

                                {/* <li>
                                    <form className="src-form position-relative">
                                        <input
                                            className="form-control"
                                            placeholder="Search here..."
                                            type="text"
                                        />

                                        <div className="src-btn position-absolute top-50 start-0 translate-middle-y bg-transparent p-0 border-0">
                                            <span className="material-symbols-outlined">
                                                search
                                            </span>
                                        </div>
                                    </form>
                                </li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="right-header-content mt-3 mt-md-0">
                            <ul className="d-flex align-items-center justify-content-center justify-content-md-end ps-0 mb-0 list-unstyled">

                                {/* Dark Mode */}
                                <li className="header-right-item light-dark-item">
                                    <div className="light-dark">
                                        <button
                                            className="switch-toggle dark-btn p-0 bg-transparent lh-0 border-0"
                                            id="switch-toggle"
                                            type="button"
                                            onClick={toggleTheme}
                                            aria-label="Toggle dark mode"
                                        >
                                            <span className="dark">
                                                <i className="material-symbols-outlined">
                                                    dark_mode
                                                </i>
                                            </span>

                                            <span className="light">
                                                <i className="material-symbols-outlined">
                                                    light_mode
                                                </i>
                                            </span>
                                        </button>
                                    </div>
                                </li>
                                
                                {/* Notifications */}
                                {/* <li className="header-right-item">
                                    <div className="dropdown notifications noti">
                                        <button
                                            aria-expanded="false"
                                            className="btn btn-secondary border-0 p-0 position-relative"
                                            data-bs-toggle="dropdown"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined">
                                                notifications
                                            </span>

                                            <span className="count">3</span>
                                        </button>
                                    </div>
                                </li> */}

                                {/* Profile */}
                                <li className="header-right-item">
                                    <div className="dropdown admin-profile">
                                        <div
                                            className="d-xxl-flex align-items-center bg-transparent border-0 text-start p-0 cursor dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                        >
                                            <div className="flex-shrink-0 position-relative">
                                                <img
                                                    alt="admin"
                                                    className="rounded-circle admin-img-width-for-mobile"
                                                    src={
                                                        auth?.user?.avatar
                                                            ? `/${auth.user.avatar}`
                                                            : '/backend/assets/images/placholder.png'
                                                    }
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                    }}
                                                />

                                                <span
                                                    className="d-block bg-success-60 border border-2 border-white rounded-circle position-absolute end-0 bottom-0"
                                                    style={{
                                                        width: "11px",
                                                        height: "11px",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="dropdown-menu border-0 bg-white dropdown-menu-end">
                                            <div className="d-flex align-items-center info">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        alt="admin"
                                                        className="rounded-circle"
                                                        src={
                                                            auth?.user?.avatar
                                                                ? `/${auth.user.avatar}`
                                                                : '/backend/assets/images/placholder.png'
                                                        }
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-grow-1 ms-10">
                                                    <h3 className="fw-medium fs-17 mb-0">
                                                        {[auth?.user?.first_name, auth?.user?.last_name]
                                                            .filter(Boolean)
                                                            .join(' ') || 'User'}
                                                    </h3>

                                                    <span className="fs-15 fw-medium">
                                                        {auth?.user?.role.toUpperCase() || 'Admin'}
                                                    </span>
                                                </div>
                                            </div>

                                            <ul className="admin-link mb-0 list-unstyled">
                                                {auth?.user?.role === 'admin' ? (
                                                    <>
                                                        <li>
                                                            <Link href={'/admin/profile'} className="dropdown-item admin-item-link d-flex align-items-center text-body">
                                                                <i className="material-symbols-outlined">person</i>
                                                                <span className="ms-2">Admin Profile</span>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href={'/admin/settings/system'} className="dropdown-item admin-item-link d-flex align-items-center text-body">
                                                                <i className="material-symbols-outlined">settings</i>
                                                                <span className="ms-2">Settings</span>
                                                            </Link>
                                                        </li>
                                                    </>
                                                ) : (
                                                    <>
                                                        <li>
                                                            <Link href={'/user/dashboard'} className="dropdown-item admin-item-link d-flex align-items-center text-body">
                                                                <i className="material-symbols-outlined">Dashboard</i>
                                                                <span className="ms-2">Dashboard</span>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href={'/user/profile'} className="dropdown-item admin-item-link d-flex align-items-center text-body">
                                                                <i className="material-symbols-outlined">person</i>
                                                                <span className="ms-2">My Profile</span>
                                                            </Link>
                                                        </li>
                                                    </>
                                                )}
                                                <li>
                                                    <Link className="dropdown-item admin-item-link d-flex align-items-center text-body" href={logout()}>
                                                        <i className="material-symbols-outlined">
                                                            logout
                                                        </i>
                                                        <span className="ms-2">
                                                            Logout
                                                        </span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}