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

const DeleteModel: FC<IRoute> = () => {
    const [models, setModels] = useState<any[]>([]);

    const [update, setUpdate] = useState<boolean>(false);

    const [model, setModel] = useState<string>('');

  useEffect(() => {
    Api.getMLPModels().then((res) => {
      if (res.models.length>0){
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
      setUpdate((update)=>!update);
    });
  };
    return (
        <div className='grid justify-center items-center h-[100vh]'>
            <Link className='font-bold ms-font-xl bg-gradient-to-br from-gray-900 to-gray-500 py-4 px-8 hover:opacity-80 rounded-sm text-center max-w-[100px]' to="/models">Back</Link>
            <div className='flex flex-col gap-10'>
            <form onSubmit={handleDeleteModel}>
            <select onChange={handleChangeModel}>
                {models?.map((model) => (
                    <option key={model} value={model}>{model}</option>
                ))}
            </select>
            <button className=" bg-red-500 px-8 py-4" type="submit">Delete</button>
            </form>
            </div>
        </div>
    )
}

export default DeleteModel;