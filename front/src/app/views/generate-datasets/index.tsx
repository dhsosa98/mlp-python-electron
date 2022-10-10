import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Api } from '../../services/Api';

interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}


const GenerateDatasets: FC<IRoute> = () => {
    const [message, setMessage] = useState("");
    const [type, setType] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const generateMessage = await Api.generateDatasets(type);
        setMessage(generateMessage.message);
    };

    return (
        <div className="p-10 grid gap-40">
            <div className="flex justify-around">
            <Link className='font-bold ms-font-xl bg-gradient-to-br from-gray-900 to-gray-500 py-4 px-8 hover:opacity-80 rounded-sm text-center' to="/">Home</Link>
            {message && (
            <div className='bg-green-600 border-2 rounded-sm border-green-200 flex justify-center items-center relative p-4'>
                <button className="absolute -top-2 right-0 text-lg text-white font-bold" onClick={()=>{setMessage('')}}>x</button>
                <p className='text-white font-normal text-lg'>{message}</p>
            </div>)}
            </div>
            <div className='grid justify-center items-center'>
                <div className='flex flex-col gap-10 text-white justify-center'>
                <div className='flex flex-col gap-20 text-white'>
                <button className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-sm' onClick={(e) => { setType('A'); handleSubmit(e) }}>
                    Generate 100 Datasets
                </button>
                <button className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-sm' onClick={(e) => { setType('B'); handleSubmit(e) }}>
                    Generate 500 Datasets
                </button>
                <button className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-sm' onClick={(e) => { setType('C'); handleSubmit(e) }}>
                    Generate 1000 Datasets
                </button>
                </div>
                </div>
            </div>
        </div>
    )
}
export default GenerateDatasets;