


import { useTranslation } from 'react-i18next';

const NotFoundModels = () => {
    const { t: T } = useTranslation();
    return (
        <div className="text-center flex flex-col gap-2 text-xl">
            <label className="font-bold">{T("There are no models")}</label>
            <label className=" font-semibold">{T("Please, generate and train a model")}</label>
          </div>
    )
}

export default NotFoundModels