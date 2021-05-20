import axios from 'axios';
import parser from 'fast-xml-parser';
import { pipe } from 'fp-ts/function';

const key = process.env.PRELIGHTS_FEED_KEY ?? '';

void (async (): Promise<void> => {
  pipe(
    await axios.get<string>(`https://prelights.biologists.com/feed/sciety/?key=${key}`, {
      headers: {
        'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
      },
    }),
    (response) => response.data,
    (responseBody) => parser.parse(responseBody) as JSON,
    JSON.stringify,
    (str) => process.stdout.write(str),
  );
})();
