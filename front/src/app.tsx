import * as ReactDom from "react-dom";
import './style.css'
import { Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import Home from "./app/views/home";
import GenerateDatasets from "./app/views/generate-datasets";
import Models from "./app/views/models";
import Predict from "./app/views/models/predict";
import TrainModel from "./app/views/train-model";
import TestModel from "./app/views/models/test";
import DeleteModel from "./app/views/models/delete";
import styled from "styled-components";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import ESFlag from '../assets/es.png';
import ENFlag from '../assets/en.png';
import ES from './locale/es.json';
import EN from './locale/en.json';

const resources = {
  en: EN,
  es: ES
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
})

function App() {
  let { i18n } = useTranslation();
  return (
    <HashRouter >
        
        <Separator>
          <Wave/>
        </Separator>
        <div>
          <div className="max-w-[80px] fixed right-0 cursor-pointer">
          <img src={ESFlag} height="64px" alt="ES" onClick={() => i18n.changeLanguage("es")} />
          <img src={ENFlag} height="64px" alt="EN" onClick={() => i18n.changeLanguage("en")} />
          </div>
        </div>
        <Route exact path="/"  component={Home} />
        <Route exact path="/models"  component={Models} />
        <Route exact path="/models/test"  component={TestModel} />
        <Route exact path="/models/predict"  component={Predict} />
        <Route exact path="/models/delete"  component={DeleteModel} />
        <Route exact path="/generate-datasets"  component={GenerateDatasets} />
        <Route exact path="/train-model" component={TrainModel} />
    </HashRouter>
  );
}

const Separator = styled.div`
  position: fixed;
  background: #0ea5e9;
  height: 50vh;
  width: 100%;
  z-index: -999;
`;

const Wave = styled.div`
  position: absolute;
  height: 250px;
  width: 100%;
  background: #0ea5e9;
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
    background-color: #0ea5e9;
    left: -1.5%;
    top: 40%;
  }
`;

function render() {
  ReactDom.render(<App />, document.getElementById("root"));
}

render();

