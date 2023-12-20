import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../src/types/data-error';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { fetchExpressionFrontMatter } from '../../../src/third-parties/crossref/fetch-expression-front-matter';

describe('fetch-expression-front-matter', () => {
  const expressionDoi = arbitraryExpressionDoi();

  describe('the request fails', () => {
    it('returns an error result', async () => {
      const queryExternalService = () => () => TE.left(DE.unavailable);
      const result = await pipe(
        expressionDoi,
        fetchExpressionFrontMatter(queryExternalService, dummyLogger, O.none),
      )();

      expect(result).toStrictEqual(E.left(DE.unavailable));
    });
  });

  describe('when crossref returns an invalid XML document', () => {
    it('throws an error', async () => {
      const queryExternalService = () => () => TE.right(arbitraryString());
      const result = await pipe(
        expressionDoi,
        fetchExpressionFrontMatter(queryExternalService, dummyLogger, O.none),
      )();

      expect(result).toStrictEqual(E.left(DE.unavailable));
    });
  });

  describe('when crossref returns no usable authors', () => {
    it('returns a Right', async () => {
      const queryExternalService = () => () => TE.right(`
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
      `);
      const result = await pipe(
        expressionDoi,
        fetchExpressionFrontMatter(queryExternalService, dummyLogger, O.none),
      )();

      expect(E.isRight(result)).toBe(true);
    });
  });
});
