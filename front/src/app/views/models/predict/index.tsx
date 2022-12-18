import React, { FC, SyntheticEvent, useState, useEffect } from "react";
import { Api } from "../../../services/Api";
import constructTooltipMessage from "../../../utils/tooltipMessage";
import StyledContainer from "../../../components/shared/containers/Container";
import StyledCard from "../../../components/shared/cards/Card";
import NotFoundModels from "../../../components/NotFoundModels";
import Cell from "../../../components/RotatedCell";
import StyledBackLink from "../../../components/buttons/BackLink";
import TooltipIcon from "../../../components/TooltipIcon";
import StyledDefaultButton from "../../../components/buttons/DefaultButton";
import { calculateDistortion } from "../../../utils/calculateDistortion";
import Loader from "../../../components/shared/loaders/Loader";
import { useTranslation } from 'react-i18next';

import HelpCenterWrapper from "../../../components/HelpCenter/HelpCenterWrapper";
import HelpCenterItemTitle from "../../../components/HelpCenter/HelpCenterItemTitle";
import HelpCenterItem from "../../../components/HelpCenter/HelpCenterItem";
import HelpCenterContent from "../../../components/HelpCenter/HelpCenterContent";
import HelpCenterItemContent from "../../../components/HelpCenter/HelpCenterItemContent";
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
      <div className="p-5 m-2 max-w-max dark:text-slate-200">
        <div>
          {T("Distortion")}: <span className={`font-bold dark:text-white`}>{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const Predict: FC<IRoute> = () => {
  const [model, setModel] = useState<string>("");

  const [distortion, setDistortion] = useState(0);

  const [percentage, setPercentage] = useState(0);

  const [models, setModels] = useState<any[]>([]);

  const [tooltipMessage, setTooltipMessage] = useState<string>("");

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [warning, setWarning] = useState(false);

  const { t: T, i18n } = useTranslation();

  const [availableMatrixes, setAvailableMatrixes] = useState([]);

  useEffect(() => {
    const getAvailableMatrixes = async () => {
      const matrixes = await Api.getAvailableMatrixes();
      if (matrixes) {
        setAvailableMatrixes(matrixes?.default_matrixes);
      }
    };
    getAvailableMatrixes();
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    Api.getMLPModels().then((res) => {
      if (res.models.length > 0) {
        setModels(res.models);
        setModel(res.models[0]);
        return;
      }
      setModels([]);
    }).finally(() => {
      setIsLoaded(false);
    });
  }, []);

  useEffect(() => {
    if (model) {
      const getModelData = async () => {
      const modelInfo = await Api.getMLPModelInfo(model)
      if (modelInfo) {
        setTooltipMessage(constructTooltipMessage(modelInfo, T))
      }
    }
    getModelData();
    }
  }, [model, i18n.language]);

  const [actualMatrixKey, setActualMatrixKey] = useState<string>("");

  useEffect(() => {
    if (availableMatrixes.length > 0 && actualMatrixKey) {
      const matrix = availableMatrixes.find((matrix) => matrix.letter === actualMatrixKey);
      setMatrix(matrix?.data);
    }
  }, [availableMatrixes, actualMatrixKey]);

  const [answer, setAnswer] = useState({
    class: '',
    probability: 0,
    other_classes: []
  });

  const handleChangeMatrix = (row: number, cell: number) => {
    const newMatrix = createMatrix(matrix, row, cell);
    setMatrix(newMatrix);
    const actualMatrix = availableMatrixes.find((matrix) => matrix.letter === actualMatrixKey);
    const distortionPercentage = calculateDistortion(
      newMatrix,
      actualMatrix
    );
    setPercentage(distortionPercentage);
  };

  const handleReset = () => {
    setMatrix(initialMatrix);
    setPercentage(0);
    setDistortion(0);
    setAnswer({
      class: '',
      probability: 0,
      other_classes: []
    });
    setActualMatrixKey("");
  };

  const handleSubmitDistortion = async (e: SyntheticEvent) => {
    e.preventDefault();
    const {data: actualMatrix} = availableMatrixes.find((matrix) => matrix.letter === actualMatrixKey);
    const matrixDistorted = await Api.getMatrixDistortioned(actualMatrix, distortion);
    setMatrix(matrixDistorted);
    setPercentage(distortion);
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
    setActualMatrixKey(e.currentTarget.value);
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
  };

  const [matrix, setMatrix] = useState<number[][]>([...initialMatrix]);

  if (isLoaded) {
    return (
      <StyledContainer>
        <StyledCard>
          <div className="p-10 flex justify-center">
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
        <div className="flex lg:flex-row flex-col justify-center gap-10">
          <div className="grid justify-center">
            <div className=" grid grid-rows-10 grid-cols-10 sm:h-[370px] h-[300px] aspect-square gap-2">
              {matrix?.map((row: number[], rowIndex: number) => (
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
          {actualMatrixKey && (
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
              {T("The prediction is")} <span className="font-bold dark:text-white">{answer.class}</span>
            </h4>
            <h4>
            {T("with a probability of")} <span className="font-bold dark:text-white">{answer.probability}%</span>
            </h4>
            {answer.other_classes.length > 0 && (
              <>
              <div className="font-bold dark:text-white">
                {T("Other possible classes are")} 
              </div>
              {answer.other_classes.map((otherClass) => (
                <div>
                  <span className="font-bold dark:text-white">{otherClass.class}</span> {T("with a probability of")} <span className="font-bold dark:text-white">{otherClass.probability}%</span>
                </div>
              ))}
              </>
              )}
          </StyledCard>
        )}
        <div className="w-full flex flex-col items-center justify-center gap-3 ">
          <div className="bg-white shadow-md shadow-gray-100 dark:bg-slate-800 dark:shadow-slate-900 dark:text-slate-200 rounded-md p-5 flex flex-col gap-5 sm:max-w-full max-w-[300px] min-w-[300px]">
            {models.length > 0 ? (
              <>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold inline-flex items-center">
                      {T("Select a Model")}{" "}
                      <TooltipIcon tooltipMessage={tooltipMessage} />
                    </label>
                    <select
                      className=" outline-1 outline-stone-100 border border-gray-100 p-2 dark:text-slate-800 dark:bg-slate-100 dark:border-slate-200 dark:rounded-sm"
                      onChange={handleChangeModel}
                    >
                      {models?.map((model) => (
                        <option value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold">{T("Select a Matrix")}</label>
                    <select
                      className=" outline-1 outline-stone-100 border border-gray-100 p-2 dark:text-slate-800 dark:bg-slate-100 dark:border-slate-200 dark:rounded-sm"
                      onChange={handleChangeDefaultMatrixes}
                    >
                    <option value={actualMatrixKey} selected disabled>{T("Matrix")}</option>
                      {availableMatrixes?.map((key) => {
                        return (
                          <>
                              <option key={key["letter"]} value={key["letter"]}>
                                {key["letter"]}
                              </option>
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
      <HelpCenterWrapper>
        <HelpCenterContent>
          <HelpCenterItem>
            <HelpCenterItemTitle>{T("How to input a pattern?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("You can input a pattern by clicking on the cells of the matrix.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("If you want to change the value of a cell, just click on it.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("If you want to start with a default matrix, you can select it on the 'Select a Matrix' select.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("You can change the model in the 'Select a Model' select.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("Then, you can click on the 'Predict' button to get the prediction.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>
              {T("How to reset the pattern?")}
            </HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("You can reset the pattern by clicking on the 'Reset' button.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("This will reset the matrix and the distortion.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>
              {T("What is the distortion?")}
            </HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("The distortion is the percentage of the cells that will be changed according to the default letter selected.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>
              {T("How to change the amount of distortion?")}
            </HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("You can change the amount of distortion by clicking on the slider and moving it.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("The amount of distortion will be displayed in the text below the slider.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>{T("How to see the Model Info?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("To see the model info, you need to select a model from the list.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("Then pass the mouse on the i tooltip button.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>
              {T("What the answers means?")}
            </HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("The answers means the prediction of the model.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("The prediction is the letter that the model thinks that the pattern represents.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("The probability is the percentage of the model to be right.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
        </HelpCenterContent>
          

      </HelpCenterWrapper>
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
        className="bg-sky-500 hover:bg-sky-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        type="submit"
      >
        {T("Distort")}
      </StyledDefaultButton>
    </StyledCard>
  );
};
