import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dayjs } from 'dayjs';
import { apiClient } from '../external/api.ts';

export const useTvGuide = (params: {
  channelId: string;
  from: Dayjs;
  to: Dayjs;
}) =>
  useQuery({
    queryKey: ['channels', params.channelId, 'guide', params] as const,
    queryFn: async () => {
      return apiClient.get('/api/v2/channels/:id/lineup', {
        params: { id: params.channelId },
        queries: {
          from: params.from.toISOString(),
          to: params.to.toISOString(),
        },
      });
    },
  });

export const useAllTvGuides = (params: {
  from: Dayjs;
  to: Dayjs;
  refetchInterval: number;
}) =>
  useQuery({
    queryKey: ['channels', 'all', 'guide', params] as const,
    queryFn: async () => {
      return apiClient.get('/api/v2/channels/all/lineups', {
        queries: {
          from: params.from.toISOString(),
          to: params.to.toISOString(),
        },
      });
    },
    refetchInterval: params.refetchInterval,
  });

export const prefetchAllTvGuides = (params: { from: Dayjs; to: Dayjs }) => {
  const queryClient = useQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['channels', 'all', 'guide', params] as const,
    queryFn: async () => {
      return apiClient.get('/api/v2/channels/all/lineups', {
        queries: {
          from: params.from.toISOString(),
          to: params.to.toISOString(),
        },
      });
    },
  });
};
