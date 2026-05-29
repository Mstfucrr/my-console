'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { storeApplicationsService } from '../service/applications.service'

/**
 * Başvuru durum listesi — tablo / filtre / detay aynı `queryKey` ile paylaşılan önbelleği kullanır.
 * İlk istekten sonra veri `staleTime` bitene kadar yeniden çekilmez; `gcTime` ile abonelik kalkınca da bellekte kalır.
 */
export function useStoreApplicationStatusesQuery() {
  return useQuery({
    queryKey: ['merchant', 'store', 'application-statuses'],
    queryFn: () => storeApplicationsService.fetchStoreApplicationStatuses(),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    placeholderData: keepPreviousData
  })
}
