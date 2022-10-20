import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const [message, setMessage] = useState<string>("");

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
    message += `Model: ${res.model_name} with test_cases: ${res.test_cases}, Estadistics: accuracy: ${res.accuracy_test} MSE_train: ${res.MSE_test}`;
    return message;
  };
  const handleTestModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Api.testMLPModel(model).then((res) => {
      console.log(res);
      setMessage(constructMessage(res));
    });
  };
  return (
    <div className="grid justify-center items-center h-[100vh]">
      <Link
        className="font-bold ms-font-xl bg-gradient-to-br from-gray-900 to-gray-500 py-4 px-8 hover:opacity-80 rounded-sm text-center max-w-[100px]"
        to="/models"
      >
        Back
      </Link>
      <div className="flex flex-col gap-10">
        <form onSubmit={handleTestModel}>
          <select onChange={handleChangeModel}>
            {models?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <button className=" bg-green-500 px-8 py-4" type="submit">
            Test
          </button>
        </form>
      </div>
      {message && (
        <div className="">
          <div className="bg-green-600 p-5 border-2 rounded-sm border-green-200 flex justify-center items-center absolute inset-0 h-[300px] w-[300px] m-10">
            <button
              className="absolute top-0 right-0 text-lg text-white font-bold px-3 py-1"
              onClick={() => {
                setMessage("");
              }}
            >
              x
            </button>
            <p className="text-white font-normal text-lg">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainModel;
