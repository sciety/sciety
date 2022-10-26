import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isArticleAddedToListEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import * as GroupId from '../../types/group-id';
import * as LID from '../../types/list-id';

export type MissingArticles = ReadonlyArray<Doi>;

export const initialState: MissingArticles = [];

export const handleEvent = (readmodel: MissingArticles, event: DomainEvent): MissingArticles => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0')) {
      return pipe(
        readmodel,
        RA.some((doi) => doi.value === event.articleId.value),
        B.match(
          () => pipe(
            readmodel,
            RA.append(event.articleId),
          ),
          () => readmodel,
        ),
      );
    }
  } else if (isArticleAddedToListEvent(event)) {
    const elifeSubjectAreaLists = [
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
    if (elifeSubjectAreaLists.includes(event.listId)) {
      return pipe(
        readmodel,
        RA.filter((doi) => doi.value !== event.articleId.value),
      );
    }
  }
  return readmodel;
};
