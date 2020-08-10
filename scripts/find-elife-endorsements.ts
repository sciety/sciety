import axios from 'axios';
import { JsonCompatible } from '../src/types/json';

const editorialCommunityId = 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0';
const publisherDoiPrefix = '10.7554';

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
    articleId: item.biorxiv_doi,
    date: item.published_date,
  }));

  const { count } = firstPage.messages[0];
  const numRequestsNeeded = Math.ceil(firstPage.messages[0].total / count);
  for (let i = 1; i < numRequestsNeeded; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const { data } = await axios.get<BiorxivResponse>(`https://api.biorxiv.org/publisher/${publisherDoiPrefix}/2000-01-01/${today}/${count * i}`);
    endorsements = endorsements.concat(
      data.collection.map((item) => ({
        articleId: item.biorxiv_doi.trim(),
        date: item.published_date,
      })),
    );
  }

  endorsements.forEach((endorsement) => {
    process.stdout.write(`
      {
        type: 'ArticleEndorsed',
        date: new Date('${endorsement.date}'),
        actorId: new EditorialCommunityId('${editorialCommunityId}'),
        articleId: new Doi('${endorsement.articleId}'),
      },
    `);
  });
})();
