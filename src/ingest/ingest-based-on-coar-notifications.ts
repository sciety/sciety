import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './discover-published-evaluations';
import { discoverPciEvaluations as discoverPciEvaluationsViaCoar } from './evaluation-discovery/coar/discover-pci-evaluations';
import { fetchData } from './fetch-data';
import { fetchHead } from './fetch-head';
import { recordEvaluations } from './update-all';

const hardcodedIngestDaysToSatisfyLegacySignature = 1;

const hardcodedEnvironment = {
  enableDebugLogs: true,
};

const group = {
  groupId: '',
  name: '',
};

const configuration = {
  targetApp: '',
  bearerToken: '',
  ingestDebug: true,
};

const enabledGroupIdentifiers: ReadonlyArray<string> = process.env.EXPERIMENT_ENABLED === 'true' ? ['https://zool.peercommunityin.org/coar_notify/'] : [];

const dependencies: Dependencies = {
  fetchData: fetchData(hardcodedEnvironment.enableDebugLogs),
  fetchHead: fetchHead(hardcodedEnvironment.enableDebugLogs),
};

void (async (): Promise<unknown> => pipe(
  enabledGroupIdentifiers,
  TE.traverseArray(
    (
      identifier,
    ) => pipe(
      discoverPciEvaluationsViaCoar(identifier)(hardcodedIngestDaysToSatisfyLegacySignature)(dependencies),
      T.chain(recordEvaluations(group, configuration)),
    ),
  ),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
