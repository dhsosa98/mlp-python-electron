import modelInfo from "./modelData";

const constructTooltipMessage = (model: string, T: any): string => {
    let message = "";
    const { datasets, lr, momentum, epochs, topology, val_percentaje  } = modelInfo(model);
    message += `-- ${T("Model Info")} -- <br> ${T("Datasets")}: ${datasets}, ${T("Learning Rate")}: ${lr}, ${T("Momentum")}: ${momentum}, ${T("Epochs")}: ${epochs}, ${T("Topology")}: ${topology}, ${T("Validation Percentage")}: ${val_percentaje}%`;
    return message;
  } 

export default constructTooltipMessage;