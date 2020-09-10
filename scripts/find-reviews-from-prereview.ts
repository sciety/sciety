import axios from 'axios';
import { Maybe } from 'true-myth';

type PrereviewSearchResponse = {
  results: ReadonlyArray<PrereviewSearchResult>,
  totalpages: number;
};

type PrereviewSearchResult = {
  id: string,
  n_prereviews: number,
};

type PrereviewPreprint = {
  prereviews: Array<Prereview>;
};

type Prereview = {
  date_created: string;
  doi: string|null;
};

const biorxivPrefix = /^doi\/10\.1101\//;

const formatRow = (preprintId: string, prereview: Prereview): Maybe<string> => {
  if (prereview.doi) {
    const reviewDate = new Date(prereview.date_created);
    const articleDoi = preprintId.replace(/^doi\//, '');
    const reviewId = `doi:${prereview.doi}`;
    return Maybe.just(`${reviewDate.toISOString()},${articleDoi},${reviewId}`);
  }

  return Maybe.nothing();
};

const fetchPrereviews = async (article: PrereviewSearchResult): Promise<ReadonlyArray<Prereview>> => {
  if (!article.id.match(biorxivPrefix)) {
    return [];
  }

  const { data } = await axios.get<PrereviewPreprint>(`https://www.prereview.org/data/preprints/${article.id}`);
  return data.prereviews;
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  let currentPage = 1;
  let totalPages = NaN;
  do {
    const { data } = await axios.post<PrereviewSearchResponse>(
      'https://www.prereview.org/data/preprints/search',
      { query: { string: null, page: currentPage } },
      { headers: { Accept: 'application/json' } },
    );
    await Promise.all(
      data.results
        .filter((searchResult) => searchResult.n_prereviews > 0)
        .map(async (searchResult) => {
          (await fetchPrereviews(searchResult))
            .map((prereview) => formatRow(searchResult.id, prereview))
            .forEach((formatted) => formatted.map((value) => process.stdout.write(`${value}\n`)));
        }),
    );
    currentPage += 1;
    totalPages = data.totalpages;
  } while (currentPage <= totalPages);
})();
