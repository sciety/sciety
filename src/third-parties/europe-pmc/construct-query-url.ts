import { URLSearchParams } from 'url';
import * as O from 'fp-ts/Option';
import {
  constant, pipe, tupled,
} from 'fp-ts/function';

const constructQueryParams = (
  pageSize: number,
) => (
  query: string,
  cursor: O.Option<string>,
  evaluatedOnly: boolean,
) => (
  new URLSearchParams({
    query: `(${query}) (PUBLISHER:"bioRxiv" OR PUBLISHER:"medRxiv" OR PUBLISHER:"Research Square" OR PUBLISHER:"SciELO Preprints")${evaluatedOnly ? ' (LABS_PUBS:"2112")' : ''} sort_date:y`,
    format: 'json',
    pageSize: pageSize.toString(),
    resultType: 'core',
    cursorMark: O.getOrElse(constant('*'))(cursor),
  }));

const constructSearchUrl = (queryParams: URLSearchParams) => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${queryParams.toString()}`;

export const constructQueryUrl = (
  query: string,
  cursor: O.Option<string>,
  evaluatedOnly: boolean,
  pageSize: number,
): string => pipe(
  [query, cursor, evaluatedOnly],
  tupled(constructQueryParams(pageSize)),
  constructSearchUrl,
);
