import { FC, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { successAlert } from '../../utils/sweetalert';
import { Api } from '../../services/Api';
import styled from 'styled-components';
import StyledContainer from '../../components/shared/containers/Container';
import StyledCard from '../../components/shared/cards/Card';
import TitleContainer from '../../components/shared/containers/TittleContainer';
import StyledBackLink from '../../components/buttons/BackLink';
import StyledDefaultButton from '../../components/buttons/DefaultButton';
import { useTranslation } from 'react-i18next';
import ThemeContext from "../../../theme";
import HelpCenterWrapper from "../../components/HelpCenter/HelpCenterWrapper";
import HelpCenterItemTitle from "../../components/HelpCenter/HelpCenterItemTitle";
import HelpCenterItem from "../../components/HelpCenter/HelpCenterItem";
import HelpCenterContent from "../../components/HelpCenter/HelpCenterContent";
import HelpCenterTitle from "../../components/HelpCenter/HelpCenterTitle";
import HelpCenterItemContent from "../../components/HelpCenter/HelpCenterItemContent";



interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}


const GenerateDatasets: FC<IRoute> = () => {
    const { t: T } = useTranslation();

    const {theme} = useContext(ThemeContext)

    const handleSubmit = async (e: any, type: string) => {
        e.preventDefault();
        const generateMessage = await Api.generateDatasets(type);
        await successAlert(T(generateMessage.message), '', theme);
    };

    return (
        <StyledContainer>
            <StyledBackLink to='/'>{T("Home")}</StyledBackLink>
            <StyledCard>
                <TitleContainer>
                    {T("Generate Datasets")}
                </TitleContainer>
                <StyledDefaultButton className="bg-sky-500 dark:bg-blue-800"  onClick={async (e: any) => { handleSubmit(e, 'A') }}>{T("Generate 100 Datasets")}</StyledDefaultButton>
                <StyledDefaultButton className="bg-sky-500 dark:bg-blue-800"  onClick={async (e: any) => { handleSubmit(e, 'B') }}>{T("Generate 500 Datasets")}</StyledDefaultButton>
                <StyledDefaultButton className="bg-sky-500 dark:bg-blue-800"  onClick={async (e: any) => { handleSubmit(e, 'C') }}>{T("Generate 1000 Datasets")}</StyledDefaultButton>
            </StyledCard>
            <HelpCenterWrapper >
        <HelpCenterContent>
            <HelpCenterItemTitle>{T("How to Generate Datasets?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
                <HelpCenterItem>{T("Click on the button 'Generate 100 Datasets' to generate 100 datasets.")}</HelpCenterItem>
                <HelpCenterItem>{T("Click on the button 'Generate 500 Datasets' to generate 500 datasets.")}</HelpCenterItem>
                <HelpCenterItem>{T("Click on the button 'Generate 1000 Datasets' to generate 1000 datasets.")}</HelpCenterItem>
            </HelpCenterItemContent>
            <HelpCenterItemTitle>{T("How is a dataset made up?")}</HelpCenterItemTitle>
            <HelpCenterItemContent>
                <HelpCenterItem>{T("Each row in been made up by this format: [letter, distortion, x1, x2, ... xn].")}</HelpCenterItem>
                <HelpCenterItem>{T("The possible letters are b, d and f")}</HelpCenterItem>
                <HelpCenterItem>{T("The possible distortion is a ramdom number between 0 and 30")}</HelpCenterItem>
                <HelpCenterItem>{T("The values x1, x2, ... xn are a 10x10 matrix with the values 0 or 1")}</HelpCenterItem>
            </HelpCenterItemContent>
        </HelpCenterContent>
      </HelpCenterWrapper>
        </StyledContainer>
    )
}
export default GenerateDatasets;

