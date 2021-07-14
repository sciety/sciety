import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { renderErrorPage, renderPage } from './render-page';
import { recentActivity, Ports as RecentActivityPorts } from '../group-page/recent-activity';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type FetchGroup = (groupId: GroupId) => TO.TaskOption<Group>;

type Ports = RecentActivityPorts & {
  getGroup: FetchGroup,
};

export const paramsCodec = t.type({
  id: GroupIdFromString,
});

type Params = t.TypeOf<typeof paramsCodec>;

type GroupEvaluationsPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

const notFoundResponse = () => ({
  type: DE.notFound,
  message: toHtmlFragment('No such group. Please check and try again.'),
} as const);

export const groupEvaluationsPage = (ports: Ports): GroupEvaluationsPage => ({ id }) => pipe(
  ports.getGroup(id),
  T.map(E.fromOption(notFoundResponse)),
  TE.chain((group) => pipe(
    {
      header: pipe(
        group.name,
        toHtmlFragment,
        TE.right,
      ),
      recentActivity: recentActivity(ports)(group),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
