import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { fetchPrelightsHighlight } from '../../../../src/third-parties/fetch-evaluation-digest/prelights/fetch-prelights-highlight';
import * as DE from '../../../../src/types/data-error';
import { dummyLogger } from '../../../dummy-logger';
import { arbitraryString, arbitraryUrl } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

const makeDoc = (descriptions: Array<string>) => `
  <!doctype html>
  <html class="no-js" lang="en">
  <head>
      <meta property="og:url" content="" />
      <meta property="og:title" content="" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:type" content="article" />
      ${descriptions.map((d) => `<meta property="og:description" content="${d}" />`).join('\n')}
  </head>
  <body>
  </body>
  </html>
`;

describe('fetch-prelights-highlight', () => {
  const ogDescription = arbitraryString();

  it.each([
    [['', '', ogDescription]],
    [[ogDescription]],
    [[ogDescription, arbitraryString()]],
  ])('returns the summary of the prelight', async (descriptions) => {
    const guid = arbitraryUrl();
    const queryExternalService = () => () => TE.right(makeDoc(descriptions));
    const fullText = await pipe(
      fetchPrelightsHighlight(queryExternalService, dummyLogger)(guid.toString()),
      TE.map((digest) => digest.toString()),
    )();

    expect(fullText).toStrictEqual(E.right(expect.stringContaining(ogDescription)));
  });

  describe('cant find fullText', () => {
    it('returns unavailable', async () => {
      const guid = arbitraryUrl();
      const queryExternalService = () => () => TE.right(makeDoc([]));
      const fullText = await pipe(
        guid.toString(),
        fetchPrelightsHighlight(queryExternalService, dummyLogger),
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isUnavailable,
        )),
      )();

      expect(fullText).toBe(true);
    });
  });
});
