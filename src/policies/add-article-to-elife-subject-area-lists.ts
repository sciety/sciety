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

const elifeMedicineMedrxivSubjectAreas = [
  'addiction medicine',
  'anesthesia',
  'cardiovascular medicine',
  'dentistry and oral medicine',
  'dermatology',
  'emergency medicine',
  'endocrinology',
  'forensic medicine',
  'gastroenterology',
  'genetic and genomic medicine',
  'geriatric medicine',
  'health economics',
  'health informatics',
  'health policy',
  'health systems and quality improvement',
  'hematology',
  'hiv aids',
  'infectious diseases',
  'intensive care and critical care medicine',
  'medical education',
  'medical ethics',
  'nephrology',
  'nursing',
  'nutrition',
  'obstetrics and gynecology',
  'occupational and environmental healthoophthalmology',
  'orthopedics',
  'otolaryngology',
  'pain medicine',
  'palliative medicine',
  'pathology',
  'pediatrics',
  'pharmacology and therapeutics',
  'primary care research',
  'psychiatry and clinical psychology',
  'radiology and imaging',
  'rehabilitation medicine and physical therapy',
  'respiratory medicine',
  'rheumatology',
  'sexual and reproductive health',
  'sports medicine',
  'surgery',
  'toxicology',
  'transplantation',
  'urology',
];

const elifeCellBiologyBiorxivSubjectAreas: ReadonlyArray<string> = [
  'cell biology',
];

const eLifeNeuroscienceBiorxivOrMedrxivSubjectAreas: ReadonlyArray<string> = [
  'animal behavior and cognition',
  'neuroscience',
  'neurology',
];

const elifeBiochemistryAndChemicalBiologyBiorxivSubjectAreas: ReadonlyArray<string> = [
  'biochemistry',
];

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
      if (elifeMedicineMedrxivSubjectAreas.includes(subjectArea)) {
        listId = 'c7237468-aac1-4132-9598-06e9ed68f31d';
      }
      if (elifeCellBiologyBiorxivSubjectAreas.includes(subjectArea)) {
        listId = 'cb15ef21-944d-44d6-b415-a3d8951e9e8b';
      }
      if (eLifeNeuroscienceBiorxivOrMedrxivSubjectAreas.includes(subjectArea)) {
        listId = '3253c905-8083-4f3d-9e1f-0a8085e64ee5';
      }
      if (elifeBiochemistryAndChemicalBiologyBiorxivSubjectAreas.includes(subjectArea)) {
        listId = '3792ee73-6a7d-4c54-b6ee-0abc18cb8bc4';
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
