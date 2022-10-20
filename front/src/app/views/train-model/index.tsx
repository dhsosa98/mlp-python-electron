import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Api } from "../../services/Api";


interface IRoute {
  path: string;
  name: string;
  exact: boolean;
  component: unknown;
  props?: unknown;
}

const TrainModel: FC<IRoute> = () => {
  const [lr, setLr] = useState(0.5);
  const [momentum, setMomentum] = useState(0.5);
  const [epochs, setEpochs] = useState(20);
  const [type, setType] = useState("A");
  const [valPercentage, setValPercentage] = useState(0.1);
  const [hidden_layers, setHidden_layers] = useState(1);
  const [hidden_nodes1, setHidden_nodes1] = useState(5);
  const [hidden_nodes2, setHidden_nodes2] = useState(5);
  const [message, setMessage] = useState("");
  const [save, setSave] = useState(false);

  const addRate = (num: number, callback: any) => {
    if (typeof num !== "number" || isNaN(num) || num > 1) {
      callback(0);
    } else {
      callback(num);
    }
  };

  const constructMessage = (message: any) => {
    let messageString = "";
    if (message.saved) {
      messageString = message.message;
      return messageString;
    }
    messageString += `Model Succesful trained with lr: ${message.learning_rate}, momentum: ${message.momentum}, epochs: ${message.amount_of_epochs}, training_cases: ${message.training_cases}, validation_cases: ${message.validation_cases}, topology: ${message.topology.join(', ')}, Estadistics: accuracy: ${message.accuracy_val} MSE_train: ${message.MSE_train}, MSE_val: ${message.MSE_val}`;
    return messageString;
  };



  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let hl_topology = [hidden_nodes1]
    if (hidden_layers === 2) {
        hl_topology.push(hidden_nodes2)
    } 
    const train = { lr, momentum, epochs, type, val_percentage: valPercentage, hl_topology, save };
    const trainMessage = await Api.trainMLP(train);
    console.log(trainMessage);
    setMessage(constructMessage(trainMessage)); 
    setSave(false);
};

  return (
    <div className="p-10">           
    <Link className='font-bold ms-font-xl bg-gradient-to-br from-gray-900 to-gray-500 py-4 px-8 hover:opacity-80 rounded-sm text-center' to="/">Home</Link>
    <div className="grid grid-cols-auto justify-center items-center p-10 gap-10">
    <div>
      <form onSubmit={handleSubmit} className=' grid px-10 py-5 bg-gray-200 rounded-sm gap-4'>
        <div className="grid gap-2">
          <label htmlFor="model">Model</label>
          <select value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="A">Model A-100Datasets</option>
            <option value="B">Model B-500Datasets</option>
            <option value="C">Model C-1000Datasets</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label>Validation Dataset Percentage</label>
          <select value={valPercentage} onChange={(e)=>{setValPercentage(Number(e.target.value))}}>
            <option value={0.1}>0.1</option>
            <option value={0.2}>0.2</option>
            <option value={0.3}>0.3</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="epochs">Epochs</label>
          <input type="number" name="epochs" id="epochs" value={epochs} min={1} onChange={(e)=>setEpochs(Number(e.target.value))} />
        </div>
        <div className="grid gap-2">
          <label>Learning Rate</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={lr}
            onChange={(e) => addRate(parseFloat(e.target.value), setLr)}
          />
          <span>{lr}</span>
        </div>
        <div className="grid gap-2">
          <label>Momentum</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={momentum}
            onChange={(e) => addRate(parseFloat(e.target.value), setMomentum)}
          />
          {momentum}
        </div>
        <div className="grid gap-2">
            <label>Hidden Layers</label>
            <select value={hidden_layers} onChange={(e)=>setHidden_layers(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
            </select>
        </div>
        <div className="grid gap-2">
            <label>Hidden Nodes 1</label>
            <input type="number" name="hidden_nodes1" id="hidden_nodes1" value={hidden_nodes1} min={5} max={10} onChange={(e)=>setHidden_nodes1(Number(e.target.value))} />
        </div>
        {hidden_layers === 2 && (
        <div className="grid gap-2">
            <label>Hidden Nodes 2</label>
            <input type="number" name="hidden_nodes2" id="hidden_nodes2" value={hidden_nodes2} min={5} max={10} onChange={(e)=>setHidden_nodes2(Number(e.target.value))} />
        </div>
        )}
        <div className="grid gap-2 text-white">
            <button type="submit" className="font-bold ms-font-xl bg-gradient-to-br from-blue-900 to-blue-500 py-4 px-8 hover:opacity-80 rounded-sm text-center">Train</button>
        </div>
        <div className="grid gap-2 text-white">
            <button type="submit" onClick={()=>setSave(true)} className="font-bold ms-font-xl bg-gradient-to-br from-blue-700 to-blue-300 py-4 px-8 hover:opacity-80 rounded-sm text-center">Save</button>
        </div>
      </form>
      </div>
    </div>
    {message && (
        <div className="">
            <div className='bg-green-600 p-5 border-2 rounded-sm border-green-200 flex justify-center items-center absolute inset-0 h-[300px] w-[300px] m-10'>
                <button className="absolute top-0 right-0 text-lg text-white font-bold px-3 py-1" onClick={()=>{setMessage('')}}>x</button>
                <p className='text-white font-normal text-lg'>{message}</p>
            </div>
        </div>)}
     </div>
  );
};
export default TrainModel;
