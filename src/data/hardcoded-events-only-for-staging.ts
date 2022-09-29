import {
  groupJoined, GroupJoinedEvent, listCreated, ListCreatedEvent,
} from '../domain-events';
import { fromValidatedString as descriptionPathFromValidatedString } from '../types/description-path';
import * as Gid from '../types/group-id';
import * as LID from '../types/list-id';
import * as LOID from '../types/list-owner-id';

export const hardcodedEventsOnlyForStaging = (): ReadonlyArray<GroupJoinedEvent | ListCreatedEvent> => ((process.env.EXPERIMENT_ENABLED === 'true')
  ? [
    groupJoined({
      id: Gid.fromValidatedString('36fbf532-ed07-4573-87fd-b0e22ee49827'),
      name: 'ASAPbio-SciELO Preprint crowd review',
      avatarPath: '/static/groups/asapbio-scielo-preprint-crowd-review.png',
      descriptionPath: descriptionPathFromValidatedString('asapbio-scielo-preprint-crowd-review.md'),
      shortDescription: 'O ASAPbio promovemos o uso produtivo de preprints para divulgação da pesquisa e avaliação por pares transparente e feedback sobre todos os resultados da pesquisa. SciELO Preprints é um servidor de preprints multilingue e multi-disciplinar gerenciado pelo Programa SciELO.',
      homepage: 'https://asapbio.org/crowd-preprint-review',
      slug: 'asapbio-scielo-preprint-crowd-review',
    }, new Date('2022-09-29T10:23:14Z')),
    listCreated(
      LID.fromValidatedString('f524583f-ab45-4f07-8b44-6b0767b2d79a'),
      'Evaluated articles',
      'Articles that have been evaluated by ASAPbio-SciELO Preprint crowd review.',
      LOID.fromGroupId(Gid.fromValidatedString('36fbf532-ed07-4573-87fd-b0e22ee49827')),
      new Date('2022-09-29T10:28:14Z'),
    ),
  ] : []
);
