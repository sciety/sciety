import { flow, identity, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/State';
import * as RA from 'fp-ts/ReadonlyArray';

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
    const autoIncrementAsState = (interval: number): S.State<number, number> => pipe(
      (counter: number): [number, number] => [
        counter,
        counter + 1,
      ],
      S.map((value) => value * interval),
    );
    const autoIncrementAsState2 = (interval: number) => pipe(
      S.gets<number, number>((value) => value * interval),
      S.chain((value) => (state) => [value, state + 1]),
    );
    let createAutoIncrementBy = (interval: number) => {
      let counter = 0;
      const steps = [];
      const myFunction = () => {
        steps.push(autoIncrementAsState2(interval));
        return pipe(
          S.sequenceArray(steps)(0),
          (([values, state]) => values),
          RA.last,
          O.getOrElse(() => -1)
        );
      }
      return myFunction;
    };
    const autoIncrement = createAutoIncrementBy(2);
    describe('when called the first time', () => {
      let result = autoIncrement();
      it('returns 0', () => {
        expect(result).toStrictEqual(0);
      })
      describe('when called the second time', () => {
        let result = autoIncrement();
        it('returns 2', () => {
          expect(result).toStrictEqual(2);
        })
        describe('when called the third time', () => {
          let result = autoIncrement();
          it('returns 4', () => {
            expect(result).toStrictEqual(4);
          })
        })
      })
    })
  });
});
