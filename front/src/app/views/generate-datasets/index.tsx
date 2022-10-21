import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { successAlert } from '../../utils/sweetalert';
import { Api } from '../../services/Api';

interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}


const GenerateDatasets: FC<IRoute> = () => {
    const handleSubmit = async (e: any, type: string) => {
        e.preventDefault();
        const generateMessage = await Api.generateDatasets(type);
        await successAlert(generateMessage.message);
    };

    return (
        <div className="p-10 grid h-[100vh] m-5">
            <Link className='font-bold ms-font-xl bg-white py-4 px-8 hover:opacity-80 rounded-full text-center absolute top-10' to="/">Home</Link>
            <div className='grid justify-center items-center'>
                <div className='flex flex-col gap-10 text-white bg-white shadow-md shadow-gray-100 rounded-md p-10'>
                <div className="flex justify-center text-gray-900 font-bold text-2xl">
                    <div className="px-5 py-2 my-5 max-w-[200px] text-2xl text-center">Generate Datasets</div>
                </div>
                <div className='flex flex-col gap-20 text-white'>
                <button className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-md' onClick={async (e) => {handleSubmit(e, 'A') }}>
                    Generate 100 Datasets
                </button>
                <button className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-md' onClick={async (e) => {handleSubmit(e, 'B') }}>
                    Generate 500 Datasets
                </button>
                <button className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-md' onClick={async (e) => {handleSubmit(e, 'C') }}>
                    Generate 1000 Datasets
                </button>
                </div>
                </div>
            </div>
        </div>
    )
}
export default GenerateDatasets;