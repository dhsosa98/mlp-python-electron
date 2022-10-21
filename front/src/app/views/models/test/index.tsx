import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { infoAlert } from "../../../utils/sweetalert";
import { Api } from "../../../services/Api";

interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: unknown;
  props?: unknown;
}

const TrainModel: FC<IRoute> = () => {
  const [models, setModels] = useState<any[]>([]);

  const [model, setModel] = useState<string>("");

  useEffect(() => {
    Api.getMLPModels().then((res) => {
      if (res.models.length > 0) {
        setModels(res.models);
        setModel(res.models[0]);
        return;
      }
      setModels([]);
    });
  }, []);

  const handleChangeModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setModel(e.currentTarget.value);
  };

  const constructMessage = (res: any): string => {
    let message = "";
    if (res.message) {
      message = res.message;
      return message;
    }
    message += `Model: ${res.model_name} with test_cases: ${res.test_cases}, Estadistics: accuracy: ${res.accuracy_test} MSE_test: ${res.MSE_test}`;
    return message;
  };
  const handleTestModel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await Api.testMLPModel(model)
    await infoAlert('Model Tested', constructMessage(response));
  };
  return (
    <div className="grid justify-center items-center h-[100vh] p-10">
      <Link
        className="font-bold ms-font-xl bg-white py-4 px-8 hover:opacity-80 rounded-full text-center absolute top-10"
        to="/models"
      >
        Back
      </Link>
      <form className="flex flex-col gap-10 bg-white shadow-md shadow-gray-100 rounded-md p-10" onSubmit={handleTestModel}>
      {models.length > 0 ? 
      (
      <>
        <label className="font-bold">Select a Model</label>
          <select className=" outline-1 outline-stone-100 p-2" onChange={handleChangeModel}>
            {models?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <button className="text-white font-normal text-lg bg-green-500 px-8 py-4 rounded-md hover:bg-green-600" type="submit">
            Test
          </button>
      </>
      ) : (
        <div className="text-center flex flex-col gap-2 text-xl">
        <label className="font-bold">There is not models</label>
        <label className=" font-semibold">Please add one</label>
        </div>
      )}
        </form>
    </div>
  );
};

export default TrainModel;
