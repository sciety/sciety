import * as TE from 'fp-ts/TaskEither';
import { DiscoverPublishedEvaluations } from './discover-published-evaluations';
import { discoverEvaluationsForAccessMicrobiology } from './evaluation-discovery/discover-evaluations-for-access-microbiology';
import { discoverEvaluationsFromCrossrefViaBiorxiv } from './evaluation-discovery/discover-evaluations-from-crossref-via-biorxiv';
import { discoverEvaluationsFromHypothesisGroup } from './evaluation-discovery/discover-evaluations-from-hypothesis-group';
import { discoverEvaluationsFromHypothesisUser } from './evaluation-discovery/discover-evaluations-from-hypothesis-user';
import { discoverPciEvaluations } from './evaluation-discovery/discover-pci-evaluations';
import { discoverPrereviewEvaluations } from './evaluation-discovery/discover-prereview-evaluations';
import { discoverRapidReviewsEvaluations } from './evaluation-discovery/discover-rapid-reviews-evaluations';
import { Configuration } from './generate-configuration-from-environment';
import { fetchPrelightsEvaluations } from './third-parties/prelights/fetch-prelights-evaluations';
import { EvaluationDiscoveryProcess } from './update-all';

const stubbedDiscoverPublishEvaluation: DiscoverPublishedEvaluations = () => () => TE.right({
  understood: [],
  skipped: [],
});

// addArticleToEvaluatedArticlesList policy needs to be updated BEFORE adding a new group to this configuration
export const evaluationDiscoveryProcesses = (environment: Configuration): Array<EvaluationDiscoveryProcess> => [
  {
    groupId: 'bc1f956b-12e8-4f5c-aadc-70f91347bd18',
    name: 'Arcadia Science',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisGroup('ApM1XL6A', new Date('2023-04-15')),
  },
  {
    groupId: 'bc1f956b-12e8-4f5c-aadc-70f91347bd18',
    name: 'Arcadia Science (old private group)',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisGroup('VzenYeD8'),
  },
  {
    groupId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
    name: 'eLife',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisGroup('q5X6RWJ6'),
  },
  {
    groupId: '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de',
    name: 'PCI Zoology',
    discoverPublishedEvaluations: discoverPciEvaluations('https://zool.peercommunityin.org/rss/rss4elife'),
  },
  {
    groupId: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332',
    name: 'PCI Evolutionary Biology',
    discoverPublishedEvaluations: discoverPciEvaluations('https://evolbiol.peercommunityin.org/rss/rss4elife'),
  },
  {
    groupId: '32025f28-0506-480e-84a0-b47ef1e92ec5',
    name: 'PCI Ecology',
    discoverPublishedEvaluations: discoverPciEvaluations('https://ecology.peercommunityin.org/rss/rss4elife'),
  },
  {
    groupId: '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa',
    name: 'PCI Animal Science',
    discoverPublishedEvaluations: discoverPciEvaluations('https://animsci.peercommunityin.org/rss/rss4elife'),
  },
  {
    groupId: 'b90854bf-795c-42ba-8664-8257b9c68b0c',
    name: 'PCI Archaeology',
    discoverPublishedEvaluations: discoverPciEvaluations('https://archaeo.peercommunityin.org/rss/rss4elife'),
  },
  {
    groupId: '7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84',
    name: 'PCI Paleontology',
    discoverPublishedEvaluations: discoverPciEvaluations('https://paleo.peercommunityin.org/rss/rss4elife'),
  },
  {
    groupId: 'af792cd3-1600-465c-89e5-250c48f793aa',
    name: 'PCI Neuroscience',
    discoverPublishedEvaluations: discoverPciEvaluations('https://neuro.peercommunityin.org/rss/rss4elife'),
  },
  {
    groupId: '53ed5364-a016-11ea-bb37-0242ac130002',
    name: 'PeerJ',
    discoverPublishedEvaluations: discoverEvaluationsFromCrossrefViaBiorxiv(environment.crossrefApiBearerToken, '10.7717', '10.7287'),
  },
  {
    groupId: 'f97bd177-5cb6-4296-8573-078318755bf2',
    name: 'preLights',
    discoverPublishedEvaluations: fetchPrelightsEvaluations(environment.prelightsFeedKey),
  },
  {
    groupId: '10360d97-bf52-4aef-b2fa-2f60d319edd7',
    name: 'PREreview',
    discoverPublishedEvaluations: discoverPrereviewEvaluations(environment.preReviewBearerToken),
  },
  {
    groupId: '5142a5bc-6b18-42b1-9a8d-7342d7d17e94',
    name: 'Rapid Reviews COVID-19',
    discoverPublishedEvaluations: discoverRapidReviewsEvaluations(),
  },
  {
    groupId: '316db7d9-88cc-4c26-b386-f067e0f56334',
    name: 'Review Commons',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisGroup('NEGQVabn'),
  },
  {
    groupId: 'f2c9eafa-6e24-4549-819c-09179e642b08',
    name: 'Life Science Editors Foundation',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisUser('lifescienceeditorsfoundation'),
  },
  {
    groupId: '1480d2dd-463f-4834-8e81-d89c8ae2b86f',
    name: 'Life Science Editors',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisUser('lifescienceeditors'),
  },
  {
    groupId: '8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65',
    name: 'ScreenIT',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisUser('sciscore'),
  },
  {
    groupId: '4bbf0c12-629b-4bb8-91d6-974f4df8efb2',
    name: 'Biophysics Colab',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisUser('biophysics_sciencecolab'),
  },
  {
    groupId: '50401e46-b764-47b7-8557-6bb35444b7c8',
    name: 'ASAPbio crowd review',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisUser('ASAPbio_crowd_preprint_review'),
  },
  {
    groupId: 'b5f31635-d32b-4df9-92a5-0325a1524343',
    name: 'PeerRef',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisGroup('LN28Q33j'),
  },
  {
    groupId: 'd6e1a913-76f8-40dc-9074-8eac033e1bc8',
    name: 'GigaScience',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisGroup('x6WjqQay'),
  },
  {
    groupId: 'f7a7aec3-8b1c-4b81-b098-f3f2e4eefe58',
    name: 'GigaByte',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisGroup('z4oRbDWY'),
  },
  {
    groupId: '36fbf532-ed07-4573-87fd-b0e22ee49827',
    name: 'ASAPbio-SciELO Preprint crowd review',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisUser('ASAPbio_SciELO_preprint_review'),
  },
  {
    groupId: '1e6f6b49-2a9b-417e-831b-8cee5af033bd',
    name: 'The Unjournal',
    discoverPublishedEvaluations: discoverEvaluationsFromHypothesisUser('theunjournal'),
  },
  {
    groupId: '4d6a8908-22a9-45c8-bd56-3c7140647709',
    name: 'Access Microbiology',
    discoverPublishedEvaluations: environment.experimentEnabled
      ? discoverEvaluationsForAccessMicrobiology
      : stubbedDiscoverPublishEvaluation,
  },
];
