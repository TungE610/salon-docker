import {React, useState} from 'react';
import { Link } from '@inertiajs/inertia-react';

const SideBarItem = ({icon: Icon, item, url, isActive, setItem, index}) => {

    return (
        <Link className={`sidebar-item flex items-center gap-6 pl-5 w-full h-14 ${isActive ? 'active' : ''}`} href={route(url)} onClick={() => {setItem(index)}}>
            <Icon />
            <div className="font-bebas text-lg text-primary-color tracking-wide">
                {item}
            </div>
        </Link>
    )
}

export default SideBarItem;
