import {FC} from 'react'

interface Props {
    children: React.ReactNode;
}

const TwoColsContainer: FC<Props> = ({children}) => {
    return (
        <div className='grid lg:grid-cols-2 grid-cols-1 gap-14 justify-center items-center' >
            {children}
        </div>
    )
}

export default TwoColsContainer