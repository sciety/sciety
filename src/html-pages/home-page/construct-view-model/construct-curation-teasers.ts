import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { CurationStatement, constructCurationTeaser } from './construct-curation-teaser';
import * as EDOI from '../../../types/expression-doi';
import * as GID from '../../../types/group-id';
import { toHtmlFragment } from '../../../types/html-fragment';
import { Dependencies } from '../dependencies';
import { ViewModel } from '../view-model';

const curationTeaser1: CurationStatement = {
  expressionDoi: EDOI.fromValidatedString('10.1101/2022.06.22.497259'),
  groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
  quote: toHtmlFragment('The preprint by Yang et al. asks how the shape of the membrane influences the localization of mechanosensitive Piezo channels. The authors use a creative approach involving methods that distort the plasma membrane by generating blebs and artificial filopodia. They convincingly show that curvature of the lipid environment influences Piezo1 localization, such that increased curvature causes channel depletion, and that application of the chemical modulator Yoda1 is sufficient to allow channels to enter filopodia. The study provides support for a provocative “flattening model” of Yoda1 action, and should inspire future studies by researchers interested in mechanosensitive channels and membrane curvature.'),
  articleTitle: toHtmlFragment('Membrane curvature governs the distribution of Piezo1 in live cells'),
};

const curationTeaser2: CurationStatement = {
  expressionDoi: EDOI.fromValidatedString('10.1101/2023.01.18.524616'),
  groupId: GID.fromValidatedString('f7a7aec3-8b1c-4b81-b098-f3f2e4eefe58'),
  quote: toHtmlFragment(`<p>Hybrid genomes are tricky to assemble, and few genomic resources are available for hybrid grapevines such as ‘Chambourcin’, a French-American interspecific hybrid grape grown in the eastern and midwestern United States. Here is an attempt to assemble Chambourcin’ using a combination of PacBio HiFi long-reads, Bionano optical maps, and Illumina short-read sequencing technologies. Producing an assembly with 26 scaffolds, an N50 length 23.3 Mb and an estimated BUSCO completeness of 97.9% that can be used for genome comparisons, functional genomic analyses, and genome-assisted breeding research. Error correction and pilon polishing was a challenge with this hybrid assembly, but after trying a few different approaches in the review process have improved it, and as they have documented what they did and are clear about the final metrics, users can assess the quality themselves.</p>
  <p><em>This assessment refers to version 2 of this preprint.</em></p>`),
  articleTitle: toHtmlFragment(`Genome assembly of the hybrid grapevine
            <i>Vitis</i>
            ‘Chambourcin’`),
};

const curationTeaser3: CurationStatement = {
  expressionDoi: EDOI.fromValidatedString('10.1101/2023.01.02.522517'),
  groupId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  quote: toHtmlFragment('This study presents important findings on the decision-making capacities of honey bees in controlled conditions. The evidence supporting the study is solid, however, the explanation of the methods, importance, and novelty of the study requires further clarification. With a deeper development of the relevance of this study, the reader will have a clear idea of how this study contributes to the field.'),
  articleTitle: toHtmlFragment('How honey bees make fast and accurate decisions'),
};

export const constructCurationTeasers = (dependencies: Dependencies): ViewModel['curationTeasers'] => pipe(
  [
    curationTeaser1,
    curationTeaser2,
    curationTeaser3,
  ],
  RA.map(constructCurationTeaser(dependencies)),
);
