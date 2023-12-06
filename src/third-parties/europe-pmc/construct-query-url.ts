import { URLSearchParams } from 'url';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

const supportAccessMicrobiologySearchIfEnabled = process.env.EXPERIMENT_ENABLED === 'true' ? ' OR PUBLISHER:"Access Microbiology"' : '';

export const constructQueryUrl = (
  query: string,
  cursor: O.Option<string>,
  evaluatedOnly: boolean,
  pageSize: number,
): string => pipe(
  evaluatedOnly ? ' (LABS_PUBS:"2112")' : '',
  (evaluatedOnSciety) => new URLSearchParams({
    query: `(${query}) (PUBLISHER:"bioRxiv" OR PUBLISHER:"medRxiv" OR PUBLISHER:"Research Square" OR PUBLISHER:"SciELO Preprints"${supportAccessMicrobiologySearchIfEnabled})${evaluatedOnSciety} sort_date:y`,
    format: 'json',
    pageSize: pageSize.toString(),
    resultType: 'core',
    cursorMark: pipe(
      cursor,
      O.getOrElse(() => '*'),
    ),
  }),
  (queryParams) => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${queryParams.toString()}`,
);
