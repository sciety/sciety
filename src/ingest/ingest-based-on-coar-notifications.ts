import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './discover-published-evaluations';
import { discoverPciEvaluations as discoverPciEvaluationsViaCoar } from './evaluation-discovery/coar/discover-pci-evaluations';
import { fetchData } from './fetch-data';
import { fetchHead } from './fetch-head';

const processNotifications = () => discoverPciEvaluationsViaCoar('https://zool.peercommunityin.org/coar_notify/');

const dependencies: Dependencies = {
  fetchData: fetchData(true),
  fetchHead: fetchHead(true),
};

void (async (): Promise<unknown> => pipe(
  processNotifications()(1)(dependencies),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
