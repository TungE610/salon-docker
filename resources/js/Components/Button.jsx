import React from 'react';

export default function MyButton({ type = 'submit', className = '', processing, children, disabled }) {
    return (
        <button
            type={type}
            className={
                `font-bebas text-md inline-flex items-center px-4 py-1 border border-transparent rounded-md font-semibold uppercase tracking-widest transition ease-in-out duration-150 ${
                    processing && 'opacity-25'
                } ` + className
            }
            disabled={processing}
        >
            {children}
        </button>
    );
}
