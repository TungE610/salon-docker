import {React, useState} from 'react';
import SideBarItem from './SideBarItem';
import dashboardIcon from '../../../public/images/dashboard.svg';
import peopleIcon from '../../../public/images/people.svg';
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

const SideBarMenu = () => {
    // const { lang, changeLocale } = useLang();
    // const [selectedLocale, setSelectedLocale] = useState(lang.getLocale());

    // const handleChange = (value) => {
    //     localStorage.removeItem("locale");
    //     localStorage.setItem("locale", value);

    //     setSelectedLocale(value);
    //     changeLocale(value);

    //     Inertia.get(route('locale', { lang: value } ));
    // };
    const handleClick = (index) => {
        localStorage.removeItem('activeTab');
        localStorage.setItem("activeTab", index);
    };

    const items = [
        {
            icon: DashboardIcon,
            item: 'Dashboard',
            url: 'dashboard',
            key: 1,
        },
        {
            icon: PeopleIcon,
            item: 'Customers',
            url: 'customers.index',
            key: 2,
        },
    ]

    return (
        <div className="flex flex-col justify-between absolute bottom-0 top-20 w-full">
            <div className="w-full">
                
                {
                     items.map((item) => {
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
