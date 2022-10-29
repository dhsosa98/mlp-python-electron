import {FC} from 'react'
import { Link } from 'react-router-dom';


interface Props {
    to: string;
    className: string;
    children: React.ReactNode;
}

const StyledLink: FC<Props> = ({to, className, children}) => {
    return (
        <Link className={`${className} text-white font-medium ms-font-xl py-4 px-8 hover:opacity-80 rounded-md text-center`} to={to} >
        {children}
        </Link>
    )
}

export default StyledLink;