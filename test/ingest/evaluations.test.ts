import * as Es from '../../src/ingest/evaluations';

describe('evaluations', () => {
  describe('toCsv', () => {
    it('removes duplicate entries', () => {
      const evaluation = {
        date: new Date('2021-07-08'),
        articleDoi: '10.1101/111111',
        evaluationLocator: 'ncrc:1234',
      };

      expect(Es.toCsv([evaluation, evaluation])).toStrictEqual(Es.toCsv([evaluation]));
    });
  });
});
