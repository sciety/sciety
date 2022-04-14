import { DomainEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GetAnnotationContentByUserListTarget = (articleId: Doi, listOwnerId: UserId)
=> (events: ReadonlyArray<DomainEvent>)
=> HtmlFragment | undefined;

export const getAnnotationContentByUserListTarget: GetAnnotationContentByUserListTarget = (
  articleId,
  listOwnerId,
) => () => {
  if (listOwnerId !== '1412019815619911685') {
    return undefined;
  }
  let content: string | undefined;
  if (articleId.value === '10.1101/2022.03.29.486216') {
    content = 'A 2.2 angstrom resolution structures of muscle actin filaments in ATP, ADP-Pi and ADP states. Many new insights here about the surprising stability of ADP actin, mechanism of ATP hydrolysis, cofilin binding and more.';
  }
  if (articleId.value === '10.1101/2021.05.26.445751') {
    content = 'Truly exquisite characterization of kinesins in the malaria parasite. Check out the spectacular expansion microscopy images in figure 7A!';
  }
  if (articleId.value === '10.1101/2022.03.31.486578') {
    content = 'This is a beautiful characterization of caveolae. In addition to platinum replica EM of these plasma membrane invaginations in various cell types, this work includes molecular identification of proteins associated with caveolae of different curvatures by STED-CLEM (very high-resolution correlative light electron microscopy).';
  }
  if (articleId.value === '10.1101/2022.03.31.486371') {
    content = 'Whoa! Successful ID of early endosomal cargoes via pull-down of an early endosomal marker followed by proteomics.';
  }

  if (articleId.value === '10.1101/2022.04.06.487275') {
    content = 'How interesting! A peptide screen to identify degrons with E3 ubiquitin ligase specificity in yeast followed by extraction of conserved properties identifies transmembrane domain containing peptides as likely degrons.';
  }
  if (articleId.value === '10.1101/2022.04.05.487209') {
    content = 'Recognizing the utility of not using <strong>exclusively</strong> cutting edge methods for everything, this important study combines bulk RNAseq (high sensitivity due to capturing more low expression and noncoding RNAs) and single cell RNAseq (high specificity) for a more comprehensive transcriptomic picture.';
  }
  if (articleId.value === '10.1101/2021.05.19.444861') {
    content = 'This is wild! Chlamydomonas flagella were isolated, demembranated, attached to polystyrene beads and reactivated to reconstitute flagellar movement. This yields some interesting insights through experimentation and simulation: Increased calcium concentration affects flagellar waveform and trajectory of bead movement and surprisingly, larger beads have increased rather than decreased velocity.';
  }
  if (articleId.value === '10.1101/2022.04.07.487451') {
    content = 'Interesting role for ARP2/3 complex in peroxisome autophagy in plants!';
  }
  if (articleId.value === '10.1101/2022.04.06.487340') {
    content = 'This polarity of actin networks and myosin traffic is interesting in light of the parallels between cilium biogenesis and the immune synapse function.';
  }
  if (!content) {
    return undefined;
  }
  return toHtmlFragment(content);
};
