import * as Gid from '../../types/group-id';
import * as LID from '../../types/list-id';

export const elifeGroupId = Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');

const biochemistryAndChemicalBiologyListId = '3792ee73-6a7d-4c54-b6ee-0abc18cb8bc4';
const bioengineeringListId = 'b2b55ddd-c0f2-4406-b304-b744af989e72';
const cancerBiologyListId = '977cec9b-7ff6-4cf5-a487-30f0cc544cdb';
const cellBiologyListId = 'cb15ef21-944d-44d6-b415-a3d8951e9e8b';
const computationalAndSystemsBiologyListId = 'c9efbf2e-8d20-4a9a-b407-c25d185b4939';
const developmentalBiologyListId = '1008fbbe-9d14-4737-808f-4170640df9cb';
const ecologyListId = 'a9f35fb7-c2fe-4fde-af39-f7c79ea0a497';
const epidemiologyListId = '0453b3c1-d58e-429f-8c1e-588ccc646113';
const evolutionaryBiologyListId = '5146099b-22e0-4589-9f16-10586e08ca4b';
const geneticsAndGenomicsListId = '890bf35a-c3da-413a-8cdb-864b7ce91a51';
const immunologyAndInflammationListId = 'b4acc6f3-bf15-4add-ab1f-bc72a8a3da7f';
const medicineListId = 'c7237468-aac1-4132-9598-06e9ed68f31d';
const microbiologyAndInfectiousDiseaseListId = 'db62bf5b-bcd4-42eb-bd99-e7a37283041d';
const molecularBiologyListId = '708b4836-0adf-4326-844f-fdf8ef816402';
const neuroscienceListId = '3253c905-8083-4f3d-9e1f-0a8085e64ee5';
const pharmacologyAndToxicologyListId = '84577aec-a4ab-4c61-8c2e-b799a3918350';
const physiologyListId = '57a4fa09-d9f5-466d-8038-ea9d29603aef';
const plantBiologyListId = '205415a7-b409-4ded-ada2-3116c953c4c2';
const scientificCommunicationAndEducationListId = 'd3d30687-62ee-4bb6-8723-f8d49dab7882';
const structuralBiologyAndMolecularBiophysicsListId = 'a059f20a-366d-4790-b1f2-03bfb9b915b6';
const syntheticBiologyListId = 'c743bc3d-955a-4e97-b897-5e423ef0d3bc';
const zoologyListId = '86a14824-8a48-4194-b75a-efbca28b90ae';

export const mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists: Record<string, string> = {
  // biorxiv
  'animal behavior and cognition': neuroscienceListId,
  biochemistry: biochemistryAndChemicalBiologyListId,
  bioengineering: bioengineeringListId,
  bioinformatics: computationalAndSystemsBiologyListId,
  biophysics: structuralBiologyAndMolecularBiophysicsListId,
  'cancer biology': cancerBiologyListId,
  'cell biology': cellBiologyListId,
  'developmental biology': developmentalBiologyListId,
  ecology: ecologyListId,
  // epidemiology: epidemiologyListId,
  'evolutionary biology': evolutionaryBiologyListId,
  genetics: geneticsAndGenomicsListId,
  genomics: geneticsAndGenomicsListId,
  immunology: immunologyAndInflammationListId,
  microbiology: microbiologyAndInfectiousDiseaseListId,
  'molecular biology': molecularBiologyListId,
  neuroscience: neuroscienceListId,
  paleontology: evolutionaryBiologyListId,
  'pharmacology and toxicology': pharmacologyAndToxicologyListId,
  physiology: physiologyListId,
  'plant biology': plantBiologyListId,
  'scientific communication and education': scientificCommunicationAndEducationListId,
  'synthetic biology': syntheticBiologyListId,
  'systems biology': computationalAndSystemsBiologyListId,
  zoology: zoologyListId,
  // medrxiv
  'addiction medicine': medicineListId,
  'allergy and immunology': immunologyAndInflammationListId,
  anesthesia: medicineListId,
  'cardiovascular medicine': medicineListId,
  'dentistry and oral medicine': medicineListId,
  dermatology: medicineListId,
  'emergency medicine': medicineListId,
  endocrinology: medicineListId,
  epidemiology: epidemiologyListId,
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
  neurology: neuroscienceListId,
  nursing: medicineListId,
  nutrition: medicineListId,
  'obstetrics and gynecology': medicineListId,
  'occupational and environmental health': medicineListId,
  oncology: cancerBiologyListId,
  ophthalmology: medicineListId,
  orthopedics: medicineListId,
  otolaryngology: medicineListId,
  'pain medicine': medicineListId,
  'palliative medicine': medicineListId,
  pathology: medicineListId,
  pediatrics: medicineListId,
  'pharmacology and therapeutics': medicineListId,
  'primary care research': medicineListId,
  'psychiatry and clinical psychology': medicineListId,
  'public and global health': epidemiologyListId,
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

export const elifeSubjectAreaLists = [
  LID.fromValidatedString('3792ee73-6a7d-4c54-b6ee-0abc18cb8bc4'),
  LID.fromValidatedString('b2b55ddd-c0f2-4406-b304-b744af989e72'),
  LID.fromValidatedString('977cec9b-7ff6-4cf5-a487-30f0cc544cdb'),
  LID.fromValidatedString('cb15ef21-944d-44d6-b415-a3d8951e9e8b'),
  LID.fromValidatedString('c9efbf2e-8d20-4a9a-b407-c25d185b4939'),
  LID.fromValidatedString('1008fbbe-9d14-4737-808f-4170640df9cb'),
  LID.fromValidatedString('a9f35fb7-c2fe-4fde-af39-f7c79ea0a497'),
  LID.fromValidatedString('0453b3c1-d58e-429f-8c1e-588ccc646113'),
  LID.fromValidatedString('5146099b-22e0-4589-9f16-10586e08ca4b'),
  LID.fromValidatedString('890bf35a-c3da-413a-8cdb-864b7ce91a51'),
  LID.fromValidatedString('b4acc6f3-bf15-4add-ab1f-bc72a8a3da7f'),
  LID.fromValidatedString('c7237468-aac1-4132-9598-06e9ed68f31d'),
  LID.fromValidatedString('db62bf5b-bcd4-42eb-bd99-e7a37283041d'),
  LID.fromValidatedString('708b4836-0adf-4326-844f-fdf8ef816402'),
  LID.fromValidatedString('3253c905-8083-4f3d-9e1f-0a8085e64ee5'),
  LID.fromValidatedString('84577aec-a4ab-4c61-8c2e-b799a3918350'),
  LID.fromValidatedString('57a4fa09-d9f5-466d-8038-ea9d29603aef'),
  LID.fromValidatedString('205415a7-b409-4ded-ada2-3116c953c4c2'),
  LID.fromValidatedString('d3d30687-62ee-4bb6-8723-f8d49dab7882'),
  LID.fromValidatedString('a059f20a-366d-4790-b1f2-03bfb9b915b6'),
  LID.fromValidatedString('c743bc3d-955a-4e97-b897-5e423ef0d3bc'),
  LID.fromValidatedString('86a14824-8a48-4194-b75a-efbca28b90ae'),
];
