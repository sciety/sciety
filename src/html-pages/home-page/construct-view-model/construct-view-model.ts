import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import * as GID from '../../../types/group-id';
import { GetGroup } from '../../../shared-read-models/groups/get-group';
import { toHtmlFragment } from '../../../types/html-fragment';
import { Logger } from '../../../shared-ports';

type HardcodedData = Omit<ViewModel['curationTeasers'][number], 'caption'>;

const curationTeaser1: HardcodedData = {
  articleLink: '/articles/activity/10.1101/2022.06.22.497259',
  groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
  quote: toHtmlFragment('The preprint by Yang et al. asks how the shape of the membrane influences the localization of mechanosensitive Piezo channels. The authors use a creative approach involving methods that distort the plasma membrane by generating blebs and artificial filopodia. They convincingly show that curvature of the lipid environment influences Piezo1 localization, such that increased curvature causes channel depletion, and that application of the chemical modulator Yoda1 is sufficient to allow channels to enter filopodia. The study provides support for a provocative “flattening model” of Yoda1 action, and should inspire future studies by researchers interested in mechanosensitive channels and membrane curvature.'),
  articleTitle: toHtmlFragment('Membrane curvature governs the distribution of Piezo1 in live cells'),
};

const curationTeaser2: HardcodedData = {
  articleLink: '/articles/activity/10.21203/rs.3.rs-2407778/v1',
  groupId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  quote: toHtmlFragment('This valuable study revisits the effects of substitution model selection on phylogenetics by comparing reversible and non-reversible DNA substitution models. The authors provide evidence that 1) non time-reversible models sometimes perform better than general time-reversible models when inferring phylogenetic trees out of simulated viral genome sequence data sets, and that 2) non time-reversible models can fit the real data better than the reversible substitution models commonly used in phylogenetics, a finding consistent with previous work. However, the methods are incomplete in supporting the main conclusion of the manuscript, that is that non time-reversible models should be incorporated in the model selection process for these data sets.'),
  articleTitle: toHtmlFragment('Viral genome sequence datasets display pervasive evidence of strand-specific substitution biases that are best described using non-reversible nucleotide substitution models'),
};

const curationTeaser3: HardcodedData = {
  articleLink: '/articles/activity/10.1101/2023.01.02.522517',
  groupId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  quote: toHtmlFragment('This study presents important findings on the decision-making capacities of honey bees in controlled conditions. The evidence supporting the study is solid, however, the explanation of the methods, importance, and novelty of the study requires further clarification. With a deeper development of the relevance of this study, the reader will have a clear idea of how this study contributes to the field.'),
  articleTitle: toHtmlFragment('How honey bees make fast and accurate decisions'),
};

export type GroupsToHighlight = ReadonlyArray<{
  groupId: GID.GroupId,
  logoPath: string,
}>;

export type Ports = {
  getGroup: GetGroup,
  logger: Logger,
};

const constructCurationTeaser = (ports: Ports) => (hardcodedData: HardcodedData) => pipe(
  hardcodedData.groupId,
  ports.getGroup,
  O.match(
    () => {
      ports.logger('error', 'Group missing from readmodel', { groupId: hardcodedData.groupId });
      return 'Curated by unknown';
    },
    (group) => `Curated by ${group.name}`,
  ),
  (caption) => ({
    ...hardcodedData,
    caption,
  }),
);

export const constructViewModel = (ports: Ports, groupsToHighlight: GroupsToHighlight): ViewModel => pipe(
  groupsToHighlight,
  O.traverseArray((groupToHighlight) => pipe(
    groupToHighlight.groupId,
    ports.getGroup,
    O.map((group) => ({
      logoPath: groupToHighlight.logoPath,
      link: `/groups/${group.slug}`,
      name: group.name,
    })),
  )),
  (groupsViewModel) => ({
    groups: groupsViewModel,
    curationTeasers: pipe(
      [
        curationTeaser1,
        curationTeaser2,
        curationTeaser3,
      ],
      RA.map(constructCurationTeaser(ports)),
    ),
  }),
);
