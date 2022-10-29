import {FC} from 'react'

interface Props {
    children: React.ReactNode;
}

const FormColumn: FC<Props> = ({children}) => {
    return (
        <div className="grid gap-2">
            {children}
        </div>
    )
}

export default FormColumn