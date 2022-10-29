

const modelInfo = (modelFile: any) => {
        let model = modelFile.split('.pickle')[0]
        model = model.split(',')
        const datasets = model[0].split('model')[1]
        const lr = model[1]
        const momentum = model[2]
        const epochs = model[3]
        const topology = model[4]
        const val_percentaje = model[5]*100
        return { datasets, lr, momentum, epochs, topology, val_percentaje }
}

export default modelInfo;