import * as E from 'fp-ts/Either';
import { supportedArticleIdFromLink } from '../../src/ingest/supported-article-id-from-link.js';

describe('supported-article-id-from-link', () => {
  describe('when the input is supported', () => {
    describe.each([
      ['medrxiv link', 'https://www.medrxiv.org/content/10.1101/2021.06.18.21258689v1', '10.1101/2021.06.18.21258689'],
      ['medrxiv cgi short', 'http://medrxiv.org/cgi/content/short/2020.04.08.20058073', '10.1101/2020.04.08.20058073'],
      ['medrxiv https cgi short', 'https://medrxiv.org/cgi/content/short/2020.07.31.20161216', '10.1101/2020.07.31.20161216'],
      ['medrxiv early with date and full pdf', 'https://www.medrxiv.org/content/medrxiv/early/2021/07/03/2021.06.28.21259452.full.pdf', '10.1101/2021.06.28.21259452'],
      ['biorxiv link with non date doi', 'https://www.biorxiv.org/content/10.1101/483891v2', '10.1101/483891'],
      ['biorxiv link with non date doi and no version indicator', 'https://www.biorxiv.org/content/10.1101/483891', '10.1101/483891'],
      ['biorxiv link', 'https://biorxiv.org/content/10.1101/2021.11.04.467308v1', '10.1101/2021.11.04.467308'],
      ['biorxiv link with no version indicator', 'https://biorxiv.org/content/10.1101/2021.11.04.467308', '10.1101/2021.11.04.467308'],
      ['biorxiv/medrxiv DOI link', 'https://doi.org/10.1101/2021.08.30.21262866', '10.1101/2021.08.30.21262866'],
      ['research square link', 'https://www.researchsquare.com/article/rs-955726/v1', '10.21203/rs.3.rs-955726/v1'],
      ['research square DOI link', 'https://doi.org/10.21203/rs.3.rs-885194/v1', '10.21203/rs.3.rs-885194/v1'],
      ['SciELO link', 'https://preprints.scielo.org/index.php/scielo/preprint/download/4639/8936/9328', '10.1590/SciELOPreprints.4639'],
      ['OSF link', 'https://osf.io/vrmpf/', '10.31219/osf.io/vrmpf'],
      ['PsyArXiv link', 'https://psyarxiv.com/mgn32', '10.31234/osf.io/mgn32'],
      ['arXiv link', 'https://arxiv.org/abs/2212.00741', '10.48550/arXiv.2212.00741'],
    ])('%s', (_, input, expectedDoi) => {
      it('extracts the doi from the input', () => {
        const result = supportedArticleIdFromLink(input);

        expect(result).toStrictEqual(E.right(expectedDoi));
      });
    });
  });

  describe('when the input is not supported', () => {
    describe.each([
      ['empty', ''],
      ['unsupported DOI prefix', 'https://doi.org/10.444444/555555'],
      ['unsupported DOI prefix with version', 'https://doi.org/10.444444/555555/v1'],
      ['unsupported server', 'https://example.com'],
      ['missing DOI suffix', 'https://doi.org/10.1101'],
      ['missing DOI suffix', 'https://doi.org/10.1101/'],
      // ['unrecognised biorxiv suffix', 'https://biorxiv.org/content/10.1101/abcdef'],
      // ['unrecognised medrxiv suffix', 'https://medrxiv.org/content/10.1101/abcdef'],
      // ['404 biorxiv link', 'https://biorxiv.org/10.1101/111111'],
      // ['404 medrxiv link', 'https://medrxiv.org/10.1101/111111'],
      ['invalid research square link', 'https://www.researchsquare.com/article/955726'],
      ['invalid SciELO link', 'https://preprints.scielo.org/index.php/scielo/preprint/4639/8936/9328'],
    ])('%s', (_, input) => {
      it('returns a left', () => {
        const result = supportedArticleIdFromLink(input);

        expect(result).toStrictEqual(E.left(expect.stringContaining(input)));
      });
    });
  });
});
