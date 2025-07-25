import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/user';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
};

