import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { decodeEvaluationsFromJsonl } from '../../src/infrastructure/evaluations-as-jsonl';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('evaluations-as-jsonl', () => {
  describe('when all lines are valid json that match domain model', () => {
    const fileContents = '{"date":"2018-09-22T00:00:00.000Z","articleDoi":"10.1101/318121","evaluationLocator":"doi:10.24072/pci.paleo.100001"}\n{"date":"2019-10-15T00:00:00.000Z","articleDoi":"10.1101/352609","evaluationLocator":"doi:10.24072/pci.paleo.100002"}';
    const result = pipe(
      decodeEvaluationsFromJsonl(fileContents),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('returns all evaluations', () => {
      expect(result).toHaveLength(2);
    });
  });

  describe('when a line is empty', () => {
    const fileContents = '{"date":"2018-09-22T00:00:00.000Z","articleDoi":"10.1101/318121","evaluationLocator":"doi:10.24072/pci.paleo.100001"}\n';
    const result = pipe(
      decodeEvaluationsFromJsonl(fileContents),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('does not return an evaluation for that line', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when a line is invalid json', () => {
    const fileContents = 'foo';
    const result = (decodeEvaluationsFromJsonl(fileContents));

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when a line does not match the domain model', () => {
    const fileContents = '{"foo":"bar"}';
    const result = decodeEvaluationsFromJsonl(fileContents);

    it('returns a left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});
