import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addArticleToList, Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import * as Gid from '../types/group-id';

type GetBiorxivOrMedrxivSubjectArea = (articleId: Doi) => TE.TaskEither<DE.DataError, string>;

export type Ports = AddArticleToListPorts & {
  logger: Logger,
  getBiorxivOrMedrxivSubjectArea: GetBiorxivOrMedrxivSubjectArea,
};

const elifeGroupId = Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');

const elifeCellBiologyBiorxivSubjectAreas: ReadonlyArray<string> = [
  'cell biology',
];

const eLifeNeuroscienceBiorxivOrMedrxivSubjectAreas: ReadonlyArray<string> = [
  'animal behavior and cognition',
  'neuroscience',
  'neurology',
];

const biochemistryAndChemicalBiologyListId = '3792ee73-6a7d-4c54-b6ee-0abc18cb8bc4';
const medicineListId = 'c7237468-aac1-4132-9598-06e9ed68f31d';

const mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists: Record<string, string> = {
  // biorxiv
  biochemistry: biochemistryAndChemicalBiologyListId,
  // medrxiv
  'addiction medicine': medicineListId,
  anesthesia: medicineListId,
  'cardiovascular medicine': medicineListId,
  'dentistry and oral medicine': medicineListId,
  dermatology: medicineListId,
  'emergency medicine': medicineListId,
  endocrinology: medicineListId,
  'forensic medicine': medicineListId,
  gastroenterology: medicineListId,
  'genetic and genomic medicine': medicineListId,
  'geriatric medicine': medicineListId,
  'health economics': medicineListId,
  'health informatics': medicineListId,
  'health policy': medicineListId,
  'health systems and quality improvement': medicineListId,
  hematology: medicineListId,
  'hiv aids': medicineListId,
  'infectious diseases': medicineListId,
  'intensive care and critical care medicine': medicineListId,
  'medical education': medicineListId,
  'medical ethics': medicineListId,
  nephrology: medicineListId,
  nursing: medicineListId,
  nutrition: medicineListId,
  'obstetrics and gynecology': medicineListId,
  'occupational and environmental healthoophthalmology': medicineListId,
  orthopedics: medicineListId,
  otolaryngology: medicineListId,
  'pain medicine': medicineListId,
  'palliative medicine': medicineListId,
  pathology: medicineListId,
  pediatrics: medicineListId,
  'pharmacology and therapeutics': medicineListId,
  'primary care research': medicineListId,
  'psychiatry and clinical psychology': medicineListId,
  'radiology and imaging': medicineListId,
  'rehabilitation medicine and physical therapy': medicineListId,
  'respiratory medicine': medicineListId,
  rheumatology: medicineListId,
  'sexual and reproductive health': medicineListId,
  'sports medicine': medicineListId,
  surgery: medicineListId,
  toxicology: medicineListId,
  transplantation: medicineListId,
  urology: medicineListId,
};

type AddArticleToElifeSubjectAreaLists = (ports: Ports) => (event: DomainEvent) => T.Task<void>;

export const addArticleToElifeSubjectAreaLists: AddArticleToElifeSubjectAreaLists = (ports) => (event) => {
  if (!isEvaluationRecordedEvent(event)) {
    return T.of(undefined);
  }
  if (event.groupId !== elifeGroupId) {
    return T.of(undefined);
  }

  return pipe(
    event.articleId,
    ports.getBiorxivOrMedrxivSubjectArea,
    TE.chain((subjectArea) => {
      let listId: string | null = null;
      listId = pipe(
        mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists,
        R.lookup(subjectArea),
        O.getOrElseW(() => null),
      );
      if (elifeCellBiologyBiorxivSubjectAreas.includes(subjectArea)) {
        listId = 'cb15ef21-944d-44d6-b415-a3d8951e9e8b';
      }
      if (eLifeNeuroscienceBiorxivOrMedrxivSubjectAreas.includes(subjectArea)) {
        listId = '3253c905-8083-4f3d-9e1f-0a8085e64ee5';
      }
      if (listId !== null) {
        return addArticleToList(ports)({
          articleId: event.articleId.value,
          listId,
        });
      }
      ports.logger('info', 'addArticleToElifeSubjectAreaLists policy: unsupported subject area', { event, subjectArea });
      return TE.right(undefined);
    }),
    TE.match(
      () => { ports.logger('error', 'addArticleToElifeSubjectAreaLists policy: failed to fetch subject area', { articleId: event.articleId }); },
      () => {},
    ),
  );
};
