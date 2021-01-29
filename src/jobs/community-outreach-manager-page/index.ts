import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { renderPage } from './render-page';
import { HtmlFragment } from '../../types/html-fragment';

type FetchStaticFile = (filename: string) => T.Task<string>;

type Ports = {
  fetchStaticFile: FetchStaticFile,
};

type CommunityOutreachManagerPage = () => T.Task<{
  title: string,
  content: HtmlFragment,
}>;

export default (ports: Ports): CommunityOutreachManagerPage => () => pipe(
  'jobs/community-outreach-manager.md',
  ports.fetchStaticFile,
  T.map(renderPage),
  T.map((html) => ({
    title: 'Community and Outreach Manager',
    content: html,
  })),
);
