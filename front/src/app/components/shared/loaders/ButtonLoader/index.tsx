import { FC } from "react";
import styled from "styled-components";

const ButtonLoader: FC = () => {
  return (
    <div>
      <StyledLoader></StyledLoader>
    </div>
  );
};

export default ButtonLoader;

const StyledLoader = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #737373;
  width: 20px;
  height: 20px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #737373;
  border-radius: 50%;
  animation: spinner 1s linear infinite;
  margin-left: 10px;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;