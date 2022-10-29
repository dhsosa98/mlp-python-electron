import { FC } from 'react'


interface Props {
    list?: any[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children?: React.ReactNode;
    value?: string | number;
}

const StyledSelect: FC<Props> = ({ list, value, onChange, children }) => {
    return (
        <>
            <select value={value} className=" outline-1 outline-stone-100 p-2 border border-gray-100" onChange={onChange}>
                {list?.map((item) => (
                    <option key={item} value={item}>{item}</option>
                ))}
                {children}
            </select>
        </>
    )
}

export default StyledSelect;