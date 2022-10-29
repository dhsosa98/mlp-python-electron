import { FC, useState } from 'react';
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


interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}


const GenerateDatasets: FC<IRoute> = () => {
    const { t: T } = useTranslation();

    const handleSubmit = async (e: any, type: string) => {
        e.preventDefault();
        const generateMessage = await Api.generateDatasets(type);
        await successAlert(T(generateMessage.message));
    };

    return (
        <StyledContainer>
            <StyledBackLink to='/'>{T("Home")}</StyledBackLink>
            <StyledCard>
                <TitleContainer>
                    {T("Generate Datasets")}
                </TitleContainer>
                <StyledDefaultButton className="bg-sky-500"  onClick={async (e: any) => { handleSubmit(e, 'A') }}>{T("Generate 100 Datasets")}</StyledDefaultButton>
                <StyledDefaultButton className="bg-sky-500"  onClick={async (e: any) => { handleSubmit(e, 'B') }}>{T("Generate 500 Datasets")}</StyledDefaultButton>
                <StyledDefaultButton className="bg-sky-500"  onClick={async (e: any) => { handleSubmit(e, 'C') }}>{T("Generate 1000 Datasets")}</StyledDefaultButton>
            </StyledCard>
        </StyledContainer>
    )
}
export default GenerateDatasets;

