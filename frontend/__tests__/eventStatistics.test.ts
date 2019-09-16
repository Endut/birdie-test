import { Event } from 'common';
import { ExtendedMoodEvent, sum, average, averageForEvents, makeWindow } from '@App/eventStatistics';

describe('checks event mood averaging functions', () => {
  it('sums an array correctly', () => {
    const array = [0,1,2,3];
    expect(sum(array)).toEqual(6)
  });

  it('averages an array correctly', () => {
    const array = [0,1,2,3];
    expect(average(array)).toEqual(1.5)
  });

  it('does not blow up with empty array', () => {
    expect(average([])).toEqual(0)
  });

  it('average for events gives correct values', () => {
    const events = [
    {
      event_type: 'mood_observation',
      id: '0',
      date: new Date('2019-01-01'),
      moodValue: 0 
    },
    {
      event_type: 'mood_observation',
      id: '1',
      date: new Date('2019-01-02'),
      moodValue: -1 
    },
    {
      event_type: 'mood_observation',
      id: '2',
      date: new Date('2019-01-03'),
      moodValue: 1 
    }];
    expect(averageForEvents(events)).toEqual({
      event_type: 'mood_observation',
      date: new Date('2019-01-03'),
      id: '0',
      moodValue: 0
    })
  });

  it('make window creates correct windows', () => {
    const array = [0, 1, 2, 3, 4, 5, 6 ];
    expect(array.map(makeWindow<number>(4))).toEqual([
      [0],
      [0, 1],
      [0, 1, 2],
      [0, 1, 2, 3],
      [1, 2, 3, 4],
      [2, 3, 4, 5],
      [3, 4, 5, 6]
    ]);
  })
})

