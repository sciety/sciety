import { AnnotationTarget } from '../../types/annotation-target';
import { HtmlFragment } from '../../types/html-fragment';

export type CreateAnnotationCommand = {
  content: HtmlFragment,
  target: AnnotationTarget,
};
