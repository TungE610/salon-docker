import React, { useState } from 'react';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../Context/LangContext';
import { Select, Button, Form, Input, InputNumber } from 'antd';
import { Inertia } from "@inertiajs/inertia";
import welcomeBackground from '../../../public/images/welcome-background.svg';
import checkIcon from '../../../public/images/check.svg';
import { Link } from '@inertiajs/inertia-react';

export default function Welcome(props) {
    const { lang, changeLocale } = useLang();
    const [selectedLocale, setSelectedLocale] = useState(lang.getLocale());
    
    const handleLocaleChange = (value) => {
        localStorage.removeItem("locale");
        localStorage.setItem("locale", value);

        setSelectedLocale(value);
        changeLocale(value);

        Inertia.get(route('locale', { lang: value } ));
    };
    return (
        <>
            <Head title="Welcome" />
            <div className="relative items-top justify-center h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className='welcome-nav flex items-center w-full justify-between h-18 px-16 fixed bg-white' >
                    <div className="logo flex items-center">
                        GoCut
                    </div>
                    <Link href={route('login')}>
                        <div className="welcome-signin-btn flex items-center bg-[#1C274C] px-10 text-white h-10 text-xl tracking-widest font-bold cursor-pointer font-bebas">
                                Sign in
                        </div>
                    </Link>
                </div>
                <div className=" w-screen sm:px-8 lg:px-16 h-screen border-y-2 overflow-hidden" 
                        style={{ backgroundImage: `url(${welcomeBackground})`, backgroundSize: 'cover' }}
                    >
                   <div className='flex items-center h-full'>
                        <div>
                            <div className='font-bebas text-3xl'>
                                Power your salon with software you can count on
                            </div>
                            <div className='font-bebas text-2xl font-light mt-6'>
                                See how we can help your business:
                            </div>
                            <div className='flex flex-col gap-y-2 mt-4'>
                                <div className='flex font-bebas text-xl gap-x-2.5'>
                                    <img src={checkIcon} alt="check icon" />
                                    <div>Bring in new clients </div>
                                </div>
                                <div className='flex font-bebas text-xl gap-x-2.5'>
                                    <img src={checkIcon} alt="check icon" />
                                    <div>Make data-driven decisions </div>
                                </div>
                                <div className='flex font-bebas text-xl gap-x-2.5'>
                                    <img src={checkIcon} alt="check icon" />
                                    <div>Synchronize your team 24/7 </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-[#ccc]'>
                            
                        </div>
                   </div>
                   <div>

                   </div>
                </div>
                <footer className="bg-white shadow dark:bg-gray-200 fixed bottom-0 left-0 z-20 w-full">
                        <div className="w-full mx-auto max-w-screen-xl md:flex md:items-center md:justify-between">
                            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                                <Select
                                    defaultValue="English"
                                    style={{
                                        width: 120,
                                    }}
                                    value={selectedLocale}
                                    onChange={handleLocaleChange}
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
                        </div>
                    </footer>
            </div>
        </>
    );
}
