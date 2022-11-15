import * as E from 'fp-ts/Either';
describe('fp-ts-sequence', () => {
    it('takes out a Task from inside an Either', () => {
      const result = pipe(
        E.right(T.of(42)),
      )
      expect(await result()).toStrictEqual(E.right(42));
    });
})
