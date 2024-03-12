import React, { useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Select } from "antd";
import { useLang } from "@/Context/LangContext";
import { Inertia } from "@inertiajs/inertia";

export default function Guest({ children }) {
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
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="big-logo flex items-center">
                GoCut
            </div>
            <div className="sm:w-2/3 lg:w-1/3 mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
            <footer className="bg-white shadow dark:bg-gray-200 fixed bottom-0 left-0 z-20 w-full">
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
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
    );
}
