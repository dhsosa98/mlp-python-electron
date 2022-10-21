import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { successAlert } from "../../../utils/sweetalert";
import { Api } from "../../../services/Api";

interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: unknown;
  props?: unknown;
}

const DeleteModel: FC<IRoute> = () => {
  const [models, setModels] = useState<any[]>([]);

  const [update, setUpdate] = useState<boolean>(false);

  const [model, setModel] = useState<string>('');

  useEffect(() => {
    Api.getMLPModels().then((res) => {
      if (res.models.length > 0) {
        setModels(res.models);
        setModel(res.models[0]);
        return
      }
      setModels([]);
    });
  }, [update]);

  const handleChangeModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setModel(e.currentTarget.value);
  };

  const handleDeleteModel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Api.deleteMLPModel(model).then((res) => {
      console.log(res);
      setUpdate((update) => !update);
      successAlert('Model Deleted Successfully');
    });
  };
  return (
    <div className='grid justify-center items-center h-[100vh] p-10'>
      <Link className='font-bold ms-font-xl bg-white py-4 px-8 hover:opacity-80 rounded-full text-center absolute top-10' to="/models">Back</Link>
      <form className='flex flex-col gap-10 bg-white shadow-md shadow-gray-100 rounded-md p-10' onSubmit={handleDeleteModel}>
        {models.length > 0 ? (
          <>
            <label className="font-bold">Select a Model</label>
            <select className=" outline-1 outline-stone-100 p-2" onChange={handleChangeModel}>
              {models?.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <button className="text-white font-normal text-lg bg-red-500 px-8 py-4 rounded-md hover:bg-red-700" type="submit">Delete</button>
          </>) : (
          <div className="text-center flex flex-col gap-2 text-xl">
            <label className="font-bold">There is not models</label>
            <label className=" font-semibold">Please add one</label>
          </div>)}
      </form>
    </div>
  )
}

export default DeleteModel;