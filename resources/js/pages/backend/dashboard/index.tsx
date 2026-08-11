import { Head } from '@inertiajs/react';
import DashboardChart from '../../widget/chart';
import MainLayout from '@/layouts/main-layout';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="main-content-container overflow-hidden">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <h3>
                                    Total Sales
                                </h3>
                                <div className="dropdown select-dropdown without-border">
                                    <button aria-expanded="false" className="dropdown-toggle bg-transparent text-secondary fs-15" data-bs-toggle="dropdown">
                                        Year 2025
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end bg-white border-0 box-shadow rounded-10" data-simplebar="">
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                Year 2025
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                Year 2025
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                Year 2023
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Area Chart */}
                            <DashboardChart
                                type="area"
                                height="260"
                                categories={[
                                    'Jan',
                                    'Feb',
                                    'Mar',
                                    'Apr',
                                    'May',
                                    'Jun',
                                    'Jul',
                                    'Aug',
                                    'Sep',
                                    'Oct',
                                    'Nov',
                                    'Dec',
                                ]}
                                series={[
                                    {
                                        name: 'Sales',
                                        data: [120, 200, 150, 300, 280, 400, 120, 190, 150, 300, 280, 400],
                                    },
                                    {
                                        name: 'Revenue',
                                        data: [80, 150, 120, 250, 230, 350, 120, 200, 180, 150, 130, 190],
                                    },
                                ]}
                            />


                        </div>
                    </div>
                    <div className="col-lg-6 col-xxl-3 col-xxxl-6">
                        <div className="row">
                            <div className="col-md-6 col-lg-12">
                                <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1">
                                            <h3 className="mb-10">
                                                Total Orders
                                            </h3>
                                            <h2 className="fs-26 fw-medium mb-0 lh-1">
                                                20,705
                                            </h2>
                                        </div>
                                        <div className="flex-shrink-0 ms-3">
                                            <div className="bg-primary text-white text-center rounded-circle d-block" style={{ width: "75px", height: "75px", lineHeight: "105px" }}>
                                                <i className="material-symbols-outlined fs-40">
                                                    shopping_basket
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "21px" }}>
                                        <p className="mb-0 fs-14">
                                            4.75% Increase in orders last week
                                        </p>
                                        <span className="d-flex align-content-center gap-1 bg-success bg-opacity-10 border border-success" style={{ padding: "3px 5px" }}>
                                            <i className="material-symbols-outlined fs-14 text-success">
                                                trending_up
                                            </i>
                                            <span className="lh-1 fs-14 text-success">
                                                4.75%
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-12">
                                <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1">
                                            <h3 className="mb-10">
                                                Total Customers
                                            </h3>
                                            <h2 className="fs-26 fw-medium mb-0 lh-1">
                                                84,127
                                            </h2>
                                        </div>
                                        <div className="flex-shrink-0 ms-3">
                                            <div className="bg-info text-white text-center rounded-circle d-block" style={{ width: "75px", height: "75px", lineHeight: "105px" }}>
                                                <i className="material-symbols-outlined fs-40">
                                                    diversity_2
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "21px" }}>
                                        <p className="mb-0 fs-14">
                                            Total visitors decreased by 1.25%
                                        </p>
                                        <span className="d-flex align-content-center gap-1 bg-danger bg-opacity-10 border border-danger" style={{ padding: "3px 5px" }}>
                                            <i className="material-symbols-outlined fs-14 text-danger">
                                                trending_down
                                            </i>
                                            <span className="lh-1 fs-14 text-danger">
                                                1.25%
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12 col-xxl-3 col-xxxl-12">
                        <div className="row">
                            <div className="col-md-6 col-xxxl-6 col-xxl-12">
                                <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1">
                                            <h3 className="mb-10">
                                                Total Revenue
                                            </h3>
                                            <h2 className="fs-26 fw-medium mb-0 lh-1">
                                                $15,278
                                            </h2>
                                        </div>
                                        <div className="flex-shrink-0 ms-3">
                                            <div className="bg-warning text-white text-center rounded-circle d-block" style={{ width: "75px", height: "75px", lineHeight: "116px" }}>
                                                <i className="material-symbols-outlined fs-50">
                                                    attach_money
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "23px" }}>
                                        <p className="mb-0 fs-14">
                                            Revenue increases this month
                                        </p>
                                        <span className="d-flex align-content-center gap-1 bg-success bg-opacity-10 border border-success" style={{ padding: "3px 5px" }}>
                                            <i className="material-symbols-outlined fs-14 text-success">
                                                trending_up
                                            </i>
                                            <span className="lh-1 fs-14 text-success">
                                                3.15%
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xxxl-6 col-xxl-12">
                                <div className="bg-primary-50 p-20 border rounded-10 border-primary-50 mb-4">
                                    <h3 className="text-white mb-12">
                                        Sales Overview
                                    </h3>
                                    <div className="d-flex flex-wrap gap-2 justify-content-between mb-14">
                                        <div>
                                            <span className="fs-14 text-white mb-1 d-block">
                                                Total Sales
                                            </span>
                                            <h2 className="fs-20 fw-medium lh-1 text-white mb-0">
                                                9,586
                                            </h2>
                                        </div>
                                        <div>
                                            <span className="fs-14 text-white mb-1 d-block">
                                                Monthly Sales
                                            </span>
                                            <h2 className="fs-20 fw-medium lh-1 text-white mb-0">
                                                3,507
                                            </h2>
                                        </div>
                                        <div>
                                            <span className="fs-14 text-white mb-1 d-block">
                                                Todayâs Sales
                                            </span>
                                            <h2 className="fs-20 fw-medium lh-1 text-white mb-0">
                                                357
                                            </h2>
                                        </div>
                                    </div>
                                    {/* <div aria-label="Basic example" aria-valuemax="100" aria-valuemin="0" aria-valuenow="80" className="progress rounded-0 mb-6" role="progressbar" style={{ height: "3px", backgroundColor: "#6258cc" }}>
                                            <div className="progress-bar rounded-0 bg-white" style={{ width: "80%", height: "3px" }}>
                                            </div>
                                        </div> */}
                                    <span className="fs-14 text-white d-block" style={{ marginBottom: "-6px" }}>
                                        20% Increase in last month
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-6 col-xxxl-12">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
                                        <h3>
                                            Profit
                                        </h3>
                                        <div className="dropdown select-dropdown without-border">
                                            <button aria-expanded="false" className="dropdown-toggle bg-transparent text-secondary fs-15" data-bs-toggle="dropdown">
                                                Action
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end bg-white border-0 box-shadow rounded-10" data-simplebar="">
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        Export
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        Print
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <DashboardChart
                                        type="bar"
                                        height="225"
                                        categories={[
                                            '2026',
                                            '2025',
                                            '2024',
                                            '2023',
                                            '2022',
                                            '2021',
                                            '2020',
                                        ]}
                                        series={[
                                            {
                                                name: 'Sales',
                                                data: [120, 200, 150, 300, 280, 280, 400],
                                            },
                                            {
                                                name: 'Revenue',
                                                data: [350, 120, 200, 180, 150, 130, 190],
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
                                        <h3>
                                            Average Daily Sales
                                        </h3>
                                        <span className="d-flex align-content-center gap-1 bg-success bg-opacity-10 border border-success" style={{ padding: "3px 5px" }}>
                                            <i className="material-symbols-outlined fs-14 text-success">
                                                trending_up
                                            </i>
                                            <span className="lh-1 fs-14 text-success">
                                                5.25%
                                            </span>
                                        </span>
                                    </div>

                                    <DashboardChart
                                        type="line"
                                        height="225"
                                        categories={[
                                            'Jan',
                                            'Feb',
                                            'Mar',
                                            'Apr',
                                            'May',
                                            'Jun',
                                            'Jul',
                                            'Aug',
                                            'Sep',
                                            'Oct',
                                            'Nov',
                                            'Dec',
                                        ]}
                                        series={[
                                            {
                                                name: 'Sales',
                                                data: [120, 200, 150, 300, 280, 400, 120, 190, 150, 300, 280, 400],
                                            },
                                            {
                                                name: 'Revenue',
                                                data: [80, 150, 120, 250, 230, 350, 120, 200, 180, 150, 130, 190],
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card p-20 bg-light-40 rounded-10 border-light-40 mb-4 position-relative z-1">
                                    <h3 className="mb-20">
                                        Best Seller Of The Month
                                    </h3>
                                    <h3 className="mb-12 text-primary-50">
                                        Michael Marquez!
                                    </h3>
                                    <h2 className="lh-1 fs-26 fw-medium">
                                        $3.5K
                                        <span className="fs-16 text-body">
                                            (Sales)
                                        </span>
                                    </h2>
                                    <a className="fw-medium fs-16 text-secondary hover-text d-inline-block" href="#" style={{ marginTop: "84px" }}>
                                        Details View
                                    </a>
                                    <img alt="man" className="position-absolute bottom-0 end-0 pe-3" src="/backend/assets/images/man.png" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card p-20 bg-white rounded-10 border border-white mb-4 position-relative z-1">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
                                        <h3>New Customers This Month</h3>

                                        <span
                                            className="d-flex align-content-center gap-1 bg-success bg-opacity-10 border border-success"
                                            style={{ padding: "3px 5px" }}
                                        >
                                            <i className="material-symbols-outlined fs-14 text-success">
                                                trending_up
                                            </i>

                                            <span className="lh-1 fs-14 text-success">
                                                2.75%
                                            </span>
                                        </span>
                                    </div>

                                    <h2 className="lh-1 fs-26 fw-medium">
                                        2,537
                                    </h2>

                                    <div style={{ marginTop: "55px" }}>
                                        <span className="fs-16 text-body d-block mb-10">
                                            Join Today
                                        </span>

                                        <ul className="p-0 mb-0 list-unstyled d-flex last-child-none global-right-list">
                                            <li style={{ marginRight: "-20px" }}>
                                                <img
                                                    alt="user12"
                                                    className="border border-3 border-white rounded-circle"
                                                    src="/backend/assets/images/user12.jpg"
                                                    style={{ width: "52px", height: "52px" }}
                                                />
                                            </li>

                                            <li style={{ marginRight: "-20px" }}>
                                                <img
                                                    alt="user13"
                                                    className="border border-3 border-white rounded-circle"
                                                    src="/backend/assets/images/user13.jpg"
                                                    style={{ width: "52px", height: "52px" }}
                                                />
                                            </li>

                                            <li style={{ marginRight: "-20px" }}>
                                                <img
                                                    alt="user14"
                                                    className="border border-3 border-white rounded-circle"
                                                    src="/backend/assets/images/user14.jpg"
                                                    style={{ width: "52px", height: "52px" }}
                                                />
                                            </li>

                                            <li style={{ marginRight: "-20px" }}>
                                                <img
                                                    alt="user15"
                                                    className="border border-3 border-white rounded-circle"
                                                    src="/backend/assets/images/user15.jpg"
                                                    style={{ width: "52px", height: "52px" }}
                                                />
                                            </li>

                                            <li style={{ marginRight: "-20px" }}>
                                                <img
                                                    alt="user16"
                                                    className="border border-3 border-white rounded-circle"
                                                    src="/backend/assets/images/user16.jpg"
                                                    style={{ width: "52px", height: "52px" }}
                                                />
                                            </li>

                                            <li
                                                className="border border-3 border-white rounded-circle bg-primary text-center"
                                                style={{
                                                    marginRight: "-20px",
                                                    width: "52px",
                                                    height: "52px",
                                                    lineHeight: "49px",
                                                }}
                                            >
                                                <span className="text-white fs-16 fw-medium">
                                                    27
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6 col-xxxl-12">
                        <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
                                <h3>
                                    Top Selling Products
                                </h3>
                                <div className="dropdown select-dropdown without-border">
                                    <button aria-expanded="false" className="dropdown-toggle bg-transparent text-secondary fs-15" data-bs-toggle="dropdown">
                                        This Week
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end bg-white border-0 box-shadow rounded-10" data-simplebar="">
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Day
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Week
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Month
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Year
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="default-table-area without-header table-top-selling-products">
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <tbody>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    01.
                                                </td>
                                                <td className="ps-0">
                                                    <a className="d-flex align-items-center text-decoration-none" href="product-details.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="product1" className="rounded-circle" src="/backend/assets/images/product1.png" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal hover-text">
                                                                Smart Watch
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                953 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-1217
                                                </td>
                                                <td className="text-body">
                                                    $90,954
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    02.
                                                </td>
                                                <td className="ps-0">
                                                    <a className="d-flex align-items-center text-decoration-none" href="product-details.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="product2" className="rounded-circle" src="/backend/assets/images/product2.png" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal hover-text">
                                                                Mobile Phone
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                876 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-9513
                                                </td>
                                                <td className="text-body">
                                                    $85,648
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    03.
                                                </td>
                                                <td className="ps-0">
                                                    <a className="d-flex align-items-center text-decoration-none" href="product-details.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="product3" className="rounded-circle" src="/backend/assets/images/product3.png" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal hover-text">
                                                                Laptop Device
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                823 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-7531
                                                </td>
                                                <td className="text-body">
                                                    $79,852
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    04.
                                                </td>
                                                <td className="ps-0">
                                                    <a className="d-flex align-items-center text-decoration-none" href="product-details.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="product4" className="rounded-circle" src="/backend/assets/images/product4.png" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal hover-text">
                                                                Black T-Shirt
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                743 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-3579
                                                </td>
                                                <td className="text-body">
                                                    $73,624
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    05.
                                                </td>
                                                <td className="ps-0">
                                                    <a className="d-flex align-items-center text-decoration-none" href="product-details.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="product5" className="rounded-circle" src="/backend/assets/images/product5.png" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal hover-text">
                                                                Headphones
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                693 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-4826
                                                </td>
                                                <td className="text-body">
                                                    $65,973
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    06.
                                                </td>
                                                <td className="ps-0">
                                                    <a className="d-flex align-items-center text-decoration-none" href="product-details.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="product6" className="rounded-circle" src="/backend/assets/images/product6.png" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal hover-text">
                                                                Hand Watch
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                654 Items Sold
                                                            </span>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    Item: #ARP-1265
                                                </td>
                                                <td className="text-body">
                                                    $42,455
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap pt-15">
                                    <span className="fs-15">
                                        Showing 1 to 5 of 50 entries
                                    </span>
                                    <nav aria-label="Page navigation example" className="custom-pagination">
                                        <ul className="pagination mb-0 justify-content-center">
                                            <li className="page-item">
                                                <button aria-label="Previous" className="page-link icon">
                                                    <i className="material-symbols-outlined">
                                                        west
                                                    </i>
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link active">
                                                    1
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    2
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    3
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button aria-label="Next" className="page-link icon">
                                                    <i className="material-symbols-outlined">
                                                        east
                                                    </i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-lg-6 col-xxl-4 col-xxxl-6 mb-4">
                        <div className="card bg-white p-20 rounded-10 border border-white">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
                                <h3>
                                    Order Summary
                                </h3>
                                <div className="dropdown select-dropdown without-border">
                                    <button aria-expanded="false" className="dropdown-toggle bg-transparent text-secondary fs-15" data-bs-toggle="dropdown">
                                        This Week
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end bg-white border-0 box-shadow rounded-10" data-simplebar="">
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Day
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Week
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Month
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Year
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-20">
                                <span className="fs-15 text-secondary">
                                    Completed 60%
                                </span>
                                <span className="fs-15 text-secondary">
                                    New Order 30%
                                </span>
                                <span className="fs-15 text-secondary">
                                    Pending 10%
                                </span>
                            </div>
                            <div id="order_summary_chart">
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xxl-4 col-xxxl-6">
                        <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
                                <h3>
                                    Top Sellers
                                </h3>
                                <div className="dropdown select-dropdown without-border">
                                    <button aria-expanded="false" className="dropdown-toggle bg-transparent text-secondary fs-15" data-bs-toggle="dropdown">
                                        This Week
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end bg-white border-0 box-shadow rounded-10" data-simplebar="">
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Day
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Week
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Month
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                This Year
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="default-table-area without-header table-top-sellers">
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <tbody>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    01.
                                                </td>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user6" className="rounded-circle" src="/backend/assets/images/user6.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal">
                                                                Mark Stjohn
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                Customer ID #76431
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <ul className="p-0 mb-0 list-unstyled d-flex align-items-center justify-content-end" style={{ gap: "2px" }}>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <span className="fs-14 text-body fw-normal">
                                                                (5)
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    02.
                                                </td>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user7" className="rounded-circle" src="/backend/assets/images/user7.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal">
                                                                Joan Stanley
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                Customer ID #64815
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <ul className="p-0 mb-0 list-unstyled d-flex align-items-center justify-content-end" style={{ gap: "2px" }}>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-half-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <span className="fs-14 text-body fw-normal">
                                                                (4.5)
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    03.
                                                </td>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user8" className="rounded-circle" src="/backend/assets/images/user8.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal">
                                                                Jacob Bell
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                Customer ID #34581
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <ul className="p-0 mb-0 list-unstyled d-flex align-items-center justify-content-end" style={{ gap: "2px" }}>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-line text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <span className="fs-14 text-body fw-normal">
                                                                (4)
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    04.
                                                </td>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user9" className="rounded-circle" src="/backend/assets/images/user9.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal">
                                                                Donald Bryan
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                Customer ID #67941
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <ul className="p-0 mb-0 list-unstyled d-flex align-items-center justify-content-end" style={{ gap: "2px" }}>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <span className="fs-14 text-body fw-normal">
                                                                (5)
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body fw-medium">
                                                    05.
                                                </td>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user10" className="rounded-circle" src="/backend/assets/images/user10.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal">
                                                                Kristina Blomquist
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                Customer ID #36985
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <ul className="p-0 mb-0 list-unstyled d-flex align-items-center justify-content-end" style={{ gap: "2px" }}>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <span className="fs-14 text-body fw-normal">
                                                                (5)
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                            <tr className="last-child-border-none">
                                                <td className="text-body fw-medium">
                                                    06.
                                                </td>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user11" className="rounded-circle" src="/backend/assets/images/user11.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-normal">
                                                                Jeffrey Morrison
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                Customer ID #26985
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <ul className="p-0 mb-0 list-unstyled d-flex align-items-center justify-content-end" style={{ gap: "2px" }}>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-half-fill text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <i className="ri-star-line text-warning fs-16">
                                                            </i>
                                                        </li>
                                                        <li>
                                                            <span className="fs-14 text-body fw-normal">
                                                                (3.5)
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 col-xxl-4 col-xxxl-12">
                        <div className="row">
                            <div className="col-xxl-12 col-lg-6 col-xxxl-6">
                                <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                                    <h3 className="mb-20">
                                        Top Sales Locations
                                    </h3>
                                    <div className="row align-items-center">
                                        <div className="col-lg-7 col-sm-6">
                                            <div className="text-center">
                                                <div id="sales_by_locations_map">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-5 col-sm-6">
                                            <ul className="p-0 mb-0 list-unstyled last-child-none mt-4 mt-sm-0">
                                                <li className="d-flex align-items-center gap-2 mb-9">
                                                    <img alt="usa" className="rounded-circle" src="/backend/assets/images/usa.png" style={{ width: "20px", height: "20px" }} />
                                                    <span className="fs-15">
                                                        United States
                                                        <span className="text-secondary">
                                                            85%
                                                        </span>
                                                    </span>
                                                </li>
                                                <li className="d-flex align-items-center gap-2 mb-9">
                                                    <img alt="china" className="rounded-circle" src="/backend/assets/images/china.png" style={{ width: "20px", height: "20px" }} />
                                                    <span className="fs-15">
                                                        China
                                                        <span className="text-secondary">
                                                            60%
                                                        </span>
                                                    </span>
                                                </li>
                                                <li className="d-flex align-items-center gap-2 mb-9">
                                                    <img alt="australia" className="rounded-circle" src="/backend/assets/images/australia.png" style={{ width: "20px", height: "20px" }} />
                                                    <span className="fs-15">
                                                        Australia
                                                        <span className="text-secondary">
                                                            85%
                                                        </span>
                                                    </span>
                                                </li>
                                                <li className="d-flex align-items-center gap-2 mb-9">
                                                    <img alt="germany" className="rounded-circle" src="/backend/assets/images/germany.png" style={{ width: "20px", height: "20px" }} />
                                                    <span className="fs-15">
                                                        Germany
                                                        <span className="text-secondary">
                                                            75%
                                                        </span>
                                                    </span>
                                                </li>
                                                <li className="d-flex align-items-center gap-2 mb-9">
                                                    <img alt="canada" className="rounded-circle" src="/backend/assets/images/canada.png" style={{ width: "20px", height: "20px" }} />
                                                    <span className="fs-15">
                                                        Canada
                                                        <span className="text-secondary">
                                                            80%
                                                        </span>
                                                    </span>
                                                </li>
                                                <li className="d-flex align-items-center gap-2 mb-9">
                                                    <img alt="france" className="rounded-circle" src="/backend/assets/images/france.png" style={{ width: "20px", height: "20px" }} />
                                                    <span className="fs-15">
                                                        France
                                                        <span className="text-secondary">
                                                            65%
                                                        </span>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xxl-12 col-lg-6 col-xxxl-6">
                                <div className="card bg-white p-20 rounded-10 border border border-white mb-4">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-0">
                                        <h3>
                                            Revenue
                                        </h3>
                                        <div className="dropdown select-dropdown without-border">
                                            <button aria-expanded="false" className="dropdown-toggle bg-transparent text-secondary fs-15" data-bs-toggle="dropdown">
                                                This Week
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end bg-white border-0 box-shadow rounded-10" data-simplebar="">
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        This Day
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        This Week
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        This Month
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-secondary">
                                                        This Year
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div id="revenue_chart" style={{ marginBottom: "-17px" }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-8 col-xxxxl-12">
                        <div className="card bg-white rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-20">
                                <h3>
                                    Recent Orders
                                </h3>
                                <div className="d-flex align-items-center">
                                    <div className="dropdown select-dropdown without-border">
                                        <button aria-expanded="false" className="dropdown-toggle bg-transparent text-secondary fs-15" data-bs-toggle="dropdown">
                                            Show All
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end bg-white border-0 box-shadow rounded-10" data-simplebar="">
                                            <li>
                                                <button className="dropdown-item text-secondary">
                                                    Shipped
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item text-secondary">
                                                    Confirmed
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item text-secondary">
                                                    Pending
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item text-secondary">
                                                    Rejected
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <form className="table-src-form position-relative">
                                        <input className="form-control" placeholder="Search here..." type="text" />
                                        <div className="src-btn position-absolute top-50 start-0 translate-middle-y bg-transparent p-0 border-0">
                                            <span className="material-symbols-outlined">
                                                search
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="default-table-area mx-minus-1 table-recent-orders">
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th className="fw-medium" scope="col">
                                                    Order ID
                                                </th>
                                                <th className="fw-medium" scope="col">
                                                    Customer
                                                </th>
                                                <th className="fw-medium" scope="col">
                                                    Created
                                                </th>
                                                <th className="fw-medium" scope="col">
                                                    Total
                                                </th>
                                                <th className="fw-medium" scope="col">
                                                    Profit
                                                </th>
                                                <th className="fw-medium" scope="col">
                                                    Status
                                                </th>
                                                <th className="fw-medium" scope="col">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-body">
                                                    #ARP-1217
                                                </td>
                                                <td>
                                                    <a className="d-flex align-items-center text-decoration-none" href="customers.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user1" className="rounded-circle" src="/backend/assets/images/user1.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-medium hover-text mb-0 fs-16">
                                                                Carlos Daley
                                                            </h3>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    15 Nov, 2025
                                                </td>
                                                <td className="text-body">
                                                    $9,095
                                                </td>
                                                <td className="text-body">
                                                    $1,254
                                                </td>
                                                <td>
                                                    <span className="text-primary bg-primary bg-opacity-10 fs-15 fw-normal d-inline-block default-badge">
                                                        Shipped
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-end" style={{ gap: "12px" }}>
                                                        <button className="bg-transparent p-0 border-0" data-bs-placement="top" data-bs-title="View" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-primary">
                                                                visibility
                                                            </i>
                                                        </button>
                                                        <button className="bg-transparent p-0 border-0 hover-text-danger" data-bs-placement="top" data-bs-title="Delete" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                delete
                                                            </i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body">
                                                    #ARP-9513
                                                </td>
                                                <td>
                                                    <a className="d-flex align-items-center text-decoration-none" href="customers.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user2" className="rounded-circle" src="/backend/assets/images/user2.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-medium hover-text mb-0 fs-16">
                                                                Dorothy Young
                                                            </h3>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    14 Nov, 2025
                                                </td>
                                                <td className="text-body">
                                                    $8,564
                                                </td>
                                                <td className="text-body">
                                                    $973
                                                </td>
                                                <td>
                                                    <span className="text-success bg-success bg-opacity-10 fs-15 fw-normal d-inline-block default-badge">
                                                        Confirmed
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-end" style={{ gap: '12px' }}>
                                                        <button className="bg-transparent p-0 border-0" data-bs-placement="top" data-bs-title="View" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-primary">
                                                                visibility
                                                            </i>
                                                        </button>
                                                        <button className="bg-transparent p-0 border-0 hover-text-danger" data-bs-placement="top" data-bs-title="Delete" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                delete
                                                            </i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body">
                                                    #ARP-7513
                                                </td>
                                                <td>
                                                    <a className="d-flex align-items-center text-decoration-none" href="customers.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user3" className="rounded-circle" src="/backend/assets/images/user3.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-medium hover-text mb-0 fs-16">
                                                                Greg Woody
                                                            </h3>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    13 Nov, 2025
                                                </td>
                                                <td className="text-body">
                                                    $7,985
                                                </td>
                                                <td className="text-body">
                                                    $852
                                                </td>
                                                <td>
                                                    <span className="text-warning bg-warning bg-opacity-10 fs-15 fw-normal d-inline-block default-badge">
                                                        Pending
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-end" style={{ gap: '12px' }}>
                                                        <button className="bg-transparent p-0 border-0" data-bs-placement="top" data-bs-title="View" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-primary">
                                                                visibility
                                                            </i>
                                                        </button>
                                                        <button className="bg-transparent p-0 border-0 hover-text-danger" data-bs-placement="top" data-bs-title="Delete" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                delete
                                                            </i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body">
                                                    #ARP-3579
                                                </td>
                                                <td>
                                                    <a className="d-flex align-items-center text-decoration-none" href="customers.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user4" className="rounded-circle" src="/backend/assets/images/user4.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-medium hover-text mb-0 fs-16">
                                                                Deborah Rosol
                                                            </h3>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    12 Nov, 2025
                                                </td>
                                                <td className="text-body">
                                                    $7,362
                                                </td>
                                                <td className="text-body">
                                                    $793
                                                </td>
                                                <td>
                                                    <span className="text-danger bg-danger bg-opacity-10 fs-15 fw-normal d-inline-block default-badge">
                                                        Rejected
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-end" style={{ gap: '12px' }}>
                                                        <button className="bg-transparent p-0 border-0" data-bs-placement="top" data-bs-title="View" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-primary">
                                                                visibility
                                                            </i>
                                                        </button>
                                                        <button className="bg-transparent p-0 border-0 hover-text-danger" data-bs-placement="top" data-bs-title="Delete" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                delete
                                                            </i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-body">
                                                    #ARP-4826
                                                </td>
                                                <td>
                                                    <a className="d-flex align-items-center text-decoration-none" href="customers.html">
                                                        <div className="flex-shrink-0">
                                                            <img alt="user1" className="rounded-circle" src="/backend/assets/images/user5.jpg" style={{ width: "50px", height: "50px" }} />
                                                        </div>
                                                        <div className="flex-grow-1 ms-12">
                                                            <h3 className="fw-medium hover-text mb-0 fs-16">
                                                                Kendall Allen
                                                            </h3>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td className="text-body">
                                                    11 Nov, 2025
                                                </td>
                                                <td className="text-body">
                                                    $6,597
                                                </td>
                                                <td className="text-body">
                                                    $674
                                                </td>
                                                <td>
                                                    <span className="text-primary bg-primary bg-opacity-10 fs-15 fw-normal d-inline-block default-badge">
                                                        Shipped
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-end" style={{ gap: '12px' }}>
                                                        <button className="bg-transparent p-0 border-0" data-bs-placement="top" data-bs-title="View" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-primary">
                                                                visibility
                                                            </i>
                                                        </button>
                                                        <button className="bg-transparent p-0 border-0 hover-text-danger" data-bs-placement="top" data-bs-title="Delete" data-bs-toggle="tooltip">
                                                            <i className="material-symbols-outlined fs-16 fw-normal text-body">
                                                                delete
                                                            </i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap pt-15 p-20">
                                    <span className="fs-15">
                                        Showing 1 to 5 of 50 entries
                                    </span>
                                    <nav aria-label="Page navigation example" className="custom-pagination">
                                        <ul className="pagination mb-0 justify-content-center">
                                            <li className="page-item">
                                                <button aria-label="Previous" className="page-link icon">
                                                    <i className="material-symbols-outlined">
                                                        west
                                                    </i>
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link active">
                                                    1
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    2
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    3
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button aria-label="Next" className="page-link icon">
                                                    <i className="material-symbols-outlined">
                                                        east
                                                    </i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-xxxxl-12">
                        <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-20">
                                <h3>
                                    Transactions History
                                </h3>
                                <div className="dropdown select-dropdown without-border">
                                    <button aria-expanded="false" className="dropdown-toggle bg-transparent text-secondary fs-15" data-bs-toggle="dropdown">
                                        Last Month
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end bg-white border-0 box-shadow rounded-10" data-simplebar="">
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                Last Day
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                Last Week
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                Last Month
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-secondary">
                                                Last Year
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="default-table-area without-header table-transactions-history">
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <tbody>
                                            <tr>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <div className="text-primary text-center rounded-circle" style={{ width: "50px", height: "50px", lineHeight: "62px", backgroundColor: "#dbeafd" }}>
                                                                <i className="material-symbols-outlined fs-24">
                                                                    settings_backup_restore
                                                                </i>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 ms-15">
                                                            <h3 className="fw-normal">
                                                                Refund Bill payment
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                15 Nov 2025 - 11:40am
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-normal text-success fs-16">
                                                    +$995
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <div className="text-danger text-center rounded-circle" style={{ width: "50px", height: "50px", lineHeight: "62px", backgroundColor: '#fce4e2' }}>
                                                                <i className="material-symbols-outlined fs-24">
                                                                    account_balance
                                                                </i>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 ms-15">
                                                            <h3 className="fw-normal">
                                                                Bank Transfer
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                15 Nov 2025 - 8:20am
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-normal text-danger fs-16">
                                                    -$1,550
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <div className="text-primary-50 text-center rounded-circle" style={{ width: "50px", height: "50px", lineHeight: "62px", backgroundColor: '#fce4e2' }}>
                                                                <i className="material-symbols-outlined fs-24">
                                                                    credit_card
                                                                </i>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 ms-15">
                                                            <h3 className="fw-normal">
                                                                Master Card
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                14 Nov 2025 - 11:40am
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-normal text-success fs-16">
                                                    +$862
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <div className="text-info text-center rounded-circle" style={{ width: "50px", height: "50px", lineHeight: "62px", backgroundColor: '#fce4e2' }}>
                                                                <i className="material-symbols-outlined fs-24">
                                                                    account_balance_wallet
                                                                </i>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 ms-15">
                                                            <h3 className="fw-normal">
                                                                Wallet
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                10 Nov 2025 - 10:10am
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-normal text-success fs-16">
                                                    +$974
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <div className="text-warning text-center rounded-circle" style={{ width: "50px", height: "50px", lineHeight: "62px", backgroundColor: '#fff4e8' }}>
                                                                <i className="material-symbols-outlined fs-24">
                                                                    attach_money
                                                                </i>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 ms-15">
                                                            <h3 className="fw-normal">
                                                                Cash Withdrawal
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                09 Nov 2025 - 1:30pm
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-normal text-danger fs-16">
                                                    -$250
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="ps-0">
                                                    <div className="d-flex align-items-center text-decoration-none">
                                                        <div className="flex-shrink-0">
                                                            <div className="text-success-60 text-center rounded-circle" style={{ width: "50px", height: "50px", lineHeight: "62px", backgroundColor: '#fff4e8' }}>
                                                                <i className="material-symbols-outlined fs-24">
                                                                    payments
                                                                </i>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 ms-15">
                                                            <h3 className="fw-normal">
                                                                Payment
                                                            </h3>
                                                            <span className="fs-14 text-body fw-normal">
                                                                8 Nov 2025 - 12:34pm
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="fw-normal text-danger fs-16">
                                                    -$657
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-center justify-content-sm-between align-items-center text-center flex-wrap gap-2 showing-wrap pt-15">
                                    <span className="fs-15">
                                        Showing 1 to 5 of 50 entries
                                    </span>
                                    <nav aria-label="Page navigation example" className="custom-pagination">
                                        <ul className="pagination mb-0 justify-content-center">
                                            <li className="page-item">
                                                <button aria-label="Previous" className="page-link icon">
                                                    <i className="material-symbols-outlined">
                                                        west
                                                    </i>
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link active">
                                                    1
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    2
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button className="page-link">
                                                    3
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <button aria-label="Next" className="page-link icon">
                                                    <i className="material-symbols-outlined">
                                                        east
                                                    </i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
}
