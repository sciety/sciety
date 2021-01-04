import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { Remarkable } from 'remarkable';
import renderPage, { RenderPage } from './render-page';

type FetchStaticFile = (filename: string) => T.Task<string>;

interface Ports {
  fetchStaticFile: FetchStaticFile;
}

type CommunityOutreachManagerPage = ReturnType<RenderPage>;

export default (ports: Ports): CommunityOutreachManagerPage => pipe(
  'jobs/community-outreach-manager.md',
  renderPage(
    flow(
      ports.fetchStaticFile,
      T.map((md: string) => new Remarkable({ html: true }).render(md)),
    ),
  ),
);
