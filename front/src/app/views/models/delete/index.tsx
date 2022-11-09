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

interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: unknown;
  props?: unknown;
}

const DeleteModel: FC<IRoute> = () => {
  const { t: T } = useTranslation();

  const [models, setModels] = useState<any[]>([]);

  const [update, setUpdate] = useState<boolean>(false);

  const [model, setModel] = useState<string>('');

  const [tooltipMessage, setTooltipMessage] = useState<string>("");

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {theme} = useContext(ThemeContext)


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
    setTooltipMessage(constructTooltipMessage(e.currentTarget.value, T));
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
          <div className="p-10">
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
            <label className="font-bold inline-flex">{T("Select a Model")} <TooltipIcon tooltipMessage={tooltipMessage} /></label>
            <StyledSelect list={models} onChange={handleChangeModel} />
            <BigButton className="bg-red-500 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800" type="submit">{T("Delete")}</BigButton>
          </>) : (
          <NotFoundModels />)}
      </StyledCard>
    </StyledContainer>
  )
}

export default DeleteModel;
