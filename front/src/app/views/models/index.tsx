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
        <div className='grid justify-center items-center h-[100vh]'>
            <Link className='font-bold ms-font-xl bg-gradient-to-br from-gray-900 to-gray-500 py-4 px-8 hover:opacity-80 rounded-sm text-center' to="/">Home</Link>
            <div className='flex flex-col gap-10 text-white'>
                <Link className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-sm text-center' to="models/test">Test</Link>
                <Link className=' font-bold ms-font-xl bg-gradient-to-br from-blue-900 to-blue-500 py-4 px-8 hover:opacity-80 rounded-sm text-center' to="models/predict">Predict</Link>
                <Link className='font-bold ms-font-xl bg-gradient-to-br from-red-900 to-red-500 py-4 px-8 hover:opacity-80 rounded-sm text-center' to="models/delete">Delete</Link>
            </div>
        </div>
    )
}

export default Models;