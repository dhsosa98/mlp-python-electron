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
import HelpCenterWrapper from "../../../components/HelpCenter/HelpCenterWrapper";
import HelpCenterItemTitle from "../../../components/HelpCenter/HelpCenterItemTitle";
import HelpCenterItem from "../../../components/HelpCenter/HelpCenterItem";
import HelpCenterContent from "../../../components/HelpCenter/HelpCenterContent";
import HelpCenterTitle from "../../../components/HelpCenter/HelpCenterTitle";
import HelpCenterItemContent from "../../../components/HelpCenter/HelpCenterItemContent";


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

  const { t: T, i18n } = useTranslation();

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
    test: {
      model_name: "",
      accuracy_test: "",
      MSE_test: "",
      test_cases: "",
    }
  });


  useEffect(() => {
    setIsLoaded(true);
    Api.getMLPModels().then((res) => {
      if (res.models.length > 0) {
        setModels(res.models);
        setModel(res.models[0]);
        return;
      }
      setModels([]);
    }).finally(() => setIsLoaded(false));
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
      
  const handleChangeModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setModel(e.currentTarget.value);
  };

  const handleTestModel = async (e: React.FormEvent<HTMLFormElement>) => {
    try{
    e.preventDefault();
    setIsLoaded(true);
    const response = await Api.testMLPModel(model)
    if (response?.history) {
      setHistory(response?.history?.results);
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
          <div className="p-10 flex justify-center">
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
        <TestResults result={history?.test} />
        </StyledCard>
      </>
      }
      <StyledCard onSubmit={handleTestModel}>
        {models.length > 0 ?
          (
            <>
              <label className="font-bold inline-flex items-center">{T("Select a Model")} <TooltipIcon tooltipMessage={tooltipMessage}/></label>
              <StyledSelect list={models} onChange={handleChangeModel} />
              <BigButton type="submit" className=" bg-green-500 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-900">{T("Test")}</BigButton>
            </>
          ) : (
            <NotFoundModels />
          )}
      </StyledCard>
      <HelpCenterWrapper>
        <HelpCenterContent>
          <HelpCenterItem>
            <HelpCenterItemTitle>{T("What is a Dataset?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("Dataset is a collection of data.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>
              {T("What is a Validation Dataset?")}
            </HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("Validation Dataset is a subset of the Dataset used to validate the model.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>
              {T("What is a Testing Dataset?")}
            </HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("Testing Dataset is a subset of the Dataset used to test the model.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>{T("What is the MSE Function?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("MSE Function is a function used to calculate the error.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("Is calculated as the average of the squares of the errors.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>{T("What is the accuracy?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("Accuracy is a percentage of correct predictions.")}
            </HelpCenterItemContent>
          </HelpCenterItem>
          <HelpCenterItem>
            <HelpCenterItemTitle>{T("How to test a Model?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("To test a model, you need to select a model from the list.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("Then click on the Test button.")}
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
            <HelpCenterItemTitle>{T("What I see in the chart?")}</HelpCenterItemTitle>
              <HelpCenterItemContent>
                {T("You can see the evolution MSE of the validation dataset and the testing dataset of the model in the chart.")}
              </HelpCenterItemContent>
          </HelpCenterItem>
        </HelpCenterContent>
      </HelpCenterWrapper>
    </StyledContainer>
  );
};

export default TrainModel;