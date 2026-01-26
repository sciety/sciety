import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './discover-published-evaluations';
import { discoverPciEvaluations } from './evaluation-discovery/coar/discover-pci-evaluations';
import { fetchData } from './fetch-data';
import { fetchHead } from './fetch-head';
import { generateConfigurationFromEnvironment } from './generate-configuration-from-environment';
import { recordEvaluations } from './update-all';

type Group = {
  scietyGroupId: string,
  name: string,
  coarNotifyId: string,
};

const hardcodedIngestDaysToSatisfyLegacySignature = 1;

const hardcodedEnvironment = {
  enableDebugLogs: false,
};

const configuration = generateConfigurationFromEnvironment(process.env);

const enabledGroups: ReadonlyArray<Group> = [
  {
    scietyGroupId: '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de',
    name: 'PCI Zoology',
    coarNotifyId: 'https://zool.peercommunityin.org/coar_notify/',
  },
  {
    scietyGroupId: 'b90854bf-795c-42ba-8664-8257b9c68b0c',
    name: 'PCI Archeology',
    coarNotifyId: 'https://archaeo.peercommunityin.org/coar_notify/',
  },
  {
    scietyGroupId: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332',
    name: 'PCI Evolutionary Biology',
    coarNotifyId: 'https://evolbiol.peercommunityin.org/coar_notify/',
  },
  {
    scietyGroupId: 'af792cd3-1600-465c-89e5-250c48f793aa',
    name: 'PCI Neuroscience',
    coarNotifyId: 'https://neuro.peercommunityin.org/coar_notify/',
  },
];

const dependencies: Dependencies = {
  fetchData: fetchData(hardcodedEnvironment.enableDebugLogs),
  fetchHead: fetchHead(hardcodedEnvironment.enableDebugLogs),
};

void (async (): Promise<unknown> => {
  if (E.isLeft(configuration)) {
    process.exit(1);
  }
  return pipe(
    enabledGroups,
    TE.traverseSeqArray(
      (
        group,
      ) => pipe(
        discoverPciEvaluations(group.coarNotifyId)(hardcodedIngestDaysToSatisfyLegacySignature)(dependencies),
        T.chain(recordEvaluations({ groupId: group.scietyGroupId, name: group.name }, configuration.right)),
      ),
    ),
    TE.match(
      () => 1,
      () => 0,
    ),
    T.map((exitCode) => process.exit(exitCode)),
  )();
})();
