import axios from 'axios';
import Doi from '../src/types/doi';
import { JsonCompatible } from '../src/types/json';

const publisherDoiPrefix = process.argv[2];

type BiorxivResponse = JsonCompatible<{
  messages: Array<{
    cursor: number | string,
    count: number,
    total: number,
  }>,
  collection: Array<{
    biorxiv_doi: string,
    published_date: string,
  }>
}>;

void (async (): Promise<void> => {
  const today = new Date().toISOString().split('T')[0];

  const { data: firstPage } = await axios.get<BiorxivResponse>(`https://api.biorxiv.org/publisher/${publisherDoiPrefix}/2000-01-01/${today}/0`);
  let endorsements = firstPage.collection.map((item) => ({
    articleId: new Doi(item.biorxiv_doi.trim()),
    date: new Date(item.published_date.trim()),
  }));

  const { count } = firstPage.messages[0];
  const numRequestsNeeded = Math.ceil(firstPage.messages[0].total / count);
  for (let i = 1; i < numRequestsNeeded; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const { data } = await axios.get<BiorxivResponse>(`https://api.biorxiv.org/publisher/${publisherDoiPrefix}/2000-01-01/${today}/${count * i}`);
    endorsements = endorsements.concat(
      data.collection.map((item) => ({
        articleId: new Doi(item.biorxiv_doi.trim()),
        date: new Date(item.published_date.trim()),
      })),
    );
  }

  process.stdout.write('Date,Article DOI\n');

  endorsements.forEach((endorsement) => {
    process.stdout.write(`${endorsement.date.toISOString()},${endorsement.articleId.value}\n`);
  });
})();
