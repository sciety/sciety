import axios from 'axios';
import { JsonCompatible } from '../src/types/json';

const elifeId = 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0';

type BiorxivResponse = JsonCompatible<{
  messages: Array<{
    cursor: number | string,
    count: number,
    total: number,
  }>,
  collection: Array<{
    biorxiv_doi: string,
  }>
}>;

void (async (): Promise<void> => {
  const today = new Date().toISOString().split('T')[0];

  const { data: firstPage } = await axios.get<BiorxivResponse>(`https://api.biorxiv.org/publisher/10.7554/2000-01-01/${today}/0`);
  let endorsements = firstPage.collection.map((item) => ({
    article: item.biorxiv_doi,
    editorialCommunity: elifeId,
  }));

  const { count } = firstPage.messages[0];
  const numRequestsNeeded = Math.ceil(firstPage.messages[0].total / count);
  for (let i = 1; i < numRequestsNeeded; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const { data } = await axios.get<BiorxivResponse>(`https://api.biorxiv.org/publisher/10.7554/2000-01-01/${today}/${count * i}`);
    endorsements = endorsements.concat(
      data.collection.map((item) => ({
        article: item.biorxiv_doi,
        editorialCommunity: elifeId,
      })),
    );
  }

  process.stdout.write(JSON.stringify(endorsements, undefined, 2));
})();
