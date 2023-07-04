import * as E from 'fp-ts/Either';
import {
  arbitraryNumber, arbitraryDate, arbitraryString, arbitraryWord,
} from '../helpers';
import { convertHypothesisAnnotationToEvaluation } from '../../src/ingest/convert-hypothesis-annotation-to-evaluation';

describe('convert-hypothesis-annotation-to-evaluation', () => {
  const evaluationType = arbitraryString();
  const supportedPreprintUri = 'https://www.medrxiv.org/content/10.1101/2021.06.18.21258689v1';
  const tagsToBeInterpretedAsCurationStatements = {
    [evaluationType]: [arbitraryString(), arbitraryString(), arbitraryString()],
  };

  describe('when the url can be parsed to a doi and the annotation contains text', () => {
    const id = arbitraryWord();
    const result = convertHypothesisAnnotationToEvaluation(tagsToBeInterpretedAsCurationStatements)({
      id,
      created: arbitraryDate().toISOString(),
      uri: supportedPreprintUri,
      text: arbitraryWord(),
      tags: [],
    });

    it('provides an evaluation locator and no evaluation type', () => {
      expect(result).toStrictEqual(E.right(expect.objectContaining({
        evaluationLocator: `hypothesis:${id}`,
        evaluationType: undefined,
      })));
    });
  });

  describe('when the url can not be parsed to a doi', () => {
    const result = convertHypothesisAnnotationToEvaluation(tagsToBeInterpretedAsCurationStatements)({
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
    const result = convertHypothesisAnnotationToEvaluation(tagsToBeInterpretedAsCurationStatements)({
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

  describe('when the annotation has a tag to be interpreted as a curation statement', () => {
    const result = convertHypothesisAnnotationToEvaluation(tagsToBeInterpretedAsCurationStatements)({
      id: arbitraryWord(),
      created: arbitraryDate().toISOString(),
      uri: supportedPreprintUri,
      text: arbitraryWord(),
      tags: [tagsToBeInterpretedAsCurationStatements[evaluationType][arbitraryNumber(0, 2)]],
    });

    it('provides a curation-statement evaluation type', () => {
      expect(result).toStrictEqual(E.right(expect.objectContaining({
        evaluationType,
      })));
    });
  });
});
