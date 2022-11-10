import {
  $, click, closeBrowser, goto, into, openBrowser, textBox, write,
} from 'taiko';
import { toUserId } from '../src/types/user-id';
import { arbitraryString } from '../test/helpers';

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
          await goto('localhost:8080/users/AvasthiReading/lists/saved-articles');
        });

        it('the article card on the user saved articles list page has the annotation attached', async () => {
          const annotationSectionText = await $('.article-card-annotation').text();

          expect(annotationSectionText).toContain(annotationText);
        });
      });
    });
  });
});
