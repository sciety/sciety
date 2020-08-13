import axios from 'axios';

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
  // from https://api.biorxiv.org/publisher/10.7717/2000-01-01/2020-08-13/0
  const biorxivResponseFirstCollectionItem = {
    biorxiv_doi: '10.1101/002717',
    published_doi: '10.7717/peerj.434',
  };
  // specify a User-Agent: https://github.com/CrossRef/rest-api-doc/issues/491
  const { data } = await axios.get<CrossrefResponse>('https://api.crossref.org/prefixes/10.7287/works?rows=1000&filter=type:peer-review,relation.object:10.7717/peerj.434', { headers: { 'User-Agent': 'TheHive (http://hive.review; mailto:team@hive.review)' } });
  process.stdout.write('Date,Article DOI,Review ID\n');
  const articleDoi = biorxivResponseFirstCollectionItem.biorxiv_doi;

  data.message.items.forEach((item) => {
    const [year, month, day] = item['published-print']['date-parts'][0];
    const date = new Date(year, month - 1, day);
    const reviewDoi = item.DOI;

    process.stdout.write(`${date.toISOString()},${articleDoi},doi:${reviewDoi}\n`);
  });
})();
