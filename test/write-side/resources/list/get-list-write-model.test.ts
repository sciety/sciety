import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../../src/domain-events';
import { ArticleId } from '../../../../src/types/article-id';
import { getListWriteModel } from '../../../../src/write-side/resources/list/get-list-write-model';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';

describe('get-list-write-model', () => {
  const listId = arbitraryListId();
  const expressionDoi = arbitraryExpressionDoi();

  describe('when the list exists', () => {
    const listName = arbitraryString();
    const listDescription = arbitraryString();

    describe('and an article used to be on the list and has been removed', () => {
      const articles = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: listName,
            description: listDescription,
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ArticleAddedToList')({ articleId: new ArticleId(expressionDoi), listId }),
          constructEvent('ArticleRemovedFromList')({ articleId: new ArticleId(expressionDoi), listId }),
        ],
        getListWriteModel(listId),
        E.getOrElseW(shouldNotBeCalled),
        (resource) => resource.articles,
      );

      it('the article id is not in the resource', () => {
        expect(articles).toStrictEqual([]);
      });
    });

    describe('and the list has been renamed', () => {
      const writeModel = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: arbitraryString(),
            description: listDescription,
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ListNameEdited')({ listId, name: listName }),
        ],
        getListWriteModel(listId),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('the list name is in the resource', () => {
        expect(writeModel.name).toStrictEqual(listName);
      });

      it('the list description remains the same', () => {
        expect(writeModel.description).toStrictEqual(listDescription);
      });
    });

    describe('and the list description has been changed', () => {
      const writeModel = pipe(
        [
          constructEvent('ListCreated')({
            listId,
            name: listName,
            description: arbitraryString(),
            ownerId: arbitraryListOwnerId(),
          }),
          constructEvent('ListDescriptionEdited')({ listId, description: listDescription }),
        ],
        getListWriteModel(listId),
        E.getOrElseW(shouldNotBeCalled),
      );

      it('the list name remains the same', () => {
        expect(writeModel.name).toStrictEqual(listName);
      });

      it('the list description is in the resource', () => {
        expect(writeModel.description).toStrictEqual(listDescription);
      });
    });
  });

  describe('when the list does not exist', () => {
    const result = pipe(
      [
      ],
      getListWriteModel(listId),
    );

    it('fails', () => {
      expect(result).toStrictEqual(E.left(expect.stringContaining(listId)));
    });
  });
});
