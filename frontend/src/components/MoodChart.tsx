import * as React from 'react';
import { Event } from 'common';

import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer 
} from 'victory';

import { movingAverageFilter } from '@App/eventStatistics';

export class MoodChart extends React.Component<{ events: Event[] }, { }> {

  clickEventCallback = (): Event => {
    // TODO: use this to route directly to the visit card for this event to give user more details
    return this.props.events[0]
  }

  render() {
		const data = movingAverageFilter(this.props.events, Math.floor(this.props.events.length * 0.125));
    return (
      <VictoryChart
      	theme={VictoryTheme.material}
        scale={{x: "time"}}
        containerComponent={
          <VictoryVoronoiContainer
            onActivated={(points, props) => {
              this.clickEventCallback = (): Event => {return points[0]}
            }}
          />}
      >
     		<VictoryLine
     			style={{
     				data: { stroke: "#c43a31" },
     				parent: { border: "1px solid #ccc"}
     			}}
     			data={data}
          x="date"
          y="moodValue"
          labels={({ datum }: any) => datum.payload.mood}
          labelComponent={<VictoryTooltip />}
          events={[{
            target: "parent",
            eventHandlers: {
              onClick: () => {
                console.log(this.clickEventCallback().payload.visit_id);
                return []
            }
          }
        }]}
        />
     </VictoryChart>
    );
  }
}
