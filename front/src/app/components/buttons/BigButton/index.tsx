import {FC} from 'react'

interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    className: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset' | undefined;
}


const BigButton: FC<Props> = ({ children, onClick, className, disabled, type, }) => {
    return (
        <button
        className={`text-white font-normal text-lg  px-8 py-4 rounded-md ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
        >
        {children}
        </button>
    )
}

export default BigButton;