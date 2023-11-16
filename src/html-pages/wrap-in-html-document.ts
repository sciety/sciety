import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserDetails } from '../types/user-details';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { DynamicHeadViewModel, head } from '../shared-components/head';
import { ContentWrappedInLayout } from './content-wrapped-in-layout';
import { CompleteHtmlDocument, toCompleteHtmlDocument } from './complete-html-document';

export const wrapInHtmlDocument = (user: O.Option<UserDetails>, dynamicHeadViewModel: DynamicHeadViewModel) => (contentWrappedInLayout: ContentWrappedInLayout): CompleteHtmlDocument => toCompleteHtmlDocument(`
  <!doctype html>
  <html lang="en" prefix="og: http://ogp.me/ns#">
    ${head(pipe(user, O.map((u) => u.id)), dynamicHeadViewModel)}
  <body>
    ${googleTagManagerNoScript()}
    ${contentWrappedInLayout}

  </body>
  </html>
`);
