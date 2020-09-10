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

  // -d '{"query":{"string":null,"sortBy":"reviews","page":1}}'
  const { data } = await axios.post<PrereviewResponse>(
    'https://www.prereview.org/data/preprints/search',
    { headers: { Accept: 'application/json' } },
  );
  data.results.forEach(async (articleSummary) => {
    if (articleSummary.n_prereviews > 0) {
      const reviews = await fetchReviews(articleSummary);
      reviews.forEach((review) => {
        const formatted = formatRow(articleSummary.id, review);
        formatted.map((value) => process.stdout.write(`${value}\n`));
      });
    }
  });
})();
