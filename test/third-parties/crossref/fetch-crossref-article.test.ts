import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, identity, pipe } from 'fp-ts/function';
import { fetchCrossrefArticle } from '../../../src/third-parties/crossref/fetch-crossref-article';
import * as DE from '../../../src/types/data-error';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';

describe('fetch-crossref-article', () => {
  const doi = arbitraryDoi();

  it('uses the correct url and accept header', async () => {
    const getXml = jest.fn();
    await fetchCrossrefArticle(getXml, dummyLogger, O.none)(doi)();

    expect(getXml).toHaveBeenCalledWith(
      `https://api.crossref.org/works/${doi.value}/transform`,
      expect.objectContaining({
        Accept: 'application/vnd.crossref.unixref+xml',
      }),
    );
  });

  describe('the request fails', () => {
    it('returns an error result', async () => {
      const getXml = async (): Promise<never> => {
        throw new Error('HTTP timeout');
      };
      const result = await pipe(
        doi,
        fetchCrossrefArticle(getXml, dummyLogger, O.none),
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isNotFound,
        )),
      )();

      expect(result).toBe(true);
    });
  });

  describe('when crossref returns an invalid XML document', () => {
    it('throws an error', async () => {
      const getXml = async (): Promise<string> => '';
      const result = await pipe(
        doi,
        fetchCrossrefArticle(getXml, dummyLogger, O.none),
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isUnavailable,
        )),
      )();

      expect(result).toBe(true);
    });
  });

  describe('when crossref returns unusable authors', () => {
    it('returns a Right', async () => {
      const getXml = async (): Promise<string> => `
        <?xml version="1.0" encoding="UTF-8"?>
        <doi_records>
          <doi_record owner="10.1101" timestamp="2021-11-11 04:35:20">
            <crossref>
              <posted_content type="preprint" language="en" metadata_distribution_opts="any">
                <titles>
                  <title>${arbitraryString()}</title>
                </titles>
                <posted_date>
                  <month>11</month>
                  <day>08</day>
                  <year>2021</year>
                </posted_date>
                <item_number item_number_type="pisa">medrxiv;2021.11.08.21265380v1</item_number>
                <doi_data>
                  <resource>http://medrxiv.org/lookup/doi/10.1101/2021.11.08.21265380</resource>
                </doi_data>
              </posted_content>
            </crossref>
          </doi_record>
        </doi_records>
      `;
      const result = await pipe(
        doi,
        fetchCrossrefArticle(getXml, dummyLogger, O.none),
      )();

      expect(E.isRight(result)).toBe(true);
    });
  });
});
