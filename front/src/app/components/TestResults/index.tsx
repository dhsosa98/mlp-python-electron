import { FC } from 'react'
import { useTranslation } from 'react-i18next';

interface Props {
    result: any;
}

const TestResults: FC<Props> = ({ result }) => {
    const { t: T } = useTranslation();
    return (
        <>
            <h2 className="font-bold px-5 py-2 text-center text-2xl">{T("Test Results")}</h2>
            <div className="grid justify-center items-center">
                <h3><span className="font-bold">{T("Model Name")}: </span>{result.model_name}</h3>
                <h3><span className="font-bold">{T("Accuracy")}: </span>{result.accuracy_test}%</h3>
                <h3><span className="font-bold">{T("MSE (Mean Squared Error)")}: </span>{result.MSE_test}</h3>
                <h3><span className="font-bold">{T("Test Cases")}: </span>{result.test_cases}</h3>
            </div>
        </>
    )
}

export default TestResults
