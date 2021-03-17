import axios from 'axios';
import * as O from 'fp-ts/Option';

type PrereviewSearchResponse = {
  results: ReadonlyArray<PrereviewSearchResult>,
  totalpages: number,
};

type PrereviewSearchResult = {
  id: string,
  n_prereviews: number,
  source: string,
};

type PrereviewPreprint = {
  prereviews: Array<Prereview>,
};

type Prereview = {
  date_created: string,
  doi: string|null,
};

const biorxivPrefix = /^doi\/10\.1101\//;

const formatRow = (preprintId: string, prereview: Prereview): O.Option<string> => {
  if (prereview.doi) {
    const reviewDate = new Date(prereview.date_created);
    const articleDoi = preprintId.replace(/^doi\//, '');
    const reviewId = `doi:${prereview.doi}`;
    return O.some(`${reviewDate.toISOString()},${articleDoi},${reviewId}`);
  }

  return O.none;
};

const fetchPrereviews = async (article: PrereviewSearchResult): Promise<ReadonlyArray<Prereview>> => {
  const { data } = await axios.get<PrereviewPreprint>(`https://www.prereview.org/data/preprints/${article.id}`);
  return data.prereviews;
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  let currentPage = 1;
  let totalPages = NaN;
  // eslint-disable-next-line no-loops/no-loops
  do {
    const { data } = await axios.post<PrereviewSearchResponse>(
      'https://www.prereview.org/data/preprints/search',
      { query: { string: null, page: currentPage } },
      { headers: { Accept: 'application/json' } },
    );
    await Promise.all(
      data.results
        .filter((searchResult) => searchResult.n_prereviews > 0)
        .filter((searchResult) => searchResult.id.match(biorxivPrefix))
        // TODO: not sure it excludes every medRxiv result,
        // as some of these values are just `Crossref`
        .filter((searchResult) => !searchResult.source.startsWith('https://www.medrxiv.org/'))
        .map(async (searchResult) => {
          (await fetchPrereviews(searchResult))
            .map((prereview) => formatRow(searchResult.id, prereview))
            .forEach(O.map((value) => process.stdout.write(`${value}\n`)));
        }),
    );
    currentPage += 1;
    totalPages = data.totalpages;
  } while (currentPage <= totalPages);
})();
