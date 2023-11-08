import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserDetails } from '../types/user-details';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { DynamicHeadViewModel, head } from '../shared-components/head';
import { ContentWrappedInLayout } from './content-wrapped-in-layout';

export const wrapInHtmlDocument = (user: O.Option<UserDetails>, dynamicHeadViewModel: DynamicHeadViewModel) => (contentWrappedInLayout: ContentWrappedInLayout): HtmlFragment => toHtmlFragment(`
  <!doctype html>
  <html lang="en" prefix="og: http://ogp.me/ns#">
    ${head(pipe(user, O.map((u) => u.id)), dynamicHeadViewModel)}
  <body>
    ${googleTagManagerNoScript()}
    ${contentWrappedInLayout}

    <script src="/static/behaviour.js"></script>

  </body>
  </html>
`);
