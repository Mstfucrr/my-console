'use client'

import { useQuery } from '@tanstack/react-query'
import { storeApplicationsService } from '../applications/service/applications.service'

/**
 * Başvuru durum listesi — tablo / filtre / detay aynı `queryKey` ile paylaşılan önbelleği kullanır.
 * İlk istekten sonra veri `staleTime` bitene kadar yeniden çekilmez; `gcTime` ile abonelik kalkınca da bellekte kalır.
 */
export function useStoreApplicationStatusesQuery() {
  return useQuery({
    queryKey: ['merchant', 'store', 'application-statuses'],
    queryFn: () => storeApplicationsService.fetchStoreApplicationStatuses(),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24
  })
}
