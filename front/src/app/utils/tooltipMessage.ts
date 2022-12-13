import modelInfo from "./modelData";

const constructTooltipMessage = (model: string, T: any): string => {
    let message = "";
    const { datasets, lr, momentum, epochs, topology, val_percentaje  } = modelInfo(model);
    if (!datasets) return `<span class="font-bold flex justify-center text-center">${T("No model info available")}</span>`
    message += `
    <span class="font-bold text-center flex justify-center"> ${T("Model Info")} </span> 
    <div><span class="font-bold">${T("Datasets")}: </span> ${datasets} </div>
    <div><span class="font-bold">${T("Learning Rate")}: </span> ${lr} </div>
    <div><span class="font-bold">${T("Momentum")}: </span> ${momentum} </div>
    <div><span class="font-bold">${T("Epochs")}: </span> ${epochs} </div>
    <div><span class="font-bold">${T("Topology")}: </span> ${topology} </div>
    <div><span class="font-bold">${T("Validation Percentage")}: </span> ${val_percentaje}% </div>` ;
    return message;
  } 

export default constructTooltipMessage;