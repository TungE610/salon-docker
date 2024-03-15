import React from 'react';

export default function Label({ forInput, value, className, children }) {
    return (
        <label htmlFor={forInput} className={`block font-medium text-lg text-gray-700 font-bebas tracking-wider ` + className}>
            {value ? value : children}
        </label>
    );
}
