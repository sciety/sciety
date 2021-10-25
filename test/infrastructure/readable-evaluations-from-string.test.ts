import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { readableEvaluationsFromString } from '../../src/infrastructure/readable-evaluations-from-string';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('readable-evalutions-from-string', () => {
  describe('when all lines are valid json that match domain model', () => {
    const fileContents = '{"date":"2018-09-22T00:00:00.000Z","articleDoi":"10.1101/318121","evaluationLocator":"doi:10.24072/pci.paleo.100001"}\n{"date":"2019-10-15T00:00:00.000Z","articleDoi":"10.1101/352609","evaluationLocator":"doi:10.24072/pci.paleo.100002"}';
    const result = pipe(
      readableEvaluationsFromString(fileContents),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('returns all evaluations', () => {
      expect(result).toHaveLength(2);
    });
  });

  describe('when a line is empty', () => {
    const fileContents = '{"date":"2018-09-22T00:00:00.000Z","articleDoi":"10.1101/318121","evaluationLocator":"doi:10.24072/pci.paleo.100001"}\n';
    const result = pipe(
      readableEvaluationsFromString(fileContents),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('does not return an evaluation for that line', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when a line is invalid json', () => {
    it.todo('returns a left');
  });

  describe('when a line does not match the domain model', () => {
    it.todo('returns a left');
  });
});
