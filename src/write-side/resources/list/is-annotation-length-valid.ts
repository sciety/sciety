import { SanitisedUserInput } from '../../../types/sanitised-user-input';

export const isAnnotationLengthValid = (
  annotationContent: SanitisedUserInput,
): boolean => annotationContent.length > 0 && annotationContent.length <= 4000;
