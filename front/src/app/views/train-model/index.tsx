import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { infoAlert, successAlert } from "../../utils/sweetalert";
import { Api } from "../../services/Api";
import styled from "styled-components";
import { Plot, Heading, LineSeries, Axis, Legend } from "react-plot";


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
  const [plotData, setPlotData] = useState({ val: [], train: [] });
  const [save, setSave] = useState(false);

  const addRate = (num: number, callback: any) => {
    if (typeof num !== "number" || isNaN(num) || num > 1) {
      callback(0);
    } else {
      callback(num);
    }
  };

  const constructMessage = async (message: any) => {
    let messageString = "";
    if (message.saved) {
      messageString = message.message;
      await successAlert(messageString);
      return;
    }
    messageString += `lr: ${message.learning_rate}, momentum: ${message.momentum}, epochs: ${message.amount_of_epochs}, training_cases: ${message.training_cases}, validation_cases: ${message.validation_cases}, topology: ${message.topology.join(', ')}, Stats: accuracy: ${message.accuracy_val}, MSE_train: ${message.MSE_train}, MSE_val: ${message.MSE_val}`;
    await infoAlert('Model Successful trained', messageString);
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
    constructMessage(trainMessage)
    setPlotData(trainMessage.plot_data);
    setSave(false);
  };

  return (
    <div className="p-10 m-5">
      <Link className='font-bold ms-font-xl bg-white py-4 px-8 hover:opacity-80 rounded-full text-center ' to="/">Home</Link>
      <div className="grid grid-cols-auto justify-center items-center p-10 gap-10">
        <div>
          <CardComponent onSubmit={handleSubmit} className=' grid px-10 py-5 bg-white shadow-md shadow-gray-100 rounded-md gap-4'>
            <div className="flex justify-center text-gray-900 font-bold">
              <div className="px-5 py-2 my-5 max-w-[200px] text-center text-2xl">Generate and Train Model</div>
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-10">
              <div>
                <div className="grid gap-2">
                  <label className="font-bold" htmlFor="model">Dataset</label>
                  <select className=" outline-1 outline-stone-100 p-2 border border-gray-100" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="A">A-100Datasets</option>
                    <option value="B">B-500Datasets</option>
                    <option value="C">C-1000Datasets</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="font-bold" >Validation Dataset Percentage</label>
                  <select className=" outline-1 outline-stone-100 p-2 border border-gray-100" value={valPercentage} onChange={(e) => { setValPercentage(Number(e.target.value)) }}>
                    <option value={0.1}>10%</option>
                    <option value={0.2}>20%</option>
                    <option value={0.3}>30%</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="font-bold" htmlFor="epochs">Epochs</label>
                  <input className=" outline-1 outline-stone-100 p-2 border border-gray-100" type="number" name="epochs" id="epochs" value={epochs} min={1} onChange={(e) => setEpochs(Number(e.target.value))} />
                </div>
                <div className="grid gap-2">
                  <label className="font-bold" >Learning Rate</label>
                  <input
                    className=" outline-1 outline-stone-100 p-2 border border-gray-100"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={lr}
                    onChange={(e) => addRate(parseFloat(e.target.value), setLr)}
                  />
                  <span className="text-center font-semibold">{lr}</span>
                </div>
              </div>
              <div>
                <div className="grid gap-2">
                  <label className="font-bold" >Momentum</label>
                  <input
                    className=" outline-1 outline-stone-100 p-2 border border-gray-100"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={momentum}
                    onChange={(e) => addRate(parseFloat(e.target.value), setMomentum)}
                  />
                  <span className="text-center font-semibold">{momentum}</span>
                </div>
                <div className="grid gap-2">
                  <label className="font-bold" >Hidden Layers</label>
                  <select className=" outline-1 outline-stone-100 p-2 border border-gray-100" value={hidden_layers} onChange={(e) => setHidden_layers(Number(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="font-bold" >Hidden Nodes for Layer 1</label>
                  <input className=" outline-1 outline-stone-100 p-2 border border-gray-100" type="number" name="hidden_nodes1" id="hidden_nodes1" value={hidden_nodes1} min={5} max={10} onChange={(e) => setHidden_nodes1(Number(e.target.value))} />
                </div>
                {hidden_layers === 2 && (
                  <div className="grid gap-2">
                    <label className="font-bold" >Hidden Nodes for Layer 2</label>
                    <input className=" outline-1 outline-stone-100 p-2 border border-gray-100" type="number" name="hidden_nodes2" id="hidden_nodes2" value={hidden_nodes2} min={5} max={10} onChange={(e) => setHidden_nodes2(Number(e.target.value))} />
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-2 text-white">
              <button type="submit" className="font-bold ms-font-xl bg-gradient-to-br from-blue-900 to-blue-500 py-4 px-8 hover:opacity-80 rounded-md text-center">Train</button>
            </div>
            <div className="grid gap-2 text-white">
              <button type="submit" onClick={() => setSave(true)} className="font-bold ms-font-xl bg-gradient-to-br from-gray-700 to-gray-300 py-4 px-8 hover:opacity-80 rounded-md text-center">Save</button>
            </div>
          </CardComponent>
        </div>
        {plotData.val.length > 0 &&
          <CardComponent className=' grid px-10 py-5 bg-white shadow-md shadow-gray-100 rounded-md gap-4'>
            <h2 className="font-bold px-5 py-2 my-5 text-center text-2xl">MSE by Epochs</h2>
            <div className="grid justify-center">
            <Plot
              width={300}
              height={320}
            >
              <LineSeries data={plotData.val}
                label="Validation Dataset"
                lineStyle={{ stroke: 'red', strokeWidth: 2 }}
                xAxis="x"
                yAxis="y" />
              <LineSeries data={plotData.train}
                label="Training Dataset"
                lineStyle={{ stroke: '#e28484', strokeWidth: 2 }}
                xAxis="x"
                yAxis="y" />
              <Axis
                id="x"
                position="bottom"
                lineStyle={{ stroke: '#e3e7ea', strokeWidth: 2, strokeOpacity: 0.5 }}
                label="Epoch"
              />
              <Axis
                id="y"
                position="left"
                lineStyle={{ stroke: '#e3e7ea', strokeWidth: 2, strokeOpacity: 0.5 }}
                label="MSE"
              />
              <Legend position="top" />
            </Plot>
            </div>
          </CardComponent>}
      </div>
    </div>
  );
};
export default TrainModel;

const CardComponent = styled.form`
  animation: myAnim 0.4s ease-in 0s 1 normal forwards;
  @keyframes myAnim {
    0% {
      opacity: 0;
      transform: translateX(50px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`
