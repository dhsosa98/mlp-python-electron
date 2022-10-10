import { Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import Home2 from "./default/index";
import GenerateDatasets from "./generate-datasets";
import Predict from "./predict";
import TrainModel from "./train-model";

export function Home() {
  return (
    <HashRouter >
        <Route exact path="/"  component={Home2} />
        <Route exact path="/predict"  component={Predict} />
        <Route exact path="/generate-datasets"  component={GenerateDatasets} />
        <Route exact path="/train-model" component={TrainModel} />
    </HashRouter>
  );
}
