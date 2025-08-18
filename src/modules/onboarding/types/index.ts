import { LucideIcon } from 'lucide-react'

export interface CompanyInfo {
  companyName: string
  companyType: string
  taxNumber: string
  taxOffice: string
  companyPhone: string
  companyEmail: string
}

export interface AddressInfo {
  companyAddress: string
  companyCity: string
  companyDistrict: string
  billingAddress: string
  billingCity: string
  billingDistrict: string
  sameAsCompany: boolean
}

export interface ContactInfo {
  managerName: string
  managerPhone: string
  managerEmail: string
  accountantName: string
  accountantPhone: string
  accountantEmail: string
}

export interface BankInfo {
  bankName: string
  iban: string
  accountHolder: string
  branchCode: string
}

export interface Preferences {
  notifications: boolean
  marketing: boolean
  analytics: boolean
}

export interface OnboardingData {
  companyInfo: CompanyInfo
  addressInfo: AddressInfo
  contactInfo: ContactInfo
  bankInfo: BankInfo
  preferences: Preferences
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: LucideIcon
}
