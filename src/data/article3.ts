import { article3 } from './article-dois';
import { article3Review1 } from './review-dois';
import { ReviewedArticle } from '../types/reviewed-article';

const article: ReviewedArticle = {
  article: {
    title: 'Uncovering the hidden antibiotic potential of Cannabis',
    authors: [
      'Maya A. Farha',
      'Omar M. El-Halfawy',
      'Robert T. Gale',
      'Craig R. MacNair',
      'Lindsey A. Carfrae',
      'Xiong Zhang',
      'Nicholas G. Jentsch',
      'Jakob Magolan',
      'Eric D. Brown',
    ],
    doi: article3,
    publicationDate: new Date('2019-11-07'),
    abstract: `<p>The spread of antimicrobial resistance continues to be a priority health concern worldwide,
necessitating exploration of alternative therapies. <em>Cannabis sativa</em> has long been known to contain
antibacterial cannabinoids, but their potential to address antibiotic resistance has only been superficially
investigated. Here, we show that cannabinoids exhibit antibacterial activity against MRSA, inhibit its ability to form
biofilms and eradicate stationary phase cells persistent to antibiotics. We show that the mechanism of action of
cannabigerol is through targeting the cytoplasmic membrane of Gram-positive bacteria and demonstrate <em>in vivo</em>
efficacy of cannabigerol in a murine systemic infection model caused by MRSA. We also show that cannabinoids are
effective against Gram-negative organisms whose outer membrane is permeabilized, where cannabigerol acts on the inner
membrane. Finally, we demonstrate that cannabinoids work in combination with polymyxin B against multi-drug resistant
Gram-negative pathogens, revealing the broad-spectrum therapeutic potential for cannabinoids.</p>`,
  },
  reviews: [
    {
      author: 'Craig McCormick',
      doi: article3Review1,
      publicationDate: new Date('2020-02-21'),
      summary: `<p>In this study, Farha, et al. investigate candidate antibiotics from <em>Cannabis sativa</em>.
Eighteen molecules from <em>C. sativa</em> were screened for antibiotic activity against methicillin-resistant
<em>Staphylococcus aureus</em> (MRSA). Of these, seven compounds were identified as potential antibiotics (min.
inhibitory concentration [MIC] &lt; 2 µg/mL). The cannabinoid cannabigerol (CBG) displayed the highest efficacy against
biofilms, free-living MRSA, and MRSA persister cells. The authors used a variety of approaches to investigate CBG
mechanism of action, including attempts to isolate drug-resistant bacteria via spontaneous resistance, serial passaging,
knockdown libraries and transposon mutant libraries. They were unable to identify a single CBG-resistant bacterium.
However, they determined that CBG affects the membrane stability of Gram-positive bacteria. Finally, they found that CBG
alone had no effect on Gram-negative bacteria, but displayed antibiotic activity when combined with polymyxin B.
Overall, this paper shows that there are multiple metabolites produced by <em>Cannabis sativa</em> that have
antibacterial properties and that CBG can kill bacterial cells and disrupt bacterial biofilms by interfering with
stability of the inner membrane.</p>`,
    },
  ],
};

export default article;
