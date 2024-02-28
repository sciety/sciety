import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as AED from '../../../../src/third-parties/fetch-evaluation/access-microbiology/evaluation-fetcher-key';
import { arbitraryWord } from '../../../helpers';
import { toJatsXmlUrlOfPublisher } from '../../../../src/third-parties/fetch-evaluation/access-microbiology/to-jats-xml-url-of-publisher';

describe('to-jats-xml-url-of-publisher', () => {
  describe.each([
    ['10.1099/acmi.0.000530.v1.3', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000530.v1/acmi.0.000530.v1.xml'],
    ['10.1099/acmi.0.000569.v1.4', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml'],
    ['10.1099/acmi.0.000569.v1.9999', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml'],
    ['10.1099/acmi.0.0005691234567.v1.9999', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.0005691234567.v1/acmi.0.0005691234567.v1.xml'],
  ])('given an ACMI evaluation DOI: %s', (acmiEvaluationDoi, url) => {
    const inferredUrl = pipe(
      acmiEvaluationDoi,
      AED.fromValidatedString,
      toJatsXmlUrlOfPublisher,
    );

    it('returns an inferred url', () => {
      expect(inferredUrl).toStrictEqual(O.some(url));
    });
  });

  describe.each([
    [arbitraryWord()],
    ['10.1099/acmi.0.000569.v1.'],
    ['10.1099/acmi.0.000569.'],
    ['10.1099/acmi.0'],
    [`10.1099/${arbitraryWord()}`],
    ['10.1234/acmi.0.000569.v1.9999'],
  ])('given a string %s that does not represent an ACMI evaluation DOI', (input) => {
    const result = toJatsXmlUrlOfPublisher(AED.fromValidatedString(input));

    it('returns an O.none', () => {
      expect(result).toStrictEqual(O.none);
    });
  });
});