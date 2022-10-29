import {FC} from 'react'
import StyledCard from '../shared/cards/Card';
import { Plot, Heading, LineSeries, Axis, Legend } from "react-plot";
import { useTranslation } from 'react-i18next';

interface Props {
    plotData: {val: any[], train: any[]};
}

const MSEPlot: FC<Props> = ({plotData}) => {
    const { t: T } = useTranslation();
    return (
        <StyledCard>
              <h2 className="font-bold px-5 py-2 text-center text-2xl">{T("Line Chart: MSE vs Epochs")}</h2>
              <div className="grid justify-center">
                <Plot
                  width={300}
                  height={320}
                >
                  <LineSeries data={plotData.val}
                    label={T("Validation Dataset")}
                    lineStyle={{ stroke: 'red', strokeWidth: 2 }}
                    xAxis="x"
                    yAxis="y" />
                  <LineSeries data={plotData.train}
                    label={T("Training Dataset")}
                    lineStyle={{ stroke: '#0f19ca', strokeWidth: 2 }}
                    xAxis="x"
                    yAxis="y" />
                  <Axis
                    id="x"
                    position="bottom"
                    lineStyle={{ stroke: '#e3e7ea', strokeWidth: 2, strokeOpacity: 0.5 }}
                    label={T("Epochs")}
                  />
                  <Axis
                    id="y"
                    position="left"
                    lineStyle={{ stroke: '#e3e7ea', strokeWidth: 2, strokeOpacity: 0.5 }}
                    label={T("MSE (Mean Squared Error)")}
                  />
                  <Legend position="top" />
                </Plot>
              </div>
            </StyledCard>
    )
}

export default MSEPlot;