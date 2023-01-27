import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { about, Ports as AboutPorts } from './about/about';
import { followers, Ports as FollowersPorts } from './followers/followers';
import { lists } from './lists/lists';
import * as DE from '../../types/data-error';
import { HtmlFragment } from '../../types/html-fragment';
import { ContentModel, TabIndex } from './content-model';

export type Ports = AboutPorts & FollowersPorts;

const contentRenderers = (
  ports: Ports,
) => (
  contentModel: ContentModel,
): Record<TabIndex, TE.TaskEither<DE.DataError, HtmlFragment>> => ({
  0: lists(contentModel),
  1: about(ports)(contentModel),
  2: followers(ports)(contentModel),
});

type ContentComponent = (ports: Ports) => (contentModel: ContentModel) => TE.TaskEither<DE.DataError, HtmlFragment>;

export const contentComponent: ContentComponent = (ports) => (contentModel) => pipe(
  contentRenderers(ports)(contentModel)[contentModel.activeTabIndex],
);
