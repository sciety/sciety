import axios from 'axios';
import { JsonCompatible } from '../src/types/json';

const elifeId = 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0';

type BiorxivResponse = JsonCompatible<{
  collection: Array<{
    biorxiv_doi: string,
  }>
}>;

void (async (): Promise<void> => {
  const today = new Date().toISOString().split('T')[0];

  const { data } = await axios.get<BiorxivResponse>(`https://api.biorxiv.org/publisher/10.7554/2000-01-01/${today}/0`);

  const endorsements = data.collection.map((item) => ({
    article: item.biorxiv_doi,
    editorialCommunity: elifeId,
  }));

  process.stdout.write(JSON.stringify(endorsements, undefined, 2));
})();
