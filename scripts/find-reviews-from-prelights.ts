import axios from 'axios';
import parser from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';

const key = process.env.PRELIGHTS_FEED_KEY ?? '';

const prelightsFeedCodec = t.type({
  rss: t.type({
    channel: t.type({
      item: t.array(t.type({
        pubDate: tt.DateFromISOString,
        guid: t.string,
      })),
    }),
  }),
});

void (async (): Promise<void> => {
  pipe(
    await axios.get<string>(`https://prelights.biologists.com/feed/sciety/?key=${key}&hours=48`, {
      headers: {
        'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
      },
    }),
    (response) => response.data,
    (responseBody) => parser.parse(responseBody) as JSON,
    prelightsFeedCodec.decode,
    E.bimap(
      (errors) => process.stderr.write(PR.failure(errors).join('\n')),
      (feed) => pipe(
        feed.rss.channel.item,
        RA.map(flow(
          (item) => ({
            date: item.pubDate.toISOString(),
            evaluationLocator: `prelights:${item.guid.replace('&#038;', '&')}`,
          }),
          ({ date, evaluationLocator }) => process.stdout.write(`${date},${evaluationLocator}\n`),
        )),
      ),
    ),
    E.fold(constant(1), constant(0)),
    (exitStatus) => process.exit(exitStatus),
  );
})();
