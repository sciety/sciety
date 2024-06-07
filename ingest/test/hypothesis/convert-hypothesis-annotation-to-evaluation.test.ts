import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { convertHypothesisAnnotationToEvaluation } from '../../src/third-parties/hypothesis/convert-hypothesis-annotation-to-evaluation';
import {
  arbitraryNumber, arbitraryDate, arbitraryString, arbitraryWord,
} from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

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
    const result = pipe(
      ({
        id,
        created: arbitraryDate().toISOString(),
        uri: supportedPreprintUri,
        text: arbitraryWord(),
        tags: [],
      }),
      convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('provides an evaluation locator', () => {
      expect(result.evaluationLocator).toBe(`hypothesis:${id}`);
    });

    it('provides an evaluation type of not-provided', () => {
      expect(result.evaluationType).toBe('not-provided');
    });
  });

  describe('when the url cannot be parsed to a doi', () => {
    const result = convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap)({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: 'http://example.com',
      text: arbitraryWord(),
      tags: [],
    });

    it('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
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
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('when the annotation has a tag associated with an evaluation type', () => {
    const result = pipe(
      ({
        id: arbitraryWord(),
        created: arbitraryDate().toISOString(),
        uri: supportedPreprintUri,
        text: arbitraryWord(),
        tags: [tagToEvaluationTypeMap[evaluationType1][arbitraryNumber(0, 2)]],
      }),
      convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('returns an evaluation of the said type', () => {
      expect(result.evaluationType).toStrictEqual(evaluationType1);
    });
  });

  describe('when the annotation has tags that associate it with multiple evaluation types', () => {
    const result = pipe(
      ({
        id: arbitraryWord(),
        created: arbitraryDate().toISOString(),
        uri: supportedPreprintUri,
        text: arbitraryWord(),
        tags: [
          tagToEvaluationTypeMap[evaluationType1][arbitraryNumber(0, 2)],
          tagToEvaluationTypeMap[evaluationType2][arbitraryNumber(0, 2)],
        ],
      }),
      convertHypothesisAnnotationToEvaluation(tagToEvaluationTypeMap),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('leaves the evaluation type as not-provided', () => {
      expect(result.evaluationType).toBe('not-provided');
    });
  });
});
