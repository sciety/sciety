import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { ViewModel } from '../../../../src/html-pages/list-page/view-model';
import { constructViewModel } from '../../../../src/html-pages/list-page/construct-view-model/construct-view-model';
import { createTestFramework, TestFramework } from '../../../framework';
import * as LOID from '../../../../src/types/list-owner-id';
import { CreateUserAccountCommand } from '../../../../src/write-side/commands';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when a user saves an article that is not in any list', () => {
    let viewModel: ViewModel;
    let createUserAccountCommand: CreateUserAccountCommand;
    const articleId = arbitraryArticleId();

    beforeEach(async () => {
      createUserAccountCommand = arbitraryCreateUserAccountCommand();
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      const listId = list.id;
      await framework.commandHelpers.addArticleToList(articleId, listId);
      viewModel = await pipe(
        {
          page: 1,
          id: listId,
          user: O.some({ id: createUserAccountCommand.userId }),
          success: false,
        },
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('the article details are included in the page content', () => {
      expect(viewModel.content).toStrictEqual(expect.objectContaining({
        articles: [
          E.right(expect.objectContaining({
            articleCard: expect.objectContaining({
              paperActivityPageHref: expect.stringContaining(articleId.value),
            }),
          })),
        ],
      }));
    });

    it('displays a link to related articles', () => {
      expect(viewModel.relatedArticlesLink).toStrictEqual(O.some(expect.anything()));
    });
  });

  describe('ordering of list contents', () => {
    const createList = async () => {
      const createUserAccountCommand = arbitraryCreateUserAccountCommand();
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      return list.id;
    };

    describe('when the list contains two articles', () => {
      let viewModel: ViewModel;
      const article1 = arbitraryArticleId();
      const article2 = arbitraryArticleId();

      beforeEach(async () => {
        const listId = await createList();
        await framework.commandHelpers.addArticleToList(article1, listId);
        await framework.commandHelpers.addArticleToList(article2, listId);
        viewModel = await pipe(
          {
            page: 1,
            id: listId,
            user: O.none,
            success: false,
          },
          constructViewModel(framework.dependenciesForViews),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('sorts the articles in reverse order of being added to the list', () => {
        expect(viewModel.content).toStrictEqual(expect.objectContaining({
          articles: [
            E.right(expect.objectContaining({
              articleCard: expect.objectContaining({ paperActivityPageHref: expect.stringContaining(article2.value) }),
            })),
            E.right(expect.objectContaining({
              articleCard: expect.objectContaining({ paperActivityPageHref: expect.stringContaining(article1.value) }),
            })),
          ],
        }));
      });
    });

    describe('when the list contains an article that has been removed and re-added', () => {
      let viewModel: ViewModel;
      const article1 = arbitraryArticleId();
      const article2 = arbitraryArticleId();

      beforeEach(async () => {
        const listId = await createList();
        await framework.commandHelpers.addArticleToList(article1, listId);
        await framework.commandHelpers.addArticleToList(article2, listId);
        await framework.commandHelpers.removeArticleFromList(article1, listId);
        await framework.commandHelpers.addArticleToList(article1, listId);
        viewModel = await pipe(
          {
            page: 1,
            id: listId,
            user: O.none,
            success: false,
          },
          constructViewModel(framework.dependenciesForViews),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('sorts the articles in reverse order of being added to the list', () => {
        expect(viewModel.content).toStrictEqual(expect.objectContaining({
          articles: [
            E.right(expect.objectContaining({
              articleCard: expect.objectContaining({ paperActivityPageHref: expect.stringContaining(article1.value) }),
            })),
            E.right(expect.objectContaining({
              articleCard: expect.objectContaining({ paperActivityPageHref: expect.stringContaining(article2.value) }),
            })),
          ],
        }));
      });
    });

    describe('when an article has been removed from the list', () => {
      let viewModel: ViewModel;
      const article1 = arbitraryArticleId();
      const article2 = arbitraryArticleId();
      const article3 = arbitraryArticleId();

      beforeEach(async () => {
        const listId = await createList();
        await framework.commandHelpers.addArticleToList(article1, listId);
        await framework.commandHelpers.addArticleToList(article2, listId);
        await framework.commandHelpers.addArticleToList(article3, listId);
        await framework.commandHelpers.removeArticleFromList(article3, listId);
        viewModel = await pipe(
          {
            page: 1,
            id: listId,
            user: O.none,
            success: false,
          },
          constructViewModel(framework.dependenciesForViews),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('sorts the remaining articles in reverse order of being added to the list', () => {
        expect(viewModel.content).toStrictEqual(expect.objectContaining({
          articles: [
            E.right(expect.objectContaining({
              articleCard: expect.objectContaining({ paperActivityPageHref: expect.stringContaining(article2.value) }),
            })),
            E.right(expect.objectContaining({
              articleCard: expect.objectContaining({ paperActivityPageHref: expect.stringContaining(article1.value) }),
            })),
          ],
        }));
      });
    });
  });
});
