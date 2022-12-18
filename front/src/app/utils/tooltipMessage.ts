const constructTooltipMessage = (model: any, T: any): string => {
    let message = "";
    const { amount_datasets, learning_rate, momentum, amount_of_epochs, topology, val_percentage  } = model
    if (!amount_datasets) return `<span class="font-bold flex justify-center text-center">${T("No model info available")}</span>`
    message += `
    <span class="font-bold text-center flex justify-center"> ${T("Model Info")} </span> 
    <div><span class="font-bold">${T("Datasets")}: </span> ${amount_datasets} </div>
    <div><span class="font-bold">${T("Learning Rate")}: </span> ${learning_rate} </div>
    <div><span class="font-bold">${T("Momentum")}: </span> ${momentum} </div>
    <div><span class="font-bold">${T("Epochs")}: </span> ${amount_of_epochs} </div>
    <div><span class="font-bold">${T("Topology")}: </span> ${topology} </div>
    <div><span class="font-bold">${T("Validation Percentage")}: </span> ${val_percentage*100}% </div>` ;
    return message;
};

export default constructTooltipMessage;