import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Group } from '../types/group';
import * as Gid from '../types/group-id';

const groups: RNEA.ReadonlyNonEmptyArray<Group> = [
  {
    id: Gid.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a'),
    name: 'NCRC',
    avatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
    descriptionPath: 'ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.md',
    shortDescription: 'The 2019 Novel Coronavirus Research Compendium (NCRC) is a centralized, publicly available resource that rapidly curates and reviews the emerging scientific evidence about SARS-CoV-2 and COVID-19. Our goal is to provide accurate, relevant information for global public health action by clinicians, public health practitioners, and policy makers.',
  },
  {
    id: Gid.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94'),
    name: 'Rapid Reviews COVID-19',
    avatarPath: '/static/groups/rapid-reviews-covid-19--5142a5bc-6b18-42b1-9a8d-7342d7d17e94.png',
    descriptionPath: 'rapid-reviews-covid-19--5142a5bc-6b18-42b1-9a8d-7342d7d17e94.md',
    shortDescription: 'Rapid Reviews: COVID-19 is an open-access overlay journal that seeks to accelerate peer review of COVID-19-related research and prevent the dissemination of false or misleading scientific news.',
  },
  {
    id: Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    name: 'eLife',
    avatarPath: '/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
    descriptionPath: 'elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.md',
    shortDescription: 'eLife is a selective journal that publishes promising research in all areas of biology and medicine.',
  },
  {
    id: Gid.fromValidatedString('8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65'),
    name: 'ScreenIT',
    avatarPath: '/static/groups/screenit--8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.png',
    descriptionPath: 'screenit--8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.md',
    shortDescription: 'The Automated Screening Working Groups is a group of software engineers and biologists passionate about improving scientific manuscripts on a large scale. Our members have created tools that check for common problems in scientific manuscripts, including information needed to improve transparency and reproducibility. We have combined our tools into a single pipeline, called ScreenIT. We\'re currently using our tools to screen COVID preprints.',
  },
  {
    id: Gid.fromValidatedString('f97bd177-5cb6-4296-8573-078318755bf2'),
    name: 'preLights',
    avatarPath: '/static/groups/prelights--f97bd177-5cb6-4296-8573-078318755bf2.jpg',
    descriptionPath: 'prelights--f97bd177-5cb6-4296-8573-078318755bf2.md',
    shortDescription: 'preLights is a community initiative supported by The Company of Biologists.',
  },
  {
    id: Gid.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7'),
    name: 'PREreview',
    avatarPath: '/static/groups/prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.jpg',
    descriptionPath: 'prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.md',
    shortDescription: 'PREreview\'s mission is to bring more diversity to scholarly peer review by supporting and empowering community of researchers, particularly those at early stages of their career (ECRs) to review preprints.',
  },
  {
    id: Gid.fromValidatedString('53ed5364-a016-11ea-bb37-0242ac130002'),
    name: 'PeerJ',
    avatarPath: '/static/groups/peerj--53ed5364-a016-11ea-bb37-0242ac130002.jpg',
    descriptionPath: 'peerj--53ed5364-a016-11ea-bb37-0242ac130002.md',
    shortDescription: 'PeerJ is an open access publisher of 7 peer-reviewed journals, and an editorial community of over 2000 Academic Editors and Advisors, and tens of thousands of authors and reviewers.',
  },
  {
    id: Gid.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334'),
    name: 'Review Commons',
    avatarPath: '/static/groups/review-commons--316db7d9-88cc-4c26-b386-f067e0f56334.jpg',
    descriptionPath: 'review-commons--316db7d9-88cc-4c26-b386-f067e0f56334.md',
    shortDescription: 'Review Commons is a platform for high-quality journal-independent peer-review in the life sciences.',
  },
  {
    id: Gid.fromValidatedString('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    name: 'Peer Community In Zoology',
    avatarPath: '/static/groups/pci-zoology--74fd66e9-3b90-4b5a-a4ab-5be83db4c5de.jpg',
    descriptionPath: 'pci-zoology--74fd66e9-3b90-4b5a-a4ab-5be83db4c5de.md',
    shortDescription: 'Peer Community in Zoology (PCI Zoology) has been launched in July 2020, replacing and broadening the scope of PCI Entomology. It is a community of recommenders playing the role of editors who recommend unpublished articles based on peer-reviews to make them complete, reliable and citable articles, without the need for publication in ‘traditional’ journals. Evaluation and recommendation by PCI Zoology are free of charge. When a recommender decides to recommend an article, he/she writes a recommendation text that is published along with all the editorial correspondence (reviews, recommender\'s decisions, authors’ replies) by PCI Zoology. The article itself is not published by PCI Zoology; it remains in the preprint server where it has been posted by the authors. PCI Zoology recommenders can also recommend, but to a lesser extent, postprints.',
  },
  {
    id: Gid.fromValidatedString('19b7464a-edbe-42e8-b7cc-04d1eb1f7332'),
    name: 'Peer Community in Evolutionary Biology',
    avatarPath: '/static/groups/pci-evolutionary-biology--19b7464a-edbe-42e8-b7cc-04d1eb1f7332.jpg',
    descriptionPath: 'pci-evolutionary-biology--19b7464a-edbe-42e8-b7cc-04d1eb1f7332.md',
    shortDescription: 'Peer Community in Evolutionary Biology (PCI Evol Biol) has been launched in January 2017. It is a community of recommenders playing the role of editors who recommend unpublished articles based on peer-reviews to make them complete, reliable and citable articles, without the need for publication in ‘traditional’ journals. Evaluation and recommendation by PCI Evol Biol are free of charge. When a recommender decides to recommend an article, he/she writes a recommendation text that is published along with all the editorial correspondence (reviews, recommender\'s decisions, authors’ replies) by PCI Evol Biol. The article itself is not published by PCI Evol Biol; it remains in the preprint server where it has been posted by the authors. PCI Evol Biol recommenders can also recommend, but to a lesser extent, postprints.',
  },
  {
    id: Gid.fromValidatedString('32025f28-0506-480e-84a0-b47ef1e92ec5'),
    name: 'Peer Community in Ecology',
    avatarPath: '/static/groups/pci-ecology--32025f28-0506-480e-84a0-b47ef1e92ec5.jpg',
    descriptionPath: 'pci-ecology--32025f28-0506-480e-84a0-b47ef1e92ec5.md',
    shortDescription: 'Peer Community in Ecology (PCI Ecology) has been launched in december 2017. It is a community of recommenders playing the role of editors who recommend unpublished articles based on peer-reviews to make them complete, reliable and citable articles, without the need for publication in ‘traditional’ journals. Evaluation and recommendation by PCI Ecology are free of charge. When a recommender decides to recommend an article, he/she writes a recommendation text that is published along with all the editorial correspondence (reviews, recommender\'s decisions, authors’ replies) by PCI Ecology. The article itself is not published by PCI Ecology; it remains in the preprint server where it has been posted by the authors. PCI Ecology recommenders can also recommend, but to a lesser extent, postprints.',
  },
  {
    id: Gid.fromValidatedString('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    name: 'Peer Community in Animal Science',
    avatarPath: '/static/groups/pci-animal-science--4eebcec9-a4bb-44e1-bde3-2ae11e65daaa.png',
    descriptionPath: 'pci-animal-science--4eebcec9-a4bb-44e1-bde3-2ae11e65daaa.md',
    shortDescription: 'Peer Community in Animal Science (PCI Animal Science) is a community of researchers working in Animal Science who peer-review and recommend unpublished preprints publicly available from open archives such as HAL, Zenodo, arXiv, OSF-preprints, and bioRxiv. The peer review process of PCI Animal Science is very similar to that of conventional journals, except that it is totally transparent. Papers recommended by PCI Animal Science are finalized, peer-reviewed articles that can be used and cited, like any other article published in a conventional journal. A recommended paper by PCI Animal Science is a reliable and high quality manuscript that does not need to be published in conventional journals, although further submission in a journal may be possible.',
  },
  {
    id: Gid.fromValidatedString('b90854bf-795c-42ba-8664-8257b9c68b0c'),
    name: 'Peer Community in Archaeology',
    avatarPath: '/static/groups/pci-archaeology--b90854bf-795c-42ba-8664-8257b9c68b0c.jpg',
    descriptionPath: 'pci-archaeology--b90854bf-795c-42ba-8664-8257b9c68b0c.md',
    shortDescription: 'Peer Community in Archaeology (PCI Archaeology) has been launched in March 2019. It is a community of recommenders playing the role of editors who recommend unpublished articles based on peer-reviews to make them complete, reliable and citable articles, without the need for publication in ‘traditional’ journals. Evaluation and recommendation by PCI Archaeology are free of charge. When a recommender decides to recommend an article, he/she writes a recommendation text that is published along with all the editorial correspondence (reviews, recommender\'s decisions, authors’ replies) by PCI Archaeology. The article itself is not published by PCI Archaeology; it remains in the preprint server where it has been posted by the authors. PCI Archaeology recommenders can also recommend, but to a lesser extent, postprints.',
  },
  {
    id: Gid.fromValidatedString('7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84'),
    name: 'Peer Community in Paleontology',
    avatarPath: '/static/groups/pci-paleontology--7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84.jpg',
    descriptionPath: 'pci-paleontology--7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84.md',
    shortDescription: 'Peer Community in Paleontology (PCI Paleo) is a community of researchers working in Paleontology who peer review and recommend research articles publicly available from open archives (such as PaleorXiv or bioRxiv). Papers recommended by PCI Paleo are finalized, peer-reviewed articles that can be used and cited, like any other article published in a conventional journal.',
  },
];

let downplayedPotentialGroups: ReadonlyArray<Group> = [];

if (process.env.EXPERIMENT_ENABLED === 'true') {
  downplayedPotentialGroups = [];
}

export const bootstrapGroups = RNEA.concat(groups, downplayedPotentialGroups);
