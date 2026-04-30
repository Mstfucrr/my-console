import type { SupplyOrderDetail, SupplyPaymentInformation } from '../../types'

export const mockSupplyPaymentInformation: SupplyPaymentInformation = {
  iban: 'TR44 0001 0000 1234 5678 9012 34',
  accountName: 'FASDAT Gıda Dağıtım A.Ş.',
  description: 'Sipariş numarasını açıklama alanına ekleyiniz.'
}

export const mockSupplyOrderDetails: SupplyOrderDetail[] = [
  {
    id: 'SO-2026-001',
    totalAmount: 4630,
    orderDate: '2026-04-20T10:30:00.000Z',
    isPaymentReceived: true,
    productCount: 5,
    items: [
      {
        productId: '1',
        productName: 'Fastro Donuk 9x18 Patates 6x2.5 KG (Fastro) (18 KG) (KOL) (6 Adet / KOL) (Ücretsiz Kargo)',
        brandName: 'FASTRO',
        quantity: 2,
        unitPrice: 900,
        totalPrice: 1800
      },
      {
        productId: '4',
        productName: 'Akdeniz Yeşilliği Fresh Mix 500 GR x 16',
        brandName: 'FASDAT',
        quantity: 1,
        unitPrice: 1280,
        totalPrice: 1280
      },
      {
        productId: '12',
        productName: 'Fastro Donuk Ispanak 4x2.5 KG',
        brandName: 'FASTRO',
        quantity: 1,
        unitPrice: 680,
        totalPrice: 680
      },
      {
        productId: '6',
        productName: 'Kırmızı Lahana 1 KG x 8 Paket',
        brandName: 'FASDAT',
        quantity: 1,
        unitPrice: 780,
        totalPrice: 780
      },
      {
        productId: '11',
        productName: 'Kaplamasız Patates 6x2.5 KG',
        brandName: 'FASTRO',
        quantity: 1,
        unitPrice: 780,
        totalPrice: 780
      }
    ]
  },
  {
    id: 'SO-2026-002',
    totalAmount: 3350,
    orderDate: '2026-04-24T07:45:00.000Z',
    isPaymentReceived: false,
    productCount: 1,
    items: [
      {
        productId: '8',
        productName: 'Rella Mozzarella Peyniri 12 KG',
        brandName: 'RELLA',
        quantity: 1,
        unitPrice: 3350,
        totalPrice: 3350
      }
    ]
  },
  {
    id: 'SO-2026-003',
    totalAmount: 2000,
    orderDate: '2026-04-27T14:15:00.000Z',
    isPaymentReceived: false,
    productCount: 2,
    items: [
      {
        productId: '7',
        productName: 'Melus Çıtır Soğan 1000 GR x 6 Paket',
        brandName: 'MELUS',
        quantity: 1,
        unitPrice: 1000,
        totalPrice: 1000
      },
      {
        productId: '7',
        productName: 'Melus Çıtır Soğan 1000 GR x 6 Paket',
        brandName: 'MELUS',
        quantity: 1,
        unitPrice: 1000,
        totalPrice: 1000
      }
    ]
  }
]
