import { FC, useState } from "react";
import { errorAlert, infoAlert, successAlert } from "../../utils/sweetalert";
import { Api } from "../../services/Api";
import TrainResults from "../../components/TrainResults";
import MSEPlot from "../../components/MSEPlot";
import FormItem from "../../components/forms/FormItem";
import TitleContainer from "../../components/shared/containers/TittleContainer";
import TwoColsContainer from "../../components/shared/containers/TwoColsContainer";
import StyledDefaultButton from "../../components/buttons/DefaultButton";
import FormColumn from "../../components/forms/FormColumn";
import StyledContainer from "../../components/shared/containers/Container";
import StyledBackLink from "../../components/buttons/BackLink";
import StyledCard from "../../components/shared/cards/Card";
import StyledSelect from "../../components/inputs/Select";
import ButtonLoader from "../../components/shared/loaders/ButtonLoader";
import { useTranslation } from 'react-i18next';
import TestResults from "../../components/TestResults";


interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: unknown;
  props?: unknown;
}

const TrainModel: FC<IRoute> = () => {
  const [lr, setLr] = useState(0.5);
  const [momentum, setMomentum] = useState(0.5);
  const [epochs, setEpochs] = useState(20);
  const [type, setType] = useState("A");
  const [valPercentage, setValPercentage] = useState(0.1);
  const [hidden_layers, setHidden_layers] = useState(1);
  const [hidden_nodes1, setHidden_nodes1] = useState(5);
  const [hidden_nodes2, setHidden_nodes2] = useState(5);
  const [plotData, setPlotData] = useState({ val: [], train: [] });
  const [save, setSave] = useState(false);
  const { t: T } = useTranslation();
  const [result, setResult] = useState({
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
  const [isLoaded, setIsLoaded] = useState(false);

  const [testResults, setTestResults] = useState({
    model_name: "",
    accuracy_test: "",
    MSE_test: "",
    test_cases: "",
  });

  const addRate = (num: number, callback: any) => {
    if (typeof num !== "number" || isNaN(num) || num > 1) {
      callback(0);
    } else {
      callback(num);
    }
  };

  const addNeuron = (num: number, callback: any) => {
    if (typeof num !== "number" || isNaN(num) || num >= 10) {
      callback(10);
      return;
    }

    callback(num);
  };

  const constructMessage = async (message: any) => {
    let messageString = "";
    if (message.saved) {
      messageString = message.message;
      await successAlert(T(messageString));
      return;
    }
    await successAlert(T("Model Successfully Trained"));
  };

  const handleSubmit = async (e: any) => {
    setIsLoaded(true);
    try {
      e.preventDefault();
      let hl_topology = [hidden_nodes1];
      if (hidden_layers === 2) {
        hl_topology.push(hidden_nodes2);
      }
      const train = {
        lr,
        momentum,
        epochs,
        type,
        val_percentage: valPercentage,
        hl_topology,
        save,
      };
      const trainMessage = await Api.trainMLP(train);
      await constructMessage(trainMessage);
      if (trainMessage.results) {
        setResult(trainMessage.results);
        setTestResults(trainMessage.results.test);
        setPlotData(trainMessage.plot_data);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 500);
      }
    } catch (err) {
      if (err.response.data.detail){
      await errorAlert(T(err.response.data.detail));
      }
    } finally {
      setIsLoaded(false);
      setSave(false);
    }
  };

  const handleReset = () => {
    window.scrollTo({ top: 9999, behavior: "smooth" });
  }

  return (
    <StyledContainer>
      <StyledBackLink to="/">{T("Home")}</StyledBackLink>
      {plotData.val.length > 0 && (
        <>
        <TwoColsContainer>
          <TrainResults result={result} />
          <MSEPlot plotData={plotData} />
        </TwoColsContainer>
        <StyledCard onSubmit={handleSubmit}>
        <TestResults result={testResults} />
        <TwoColsContainer>
        <FormItem>
          <StyledDefaultButton
            type="submit"
            onClick={() => setSave(true)}
            className="bg-green-500 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoaded}
          >
            {T("Save Model")} {isLoaded && <ButtonLoader />}
          </StyledDefaultButton>
        </FormItem>
        <FormItem>
        <StyledDefaultButton
        type="button"
        onClick={handleReset}
        className="bg-sky-500 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {T("Generate other")}
      </StyledDefaultButton>
      </FormItem>
      </TwoColsContainer>
        </StyledCard>
        </>
      )}
      <StyledCard onSubmit={handleSubmit}>
        <TitleContainer>{T("Generate and Train Model")}</TitleContainer>
        <TwoColsContainer>
          <FormColumn>
            <FormItem label={T("Dataset")}>
              <StyledSelect
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="A">A-100 {T("Datasets")}</option>
                <option value="B">B-500 {T("Datasets")}</option>
                <option value="C">C-1000 {T("Datasets")}</option>
              </StyledSelect>
            </FormItem>
            <FormItem label={T("Validation Dataset Percentage")}>
              <StyledSelect
                value={valPercentage}
                onChange={(e: any) => {
                  setValPercentage(Number(e.target.value));
                }}
              >
                <option value={0.1}>10%</option>
                <option value={0.2}>20%</option>
                <option value={0.3}>30%</option>
              </StyledSelect>
            </FormItem>
            <FormItem label={T("Epochs")}>
              <input
                className=" outline-1 outline-stone-100 p-2 border border-gray-100"
                type="number"
                name="epochs"
                id="epochs"
                value={epochs}
                min={0}
                onChange={(e) => setEpochs(Number(e.target.value))}
              />
            </FormItem>
            <FormItem label={T("Learning Rate")}>
              <input
                className=" outline-1 outline-stone-100 p-2 border border-gray-100"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={lr}
                onChange={(e) => addRate(parseFloat(e.target.value), setLr)}
              />
              <span className="text-center font-semibold">{lr}</span>
            </FormItem>
          </FormColumn>
          <FormColumn>
            <FormItem label={T("Momentum")}>
              <input
                className=" outline-1 outline-stone-100 p-2 border border-gray-100"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={momentum}
                onChange={(e) =>
                  addRate(parseFloat(e.target.value), setMomentum)
                }
              />
              <span className="text-center font-semibold">{momentum}</span>
            </FormItem>
            <FormItem label={T("Hidden Layers")}>
              <StyledSelect
                value={hidden_layers}
                onChange={(e) => setHidden_layers(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
              </StyledSelect>
            </FormItem>
            <FormItem label={T("Hidden Nodes for Layer 1")}>
              <input
                className=" outline-1 outline-stone-100 p-2 border border-gray-100"
                type="number"
                name="hidden_nodes1"
                id="hidden_nodes1"
                value={hidden_nodes1}
                min={5}
                max={10}
                onChange={(e) =>
                  addNeuron(Number(e.currentTarget.value), setHidden_nodes1)
                }
              />
            </FormItem>
            {hidden_layers === 2 && (
              <FormItem label={T("Hidden Nodes for Layer 2")}>
                <input
                  className=" outline-1 outline-stone-100 p-2 border border-gray-100"
                  type="number"
                  name="hidden_nodes2"
                  id="hidden_nodes2"
                  value={hidden_nodes2}
                  min={5}
                  max={10}
                  onChange={(e) =>
                    addNeuron(Number(e.currentTarget.value), setHidden_nodes2)
                  }
                />
              </FormItem>
            )}
          </FormColumn>
        </TwoColsContainer>
        <FormItem>
          <StyledDefaultButton
            type="submit"
            className="bg-sky-500 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoaded}
          >
            {T("Train Model")} {isLoaded && <ButtonLoader />}
          </StyledDefaultButton>
        </FormItem>
      </StyledCard>
    </StyledContainer>
  );
};

export default TrainModel;
