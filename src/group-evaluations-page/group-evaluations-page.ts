import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type FetchGroup = (groupId: GroupId) => TO.TaskOption<Group>;

type Ports = {
  getGroup: FetchGroup,
};

const renderErrorPage = (): RenderPageError => ({
  type: DE.unavailable,
  message: toHtmlFragment('We couldn\'t retrieve this information. Please try again.'),
});

export const paramsCodec = t.type({
  id: GroupIdFromString,
});

type Params = t.TypeOf<typeof paramsCodec>;

type GroupEvaluationsPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const groupEvaluationsPage = (ports: Ports): GroupEvaluationsPage => ({ id }) => pipe(
  ports.getGroup(id),
  T.map(E.fromOption(
    () => DE.notFound,
  )),
  TE.bimap(
    renderErrorPage,
    (group) => ({
      title: `Recently evaluated by ${group.name}`,
      content: toHtmlFragment(''),
    }),
  ),
);
