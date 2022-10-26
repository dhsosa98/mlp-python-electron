import { Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import Home2 from "./default/index";
import GenerateDatasets from "./generate-datasets";
import Models from "./models";
import Predict from "./models/predict";
import TrainModel from "./train-model";
import TestModel from "./models/test";
import DeleteModel from "./models/delete";
import styled from "styled-components";

export function Home() {
  return (
    <HashRouter >

        <Separator>
          <Wave/>
        </Separator>
        <div className="">
        <Route exact path="/"  component={Home2} />
        <Route exact path="/models"  component={Models} />
        <Route exact path="/models/test"  component={TestModel} />
        <Route exact path="/models/predict"  component={Predict} />
        <Route exact path="/models/delete"  component={DeleteModel} />
        <Route exact path="/generate-datasets"  component={GenerateDatasets} />
        <Route exact path="/train-model" component={TrainModel} />
        </div>
    </HashRouter>
  );
}

const Separator = styled.div`
  position: fixed;
  background: #579ce6;
  height: 50vh;
  width: 100%;
  z-index: -999;
`;

const Wave = styled.div`
  position: absolute;
  height: 250px;
  width: 100%;
  background: #579ce6;
  bottom: 0;
  ::before, ::after{
    content: "";
    display: block;
    position: absolute;
    border-radius: 100% 50%;
  }
  ::before{
    width: 55%;
    height: 109%;
    background-color: #fff;
    right: -1.5%;
    top: 60%;
  }
  ::after{
    width: 55%;
    height: 100%;
    background-color: #579ce6;
    left: -1.5%;
    top: 40%;
  }
`;
