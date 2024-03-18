import React, { createContext, useContext, useState } from 'react';

const SideBarContext = createContext();

export const SideBarProvider = ({ children }) => {

    const [activeIndex, setActiveIndex] = useState(1);

    const changeActiveIndex = (newIndex) => {
        setActiveIndex(newIndex);
    };

    return (
        <SideBarContext.Provider value={{ activeIndex, changeActiveIndex }}>
            {children}
        </SideBarContext.Provider>
    );
};

export const useSideBar = () => {
    return useContext(SideBarContext);
};
