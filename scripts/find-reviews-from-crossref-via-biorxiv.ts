import axios from 'axios';

type BiorxivResponse = {
  messages: Array<{
    cursor: number | string,
    count: number,
    total: number,
  }>,
  collection: Array<{
    biorxiv_doi: string,
    published_doi: string,
  }>
};

type CrossrefResponse ={
  message: {
    items: [
      {
        DOI: string;
        'published-print': {
          'date-parts': [
            [number, number, number],
          ],
        }
      }
    ]
  }
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  let offset = 0;
  let total: number;
  do {
    // eslint-disable-next-line no-await-in-loop
    const { data: biorxivData } = await axios.get<BiorxivResponse>(
      `https://api.biorxiv.org/publisher/10.7717/2000-01-01/2020-08-13/${offset}`,
    );
    const { count } = biorxivData.messages[0];
    total = biorxivData.messages[0].total;

    for (const biorxivItem of biorxivData.collection) {
      const publishedDoi = biorxivItem.published_doi;
      const biorxivDoi = biorxivItem.biorxiv_doi;

      // specify a User-Agent: https://github.com/CrossRef/rest-api-doc/issues/491
      // eslint-disable-next-line no-await-in-loop
      const { data } = await axios.get<CrossrefResponse>(
        `https://api.crossref.org/prefixes/10.7287/works?rows=1000&filter=type:peer-review,relation.object:${publishedDoi}`,
        { headers: { 'User-Agent': 'TheHive (http://hive.review; mailto:team@hive.review)' } },
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
