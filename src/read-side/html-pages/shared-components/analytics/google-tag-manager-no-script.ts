import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const renderTagManagerNoScript = (tagManagerId: string) => `
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${tagManagerId}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
`;

export const googleTagManagerNoScript = (): HtmlFragment => pipe(
  process.env.GOOGLE_TAG_MANAGER_ID,
  O.fromNullable,
  O.match(
    constant(''),
    renderTagManagerNoScript,
  ),
  toHtmlFragment,
);
