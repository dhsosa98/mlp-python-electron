import { FC } from 'react';
import { Link } from 'react-router-dom';

interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}

const Home2: FC<IRoute> = () => {
    return (
        <div className='grid justify-center items-center h-[100vh]'>
            <div className='flex flex-col gap-10 text-white bg-white shadow-md shadow-gray-100 rounded-md p-10'>
                <div className="flex justify-center text-gray-900 font-bold text-lg">
                    <div className="px-5 py-2 my-5 max-w-[200px]">TPI-IA-2022</div>
                </div>
                <Link className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="/generate-datasets">Generate Datasets</Link>
                <Link className=' font-bold ms-font-xl bg-gradient-to-br from-blue-900 to-blue-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="/train-model">Gnererate and Train Model</Link>
                <Link className='font-bold ms-font-xl bg-gradient-to-br from-gray-900 to-gray-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="/models">Models</Link>
            </div>
        </div>
    )
}

export default Home2;