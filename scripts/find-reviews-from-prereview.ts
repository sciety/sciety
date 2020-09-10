import axios from 'axios';
import { Maybe } from 'true-myth';

type ArticleSummary = {
  id: string,
  n_prereviews: number,
};

type Review = {
  date_created: string;
  doi: string|null;
};

type Article = {
  prereviews: Array<Review>;
};

type PrereviewResponse = {
  results: ReadonlyArray<ArticleSummary>,
  totalpages: number;
};

const biorxivPrefix = /^doi\/10\.1101\//;

const formatRow = (articleId: string, row: Review): Maybe<string> => {
  const articleDoi = articleId.replace(/^doi\//, '');

  if (row.doi) {
    return Maybe.just(`${new Date(row.date_created).toISOString()},${articleDoi},doi:${row.doi}`);
  }

  return Maybe.nothing();
};

const fetchReviews = async (article: ArticleSummary): Promise<ReadonlyArray<Review>> => {
  if (!article.id.match(biorxivPrefix)) {
    return [];
  }

  const { data } = await axios.get<Article>(`https://www.prereview.org/data/preprints/${article.id}`);
  return data.prereviews;
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  let currentPage = 1;
  let totalPages = NaN;
  do {
    const response = await axios.post<PrereviewResponse>(
      'https://www.prereview.org/data/preprints/search',
      { query: { string: null, page: currentPage } },
      { headers: { Accept: 'application/json' } },
    );
    const { data } = response;
    data.results.forEach(async (articleSummary) => {
      if (articleSummary.n_prereviews > 0) {
        const reviews = await fetchReviews(articleSummary);
        reviews.forEach((review) => {
          const formatted = formatRow(articleSummary.id, review);
          formatted.map((value) => process.stdout.write(`${value}\n`));
        });
      }
    });
    currentPage += 1;
    totalPages = data.totalpages;
  } while (currentPage <= totalPages);
})();
