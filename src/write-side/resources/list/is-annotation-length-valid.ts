import { UnsafeUserInput } from '../../../types/unsafe-user-input';

/** @deprecated use unsafeAnnotationContent instead */
export const isAnnotationLengthValid = (
  annotationContent: UnsafeUserInput,
): boolean => annotationContent.length > 0 && annotationContent.length <= 4000;
