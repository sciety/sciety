import { pipe } from 'fp-ts/lib/function';
import * as S from 'fp-ts/State';

type Event = {type: string, date: Date};

describe('state-events', () => {
  it('', () => {
    let i = 0;
    const getEventsFrom: S.State<Date, ReadonlyArray<Event>> = (date: Date) => {
      i++;
      return [
        [{type: `Event${i}`, date}],
        date,
      ];
    }
    //const getAllEvents: S.State<Date, ReadonlyArray<Event>> = () => [
    //  [{type: "EventA"}],
    //  new Date("2022-02-21"), 
    //];
    const countEventsProjection = (startingDate) => pipe(
      startingDate,
      getEventsFrom,
      ([events, state]) => [events.length, state],
    );
    expect(countEventsProjection(new Date("1970-01-01"))[0]).toStrictEqual(1);
  })

  describe('auto-increment', () => {
    const autoIncrementAsState: S.State<number, number> = (counter: number) => [
      counter,
      counter + 1,
    ];
    let createAutoIncrement = () => {
      let counter = 1;
      const myFunction = () => {
        const [value, newCounter] = autoIncrementAsState(counter);
        counter = newCounter;
        return value;
      }
      return myFunction;
    };
    const autoIncrement = createAutoIncrement();
    describe('when called the first time', () => {
      let result = autoIncrement();
      it('returns 1', () => {
        expect(result).toStrictEqual(1);
      })
      describe('when called the second time', () => {
        let result = autoIncrement();
        it('returns 2', () => {
          expect(result).toStrictEqual(2);
        })
      })
    })
  });
});
