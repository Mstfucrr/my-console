'use client'

import { useQuery } from '@tanstack/react-query'
import { storesService } from '../service/stores.service'

/**
 * Başvuru durum listesi — tablo / filtre / detay aynı `queryKey` ile paylaşılan önbelleği kullanır.
 * İlk istekten sonra veri `staleTime` bitene kadar yeniden çekilmez; `gcTime` ile abonelik kalkınca da bellekte kalır.
 */
export function useStoreStatusesQuery() {
  return useQuery({
    queryKey: ['merchant', 'store', 'stores-statuses'],
    queryFn: () => storesService.getStoresStatuses(),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24
  })
}
