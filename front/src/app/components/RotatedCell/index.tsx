import {useState, FC} from 'react'
import styled, {keyframes, css} from 'styled-components';
const animationTime = 500;

const Cell: FC<any> = ({
  cell,
  cellIndex,
  handleChangeMatrix,
  rowIndex,
}) => {
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const handleRotate = (e: any) => {
    e.preventDefault();
    if (isRotating) {
      return;
    }
    setIsRotating(true);
    setTimeout(() => {
      handleChangeMatrix(rowIndex, cellIndex);
    }, animationTime / 2);
    setTimeout(() => {
      setIsRotating(false);
    }, animationTime);
  };

  return (
    <RotateComponent
      rotating={isRotating}
      cell={cell}
      className={` justify-center items-center shadow-sm shadow-gray-300 dark:shadow-slate-900 flex ${
        cell ? "bg-sky-300 dark:bg-blue-700" : "bg-white dark:bg-slate-800"
      }`}
      key={cellIndex}
      onClick={handleRotate}
    />
  );
};

export default Cell;

// Create the keyframes
const rotateAnimation = keyframes`
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(180deg);
  }
`;

// Here we create a component that will rotate everything we pass in over two seconds
const RotateComponent: any = styled.div`
  ${(props: any) =>
    props.rotating &&
    css`
      animation: ${rotateAnimation} ${(animationTime / 1000).toString() + "s"}
        linear;
    `}
`;