import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserDetails } from '../types/user-details';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { DynamicHeadViewModel, head } from '../shared-components/head';

export const wrapInHtmlDocument = (user: O.Option<UserDetails>, dynamicHeadViewModel: DynamicHeadViewModel) => (styledContent: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <!doctype html>
  <html lang="en" prefix="og: http://ogp.me/ns#">
    ${head(pipe(user, O.map((u) => u.id)), dynamicHeadViewModel)}
  <body>
    ${googleTagManagerNoScript()}
    ${styledContent}

    <script src="/static/behaviour.js"></script>

  </body>
  </html>
`);
