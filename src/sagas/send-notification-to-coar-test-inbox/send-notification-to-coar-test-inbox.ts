import axios from 'axios';
import { v4 as uuidV4 } from 'uuid';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { constructHeadersWithUserAgent } from '../../third-parties/construct-headers-with-user-agent';
import { DependenciesForCommands } from '../../write-side';

const data = {
  '@context': [
    'https://www.w3.org/ns/activitystreams',
    'https://purl.org/coar/notify',
  ],
  actor: {
    id: 'https://sciety.org',
    name: 'Sciety',
    type: 'Organization',
  },
  id: 'urn:uuid:94ecae35-dcfd-4182-8550-22c7164fe23f',
  object: {
    id: 'https://sciety.org/articles/activity/10.1101/2024.04.03.24305276#doi:10.5281/zenodo.13274625',
    type: 'sorg:WebPage',
  },
  context: {
    id: 'https://sciety.org/articles/activity/10.1101/2024.04.03.24305276',
    'ietf:cite-as': 'https://doi.org/10.1101/2024.04.03.24305276',
    type: 'sorg:ScholarlyArticle',
  },
  origin: {
    id: 'https://sciety.org',
    inbox: 'https://sciety.org/inbox/',
    type: 'Service',
  },
  target: {
    id: 'https://coar-notify-inbox.fly.dev',
    inbox: 'https://coar-notify-inbox.fly.dev/inbox',
    type: 'Service',
  },
  type: [
    'Announce',
    'coar-notify:IngestAction',
  ],
};
type Dependencies = DependenciesForViews & DependenciesForCommands;

export const sendNotificationToCoarTestInbox = async (
  dependencies: Dependencies,
): Promise<void> => {
  const iterationId = uuidV4();

  dependencies.logger('debug', 'sendNotificationToCoarTestInbox starting', { iterationId });
  await axios.post('https://coar-notify-inbox.fly.dev/inbox/', data, {
    headers: constructHeadersWithUserAgent({
      'Content-Type': 'application/json',
    }),
  });
  dependencies.logger('debug', 'sendNotificationToCoarTestInbox finished', { iterationId });
};
