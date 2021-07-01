import { fetchPciEvaluations } from './fetch-pci-evaluations';
import { Group, updateAll } from './update-all';

const groups: Array<Group> = [
  {
    id: '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de',
    name: 'PCI Zoology',
    fetchFeed: fetchPciEvaluations('https://zool.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332',
    name: 'PCI Evolutionary Biology',
    fetchFeed: fetchPciEvaluations('https://evolbiol.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: '32025f28-0506-480e-84a0-b47ef1e92ec5',
    name: 'PCI Ecology',
    fetchFeed: fetchPciEvaluations('https://ecology.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa',
    name: 'PCI Animal Science',
    fetchFeed: fetchPciEvaluations('https://animsci.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: 'b90854bf-795c-42ba-8664-8257b9c68b0c',
    name: 'PCI Archaeology',
    fetchFeed: fetchPciEvaluations('https://archaeo.peercommunityin.org/rss/rss4elife'),
  },
  {
    id: '7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84',
    name: 'PCI Paleontology',
    fetchFeed: fetchPciEvaluations('https://paleo.peercommunityin.org/rss/rss4elife'),
  },
];

void (async (): Promise<void> => updateAll(groups))();
