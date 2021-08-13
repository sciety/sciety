/* eslint-disable no-loops/no-loops */
import axios from 'axios';

const publisherDoiPrefix = process.argv[2];
const publisherReviewDoiPrefix = process.argv[3];

type BiorxivResponse = {
  messages: Array<{
    cursor: number | string,
    count: number,
    total: number,
  }>,
  collection: Array<{
    biorxiv_doi: string,
    published_doi: string,
  }>,
};

type CrossrefResponse = {
  message: {
    items: [
      {
        DOI: string,
        'published-print': {
          'date-parts': [
            [number, number, number],
          ],
        },
      },
    ],
  },
};

void (async (): Promise<void> => {
  const now = new Date();
  const startDate = new Date(now.getTime() - (6 * 24 * 60 * 60)).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  process.stdout.write('Date,Article DOI,Review ID\n');

  let offset = 0;
  let total: number;
  do {
    const { data: biorxivData } = await axios.get<BiorxivResponse>(
      `https://api.biorxiv.org/publisher/${publisherDoiPrefix}/${startDate}/${today}/${offset}`,
    );
    const { count } = biorxivData.messages[0];
    total = biorxivData.messages[0].total;

    for (const biorxivItem of biorxivData.collection) {
      const publishedDoi = biorxivItem.published_doi;
      const biorxivDoi = biorxivItem.biorxiv_doi;

      // specify a User-Agent: https://github.com/CrossRef/rest-api-doc/issues/491
      const headers: Record<string, string> = {
        'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
      };
      if (process.env.CROSSREF_API_BEARER_TOKEN !== undefined) {
        headers['Crossref-Plus-API-Token'] = `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}`;
      }
      const { data } = await axios.get<CrossrefResponse>(
        `https://api.crossref.org/prefixes/${publisherReviewDoiPrefix}/works?rows=1000&filter=type:peer-review,relation.object:${publishedDoi}`,
        { headers },
      );

      data.message.items.forEach((item) => {
        const [year, month, day] = item['published-print']['date-parts'][0];
        const date = new Date(year, month - 1, day);
        const reviewDoi = item.DOI;

        process.stdout.write(`${date.toISOString()},${biorxivDoi},doi:${reviewDoi}\n`);
      });
    }

    offset += count;
  } while (offset < total);
})();
