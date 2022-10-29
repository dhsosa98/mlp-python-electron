import { FC } from 'react';
import StyledCard from '../../components/shared/cards/Card';
import StyledContainer from '../../components/shared/containers/Container';
import TitleContainer from '../../components/shared/containers/TittleContainer';
import StyledLink from '../../components/buttons/Link';
import { useTranslation } from 'react-i18next';
interface IRoute {
    path: string;
    name: string;
    exact: boolean;
    component: unknown;
    props?: unknown;
}

const Home: FC<IRoute> = () => {
    const { t: T } = useTranslation();
    return (
        <StyledContainer>
            <StyledCard>
                <TitleContainer>
                  {T("MLP Perceptron")}
                </TitleContainer>
                <StyledLink className="bg-sky-700" to="/generate-datasets">{T("Generate Datasets")}</StyledLink>
                <StyledLink className="bg-sky-500" to="/train-model">{T("Generate and Train Model")}</StyledLink>
                <StyledLink className="bg-sky-300" to="/models">{T("Models")}</StyledLink>
            </StyledCard>
        </StyledContainer>
    )
}

export default Home;
