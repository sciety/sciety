import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Group } from '../types/group';
import * as Gid from '../types/group-id';

// Group creation times:
//
// 10360d97-bf52-4aef-b2fa-2f60d319edd7 new Date('2020-08-12T13:59:31Z'),
// 19b7464a-edbe-42e8-b7cc-04d1eb1f7332 new Date('2020-08-17T13:07:08Z'),
// 316db7d9-88cc-4c26-b386-f067e0f56334 new Date('2020-08-12T13:59:31Z'),
// 32025f28-0506-480e-84a0-b47ef1e92ec5 new Date('2020-08-17T13:56:40Z'),
// 4bbf0c12-629b-4bb8-91d6-974f4df8efb2 new Date('2021-06-29T08:13:16Z'),
// 4eebcec9-a4bb-44e1-bde3-2ae11e65daaa new Date('2020-08-17T13:56:40Z'),
// 50401e46-b764-47b7-8557-6bb35444b7c8 new Date('2021-06-29T08:13:16Z'),
// 5142a5bc-6b18-42b1-9a8d-7342d7d17e94 new Date('2021-05-13T14:33:27Z'),
// 53ed5364-a016-11ea-bb37-0242ac130002 new Date('2020-08-12T13:53:54Z'),
// 62f9b0d0-8d43-4766-a52a-ce02af61bc6a new Date('2021-02-18T10:28:53Z'),
// 74fd66e9-3b90-4b5a-a4ab-5be83db4c5de new Date('2020-08-12T13:59:31Z'),
// 7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84 new Date('2020-08-17T13:56:40Z'),
// 8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65 new Date('2021-05-13T10:39:42Z'),
// b560187e-f2fb-4ff9-a861-a204f3fc0fb0 new Date('2020-08-12T13:59:31Z'),
// b90854bf-795c-42ba-8664-8257b9c68b0c new Date('2021-06-29T08:13:16Z'),
// f97bd177-5cb6-4296-8573-078318755bf2 new Date('2021-01-05T11:43:07Z'),
// b5f31635-d32b-4df9-92a5-0325a1524343 new Date('2022-01-20T09:41:00Z'),

