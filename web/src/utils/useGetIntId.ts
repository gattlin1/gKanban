import { useRouter } from 'next/router';

export function useGetIntId() {
  const router = useRouter();
  const routerId = router.query.id;

  return typeof routerId === 'string' ? parseInt(routerId) : -1;
}
