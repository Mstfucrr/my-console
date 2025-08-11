'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, CheckCircle2, Info, Loader2, Plus, RefreshCw, StoreIcon as Shop, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

import StatCard from '@/components/StatCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { RefreshButton } from '@/components/ui/buttons/refresh-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Restaurant } from '@/modules/types'
import { RestaurantCard } from './components/restaurant-card'
import { RestaurantDetailDialog } from './components/restaurant-detail-dialog'
import { RestaurantFilters } from './components/restaurant-filters'
import { restaurantsService } from './service'

export default function RestaurantsView() {
  const [filters, setFilters] = useState<{ search?: string; status?: 'all' | 'active' | 'inactive' | undefined }>({
    status: 'all'
  })

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const {
    data: restaurantsResponse,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsService.getRestaurants(),
    staleTime: 60_000
  })

  const restaurants = useMemo(() => restaurantsResponse?.data ?? [], [restaurantsResponse?.data])

  const stats = useMemo(() => {
    const total = restaurants.length
    const active = restaurants.filter(r => r.isActive).length
    const inactive = restaurants.filter(r => !r.isActive).length
    return { total, active, inactive }
  }, [restaurants])

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      let ok = true
      if (filters.search) {
        const q = filters.search.toLowerCase()
        ok =
          ok &&
          (r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q))
      }
      if (filters.status !== 'all') {
        ok = ok && (filters.status === 'active' ? r.isActive : !r.isActive)
      }
      return ok
    })
  }, [restaurants, filters])

  const onViewDetails = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsModalOpen(true)
  }

  const clearFilters = () => setFilters({})

  return (
    <div className='p-6'>
      {/* Header */}
      <Card className='mb-6'>
        <CardHeader className='flex flex-row items-start justify-between'>
          <div>
            <CardTitle className='mb-1 flex items-center gap-2 text-2xl'>
              <Shop className='text-amber-400' />
              Restoranlarım
            </CardTitle>
            <p className='text-muted-foreground text-sm'>
              Fiyuu sistemine kayıtlı şubelerinizi görüntüleyin ve yönetin
            </p>
          </div>
          <Button disabled>
            <Plus className='mr-1 h-4 w-4' />
            Yeni Şube Ekle
          </Button>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Toplam Şube'
          value={stats.total}
          Icon={Shop}
          hint='Toplam restoran sayısı'
          color='text-blue-600'
        />
        <StatCard
          title='Aktif Şubeler'
          value={stats.active}
          Icon={CheckCircle2}
          hint='Hizmet veren şubeler'
          color='text-green-600'
        />
        <StatCard
          title='Pasif Şubeler'
          value={stats.inactive}
          Icon={XCircle}
          hint='Pasif durumdaki şubeler'
          color='text-red-600'
        />
      </div>

      {/* Filters */}
      <RestaurantFilters filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />

      {/* Error */}
      {error && (
        <Card className='border-destructive mb-4'>
          <CardContent className='flex items-center justify-between gap-3 p-4'>
            <div className='text-destructive flex items-center gap-2'>
              <AlertTriangle className='h-4 w-4' />
              <div className='text-sm'>{error.message}</div>
            </div>
            <Button size='xs' variant='outline' onClick={() => refetch()}>
              <RefreshCw className='mr-1 h-4 w-4' />
              Yeniden Dene
            </Button>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Restoranlar ({filteredRestaurants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='text-muted-foreground flex h-48 flex-col items-center justify-center gap-2 text-sm'>
              <Loader2 className='size-5 animate-spin' />
              Restoranlar yükleniyor...
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className='text-muted-foreground flex flex-col items-center justify-center gap-3 py-12 text-center text-sm'>
              {filters.search || filters.status !== 'all' ? (
                <>
                  <div>Seçili filtrelere uygun restoran bulunamadı.</div>
                  <div className='flex items-center gap-2'>
                    <RefreshButton size='xs' onClick={refetch} isLoading={isFetching} />
                    <Button size='xs' variant='outline' onClick={clearFilters}>
                      Filtreleri Temizle
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>Henüz sisteme kayıtlı restoran bulunmuyor.</div>
                  <Button disabled>
                    <Plus className='mr-1 h-4 w-4' />
                    İlk Restoranınızı Ekleyin
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredRestaurants.map(r => (
                <RestaurantCard key={r.id} restaurant={r} onViewDetails={onViewDetails} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info box */}
      <Card className='mt-4'>
        <CardContent className='space-y-2 p-4'>
          <Alert color='info' variant='outline'>
            <Info className='!size-6' />
            <AlertTitle>Restoran Yönetimi Özellikleri</AlertTitle>
            <AlertDescription>
              <ul className='list-disc pl-5'>
                <li>✅ Restoran listesi görüntüleme</li>
                <li>✅ Detaylı restoran bilgileri</li>
                <li>✅ Durum bazlı filtreleme</li>
                <li>✅ Arama fonksiyonu</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <RestaurantDetailDialog
        restaurant={selectedRestaurant}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
