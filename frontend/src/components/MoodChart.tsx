import * as React from 'react';
import { Event } from 'common';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer 
} from 'victory';
import { MoodEnum } from '../renderEnums';
import * as _ from 'lodash';

interface ExtendedMoodEvent extends Event {
  date: Date,
  moodValue: number
}

// TODO: refactor these averaging/stats functions to separate module
function sum(numbers: number[]): number {
  return _.reduce(numbers, (a, b) => a + b, 0)
}

function average(numbers: number[]): number {
  return sum(numbers) / (numbers.length || 1)
}

function averageForEvents(events: ExtendedMoodEvent[]): ExtendedMoodEvent {
  console.log(events);
  const moodValues = events.map(e => e.moodValue);
  return { ...events[0], date: events[events.length - 1].date, moodValue: average(moodValues) }
}

function makeWindow<T>(windowSize: number): (_arrayMember: T, index: number, array: T[]) => T[] {
  return (_arrayMember: T, index: number, array: T[]): T[] => {
    const start = Math.max(0, index - windowSize);
    const end = index;
    const arr = _.slice(array, start, end);

    return arr;
  }
}

function createExtendedMoodEvent(e: Event) {
  return { ...e, date: new Date(e.timestamp), moodValue: MoodEnum[e.payload.mood] }
}

function movingAverageFilter(events: Event[], avgSize: number): any[] {
  const aggregateDays = _.chain(events.map(createExtendedMoodEvent))
    .map(makeWindow<ExtendedMoodEvent>(avgSize))
    .map(averageForEvents)
    .value();

  return aggregateDays;
}


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
