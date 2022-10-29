import {FC} from 'react'

interface Props {
    children: React.ReactNode;
}

const StyledContainer: FC<Props> = ({children}) => {
    return (
        <div className='grid justify-center items-center gap-10 p-10 h-[90vh] m-5 text-gray-900' >
            {children}
        </div>
    )
} 

export default StyledContainer;