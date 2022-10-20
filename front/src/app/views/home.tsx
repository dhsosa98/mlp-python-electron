import { Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import Home2 from "./default/index";
import GenerateDatasets from "./generate-datasets";
import Models from "./models";
import Predict from "./models/predict";
import TrainModel from "./train-model";
import TestModel from "./models/test";
import DeleteModel from "./models/delete";

export function Home() {
  return (
    <HashRouter >
        <Route exact path="/"  component={Home2} />
        <Route exact path="/models"  component={Models} />
        <Route exact path="/models/test"  component={TestModel} />
        <Route exact path="/models/predict"  component={Predict} />
        <Route exact path="/models/delete"  component={DeleteModel} />
        <Route exact path="/generate-datasets"  component={GenerateDatasets} />
        <Route exact path="/train-model" component={TrainModel} />
    </HashRouter>
  );
}
