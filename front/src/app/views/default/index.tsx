import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}

const Home2: FC<IRoute> = () => {
    return (
        <div className='grid justify-center items-center h-[100vh] m-5'>
            <CardComponent className='flex flex-col gap-10 text-white bg-white shadow-md shadow-gray-100 rounded-md p-10'>
                <div className="flex justify-center text-gray-900 font-bold text-lg">
                    <div className="px-5 py-2 my-5 max-w-[200px] text-2xl text-center">MLP Perceptron</div>
                </div>
                <Link className='font-bold ms-font-xl bg-gradient-to-br from-green-900 to-green-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="/generate-datasets">Generate Datasets</Link>
                <Link className=' font-bold ms-font-xl bg-gradient-to-br from-blue-900 to-blue-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="/train-model">Generate and Train Model</Link>
                <Link className='font-bold ms-font-xl bg-gradient-to-br from-gray-900 to-gray-500 py-4 px-8 hover:opacity-80 rounded-md text-center' to="/models">Models</Link>
            </CardComponent>
        </div>
    )
}

export default Home2;

const CardComponent = styled.div`
  animation: myAnim 0.4s ease-in 0s 1 normal forwards;
  @keyframes myAnim {
    0% {
      opacity: 0;
      transform: translateX(50px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`