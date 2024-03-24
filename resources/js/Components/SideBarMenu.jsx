import {React, useState} from 'react';
import SideBarItem from './SideBarItem';
import dashboardIcon from '../../../public/images/dashboard.svg';
import peopleIcon from '../../../public/images/people.svg';
import salonIcon from '../../../public/images/salon.svg';
import calendarIcon from '../../../public/images/calendar.svg';
import productIcon from '../../../public/images/product.svg';
import categoryIcon from '../../../public/images/category.svg';
import productProductIcon from '../../../public/images/product-product.svg';
import productServiceIcon from '../../../public/images/product-service.svg';
import productPackageIcon from '../../../public/images/product-package.svg';

// import { LangProvider, useLang } from '../Context/LangContext';
import {Select} from 'antd';

const DashboardIcon = () => {
    return (
        <img src={dashboardIcon} alt="dashboard icon" />
    )
}

const PeopleIcon = () => {
    return (
        <img src={peopleIcon} alt="people icon" />
    )
}

const SalonIcon = () => {
    return (
        <img src={salonIcon} alt="people icon" />
    )
}

const CalendarIcon = () => {
    return (
        <img src={calendarIcon} alt="people icon" />
    )
}

const ProductIcon = () => {
    return (
        <img src={productIcon} alt="people icon" />
    )
}

const CategoryIcon = () => {
    return (
        <img src={categoryIcon} alt="people icon" />
    )
}

const SideBarMenu = ({ auth, children, ...props }) => {
    // const { lang, changeLocale } = useLang();
    // const [selectedLocale, setSelectedLocale] = useState(lang.getLocale());

    // const handleChange = (value) => {
    //     localStorage.removeItem("locale");
    //     localStorage.setItem("locale", value);

    //     setSelectedLocale(value);
    //     changeLocale(value);

    //     Inertia.get(route('locale', { lang: value } ));
    // };
    // const systemRole = auth;
    // console.log(systemRole);
    const handleClick = (index) => {
        localStorage.removeItem('activeTab');
        localStorage.setItem("activeTab", index);
    };

    const superAdminItems = [
        {
            icon: DashboardIcon,
            item: 'Dashboard',
            url: 'admin.dashboard',
            key: 1,
        },
        {
            icon: PeopleIcon,
            item: 'Registration',
            url: 'registrations.index',
            key: 2,
        },
        {
            icon: SalonIcon,
            item: 'Salon',
            url: 'salons.index',
            key: 3,
        },
    ]

    const SalonManagerItems = [
        {
            icon: DashboardIcon,
            item: 'Dashboard',
            url: 'admin.dashboard',
            key: 1,
        },
        {
            icon: PeopleIcon,
            item: 'Customers',
            url: 'customers.index',
            key: 2,
        },
        {
            icon: CalendarIcon,
            item: 'Orders',
            url: 'orders.index',
            key: 3,
        },
        {
            icon: ProductIcon,
            item: 'Products',
            url: 'products.index',
            key: 4,
            children: [
                {
                    
                }
            ]
        },
        {
            icon: CategoryIcon,
            item: 'Categories',
            url: 'categories.index',
            key: 5,
        },
    ]

    const menuItems = auth.user.system_role === 'super admin' ? superAdminItems : SalonManagerItems;

    return (
        <div className="flex flex-col justify-between absolute bottom-0 top-20 w-full">
            <div className="w-full">
                
                {
                    menuItems.map((item) => {
                        return (
                            <div key={item.key}> 
                                <SideBarItem key={item.key} index={item.key} icon={item.icon} item={item.item} url={item.url} setItem={handleClick} isActive={item.key == localStorage.getItem('activeTab')}/>
                            </div>
                        )
                    })
                }
            </div>
            {/* <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    <Select
                        defaultValue="English"
                        style={{
                            width: 120,
                        }}
                        value={selectedLocale}
                        onChange={handleChange}
                        options={[
                            {
                                value: 'en',
                                label: 'English',
                            },
                            {
                                value: 'vi',
                                label: 'Tiếng Việt',
                            },
                        ]}
                    />
                </span>
            </div> */}
        </div>
    )
}

export default SideBarMenu;
