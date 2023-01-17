import { callApi } from './feature-test/call-api.helper';
import { arbitraryDate, arbitraryString, arbitraryWord } from './test/helpers';
import { arbitraryDescriptionPath } from './test/types/description-path.helper';
import * as RI from './src/types/review-id';
import { arbitraryGroupId } from './test/types/group-id.helper';
import { arbitraryReviewId } from './test/types/review-id.helper';

const constructBackstopStateViaApi = async () => {
  const articleId = '10.1101/2021.07.23.453070';
  const evaluationLocator = RI.serialize(arbitraryReviewId());
  const groupId = arbitraryGroupId();
  await callApi('api/add-group', {
    groupId,
    name: arbitraryString(),
    shortDescription: arbitraryString(),
    homepage: arbitraryString(),
    avatarPath: 'http://somethingthatproducesa404',
    descriptionPath: arbitraryDescriptionPath(),
    slug: arbitraryWord(),
  });
  await callApi('api/record-evaluation', {
    evaluationLocator,
    articleId,
    groupId,
    publishedAt: arbitraryDate(),
    authors: [arbitraryString(), arbitraryString()],
  });
};

// eslint-disable-next-line func-names
void (async function () { await constructBackstopStateViaApi(); }());
