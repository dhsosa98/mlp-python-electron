import React, { FC, SyntheticEvent, useState, useEffect } from "react";
import { Api } from "../../../services/Api";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";

interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: unknown;
  props?: unknown;
}

const initialMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const dMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const bMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const fMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const defaultMatrixes = {
  _: [...initialMatrix],
  b: [...bMatrix],
  d: [...dMatrix],
  f: [...fMatrix],
};


const calculateDistortion = (
  matrix: number[][],
  actualMatrixKey: keyof typeof defaultMatrixes
) => {
  if (typeof actualMatrixKey !== "string") {
    return 0;
  }
  if (actualMatrixKey === "_") {
    return 0;
  }
  const actualMatrix = defaultMatrixes[actualMatrixKey];
  return matrix.reduce((acc1, row, rowIndex) => {
    return (
      acc1 +
      row.reduce((acc2, cell, cellIndex) => {
        if (cell !== actualMatrix[rowIndex][cellIndex]) {
          return acc2 + 1;
        }
        return acc2;
      }, 0)
    );
  }, 0);
};

const createMatrix = (matrix: number[][], row: number, cell: number) => {
  return matrix.map((r, rowIndex) => {
    return r.map((c, cellIndex) => {
      if (rowIndex === row && cellIndex === cell) {
        return Number(!c);
      }
      return c;
    });
  });
};

const DistortionComponent: FC<any> = ({ percentage }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-white p-5 m-2 max-w-max">
        <div className="">Distortion: {percentage}%</div>
      </div>
    </div>
  );
};

const defaultModels ={'A': 'model100', 'B': 'model500', 'C': 'model1000'}

const Predict: FC<IRoute> = () => {
  const [model, setModel] = useState<string>("A");

  const [distortion, setDistortion] = useState(0);

  const [percentage, setPercentage] = useState(0);

  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    Api.getMLPModels().then((res) => {
      if (res.models.length>0){
        setModels(res.models);
        setModel(res.models[0]);
        return
      }
      setModels([]);
    });
  }, []);

  const [actualMatrixKey, setActualMatrixKey] =
    useState<keyof typeof defaultMatrixes>("_");

  const [answer, setAnswer] = useState("");

  const handleChangeMatrix = (row: number, cell: number) => {
    const newMatrix = createMatrix(matrix, row, cell);
    setMatrix(newMatrix);
    const distortionPercentage = calculateDistortion(
      newMatrix,
      actualMatrixKey
    );
    setPercentage(distortionPercentage);
  };

  const handleReset = () => {
    setMatrix(initialMatrix);
    setPercentage(0);
    setDistortion(0);
    setActualMatrixKey("_");
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const matrixDistorted = await Api.getMatrixDistortioned(matrix, distortion);
    setMatrix(matrixDistorted);
    const distortionPercentage = calculateDistortion(
      matrixDistorted,
      actualMatrixKey
    );
    setPercentage(distortionPercentage);
  };

  const handleSubmitMLPAnswer = async (e: SyntheticEvent) => {
    e.preventDefault();
    const answer = await Api.getMLPAnswer(matrix, model);
    console.log(answer);
    setAnswer(answer.class);
  };

  const handleChangeDefaultMatrixes = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();
    setActualMatrixKey(e.currentTarget.value as keyof typeof defaultMatrixes);
    setMatrix([
      ...defaultMatrixes[e.currentTarget.value as keyof typeof defaultMatrixes],
    ]);
  };

  const handleChangeDistortion = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDistortion(Number(e.currentTarget.value));
  };

  const handleChangeModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setModel(e.currentTarget.value);
  };

  const [matrix, setMatrix] = useState<number[][]>([...initialMatrix]);

  return (
    <div className="flex flex-col justify-center p-10">
      <Link className='font-bold ms-font-xl bg-gradient-to-br from-gray-900 to-gray-500 py-4 px-8 hover:opacity-80 rounded-sm text-center max-w-[100px]' to="/models">Back</Link>
      <div className="flex justify-center gap-10">
        <div className="grid justify-center">
          <div className=" grid grid-rows-10 grid-cols-10 h-[400px] aspect-square gap-3">
            {matrix.map((row: number[], rowIndex: number) => (
              <>
                {row.map((cell: number, cellIndex: number) => {
                  return (
                    <RotatedCell
                      cell={cell}
                      cellIndex={cellIndex}
                      handleChangeMatrix={handleChangeMatrix}
                      rowIndex={rowIndex}
                    />
                  );
                })}
              </>
            ))}
          </div>
        </div>
        {actualMatrixKey !== "_" && (
          <div className="flex flex-col justify-center">
            <DistortionInputComponent
              distortion={distortion}
              handleChangeDistortion={handleChangeDistortion}
              handleSubmit={handleSubmit}
            />
            <DistortionComponent percentage={percentage} />
          </div>
        )}
      </div>
      {answer !== "" && (
        <div className="flex justify-center mt-5">
          <div className="bg-white text-center p-3 max-w-max font-bold">
            Your Letter is: {answer}
          </div>
        </div>
      )}
      <div className="w-full flex p-10 justify-center gap-3">
        <button
          className="bg-red-500 text-white px-4 py-2"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2"
          onClick={handleSubmitMLPAnswer}
        >
          Submit
        </button>
        <select onChange={handleChangeModel}>
          {models.map((model) => (
            <option value={model}>{model}</option>
          ))}
        </select>
        <select onChange={handleChangeDefaultMatrixes}>
          {Object.keys(defaultMatrixes).map((key) => {
            return (
              <>
                {key === "_" ? (
                  <option
                    key={key}
                    disabled
                    selected={actualMatrixKey === "_"}
                    value={key}
                  >
                    {"Select a Matrix"}
                  </option>
                ) : (
                  <option key={key} value={key}>
                    {key}
                  </option>
                )}
              </>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default Predict;

const animationTime = 500;

const RotatedCell: FC<any> = ({
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
    <Rotate
      rotating={isRotating}
      cell={cell}
      className={` justify-center items-center flex ${
        cell ? "bg-sky-500" : "bg-white"
      }`}
      key={cellIndex}
      onClick={handleRotate}
    />
  );
};

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
const Rotate: any = styled.div`
  ${(props: any) =>
    props.rotating &&
    css`
      animation: ${rotateAnimation} ${(animationTime / 1000).toString() + "s"}
        linear;
    `}
`;

const DistortionInputComponent: FC<any> = ({
  distortion,
  handleChangeDistortion,
  handleSubmit,
}) => {
  return (
    <div className="flex bg-white p-5 m-2 flex-col max-w-max justify-center text-center">
      {"Select the Distortion Manually:"}
      <input
        value={distortion}
        min={0}
        max={30}
        type="range"
        onChange={handleChangeDistortion}
      />
      <strong>{distortion}</strong>
      <button
        className="bg-blue-400 text-white px-4 py-2"
        onClick={handleSubmit}
      >
        Distort
      </button>
    </div>
  );
};
