export type WelcomeCompanyType = 'Bireysel' | 'Kurumsal'

/** Evrak yükleme slot’ları — DocumentUploadSection ile aynı anahtarlar. */
export type WelcomeDocType = 'taxDocument' | 'idFront' | 'idBack' | 'signatureCircular' | 'tradeRegistryGazette'

export type WelcomeAccountType = 'platform' | 'tenant'

export type SaveFinancialDetailsRequest = {
  accountType?: WelcomeAccountType
  companyType: WelcomeCompanyType
  tckn?: string | null
  vkn?: string | null
  companyName: string
  taxOffice: string
  iban: string
  taxDocumentKey: string
  idFrontKey?: string | null
  idBackKey?: string | null
  tradeRegistryGazetteKey?: string | null
  signatureCircularKey?: string | null
}
