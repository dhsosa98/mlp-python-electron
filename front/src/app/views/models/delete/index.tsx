import { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { successAlert } from "../../../utils/sweetalert";
import { Api } from "../../../services/Api";
import styled from "styled-components";
import constructTooltipMessage from "../../../utils/tooltipMessage";
import ReactTooltip from "react-tooltip";
import StyledContainer from "../../../components/shared/containers/Container";
import StyledCard from "../../../components/shared/cards/Card";
import NotFoundModels from "../../../components/NotFoundModels";
import StyledSelect from "../../../components/inputs/Select";
import BigButton from "../../../components/buttons/BigButton";
import StyledBackLink from "../../../components/buttons/BackLink";
import TooltipIcon from "../../../components/TooltipIcon";
import Loader from "../../../components/shared/loaders/Loader";
import { useTranslation } from 'react-i18next';
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

const DeleteModel: FC<IRoute> = () => {
  const { t: T, i18n } = useTranslation();

  const [models, setModels] = useState<any[]>([]);

  const [update, setUpdate] = useState<boolean>(false);

  const [model, setModel] = useState<string>('');

  const [tooltipMessage, setTooltipMessage] = useState<string>("");

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {theme} = useContext(ThemeContext)

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
  }, [update]);

  const handleChangeModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setModel(e.currentTarget.value);
  };

  const handleDeleteModel = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoaded(true);
    e.preventDefault();
    Api.deleteMLPModel(model).then((res) => {
      console.log(res);
      setUpdate((update) => !update);
      successAlert(T('Model Successfully Deleted'), '', theme);
    }).finally(() => setIsLoaded(false));
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
    );
  }

  return (
    <StyledContainer>
      <StyledBackLink to='/models'>{T("Back")}</StyledBackLink>
      <StyledCard onSubmit={handleDeleteModel}>
        {models.length > 0 ? (
          <>
            <label className="font-bold inline-flex items-center">{T("Select a Model")} <TooltipIcon tooltipMessage={tooltipMessage} /></label>
            <StyledSelect list={models} onChange={handleChangeModel} />
            <BigButton className="bg-red-500 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800" type="submit">{T("Delete")}</BigButton>
          </>) : (
          <NotFoundModels />)}
      </StyledCard>
      <HelpCenterWrapper>
        <HelpCenterContent>
          <HelpCenterItem>
            <HelpCenterItemTitle>{T("How to delete a Model?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
              {T("To delete a model, you need to select a model from the list.")}
            </HelpCenterItemContent>
            <HelpCenterItemContent>
              {T("Then click on the Delete button.")}
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
        </HelpCenterContent>
      </HelpCenterWrapper>
    </StyledContainer>
  )
}

export default DeleteModel;
