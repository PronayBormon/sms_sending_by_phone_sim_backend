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
                    <div className="col-md-6  col-6">
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

                    <div className="col-md-6 col-6">
                        <div className="right-header-content mt-3 mt-md-0">
                            <ul className="d-flex align-items-center justify-content-center justify-content-md-end ps-0 mb-0 list-unstyled">
                                {/* Language */}
                                <li className="header-right-item language-item">
                                    <div className="dropdown notifications language">
                                        <button
                                            aria-expanded="false"
                                            className="btn btn-secondary dropdown-toggle border-0 p-0 position-relative"
                                            data-bs-toggle="dropdown"
                                            type="button"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: "19px" }}
                                            >
                                                translate
                                            </span>
                                        </button>

                                        <div className="dropdown-menu dropdown-lg p-0 border-0 dropdown-menu-end">
                                            <span
                                                className="fw-medium fs-16 text-secondary d-block title"
                                                style={{
                                                    paddingTop: "20px",
                                                    paddingBottom: "20px",
                                                }}
                                            >
                                                Choose Language
                                            </span>

                                            <div className="max-h-275" data-simplebar="">
                                                {[
                                                    {
                                                        name: "English",
                                                        image: "usa.png",
                                                    },
                                                    {
                                                        name: "Australia",
                                                        image: "australia.png",
                                                    },
                                                    {
                                                        name: "Spanish",
                                                        image: "spain.png",
                                                    },
                                                    {
                                                        name: "France",
                                                        image: "france.png",
                                                    },
                                                ].map((lang, index) => (
                                                    <div
                                                        className="notification-menu"
                                                        key={index}
                                                    >
                                                        <button
                                                            className="dropdown-item"
                                                            type="button"
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <img
                                                                        alt={lang.name}
                                                                        className="wh-30 rounded-circle"
                                                                        src={`/backend/assets/images/${lang.image}`}
                                                                    />
                                                                </div>

                                                                <div className="flex-grow-1 ms-10">
                                                                    <span className="text-secondary fw-medium fs-15">
                                                                        {lang.name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </li>

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

                                {/* Calendar */}
                                {/* <li className="header-right-item calendar-item">
                                    <div className="dropdown notifications">
                                        <a
                                            className="btn btn-secondary border-0 p-0 position-relative"
                                            href="/calendar"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: "19px" }}
                                            >
                                                calendar_today
                                            </span>
                                        </a>
                                    </div>
                                </li> */}

                                {/* Messages */}
                                {/* <li className="header-right-item messages-item">
                                    <div className="dropdown notifications noti messages">
                                        <button
                                            aria-expanded="false"
                                            className="btn btn-secondary border-0 p-0 position-relative"
                                            data-bs-toggle="dropdown"
                                            type="button"
                                        >
                                            <span className="material-symbols-outlined">
                                                mail
                                            </span>

                                            <span className="count bg-primary">5</span>
                                        </button>

                                        <div className="dropdown-menu dropdown-lg p-0 border-0 dropdown-menu-end">
                                            <div className="d-flex justify-content-between align-items-center title">
                                                <span className="fw-medium fs-16 text-secondary">
                                                    Messages
                                                </span>

                                                <button
                                                    className="p-0 m-0 bg-transparent border-0 fs-15 text-primary fw-medium"
                                                    type="button"
                                                >
                                                    Mark all as read
                                                </button>
                                            </div>

                                            <div
                                                data-simplebar=""
                                                style={{ maxHeight: "300px" }}
                                            >
                                                {[1, 2, 3].map((item) => (
                                                    <div
                                                        className="notification-menu"
                                                        key={item}
                                                    >
                                                        <a
                                                            className="dropdown-item"
                                                            href="/chat"
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0">
                                                                    <img
                                                                        alt="user"
                                                                        className="rounded-circle"
                                                                        src={`/backend/assets/images/user${item}.jpg`}
                                                                        style={{
                                                                            width: "44px",
                                                                            height: "44px",
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="flex-grow-1 ms-10">
                                                                    <p className="fs-16 fw-medium text-secondary mb-2">
                                                                        User {item}
                                                                    </p>

                                                                    <span
                                                                        className="fs-14-5 fw-medium d-inline-block"
                                                                        style={{
                                                                            lineHeight:
                                                                                "1.4",
                                                                        }}
                                                                    >
                                                                        Message preview...
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </li> */}

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
                                                <li>
                                                    <Link href={'/admin/profile'} className="dropdown-item admin-item-link d-flex align-items-center text-body" >
                                                        <i className="material-symbols-outlined">
                                                            person
                                                        </i>
                                                        <span className="ms-2">
                                                            My Profile
                                                        </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href={'/admin/settings/system'} className="dropdown-item admin-item-link d-flex align-items-center text-body" >
                                                        <i className="material-symbols-outlined">
                                                            settings
                                                        </i>
                                                        <span className="ms-2">
                                                            Settings
                                                        </span>
                                                    </Link>
                                                </li>
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