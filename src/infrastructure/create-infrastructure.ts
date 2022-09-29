import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { CollectedPorts } from './collected-ports';
import { commitEvents, writeEventToDatabase } from './commit-events';
import { fetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { fetchNcrcReview } from './fetch-ncrc-review';
import { fetchRapidReview } from './fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchStaticFile } from './fetch-static-file';
import { fetchZenodoRecord } from './fetch-zenodo-record';
import { fetchData } from './fetchers';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { getEventsFromDatabase } from './get-events-from-database';
import { getHtml } from './get-html';
import { getListsOwnedByFromListsReadModelService } from './get-lists-owned-by-from-lists-read-model-service';
import { localFetchArticleAdapter } from './local-fetch-article-adapter';
import {
  jsonSerializer, Logger, loggerIO, rTracerLogger, streamLogger,
} from './logger';
import { needsToBeAdded } from './needs-to-be-added';
import { addArticleToListCommandHandler } from '../add-article-to-list';
import { bootstrapGroups as groupJoinedEvents } from '../data/bootstrap-groups';
import {
  groupJoined, GroupJoinedEvent, isListCreatedEvent, listCreated, ListCreatedEvent, sort as sortEvents,
} from '../domain-events';
import { RuntimeGeneratedEvent } from '../domain-events/runtime-generated-event';
import { createListCommandHandler } from '../lists';
import { executePolicies } from '../policies/execute-policies';
import { getArticleVersionEventsFromBiorxiv } from '../third-parties/biorxiv';
import { getBiorxivOrMedrxivSubjectArea } from '../third-parties/biorxiv/get-biorxiv-or-medrxiv-subject-area';
import { fetchCrossrefArticle } from '../third-parties/crossref';
import { searchEuropePmc } from '../third-parties/europe-pmc';
import { fetchPrelightsHighlight } from '../third-parties/prelights';
import {
  getTwitterResponse, getTwitterUserDetails, getTwitterUserDetailsBatch, getTwitterUserId,
} from '../third-parties/twitter';
import { fromValidatedString as descriptionPathFromValidatedString } from '../types/description-path';
import { Doi } from '../types/doi';
import * as Gid from '../types/group-id';
import * as LID from '../types/list-id';
import { ListId } from '../types/list-id';
import * as LOID from '../types/list-owner-id';

type Dependencies = {
  prettyLog: boolean,
  logLevel: string, // TODO: Make this a level name
  crossrefApiBearerToken: O.Option<string>,
  twitterApiBearerToken: string,
};

const createLogger = (dependencies: Dependencies) => pipe(
  dependencies.prettyLog,
  jsonSerializer,
  (serializer) => streamLogger(process.stdout, serializer, dependencies.logLevel),
  rTracerLogger,
);

type DatabaseConnectionPoolAndLogger = { pool: Pool, logger: Logger };

const createEventsTable = ({ pool }: DatabaseConnectionPoolAndLogger) => TE.tryCatch(
  async () => pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id uuid,
        type varchar,
        date timestamp,
        payload jsonb,
        PRIMARY KEY (id)
      );
    `),
  identity,
);

const createGetJson = (logger: Logger) => async (uri: string) => {
  const response = await fetchData(logger)<Json>(uri);
  return response.data;
};

const createGetJsonWithTimeout = (logger: Logger, timeout: number) => async (uri: string) => {
  const response = await fetchData(logger, timeout)<Json>(uri);
  return response.data;
};

const addSpecifiedEventsFromCodeIntoDatabaseAndAppend = (
  pool: Pool,
) => (
  events: ReadonlyArray<RuntimeGeneratedEvent>,
) => pipe(
  [],
  TE.right,
  TE.map(RA.filter(isListCreatedEvent)),
  TE.map(RA.filter(needsToBeAdded(events))),
  TE.chainFirstTaskK(T.traverseArray(writeEventToDatabase(pool))),
  TE.map((eventsToAdd) => [
    ...events,
    ...eventsToAdd,
  ]),
);

export const eventsOnlyForStaging = (): ReadonlyArray<GroupJoinedEvent | ListCreatedEvent> => ((process.env.EXPERIMENT_ENABLED === 'true')
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

export const createInfrastructure = (dependencies: Dependencies): TE.TaskEither<unknown, CollectedPorts> => pipe(
  {
    pool: new Pool(),
    logger: createLogger(dependencies),
  },
  TE.right,
  TE.chainFirst(createEventsTable),
  TE.chainW(({ pool, logger }) => pipe(
    getEventsFromDatabase(pool, logger),
    TE.chainW(addSpecifiedEventsFromCodeIntoDatabaseAndAppend(pool)),
    TE.map((eventsFromDatabase) => pipe(
      [
        ...eventsFromDatabase,
        ...groupJoinedEvents,
        ...eventsOnlyForStaging(),
      ],
      sortEvents,
    )),
    TE.map((events) => (
      {
        events,
        pool,
        logger,
        getJson: createGetJson(logger),
      }
    )),
  )),
  TE.map((lowLevelAdapters) => ({
    ...lowLevelAdapters,
    getBiorxivOrMedrxivSubjectArea: getBiorxivOrMedrxivSubjectArea({
      getJson: createGetJsonWithTimeout(lowLevelAdapters.logger, 10000),
      logger: lowLevelAdapters.logger,
    }),
  })),
  TE.chain((partialAdapters) => TE.tryCatch(
    async () => {
      const {
        events, logger, pool, getJson,
      } = partialAdapters;

      const getAllEvents = T.of(events);
      const fetchFile = fetchStaticFile(loggerIO(logger));
      const fetchers = {
        doi: fetchZenodoRecord(getJson, logger),
        hypothesis: fetchHypothesisAnnotation(getJson, logger),
        ncrc: fetchNcrcReview(logger),
        prelights: fetchPrelightsHighlight(getHtml(logger)),
        rapidreviews: fetchRapidReview(logger, getHtml(logger)),
      };

      type AddArticleToListCommandPayload = {
        articleId: Doi, listId: ListId,
      };

      const commitEventsWithoutListeners = commitEvents({ inMemoryEvents: events, pool, logger });

      type ExecuteAddArticleToListCommandInProcess = (
        payload: AddArticleToListCommandPayload
      ) => TE.TaskEither<string, void>;

      const executeAddArticleToListCommandInProcess: ExecuteAddArticleToListCommandInProcess = (
        payload,
      ) => pipe(
        {
          articleId: payload.articleId.value,
          listId: payload.listId.toString(),
        },
        addArticleToListCommandHandler({
          getAllEvents,
          commitEvents: commitEventsWithoutListeners,
          ...partialAdapters,
        }),
        TE.map(() => undefined),
      );

      let fetchArticle;
      if (process.env.FETCH_ARTICLE_ADAPTER === 'local') {
        fetchArticle = localFetchArticleAdapter;
      } else {
        fetchArticle = fetchCrossrefArticle(
          getCachedAxiosRequest(logger),
          logger,
          dependencies.crossrefApiBearerToken,
        );
      }

      const collectedAdapters = {
        fetchArticle,
        fetchReview: fetchReview(fetchers),
        fetchStaticFile: fetchFile,
        searchEuropePmc: searchEuropePmc({ getJson, logger }),
        getAllEvents,
        getListsOwnedBy: getListsOwnedByFromListsReadModelService(logger, `http://${process.env.LISTS_READ_MODEL_HOST ?? 'lists'}`),
        getUserDetails: getTwitterUserDetails(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        getUserDetailsBatch: getTwitterUserDetailsBatch(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        getUserId: getTwitterUserId(
          getTwitterResponse(dependencies.twitterApiBearerToken, logger),
          logger,
        ),
        findVersionsForArticleDoi: getArticleVersionEventsFromBiorxiv({
          getJson: getCachedAxiosRequest(logger),
          logger,
        }),
        addArticleToList: executeAddArticleToListCommandInProcess,
        createList: createListCommandHandler({ commitEvents: commitEventsWithoutListeners }),
        ...partialAdapters,
      };

      const policiesAdapters = {
        commitEvents: commitEventsWithoutListeners,
        getAllEvents: collectedAdapters.getAllEvents,
        logger: collectedAdapters.logger,
        getBiorxivOrMedrxivSubjectArea: collectedAdapters.getBiorxivOrMedrxivSubjectArea,
        getListsOwnedBy: collectedAdapters.getListsOwnedBy,
        getUserDetails: collectedAdapters.getUserDetails,
        addArticleToList: collectedAdapters.addArticleToList,
        createList: collectedAdapters.createList,
      };

      return {
        ...collectedAdapters,
        commitEvents: (eventsToCommit: ReadonlyArray<RuntimeGeneratedEvent>) => pipe(
          eventsToCommit,
          commitEventsWithoutListeners,
          T.chainFirst(() => pipe(
            eventsToCommit,
            T.traverseArray(executePolicies(policiesAdapters)),
          )),
        ),
      };
    },
    identity,
  )),
);
