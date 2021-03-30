import axios from 'axios';
import { Json } from 'io-ts-types';

void (async (): Promise<void> => {
  const { data } = await axios.get<Json>(
    'https://www.prereview.org/api/v2/preprints?limit=10',
    { headers: { Accept: 'application/json' } },
  );

  process.stdout.write(JSON.stringify(data, undefined, 2));
})();
