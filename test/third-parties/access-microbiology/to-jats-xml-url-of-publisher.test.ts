import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { toJatsXmlUrlOfPublisher } from '../../../src/third-parties/access-microbiology/to-jats-xml-url-of-publisher';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryWord } from '../../helpers';

describe('to-jats-xml-url-of-publisher', () => {
  describe.each([
    ['10.1099/acmi.0.000530.v1.3', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000530.v1/acmi.0.000530.v1.xml'],
    ['10.1099/acmi.0.000569.v1.4', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml'],
  ])('given a hardcoded ACMI evaluation DOI: %s', (acmiEvaluationDoi, url) => {
    let inferredUrl: string;

    beforeEach(() => {
      inferredUrl = pipe(
        acmiEvaluationDoi,
        toJatsXmlUrlOfPublisher,
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns an inferred url', () => {
      expect(inferredUrl).toBe(url);
    });
  });

  describe.each([
    ['10.1099/acmi.0.000569.v1.9999', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml'],
  ])('given an ACMI evaluation DOI: %s', (acmiEvaluationDoi, url) => {
    const inferredUrl = pipe(
      acmiEvaluationDoi,
      toJatsXmlUrlOfPublisher,
    );

    it.failing('returns an inferred url', () => {
      expect(inferredUrl).toStrictEqual(O.some(url));
    });
  });

  describe('given a string that does not represent an ACMI evaluation DOI', () => {
    const result = toJatsXmlUrlOfPublisher(arbitraryWord());

    it('returns an O.none', () => {
      expect(result).toStrictEqual(O.none);
    });
  });
});
