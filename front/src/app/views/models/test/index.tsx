import { FC, useContext, useEffect, useState } from "react";
import { infoAlert, successAlert } from "../../../utils/sweetalert";
import { Api } from "../../../services/Api";
import constructTooltipMessage from "../../../utils/tooltipMessage";
import StyledBackLink from "../../../components/buttons/BackLink";
import StyledContainer from "../../../components/shared/containers/Container";
import MSEPlot from "../../../components/MSEPlot";
import NotFoundModels from "../../../components/NotFoundModels";
import StyledCard from "../../../components/shared/cards/Card";
import TestResults from "../../../components/TestResults";
import BigButton from "../../../components/buttons/BigButton";
import StyledSelect from "../../../components/inputs/Select";
import TwoColsContainer from "../../../components/shared/containers/TwoColsContainer";
import TooltipIcon from "../../../components/TooltipIcon";
import Loader from "../../../components/shared/loaders/Loader";
import { useTranslation } from "react-i18next";
import TrainResults from "../../../components/TrainResults";
import ThemeContext from "../../../../theme";


interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: unknown;
  props?: unknown;
}

const TrainModel: FC<IRoute> = () => {
  const [models, setModels] = useState<any[]>([]);

  const [model, setModel] = useState<string>("");

  const [plotData, setPlotData] = useState<any>({ "val": [], "train": [] });

  const [tooltipMessage, setTooltipMessage] = useState<string>("");

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {theme} = useContext(ThemeContext)

  const { t: T } = useTranslation();

  const [result, setResult] = useState({
    "model_name": "",
    "accuracy_test": "",
    "MSE_test": "",
    "test_cases": "",
  });

  const [history, setHistory] = useState({
    model_name: "",
    learning_rate: "",
    momentum: "",
    amount_of_epochs: "",
    val_percentage: "",
    topology: [],
    training_cases: "",
    validation_cases: "",
    accuracy_train: "",
    accuracy_val: "",
    MSE_train: "",
    MSE_val: "",
    accuracy_test: "",
    MSE_test: "",
    test_cases: "",
  });

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
    }).finally(() => setIsLoaded(false));
  }, []);

  const handleChangeModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setModel(e.currentTarget.value);
    setTooltipMessage(constructTooltipMessage(e.currentTarget.value, T));
  };

  const handleTestModel = async (e: React.FormEvent<HTMLFormElement>) => {
    try{
    e.preventDefault();
    setIsLoaded(true);
    const response = await Api.testMLPModel(model)
    if (response.data) {
      setResult(response.data);
      setHistory(response.history.results);
      setTooltipMessage(constructTooltipMessage(model, T));
      setPlotData(response.plot_data);
      await successAlert(T('Model Successfully Tested'), '', theme);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500)
    }
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoaded(false);
    }
  };

  if (isLoaded) {
    return (
    <StyledContainer>
        <StyledCard>
          <div className="p-10">
          <Loader/>
          </div>
          </StyledCard>
    </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <StyledBackLink
        to="/models"
      >
        {T("Back")}
      </StyledBackLink>
      {plotData?.val.length > 0 &&
      <>
        <TwoColsContainer>
          <MSEPlot plotData={plotData} />
          <TrainResults result={history} />
        </TwoColsContainer>
        <StyledCard>
        <TestResults result={result} />
        </StyledCard>
      </>
      }
      <StyledCard onSubmit={handleTestModel}>
        {models.length > 0 ?
          (
            <>
              <label className="font-bold inline-flex">{T("Select a Model")} <TooltipIcon tooltipMessage={tooltipMessage}/></label>
              <StyledSelect list={models} onChange={handleChangeModel} />
              <BigButton type="submit" className=" bg-green-500 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-900">{T("Test")}</BigButton>
            </>
          ) : (
            <NotFoundModels />
          )}
      </StyledCard>
    </StyledContainer>
  );
};

export default TrainModel;