import axios from 'axios';
import {
  $, click, closeBrowser, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { toUserId } from '../src/types/user-id';
import { arbitraryString } from '../test/helpers';

const getFirstListOwnedBy = async (userId: string) => {
  const userList = await axios.get(`http://localhost:8081/owned-by/user-id:${userId}`);

  expect(userList.data.items).toHaveLength(1);

  const listId = userList.data.items[0].id as unknown as string;
  return listId;
};

describe('create-annotation', () => {
  beforeAll(async () => {
    await openBrowser();
  });

  afterAll(async () => {
    await closeBrowser();
  });

  describe('when logged in as AvasthiReading', () => {
    const avasthiReadingUserId = toUserId('1412019815619911685');

    beforeAll(async () => {
      await goto(`localhost:8080/log-in-as?userId=${avasthiReadingUserId}`);
    });

    describe('and having saved an article', () => {
      const articleId = '10.1101/2022.09.20.508647';

      beforeAll(async () => {
        await goto(`localhost:8080/articles/${articleId}`);
        await click('Save to my list');
      });

      describe('and having annotated that article', () => {
        const annotationText = arbitraryString();

        beforeAll(async () => {
          await goto('localhost:8080/annotations/create-annotation-form-avasthi-reading');
          await write(annotationText, into(textBox('Annotation content')));
          await write(articleId, into(textBox('Article DOI')));
          await click('Create annotation');
        });

        it('the article card on the user saved articles list page has the annotation attached', async () => {
          await goto('localhost:8080/users/AvasthiReading/lists/saved-articles');
          const annotationSectionText = await $('.article-card-annotation').text();

          expect(annotationSectionText).toContain(annotationText);
        });

        it.skip('the article card on the generic list page has the annotation attached', async () => {
          const genericListId = await getFirstListOwnedBy(avasthiReadingUserId);
          await goto(`localhost:8080/lists/${genericListId}`);
          const annotationSectionText = await $('.article-card-annotation').text();

          expect(annotationSectionText).toContain(annotationText);
        });
      });
    });
  });
});
