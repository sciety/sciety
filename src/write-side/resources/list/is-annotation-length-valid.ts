import { UnsafeUserInput } from '../../../types/unsafe-user-input';

export const isAnnotationLengthValid = (
  annotationContent: UnsafeUserInput,
): boolean => annotationContent.length > 0 && annotationContent.length <= 4000;
