import * as E from 'fp-ts/Either';
import {
  arbitraryNumber, arbitraryDate, arbitraryString, arbitraryWord,
} from '../../helpers.js';
import { convertHypothesisAnnotationToEvaluation } from '../../../src/ingest/third-parties/hypothesis/convert-hypothesis-annotation-to-evaluation.js';

describe('convert-hypothesis-annotation-to-evaluation', () => {
  const supportedPreprintUri = 'https://www.medrxiv.org/content/10.1101/2021.06.18.21258689v1';
  const evaluationType1 = arbitraryString();
  const evaluationType2 = arbitraryString();
  const tagToEvaluationTypeMap = {
    [evaluationType1]: [arbitraryString(), arbitraryString(), arbitraryString()],
    [evaluationType2]: [arbitraryString(), arbitraryString(), arbitraryString()],
  };

  describe('when the url can be parsed to a doi and the annotation contains text but no tags', () => {
    const id = arbitraryWord();
    const result = convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap)({
      id,
      created: arbitraryDate().toISOString(),
      uri: supportedPreprintUri,
      text: arbitraryWord(),
      tags: [],
    });

    it('provides an evaluation locator and an evaluation type of not-provided', () => {
      expect(result).toStrictEqual(E.right(expect.objectContaining({
        evaluationLocator: `hypothesis:${id}`,
        evaluationType: 'not-provided',
      })));
    });
  });

  describe('when the url can not be parsed to a doi', () => {
    const result = convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap)({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: 'http://example.com',
      text: arbitraryWord(),
      tags: [],
    });

    it('returns on the left', () => {
      expect(result).toStrictEqual(E.left(expect.objectContaining({
        reason: 'server "example" not supported in "http://example.com"',
      })));
    });
  });

  describe('when the evaluation relates to an highlight-only annotation', () => {
    const result = convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap)({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: supportedPreprintUri,
      text: '',
      tags: [],
    });

    it('returns on the left', () => {
      expect(result).toStrictEqual(E.left(expect.objectContaining({
        reason: 'annotation text field is empty',
      })));
    });
  });

  describe('when the annotation has a tag associated with an evaluation type', () => {
    const result = convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap)({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: supportedPreprintUri,
      text: arbitraryWord(),
      tags: [tagToEvaluationTypeMap[evaluationType1][arbitraryNumber(0, 2)]],
    });

    it('returns an evaluation of the said type', () => {
      expect(result).toStrictEqual(E.right(expect.objectContaining({
        evaluationType: evaluationType1,
      })));
    });
  });

  describe('when the annotation has tags that associate it with multiple evaluation types', () => {
    const result = convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap)({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: supportedPreprintUri,
      text: arbitraryWord(),
      tags: [
        tagToEvaluationTypeMap[evaluationType1][arbitraryNumber(0, 2)],
        tagToEvaluationTypeMap[evaluationType2][arbitraryNumber(0, 2)],
      ],
    });

    it('leaves the evaluation type as not-provided', () => {
      expect(result).toStrictEqual(E.right(expect.objectContaining({
        evaluationType: 'not-provided',
      })));
    });
  });
});
