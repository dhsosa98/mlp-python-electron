import {FC} from 'react'

interface Props {
    children: React.ReactNode;
}


const TitleContainer: FC<Props> = ({children}) => {
    return (
        <div className="flex justify-center dark:text-white text-gray-900 font-bold px-5 py-2 my-5 text-2xl text-center">
            <h1>{children}</h1>
        </div>
    )
}

export default TitleContainer;