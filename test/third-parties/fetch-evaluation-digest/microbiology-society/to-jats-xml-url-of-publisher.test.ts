import * as O from 'fp-ts/Option';
import { toJatsXmlUrlOfPublisher } from '../../../../src/third-parties/fetch-evaluation-digest/microbiology-society/to-jats-xml-url-of-publisher';
import { arbitraryWord } from '../../../helpers';

describe('to-jats-xml-url-of-publisher', () => {
  describe.each([
    ['10.1099/acmi.0.000530.v1.3', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000530.v1/acmi.0.000530.v1.xml'],
    ['10.1099/acmi.0.000569.v1.4', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml'],
    ['10.1099/acmi.0.000569.v1.9999', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml'],
    ['10.1099/acmi.0.0005691234567.v1.9999', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.0005691234567.v1/acmi.0.0005691234567.v1.xml'],
  ])('given an ACMI evaluation DOI: %s', (acmiEvaluationDoi, url) => {
    const inferredUrl = toJatsXmlUrlOfPublisher(acmiEvaluationDoi);

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
    const result = toJatsXmlUrlOfPublisher(input);

    it('returns an O.none', () => {
      expect(result).toStrictEqual(O.none);
    });
  });
});
