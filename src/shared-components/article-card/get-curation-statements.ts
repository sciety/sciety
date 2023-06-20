import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { LanguageCode } from '../lang-attribute';
import { Doi } from '../../types/doi';

type CurationStatementViewModel = {
  groupName: string,
  content: SanitisedHtmlFragment,
  contentLanguageCode: O.Option<LanguageCode>,
};

export const getCurationStatements = (articleId: Doi): ReadonlyArray<CurationStatementViewModel> => {
  if (articleId.value !== '10.1101/2022.02.23.481615') {
    return [];
  }

  return [{
    groupName: 'Biophysics Colab',
    content: sanitise(toHtmlFragment(`
      <p><strong>Endorsement statement (17 November 2022)</strong></p>
      <p>The preprint by Atsumi <em>et al</em>. describes how chloride binding to sweet- and umami-sensing proteins (T1R taste receptors) can evoke taste sensation. The authors use an elegant combination of structural, biophysical and electrophysiological approaches to locate a chloride binding site in the ligand-binding domain of medaka fish T1r2a/3 receptors. They convincingly show that low mM concentrations of chloride induce conformational changes and, using single fiber recordings, establish that mouse chorda tympani nerves are activated by chloride in a T1R-dependent manner&hellip;</p>
    `)),
    contentLanguageCode: O.some('en'),
  },
  {
    groupName: 'eLife',
    content: sanitise(toHtmlFragment(`
      <p><strong>eLife assessment</strong></p>
      <p>This fundamental study presents solid evidence for T1r (sweet /umami) taste receptors as chloride (Cl-) receptors, based on a combination of state-of-the-art techniques to demonstrate that T1r receptors from Medaka fish bind chloride and that this binding induces a conformational change in the heteromeric receptor. This conformational change leads to low-concentration chloride-specific action potential firing in nerves from neurons containing these receptors in mice, results that represent an important advance in our understanding of the logic of taste perception.</p>
    `)),
    contentLanguageCode: O.some('en'),
  },
  ];
};
