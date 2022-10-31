import {FC} from 'react'
import styled from 'styled-components';

interface Props {
    children: React.ReactNode;
    onSubmit?: any;
}


const StyledCard: FC<Props>  = ({ children, onSubmit }) => {
    return (
        <div className='flex justify-center'>
        <CardComponent onSubmit={onSubmit} className='flex flex-col bg-white shadow-sm shadow-gray-200 sm:max-w-lg max-w-[300px] rounded-md p-10 gap-5'>
            {children}
        </CardComponent>
        </div>
    );
    }

export default StyledCard;


const CardComponent = styled.form`
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