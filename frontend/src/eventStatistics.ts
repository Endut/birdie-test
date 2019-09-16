import { Event } from 'common';
import * as _ from 'lodash';

enum MoodEnum {
  sad = -1,
  okay = 0,
  happy = 1
}

export interface ExtendedMoodEvent extends Event {
  date: Date,
  moodValue: number
}

export function sum(numbers: number[]): number {
  return _.reduce(numbers, (a, b) => a + b, 0)
}

export function average(numbers: number[]): number {
  return sum(numbers) / (numbers.length || 1)
}

export function averageForEvents(events: ExtendedMoodEvent[]): ExtendedMoodEvent {
  const moodValues = events.map(e => e.moodValue);
  return { ...events[0], date: events[events.length - 1].date, moodValue: average(moodValues) }
}

export function makeWindow<T>(windowSize: number): (_arrayMember: T, index: number, array: T[]) => T[] {
  return (_arrayMember: T, index: number, array: T[]): T[] => {
    const start = Math.max(0, index - windowSize + 1);
    const end = Math.min(array.length, index + 1);
    const arr = _.slice(array, start, end);
    return arr;
  }
}

export function createExtendedMoodEvent(e: Event) {
  return { ...e, date: new Date(e.timestamp), moodValue: MoodEnum[e.payload.mood] }
}

export function movingAverageFilter(events: Event[], avgSize: number): any[] {
  const aggregateDays = _.chain(events.map(createExtendedMoodEvent))
    .map(makeWindow<ExtendedMoodEvent>(avgSize))
    .map(averageForEvents)
    .value();
  return aggregateDays;
}