const groups: RNEA.ReadonlyNonEmptyArray<Group> = [
  {
    id: Gid.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
    name: 'Biophysics Colab',
    avatarPath: '/static/groups/biophysics-colab--4bbf0c12-629b-4bb8-91d6-974f4df8efb2.png',
    descriptionPath: 'biophysics-colab--4bbf0c12-629b-4bb8-91d6-974f4df8efb2.md',
    shortDescription: 'Biophysics Colab is a collaboration of biophysicists who are working in partnership with eLife to improve the way in which original research is evaluated. We aim to drive forward the principles of open science by providing an equitable, inclusive, and transparent environment for peer review. Our ambition is to facilitate a publishing ecosystem in which the significance of research is recognised independently of publication venue.',
    homepage: 'https://biophysics.sciencecolab.org',
    slug: 'biophysics-colab',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('50401e46-b764-47b7-8557-6bb35444b7c8'),
    name: 'ASAPbio crowd review',
    avatarPath: '/static/groups/asapbio-crowd-review--50401e46-b764-47b7-8557-6bb35444b7c8.png',
    descriptionPath: 'asapbio-crowd-review--50401e46-b764-47b7-8557-6bb35444b7c8.md',
    shortDescription: 'We promote the productive use of preprints for research dissemination and transparent peer review and feedback on all research outputs.',
    homepage: 'https://asapbio.org/about-us',
    slug: 'asapbio-crowd-review',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a'),
    name: 'NCRC',
    avatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
    descriptionPath: 'ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.md',
    shortDescription: 'The 2019 Novel Coronavirus Research Compendium (NCRC) is a centralized, publicly available resource that rapidly curates and reviews the emerging scientific evidence about SARS-CoV-2 and COVID-19. Our goal is to provide accurate, relevant information for global public health action by clinicians, public health practitioners, and policy makers.',
    homepage: 'https://ncrc.jhsph.edu/',
    slug: 'ncrc',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94'),
    name: 'Rapid Reviews COVID-19',
    avatarPath: '/static/groups/rapid-reviews-covid-19--5142a5bc-6b18-42b1-9a8d-7342d7d17e94.png',
    descriptionPath: 'rapid-reviews-covid-19--5142a5bc-6b18-42b1-9a8d-7342d7d17e94.md',
    shortDescription: 'Rapid Reviews: COVID-19 is an open-access overlay journal that seeks to accelerate peer review of COVID-19-related research and prevent the dissemination of false or misleading scientific news.',
    homepage: 'https://rapidreviewscovid19.mitpress.mit.edu/',
    slug: 'rapid-reviews-covid-19',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    name: 'eLife',
    avatarPath: '/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
    descriptionPath: 'elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.md',
    shortDescription: 'eLife is a selective journal that publishes promising research in all areas of biology and medicine.',
    homepage: 'https://elifesciences.org/',
    slug: 'elife',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65'),
    name: 'ScreenIT',
    avatarPath: '/static/groups/screenit--8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.png',
    descriptionPath: 'screenit--8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.md',
    shortDescription: 'The Automated Screening Working Groups is a group of software engineers and biologists passionate about improving scientific manuscripts on a large scale. Our members have created tools that check for common problems in scientific manuscripts, including information needed to improve transparency and reproducibility. We have combined our tools into a single pipeline, called ScreenIT. We\'re currently using our tools to screen COVID preprints.',
    homepage: 'https://sciscore.com/',
    slug: 'screenit',
    isAutomated: true,
  },
  {
    id: Gid.fromValidatedString('f97bd177-5cb6-4296-8573-078318755bf2'),
    name: 'preLights',
    avatarPath: '/static/groups/prelights--f97bd177-5cb6-4296-8573-078318755bf2.jpg',
    descriptionPath: 'prelights--f97bd177-5cb6-4296-8573-078318755bf2.md',
    shortDescription: 'preLights is a community initiative supported by The Company of Biologists.',
    homepage: 'https://prelights.biologists.com/',
    slug: 'prelights',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7'),
    name: 'PREreview',
    avatarPath: '/static/groups/prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.jpg',
    descriptionPath: 'prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.md',
    shortDescription: 'PREreview\'s mission is to bring more diversity to scholarly peer review by supporting and empowering community of researchers, particularly those at early stages of their career (ECRs) to review preprints.',
    homepage: 'https://prereview.org/',
    slug: 'prereview',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('53ed5364-a016-11ea-bb37-0242ac130002'),
    name: 'PeerJ',
    avatarPath: '/static/groups/peerj--53ed5364-a016-11ea-bb37-0242ac130002.jpg',
    descriptionPath: 'peerj--53ed5364-a016-11ea-bb37-0242ac130002.md',
    shortDescription: 'PeerJ is an open access publisher of 7 peer-reviewed journals, and an editorial community of over 2000 Academic Editors and Advisors, and tens of thousands of authors and reviewers.',
    homepage: 'https://peerj.com/',
    slug: 'peerj',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334'),
    name: 'Review Commons',
    avatarPath: '/static/groups/review-commons--316db7d9-88cc-4c26-b386-f067e0f56334.jpg',
    descriptionPath: 'review-commons--316db7d9-88cc-4c26-b386-f067e0f56334.md',
    shortDescription: 'Review Commons is a platform for high-quality journal-independent peer-review in the life sciences.',
    homepage: 'https://www.reviewcommons.org/',
    slug: 'review-commons',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    name: 'Peer Community In Zoology',
    avatarPath: '/static/groups/pci-zoology--74fd66e9-3b90-4b5a-a4ab-5be83db4c5de.jpg',
    descriptionPath: 'pci-zoology--74fd66e9-3b90-4b5a-a4ab-5be83db4c5de.md',
    shortDescription: 'Free and transparent preprint peer-review and recommendation by and for researchers in Zoology.',
    homepage: 'https://zool.peercommunityin.org/',
    slug: 'pci-zoology',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('19b7464a-edbe-42e8-b7cc-04d1eb1f7332'),
    name: 'Peer Community in Evolutionary Biology',
    avatarPath: '/static/groups/pci-evolutionary-biology--19b7464a-edbe-42e8-b7cc-04d1eb1f7332.jpg',
    descriptionPath: 'pci-evolutionary-biology--19b7464a-edbe-42e8-b7cc-04d1eb1f7332.md',
    shortDescription: 'Free and transparent preprint peer-review and recommendation by and for researchers in Evolutionary Biology.',
    homepage: 'https://evolbiol.peercommunityin.org/',
    slug: 'pci-evolutionary-biology',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('32025f28-0506-480e-84a0-b47ef1e92ec5'),
    name: 'Peer Community in Ecology',
    avatarPath: '/static/groups/pci-ecology--32025f28-0506-480e-84a0-b47ef1e92ec5.jpg',
    descriptionPath: 'pci-ecology--32025f28-0506-480e-84a0-b47ef1e92ec5.md',
    shortDescription: 'Free and transparent preprint peer-review and recommendation by and for researchers in Ecology.',
    homepage: 'https://ecology.peercommunityin.org/',
    slug: 'pci-ecology',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    name: 'Peer Community in Animal Science',
    avatarPath: '/static/groups/pci-animal-science--4eebcec9-a4bb-44e1-bde3-2ae11e65daaa.png',
    descriptionPath: 'pci-animal-science--4eebcec9-a4bb-44e1-bde3-2ae11e65daaa.md',
    shortDescription: 'Free and transparent preprint peer-review and recommendation by and for researchers in Animal Science.',
    homepage: 'https://animsci.peercommunityin.org/',
    slug: 'pci-animal-science',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('b90854bf-795c-42ba-8664-8257b9c68b0c'),
    name: 'Peer Community in Archaeology',
    avatarPath: '/static/groups/pci-archaeology--b90854bf-795c-42ba-8664-8257b9c68b0c.jpg',
    descriptionPath: 'pci-archaeology--b90854bf-795c-42ba-8664-8257b9c68b0c.md',
    shortDescription: 'Free and transparent preprint peer-review and recommendation by and for researchers in Archaeology.',
    homepage: 'https://archaeo.peercommunityin.org/',
    slug: 'pci-archaeology',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84'),
    name: 'Peer Community in Paleontology',
    avatarPath: '/static/groups/pci-paleontology--7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84.jpg',
    descriptionPath: 'pci-paleontology--7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84.md',
    shortDescription: 'Free and transparent preprint peer-review and recommendation by and for researchers in Paleontology.',
    homepage: 'https://paleo.peercommunityin.org/',
    slug: 'pci-paleontology',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('af792cd3-1600-465c-89e5-250c48f793aa'),
    name: 'Peer Community in Neuroscience',
    avatarPath: '/static/groups/pci-neuroscience--af792cd3-1600-465c-89e5-250c48f793aa.png',
    descriptionPath: 'pci-neuroscience--af792cd3-1600-465c-89e5-250c48f793aa.md',
    shortDescription: 'Free and transparent preprint peer-review and recommendation by and for researchers in Neuroscience.',
    homepage: 'https://neuro.peercommunityin.org/',
    slug: 'pci-neuroscience',
    isAutomated: false,
  },
  {
    id: Gid.fromValidatedString('b5f31635-d32b-4df9-92a5-0325a1524343'),
    name: 'PeerRef',
    avatarPath: '/static/groups/peerref--b5f31635-d32b-4df9-92a5-0325a1524343.png',
    descriptionPath: 'peerref--b5f31635-d32b-4df9-92a5-0325a1524343.md',
    shortDescription: 'PeerRef organizes journal-independent open peer review for all research.',
    homepage: 'https://www.peerref.com/',
    slug: 'peerref',
    isAutomated: false,
  },
];

let downplayedPotentialGroups: ReadonlyArray<Group> = [];

if (process.env.EXPERIMENT_ENABLED === 'true') {
  downplayedPotentialGroups = [
  ];
}

export const bootstrapGroups = RNEA.concat(groups, downplayedPotentialGroups);
