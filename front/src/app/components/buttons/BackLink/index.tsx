import {FC} from 'react'
import { Link } from 'react-router-dom';


interface Props {
    to: string;
    children: React.ReactNode;
}

const StyledBackLink: FC<Props> = ({to, children}) => {
    return (
        <Link className="font-bold ms-font-xl bg-white py-4 px-8 hover:opacity-80 rounded-full text-center top-11 fixed shadow-sm shadow-grey-100 z-50 dark:bg-slate-800 dark:text-white" to={to} >
        {children}
        </Link>
    )
}

export default StyledBackLink;