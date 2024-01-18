/* eslint-disable no-irregular-whitespace */
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import {formatValidationErrors} from 'io-ts-reporters';
import { crossrefMultipleWorksResponseCodec } from '../../../../src/third-parties/crossref/fetch-all-paper-expression/fetch-works-that-point-to-individual-works';

describe('crossrefMultipleWorksResponseCodec', () => {
  const crossrefResponse = `
    {
        "status": "ok",
        "message-type": "work-list",
        "message-version": "1.0.0",
        "message": {
          "facets": {},
          "total-results": 1,
          "items": [
            {
              "indexed": {
                "date-parts": [
                  [
                    2024,
                    1,
                    15
                  ]
                ],
                "date-time": "2024-01-15T23:30:19Z",
                "timestamp": 1705361419616
              },
              "reference-count": 92,
              "publisher": "Elsevier BV",
              "issue": "5",
              "content-domain": {
                "domain": [
                  "cell.com",
                  "elsevier.com",
                  "sciencedirect.com"
                ],
                "crossmark-restriction": true
              },
              "short-container-title": [
                "Cell Reports"
              ],
              "published-print": {
                "date-parts": [
                  [
                    2022,
                    5
                  ]
                ]
              },
              "DOI": "10.1016/j.celrep.2022.110776",
              "type": "journal-article",
              "created": {
                "date-parts": [
                  [
                    2022,
                    5,
                    6
                  ]
                ],
                "date-time": "2022-05-06T04:20:28Z",
                "timestamp": 1651810828000
              },
              "page": "110776",
              "update-policy": "http://dx.doi.org/10.1016/elsevier_cm_policy",
              "source": "Crossref",
              "is-referenced-by-count": 18,
              "title": [
                "Cholesterol determines the cytosolic entry and seeded aggregation of tau"
              ],
              "prefix": "10.1016",
              "volume": "39",
              "container-title": [
                "Cell Reports"
              ],
              "language": "en",
              "resource": {
                "primary": {
                  "URL": "https://linkinghub.elsevier.com/retrieve/pii/S221112472200540X"
                }
              },
              "issued": {
                "date-parts": [
                  [
                    2022,
                    5
                  ]
                ]
              },
              "references-count": 92,
              "journal-issue": {
                "issue": "5",
                "published-print": {
                  "date-parts": [
                    [
                      2022,
                      5
                    ]
                  ]
                }
              },
              "alternative-id": [
                "S221112472200540X"
              ],
              "URL": "http://dx.doi.org/10.1016/j.celrep.2022.110776",
              "relation": {
                "has-preprint": [
                  {
                    "id-type": "doi",
                    "id": "10.1101/2021.06.21.449238",
                    "asserted-by": "object"
                  }
                ]
              },
              "ISSN": [
                "2211-1247"
              ],
              "issn-type": [
                {
                  "value": "2211-1247",
                  "type": "print"
                }
              ],
              "subject": [
                "General Biochemistry, Genetics and Molecular Biology"
              ],
              "published": {
                "date-parts": [
                  [
                    2022,
                    5
                  ]
                ]
              },
              "article-number": "110776"
            }
          ],
          "items-per-page": 20,
          "query": {
            "start-index": 0,
            "search-terms": null
          }
        }
      }
    `;

  describe('given a valid crossref response', () => {
    const result = pipe(
      crossrefResponse,
      crossrefMultipleWorksResponseCodec.decode,
      E.mapLeft(formatValidationErrors),
    );

    it.failing('decodes successfully', () => {
      expect(result).toStrictEqual(E.right(expect.any));
    });
  });
});
