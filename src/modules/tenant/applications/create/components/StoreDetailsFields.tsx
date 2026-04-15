'use client'

import { FormInputField } from '@/components/form/FormInputField'
import { FormPhoneField } from '@/components/form/FormPhoneField'
import { FormSelectField } from '@/components/form/FormSelectField'
import { TooltippedElement } from '@/components/tooltipped-element'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MOBILE_PHONE_REGEX, ONLY_LETTERS_REGEX } from '@/lib/regex'
import { cn } from '@/lib/utils'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Building2, InfoIcon, PlusIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useStoreApplicationWizard } from '../context/StoreApplicationWizardContext'
import { EstimatedPackageUnitPriceHint } from './EstimatedPackageUnitPriceHint'

export function StoreDetailsFields() {
  const { branchForm: form, sectors, isLoadingSectors } = useStoreApplicationWizard()
  const sector = form.watch('sector')
  const selectedSubSectors = form.watch('subSectors')
  const [newSubSector, setNewSubSector] = useState('')
  const baseSubSectorOptions = useMemo(
    () => sectors.find(s => s.sector === sector)?.subSectors ?? [],
    [sectors, sector]
  )
  const customSubSectorOptions = useMemo(
    () =>
      selectedSubSectors.filter(
        selected =>
          !baseSubSectorOptions.some(
            option => option.toLocaleLowerCase('tr-TR') === selected.toLocaleLowerCase('tr-TR')
          )
      ),
    [baseSubSectorOptions, selectedSubSectors]
  )
  const subSectorOptions = useMemo(
    () => [...baseSubSectorOptions, ...customSubSectorOptions],
    [baseSubSectorOptions, customSubSectorOptions]
  )

  const sectorOptions = useMemo(() => sectors.map(s => ({ value: s.sector, label: s.sector })), [sectors])

  const handleAddNewSubSector = useCallback(() => {
    const trimmed = newSubSector.trim()
    const trimmedLowerCase = trimmed.toLocaleLowerCase('tr-TR')
    const currentSubSectors = subSectorOptions.map((s: string) => s.toLocaleLowerCase('tr-TR'))

    if (customSubSectorOptions.length >= 5) {
      toast.warning('En fazla 5 alt sektör ekleyebilirsiniz')
      return
    }

    if (trimmed.length > 50) {
      toast.warning('Alt sektör adı en fazla 50 karakter olabilir')
      return
    }

    if (
      trimmedLowerCase &&
      !currentSubSectors.includes(trimmedLowerCase) &&
      !customSubSectorOptions.some(sub => sub.toLocaleLowerCase('tr-TR') === trimmedLowerCase)
    ) {
      form.setValue('subSectors', [...form.getValues('subSectors'), trimmed], {
        shouldDirty: true,
        shouldValidate: true
      })
      setNewSubSector('')
    } else {
      toast.warning('Bu alt sektör zaten listemizde mevcuttur')
    }
  }, [customSubSectorOptions, form, newSubSector, subSectorOptions])

  const handleCheckSubSector = (checked: CheckedState, sub: string) => {
    const next = new Set(form.getValues('subSectors'))
    if (checked === true) next.add(sub)
    else if (checked === false) next.delete(sub)
    form.setValue('subSectors', Array.from(next), { shouldDirty: true, shouldValidate: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='grid grid-cols-2 gap-x-4 text-lg'>
          <div className='flex items-center gap-2'>
            <Building2 className='size-4.5' /> Şube Bilgileri
          </div>
          <div className='-ml-2 flex items-center gap-2 border-l pl-4 max-xl:hidden'>
            Şube Yetkilisi Bilgileri
            <TooltippedElement
              className='max-w-56'
              side='bottom'
              tooltipContent='Bu alanda girilen bilgiler, şubenize ait Partner hesabına girişte kullanılacak iletişim bilgileridir. Her şube, kendi hesabı üzerinden iş süreçlerini yönetecektir. Lütfen bilgilerin doğru ve eksiksiz olduğundan emin olunuz'
            >
              <InfoIcon className='text-primary-700 size-4' />
            </TooltippedElement>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-y-4 xl:grid-cols-2'>
          <div className='grid gap-x-4 gap-y-2 sm:grid-cols-2 xl:pr-4'>
            <FormInputField
              autoFocus
              name='restaurantName'
              control={form.control}
              label='Şube Adı'
              required
              placeholder='Şube adı'
              formItemClassName='max-sm:col-span-2'
              autoComplete='off'
              autoFirstLetterUppercase
              tabIndex={6}
            />
            {isLoadingSectors ? (
              <div className='text-muted-foreground col-span-2 text-sm'>Sektörler yükleniyor...</div>
            ) : (
              <FormSelectField
                name='sector'
                control={form.control}
                label='Sektör'
                required
                placeholder='Sektör seçiniz'
                options={sectorOptions}
                formItemClassName='max-sm:col-span-2'
                onValueChange={() => {
                  form.setValue('subSectors', [], { shouldDirty: true })
                  form.clearErrors('sector')
                }}
                tabIndex={7}
              />
            )}
            <FormField
              control={form.control}
              name='subSectors'
              render={({ field, fieldState }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Alt Sektör *</FormLabel>
                  <div
                    className={cn(
                      'border-border flex max-h-52 flex-wrap gap-2 overflow-y-auto rounded-md border p-3 py-2',
                      fieldState.error && 'border-destructive'
                    )}
                  >
                    {subSectorOptions.length === 0 ? (
                      <p className='text-muted-foreground text-sm'>Önce sektör seçiniz.</p>
                    ) : (
                      subSectorOptions.map(sub => {
                        const checked = field.value?.includes(sub) ?? false
                        return (
                          <label
                            key={sub}
                            className={cn(
                              'hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm',
                              checked && 'border-primary/30 bg-muted/40'
                            )}
                          >
                            <Checkbox
                              tabIndex={8}
                              checked={checked}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === 'Space') {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleCheckSubSector(true, sub)
                                }
                              }}
                              onCheckedChange={v => handleCheckSubSector(v, sub)}
                            />
                            <span>{sub}</span>
                          </label>
                        )
                      })
                    )}

                    {subSectorOptions.length !== 0 && (
                      <ButtonGroup className='w-auto min-w-20'>
                        <Input
                          type='text'
                          size='sm'
                          placeholder='Alt sektör ekle'
                          className='w-28 min-w-auto rounded-r-none'
                          value={newSubSector}
                          autoFirstLetterUppercase
                          onChange={e => setNewSubSector(e.target.value)}
                        />
                        <Button
                          size='icon-sm'
                          type='button'
                          variant='outline'
                          disabled={!newSubSector.trim()}
                          onClick={handleAddNewSubSector}
                        >
                          <PlusIcon className='size-4.5' />
                        </Button>
                      </ButtonGroup>
                    )}
                  </div>
                  <FormMessage className='-mt-2' />
                </FormItem>
              )}
            />
            <div className='col-span-2 grid gap-x-4 sm:grid-cols-2'>
              <FormInputField
                name='dailyPackageEstimate'
                control={form.control}
                label='Günlük Paket Tahmini'
                required
                placeholder='32'
                inputMode='numeric'
                pattern='[0-9]*'
                regexPattern={/^[0-9]{0,6}$/}
                tabIndex={9}
              />

              <EstimatedPackageUnitPriceHint />
            </div>
          </div>
          <div className='flex flex-col gap-2 xl:border-l xl:pl-4'>
            <div className='flex items-center gap-2 border-t pt-4 xl:hidden'>
              <p className='text-lg font-medium'>Şube Yetkilisi Bilgileri</p>
              <TooltippedElement
                className='max-w-56'
                side='bottom'
                tooltipContent='Bu alanda girilen bilgiler, şubenize ait Partner hesabına girişte kullanılacak iletişim bilgileridir. Her şube, kendi hesabı üzerinden iş süreçlerini yönetecektir. Lütfen bilgilerin doğru ve eksiksiz olduğundan emin olunuz'
              >
                <InfoIcon className='text-primary-700 size-4' />
              </TooltippedElement>
            </div>
            <div className='grid gap-x-4 gap-y-2 sm:grid-cols-2'>
              <FormInputField
                name='authFirstName'
                control={form.control}
                label='Ad'
                required
                regexPattern={ONLY_LETTERS_REGEX}
                placeholder='Ad'
                tabIndex={10}
                autoFirstLetterUppercase
              />
              <FormInputField
                name='authSurname'
                control={form.control}
                label='Soyad'
                required
                regexPattern={ONLY_LETTERS_REGEX}
                placeholder='Soyad'
                tabIndex={11}
                autoFirstLetterUppercase
              />
              <FormPhoneField
                name='authPhoneNumber'
                customMask='(500) 000-0000'
                required
                control={form.control}
                label='Cep Telefonu'
                placeholder='(532) 123-4567'
                tabIndex={12}
                regexPattern={MOBILE_PHONE_REGEX}
              />
              <FormInputField
                name='authEmail'
                control={form.control}
                label='E-posta'
                required
                type='email'
                placeholder='ornek@firma.com'
                tabIndex={13}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
