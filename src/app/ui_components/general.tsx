import { MouseEventHandler } from 'react';
import clsx from 'clsx';

interface ButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function Button({
    onClick,
    children,
    className,
    disabled,
}: ButtonProps) {
    return (
        <button
            className={clsx(
                `block w-fit min-w-[100px] bg-red-800 text-white py-2 px-4 rounded-xl ${className}`,
                {
                    'hover:bg-red-500 hover:text-black': !disabled,
                    'bg-slate-500 text-black': disabled,
                }
            )}
            onClick={onClick}
            disabled={disabled}
            aria-disabled={disabled}
        >
            {children}
        </button>
    );
}

export function LoadingWheel() {
    return (
        <div className="mx-auto mt-8 w-fit">
            <span className="ml-4 inline-block w-[100px] h-[100px] border-4 border-l-transparent border-t border-b-red-200 rounded-full animate-spin"></span>
        </div>
    );
}
