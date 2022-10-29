import {FC} from 'react'

interface Props {
    children: React.ReactNode;
}

const TwoColsContainer: FC<Props> = ({children}) => {
    return (
        <div className='grid md:grid-cols-2 grid-cols-1 gap-10 justify-center items-center' >
            {children}
        </div>
    )
}

export default TwoColsContainer