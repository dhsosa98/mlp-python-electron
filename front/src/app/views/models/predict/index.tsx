import React, { FC, SyntheticEvent, useState, useEffect } from "react";
import { Api } from "../../../services/Api";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import constructTooltipMessage from "../../../utils/tooltipMessage";
import ReactTooltip from "react-tooltip";
import StyledContainer from "../../../components/shared/containers/Container";
import StyledCard from "../../../components/shared/cards/Card";
import NotFoundModels from "../../../components/NotFoundModels";
import StyledSelect from "../../../components/inputs/Select";
import Cell from "../../../components/RotatedCell";
import BigButton from "../../../components/buttons/BigButton";
import StyledBackLink from "../../../components/buttons/BackLink";
import TooltipIcon from "../../../components/TooltipIcon";
import StyledDefaultButton from "../../../components/buttons/DefaultButton";
import {
  initialMatrix,
  defaultMatrixes
} from "../../../constants/matrixes";
import { calculateDistortion } from "../../../utils/calculateDistortion";
import Loader from "../../../components/shared/loaders/Loader";
import { useTranslation } from 'react-i18next';


interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: unknown;
  props?: unknown;
}


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
  const { t: T } = useTranslation();
  return (
    <div className="flex justify-center">
      <div className="p-5 m-2 max-w-max">
        <div>
          {T("Distortion")}: <span className={`font-bold`}>{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const Predict: FC<IRoute> = () => {
  const [model, setModel] = useState<string>("A");

  const [distortion, setDistortion] = useState(0);

  const [percentage, setPercentage] = useState(0);

  const [models, setModels] = useState<any[]>([]);

  const [tooltipMessage, setTooltipMessage] = useState<string>("");

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [warning, setWarning] = useState(false);

  const { t: T } = useTranslation();

  useEffect(() => {
    setIsLoaded(true);
    Api.getMLPModels().then((res) => {
      if (res.models.length > 0) {
        setModels(res.models);
        setModel(res.models[0]);
        setTooltipMessage(constructTooltipMessage(res.models[0], T));
        return;
      }
      setModels([]);
    }).finally(() => {
      setIsLoaded(false);
    });
  }, []);

  const [actualMatrixKey, setActualMatrixKey] =
    useState<keyof typeof defaultMatrixes>("_");

  const [answer, setAnswer] = useState({
    class: '',
    probability: 0
  });

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
    setAnswer({
      class: '',
      probability: 0
    });
    setActualMatrixKey("_");
  };

  const handleSubmitDistortion = async (e: SyntheticEvent) => {
    e.preventDefault();
    const matrixDistorted = await Api.getMatrixDistortioned(defaultMatrixes[actualMatrixKey], distortion);
    setMatrix(matrixDistorted);
    const distortionPercentage = calculateDistortion(
      matrixDistorted,
      actualMatrixKey
    );
    setPercentage(distortionPercentage);
  };

  const handleSubmitMLPAnswer = async (e: SyntheticEvent) => {
    try{
    e.preventDefault();
    const answer = await Api.getMLPAnswer(matrix, model);
    console.log(answer);
    setAnswer(answer);
    }catch(e){
      console.log(e);
    }
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
    if (Number(e.currentTarget.value) > 30) {
      setWarning(true);
      return
    }
    setWarning(false);
  };

  const handleChangeModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setModel(e.currentTarget.value);
    setTooltipMessage(constructTooltipMessage(e.currentTarget.value, T));
  };

  const [matrix, setMatrix] = useState<number[][]>([...initialMatrix]);

  if (isLoaded) {
    return (
      <StyledContainer>
        <StyledCard>
          <div className="p-10">
            <Loader />
          </div>
        </StyledCard>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <StyledBackLink to="/models">{T("Back")}</StyledBackLink>
      <div className="flex flex-col gap-5">
        <div className="flex sm:flex-row flex-col justify-center gap-10">
          <div className="grid justify-center">
            <div className=" grid grid-rows-10 grid-cols-10 sm:h-[370px] h-[300px] aspect-square gap-2">
              {matrix.map((row: number[], rowIndex: number) => (
                <>
                  {row.map((cell: number, cellIndex: number) => {
                    return (
                      <Cell
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
            <div>
              <DistortionInputComponent
                distortion={distortion}
                handleChangeDistortion={handleChangeDistortion}
                onSubmit={handleSubmitDistortion}
                warning={warning}
              />
              <DistortionComponent percentage={percentage} />
            </div>
          )}
        </div>
        {answer.class !== "" && (
          <StyledCard>
            <h3 className="font-bold text-xl text-center">{T("Answer")}</h3>
            <h4>
              {T("The prediction is")} <span className="font-bold">{answer.class}</span>
            </h4>
            <h4>
            {T("with a probability of")} <span className="font-bold">{answer.probability}%</span>
            </h4>
          </StyledCard>
        )}
        <div className="w-full flex flex-col items-center justify-center gap-3 ">
          <div className="bg-white shadow-md shadow-gray-100 rounded-md p-5 max-w-[300px] flex flex-col gap-5">
            {models.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold inline-flex">
                      {T("Select a Model")}{" "}
                      <TooltipIcon tooltipMessage={tooltipMessage} />
                    </label>
                    <select
                      className=" outline-1 outline-stone-100 border border-gray-100 p-2"
                      onChange={handleChangeModel}
                    >
                      {models.map((model) => (
                        <option value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold">{T("Select a Matrix")}</label>
                    <select
                      className=" outline-1 outline-stone-100 border border-gray-100 p-2"
                      onChange={handleChangeDefaultMatrixes}
                    >
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
                                {T("Matrix")}
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
                <div className="flex gap-10 justify-center">
                  <StyledDefaultButton
                    className="bg-red-500 hover:bg-red-600"
                    onClick={handleReset}
                  >
                    {T("Reset")}
                  </StyledDefaultButton>
                  <StyledDefaultButton
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSubmitMLPAnswer}
                  >
                    {T("Predict")}
                  </StyledDefaultButton>
                </div>
              </>
            ) : (
              <NotFoundModels />
            )}
          </div>
        </div>
      </div>
    </StyledContainer>
  );
};

export default Predict;

const DistortionInputComponent: FC<any> = ({
  distortion,
  handleChangeDistortion,
  onSubmit,
  warning
}) => {
  const { t: T } = useTranslation();

  return (
    <StyledCard onSubmit={onSubmit}>
      <div className="flex flex-col gap-2 justify-center items-center">
        <label className="font-bold">{T("Select the Distortion Manually")}</label>
        <input
          className="w-full"
          value={distortion}
          min={0}
          max={100}
          type="range"
          onChange={handleChangeDistortion}
        />
        {
          warning && <p className="text-red-500 text-xs"><span className="font-bold">{T("Warning")}</span>{": "}{T("Bad prediction from 30%")}</p>
        }
        <strong className={`${distortion>30 && "text-red-500"}`}>{distortion}{"%"}</strong>
      </div>
      <StyledDefaultButton
        className="bg-sky-500 hover:bg-sky-700"
        type="submit"
      >
        {T("Distort")}
      </StyledDefaultButton>
    </StyledCard>
  );
};
