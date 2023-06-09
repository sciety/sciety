import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as GID from '../../../types/group-id';
import { Doi } from '../../../types/doi';
import { detectLanguage } from '../../../shared-components/lang-attribute';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';

// ts-unused-exports:disable-next-line
export const magicArticleId = '10.1101/2022.02.23.481615';

type CurationStatement = {
  evaluationLocator: string,
  groupId: GID.GroupId,
  statement: string,
};

// ts-unused-exports:disable-next-line
export const curationStatements: ReadonlyArray<CurationStatement> = [
  {
    groupId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    statement: `
      <p><strong>eLife assessment</strong></p>
      <p>This fundamental study presents solid evidence for T1r (sweet /umami) taste receptors as chloride (Cl-) receptors, based on a combination of state-of-the-art techniques to demonstrate that T1r receptors from Medaka fish bind chloride and that this binding induces a conformational change in the heteromeric receptor. This conformational change leads to low-concentration chloride-specific action potential firing in nerves from neurons containing these receptors in mice, results that represent an important advance in our understanding of the logic of taste perception.</p>
    `,
    evaluationLocator: 'hypothesis:YSEnWoeKEe2O2nN67bYvsA',
  },
  {
    groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
    statement: `
      <p><strong>Endorsement statement (17 November 2022)</strong></p>
      <p>The preprint by Atsumi <em>et al</em>. describes how chloride binding to sweet- and umami-sensing proteins (T1R taste receptors) can evoke taste sensation. The authors use an elegant combination of structural, biophysical and electrophysiological approaches to locate a chloride binding site in the ligand-binding domain of medaka fish T1r2a/3 receptors. They convincingly show that low mM concentrations of chloride induce conformational changes and, using single fiber recordings, establish that mouse chorda tympani nerves are activated by chloride in a T1R-dependent manner. This suggests that chloride binding to sweet receptors could mediate the commonly reported sweet taste sensation following ingestion of low concentrations of table salt. The findings will be of broad relevance to those studying taste sensation and ligand recognition in GPCRs.</p>
      <p><em>(This endorsement by Biophysics Colab refers to version 2 of this preprint, which has been revised in response to peer review of version 1.)</em></p>
    `,
    evaluationLocator: 'hypothesis:TfCA6maDEe2zm3_n3MyxjA',
  },
];

type ConstructCurationStatements = (dependencies: Dependencies, doi: Doi) => T.Task<ViewModel['curationStatements']>;

export const constructCurationStatements: ConstructCurationStatements = (dependencies, doi) => pipe(
  (doi.value === magicArticleId) ? curationStatements : [],
  RA.map((statement) => pipe(
    statement.groupId,
    dependencies.getGroup,
    E.fromOption(() => {
      dependencies.logger('error', 'Group not found in read model', { statement });
    }),
    E.map((group) => ({
      ...statement,
      statementLanguageCode: detectLanguage(statement.statement),
      groupName: group.name,
      groupSlug: group.slug,
      groupLogo: group.largeLogoPath,
    })),
  )),
  RA.rights,
  T.of,
);
