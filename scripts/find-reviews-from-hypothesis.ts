import axios from 'axios';
import { JsonCompatible } from '../src/types/json';

const publisherGroupId = 'NEGQVabn';

type HypothesisResponse = JsonCompatible<{
  rows: Array<{
    created: string,
    uri: string,
  }>
}>;

void (async (): Promise<void> => {
  const { data } = await axios.get<HypothesisResponse>(`https://api.hypothes.is/api/search?group=${publisherGroupId}`);

  process.stdout.write(JSON.stringify(data, undefined, 2));
})();
