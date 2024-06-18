import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { CurationStatement, constructCurationTeaser } from './construct-curation-teaser';
import * as EDOI from '../../../../types/expression-doi';
import * as GID from '../../../../types/group-id';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { Dependencies } from '../dependencies';
import { ViewModel } from '../view-model';

const curationTeaser1: CurationStatement = {
  expressionDoi: EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
  groupId: GID.fromValidatedString('f7a7aec3-8b1c-4b81-b098-f3f2e4eefe58'),
  quote: toHtmlFragment('This work is part of a series of papers from the Hong Kong Biodiversity Genomics Consortium sequencing the rich biodiversity of species in Hong Kong. This example assembles the genome of the long-spined sea urchin Diadema setosum (Leske, 1778). Using PacBio HiFi long-reads and Omni-C data the assembled genome size was 886 Mb, consistent to the size of other sea urchin genomes. The assembly anchored to 22 pseudo-molecules/chromosomes, and a total of 27,478 genes including 23,030 protein-coding genes were annotated. Peer review added more to the conclusion and future perspectives. The data hopefully providing a valuable resource and foundation for a better understanding of the ecology and evolution of sea urchins.'),
  articleTitle: toHtmlFragment('Chromosomal-level genome assembly of the long-spined sea urchin <i>Diadema setosum</i> (Leske, 1778)'),
};

const curationTeaser2: CurationStatement = {
  expressionDoi: EDOI.fromValidatedString('10.1016/j.bpj.2023.01.015'),
  groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
  quote: toHtmlFragment('The study by Bassetto Jr. et al. presents an elegant and pioneering technique to rapidly manipulate membrane temperature by up to 10 ºC in less than 1.5 ms, thereby enabling high temporal resolution of the temperature dependence of ion channel currents. The approach combines the cut-open oocyte voltage clamp technique with laser illumination to heat the sub-membrane melanosome layer. Temperature is quantified from observed changes in membrane capacitance. Recordings of Kir1.1, TRPM8, and TRPV1 channels are used to validate the effectiveness of the technique. A limitation is that, in its current form, the technique can be used only on melanosome-containing Xenopus oocyte membranes.'),
  articleTitle: toHtmlFragment('Ion channel thermodynamics studied with temperature jumps measured at the cell membrane'),
};

const curationTeaser3: CurationStatement = {
  expressionDoi: EDOI.fromValidatedString('10.7554/elife.95814.2'),
  groupId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  quote: toHtmlFragment('This landmark work by Lewis and Hegde represents the most significant breakthrough in membrane and secretory biogenesis in recent years. Their work reveals with outstanding clarity how nascent transmembrane segments can pass through the gate of Sec61 into the ER membrane through the coordinated motions of a conformationally and compositionally dynamic machine. Among many other insights, the authors discovered how a new factor, RAMP4, contributes to the formation and function of the lateral gate for certain substrates. The technical quality of the work is exceptional, setting the bar appropriately high.'),
  articleTitle: toHtmlFragment('Structural analysis of the dynamic ribosome-translocon complex'),
};

export const constructCurationTeasers = (dependencies: Dependencies): ViewModel['curationTeasers'] => pipe(
  [
    curationTeaser1,
    curationTeaser2,
    curationTeaser3,
  ],
  RA.map(constructCurationTeaser(dependencies)),
);
