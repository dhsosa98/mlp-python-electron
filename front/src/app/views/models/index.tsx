import { FC } from 'react';
import TitleContainer from '../../components/shared/containers/TittleContainer';
import StyledContainer from '../../components/shared/containers/Container';
import StyledCard from '../../components/shared/cards/Card';
import StyledLink from '../../components/buttons/Link';
import StyledBackLink from '../../components/buttons/BackLink';
import { useTranslation } from 'react-i18next';

interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}

const Models: FC<IRoute> = () => {
    const { t: T } = useTranslation();
    return (
        <StyledContainer>
            <StyledBackLink to="/">{T("Home")}</StyledBackLink>
            <StyledCard>
                <TitleContainer>{T("Models")}</TitleContainer>
                    <StyledLink className='bg-sky-700 hover:bg-sky-800' to="models/test">{T("Charts and Test")}</StyledLink>
                    <StyledLink className='bg-sky-500 hover:bg-sky-600' to="models/predict">{T("Predict")}</StyledLink>
                    <StyledLink className='bg-red-500 hover:bg-red-700' to="models/delete">{T("Delete Models")}</StyledLink>
            </StyledCard>
        </StyledContainer>
    )
}

export default Models;

