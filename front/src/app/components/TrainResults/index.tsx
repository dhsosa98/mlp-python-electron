import {FC} from 'react';
import StyledCard from '../shared/cards/Card';
import { useTranslation } from 'react-i18next';

interface Props {
    result: any;
}

const TrainResults: FC<Props> = ({result}) => {
    const { t: T } = useTranslation();
    return (
        <StyledCard >
        <h2 className="font-bold px-5 py-2 text-center text-2xl dark:text-white">{T("Train Results")}</h2>
        <div className="grid justify-center items-center">
          <h3><span className="font-bold dark:text-slate-100">{T("Model Name")}: </span>{result.model_name}</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("Learning Rate")}: </span>{result.learning_rate}</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("Momentum")}: </span>{result.momentum}</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("Epochs")}: </span>{result.amount_of_epochs}</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("Topology")}: </span>{result.topology.join(', ')}</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("Validation Dataset Percentage")}: </span>{Number(result.val_percentage)*100}%</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("Training Cases")}: </span>{result.training_cases}</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("Validation Cases")}: </span>{result.validation_cases}</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("Validation Accuracy")}: </span>{result.accuracy_val}%</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("MSE Training")}: </span>{result.MSE_train}</h3>
          <h3><span className="font-bold dark:text-slate-100">{T("MSE Validation")}: </span>{result.MSE_val}</h3>
        </div>
      </StyledCard>
    )
}

export default TrainResults