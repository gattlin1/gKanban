import { FieldError } from '../generated/graphql';

export function toErrorMap(errors: FieldError[]) {
  const erorrMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    erorrMap[field] = message;
  });

  return erorrMap;
}
