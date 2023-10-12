import { useInfiniteQuery } from '@tanstack/react-query';

import { NoticeList } from '@type/notice';

import { getNoticeList } from '@api/notice';

import { NOTICE_AMOUNT_PER_PAGE } from '@constants/api';
import { QUERY_KEY } from '@constants/queryKey';

export const useNoticeList = () => {
  const { data, isError, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<NoticeList>(
      [QUERY_KEY.NOTICE],
      ({ pageParam = 0 }) => getNoticeList(pageParam),
      {
        suspense: true,
        cacheTime: 30 * 60 * 1000,
        staleTime: 30 * 60 * 1000,
        onSuccess: data => {
          return data;
        },
        onError: () => {
          console.error('공지 사항을 리스트를 불러오는데 실패했습니다');
        },
        getNextPageParam: lastPage => {
          if (lastPage.noticeList.length !== NOTICE_AMOUNT_PER_PAGE) return;

          return lastPage.pageNumber + 1;
        },
      }
    );

  return { data, isError, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage };
};
