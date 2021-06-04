import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchPrelightsHighlight } from '../../src/infrastructure/fetch-prelights-highlight';
import { arbitraryString, arbitraryUri } from '../helpers';

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

describe('fetch-prelight-highlight', () => {
  it('given an arbitrary URL the result contains the same URL', async () => {
    const guid = new URL(arbitraryUri());
    const getHtml = () => TE.right(makeDoc([arbitraryString()]));
    const evaluationUrl = await pipe(
      fetchPrelightsHighlight(getHtml)(guid.toString()),
      TE.map((evaluation) => evaluation.url.toString()),
    )();

    expect(evaluationUrl).toStrictEqual(E.right(guid.toString()));
  });

  it('returns the summary of the prelight', async () => {
    const guid = new URL(arbitraryUri());
    const ogDescription = arbitraryString();
    const getHtml = () => TE.right(makeDoc(['', '', ogDescription]));
    const fullText = await pipe(
      fetchPrelightsHighlight(getHtml)(guid.toString()),
      TE.map((evaluation) => evaluation.fullText.toString()),
    )();

    expect(fullText).toStrictEqual(E.right(ogDescription));
  });
});
