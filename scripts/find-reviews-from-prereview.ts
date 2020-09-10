import axios from 'axios';

type ArticleSummary = {
  id: string,
  n_prereviews: number,
};

type Review = {
  date_created: string;
  doi: string;
};

type Article = {
  prereviews: Array<Review>;
};

type PrereviewResponse = {
  results: ReadonlyArray<ArticleSummary>,
};

const biorxivPrefix = /^doi\/10\.1101\//;

const formatRow = (articleId: string, row: Review): string => {
  const articleDoi = articleId.replace(/^doi\//, '');

  return `${new Date(row.date_created).toISOString()},${articleDoi},doi:${row.doi}`;
};

const fetchReviews = (article: ArticleSummary): Array<Review> => {
  if (!article.id.match(biorxivPrefix)) {
    return [];
  }
  return [];
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  // -d '{"query":{"string":null,"sortBy":"reviews","page":1}}'
  const { data } = await axios.post<PrereviewResponse>(
    'https://www.prereview.org/data/preprints/search',
    { headers: { Accept: 'application/json' } },
  );
  data.results.forEach((articleSummary) => {
    if (articleSummary.n_prereviews > 0) {
      const reviews = fetchReviews(articleSummary);
      reviews.forEach((review) => {
        const formatted = formatRow(articleSummary.id, review);
        process.stdout.write(`${formatted}\n`);
      });
    }
  });
})();
