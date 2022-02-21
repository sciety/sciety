import * as S from 'fp-ts/State';

type Event = {type: string};

describe('state-events', () => {
  it('', () => {
    const getAllEvents: S.State<Date, ReadonlyArray<Event>> = () => [
      [{type: "EventA"}],
      new Date("2022-02-21"), 
    ];
  })
});
