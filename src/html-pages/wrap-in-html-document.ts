import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserDetails } from '../types/user-details';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { HtmlPage } from './html-page';
import { googleTagManagerNoScript } from '../shared-components/analytics';
import { head } from '../shared-components/head';

export const wrapInHtmlDocument = (user: O.Option<UserDetails>, page: HtmlPage) => (styledContent: HtmlFragment): HtmlFragment => toHtmlFragment(`
  <!doctype html>
  <html lang="en" prefix="og: http://ogp.me/ns#">
    ${head(pipe(user, O.map((u) => u.id)), page)}
  <body>
    ${googleTagManagerNoScript()}
    ${styledContent}

    <script src="/static/behaviour.js"></script>

  </body>
  </html>
`);
