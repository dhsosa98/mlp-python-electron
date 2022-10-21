import { FC } from 'react';
import { Link } from 'react-router-dom';

interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}

const Models: FC<IRoute> = () => {
    return (
        <div className='grid justify-center items-center gap-40 p-10 h-[100vh] m-5'>
            <Link className='font-bold ms-font-xl bg-white py-4 px-8 hover:opacity-80 rounded-full text-center absolute top-10' to="/">Home</Link>
            <div className='flex flex-col gap-10 text-white bg-white shadow-md shadow-gray-100 rounded-md p-10'>
            <div className="flex justify-center text-gray-900 font-bold text-lg">
                    <div className="px-5 py-2 my-5 max-w-[200px] text-2xl">Models</div>
                </div>
                <div className='w-[200px] flex flex-col gap-10'>
                <Link className='w-full font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="models/test">Test</Link>
                <Link className='w-full font-bold ms-font-xl bg-gradient-to-br from-blue-900 to-blue-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="models/predict">Predict</Link>
                <Link className='w-full font-bold ms-font-xl bg-gradient-to-br from-red-900 to-red-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="models/delete">Delete</Link>
                </div>
            </div>
        </div>
    )
}

export default Models;