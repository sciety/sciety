import { CompleteHtmlDocument, toCompleteHtmlDocument } from './complete-html-document';
import { ContentWrappedInLayout } from './content-wrapped-in-layout';
import { googleTagManagerNoScript } from './shared-components/analytics';
import { DynamicHeadViewModel, head } from './shared-components/head';

const serverStartupTimestamp = new Date();

const serverRestartObservability = process.env.DISPLAY_LAST_SERVER_STARTUP === 'true' ? `<div>Server restarted at: ${serverStartupTimestamp.toLocaleTimeString()} UTC</div>` : '';

export const wrapInHtmlDocument = (dynamicHeadViewModel: DynamicHeadViewModel) => (contentWrappedInLayout: ContentWrappedInLayout): CompleteHtmlDocument => toCompleteHtmlDocument(`
  <!doctype html>
  <html lang="en" prefix="og: http://ogp.me/ns#">
    ${head(dynamicHeadViewModel)}
  <body>
    ${serverRestartObservability}
    ${googleTagManagerNoScript()}
    ${contentWrappedInLayout}

    <script src="/static/behaviour.js"></script>

  </body>
  </html>
`);
