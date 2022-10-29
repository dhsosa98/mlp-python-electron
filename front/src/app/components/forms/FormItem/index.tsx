import { FC } from 'react'

interface Props {
    children: React.ReactNode;
    label?: string;
}

const FormItem: FC<Props> = ({ children, label }) => {
    return (
        <div className="grid gap-2">
            {label && <label className="font-bold" >{label}</label>}
            {children}
        </div>
    )
}

export default FormItem