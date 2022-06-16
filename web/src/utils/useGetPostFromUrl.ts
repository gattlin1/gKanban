import { usePostQuery } from '../generated/graphql';
import { useGetIntId } from './useGetIntId';

export function useGetPostFromUrl() {
  const id = useGetIntId();
  return usePostQuery({
    pause: id === -1,
    variables: { id },
  });
}
