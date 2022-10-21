import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { infoAlert } from "../../utils/sweetalert";
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
    messageString += `lr: ${message.learning_rate}, momentum: ${message.momentum}, epochs: ${message.amount_of_epochs}, training_cases: ${message.training_cases}, validation_cases: ${message.validation_cases}, topology: ${message.topology.join(', ')}, Estadistics: accuracy: ${message.accuracy_val} MSE_train: ${message.MSE_train}, MSE_val: ${message.MSE_val}`;
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
    await infoAlert('Model Successful trained', constructMessage(trainMessage));
    setSave(false);
  };

  return (
    <div className="p-10">
      <Link className='font-bold ms-font-xl bg-white py-4 px-8 hover:opacity-80 rounded-full text-center ' to="/">Home</Link>
      <div className="grid grid-cols-auto justify-center items-center p-10 gap-10">
        <div>
          <form onSubmit={handleSubmit} className=' grid px-10 py-5 bg-white shadow-md shadow-gray-100 rounded-md gap-4'>
            <div className="flex justify-center text-gray-900 font-bold text-lg">
              <div className="px-5 py-2 my-5 max-w-[200px] text-center">Generate and Train Model</div>
            </div>
            <div className="grid gap-2">
              <label className="font-bold" htmlFor="model">Model</label>
              <select className=" outline-1 outline-stone-100 p-2" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="A">Model A-100Datasets</option>
                <option value="B">Model B-500Datasets</option>
                <option value="C">Model C-1000Datasets</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="font-bold" >Validation Dataset Percentage</label>
              <select className=" outline-1 outline-stone-100 p-2" value={valPercentage} onChange={(e) => { setValPercentage(Number(e.target.value)) }}>
                <option value={0.1}>10%</option>
                <option value={0.2}>20%</option>
                <option value={0.3}>30%</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="font-bold" htmlFor="epochs">Epochs</label>
              <input className=" outline-1 outline-stone-100 p-2" type="number" name="epochs" id="epochs" value={epochs} min={1} onChange={(e) => setEpochs(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <label className="font-bold" >Learning Rate</label>
              <input
                className=" outline-1 outline-stone-100 p-2"
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
              <label className="font-bold" >Momentum</label>
              <input
                className=" outline-1 outline-stone-100 p-2"
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
              <label className="font-bold" >Hidden Layers</label>
              <select className=" outline-1 outline-stone-100 p-2" value={hidden_layers} onChange={(e) => setHidden_layers(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="font-bold" >Hidden Nodes for Layer 1</label>
              <input className=" outline-1 outline-stone-100 p-2" type="number" name="hidden_nodes1" id="hidden_nodes1" value={hidden_nodes1} min={5} max={10} onChange={(e) => setHidden_nodes1(Number(e.target.value))} />
            </div>
            {hidden_layers === 2 && (
              <div className="grid gap-2">
                <label className="font-bold" >Hidden Nodes for Layer 2</label>
                <input className=" outline-1 outline-stone-100 p-2" type="number" name="hidden_nodes2" id="hidden_nodes2" value={hidden_nodes2} min={5} max={10} onChange={(e) => setHidden_nodes2(Number(e.target.value))} />
              </div>
            )}
            <div className="grid gap-2 text-white">
              <button type="submit" className="font-bold ms-font-xl bg-gradient-to-br from-blue-900 to-blue-500 py-4 px-8 hover:opacity-80 rounded-md text-center">Train</button>
            </div>
            <div className="grid gap-2 text-white">
              <button type="submit" onClick={() => setSave(true)} className="font-bold ms-font-xl bg-gradient-to-br from-gray-700 to-gray-300 py-4 px-8 hover:opacity-80 rounded-md text-center">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default TrainModel;
