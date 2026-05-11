export type BusinessInfoCompanyType = 'Bireysel' | 'Kurumsal'

/** Evrak yükleme slot’ları — DocumentUploadSection ile aynı anahtarlar. */
export type BusinessInfoDocType = 'taxDocument' | 'idFront' | 'idBack' | 'signatureCircular'

export type BusinessInfoAccountType = 'platform' | 'tenant'

export type SaveBusinessInfoRequest = {
  accountType?: BusinessInfoAccountType
  companyType: BusinessInfoCompanyType
  tckn?: string | null
  vkn?: string | null
  companyName: string
  taxOffice: string
  iban: string
  taxDocumentKey: string
  idFrontKey: string
  idBackKey: string
  signatureCircularKey?: string | null
}
