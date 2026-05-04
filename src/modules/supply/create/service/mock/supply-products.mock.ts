import type { SupplyBrand, SupplyCategory, SupplyProduct } from '../../types'

const mockSupplyCategoryStubs = [
  { id: 'frozen', name: 'Donuk Ürünler' },
  { id: 'vegetable', name: 'Sebze' },
  { id: 'dairy', name: 'Süt Ürünleri' }
] as const

export const mockSupplyBrands: SupplyBrand[] = [
  { id: 'fasdat', name: 'FASDAT' },
  { id: 'fastro', name: 'FASTRO' },
  { id: 'rella', name: 'RELLA' },
  { id: 'melus', name: 'MELUS' }
]

const categoriesById = Object.fromEntries(
  mockSupplyCategoryStubs.map(category => [category.id, { id: category.id, name: category.name } as SupplyCategory])
)
const brandsById = Object.fromEntries(mockSupplyBrands.map(brand => [brand.id, brand]))

const getCategory = (id: string) => categoriesById[id]!
const getBrand = (id: string) => brandsById[id]!

export const mockSupplyProducts: SupplyProduct[] = [
  {
    id: '1',
    name: 'Fastro Donuk 9x18 Patates 6x2.5 KG (Fastro) (18 KG) (KOL) (6 Adet / KOL) (Ücretsiz Kargo) (Kırmızı) (5%) (Taze)',
    brand: getBrand('fastro'),
    category: getCategory('frozen'),
    quantityPerBox: 6,
    boxWeight: '15 KG',
    unit: 'KOL',
    price: 900
  },
  {
    id: '2',
    name: 'Fastro Donuk 7x7 Patates 6x2.5 KG',
    brand: getBrand('fastro'),
    category: getCategory('frozen'),
    quantityPerBox: 6,
    boxWeight: '15 KG',
    unit: 'KOL',
    price: 850,
    hasDiscount: true,
    discountPercent: 10
  },
  {
    id: '3',
    name: 'Fastro Donuk Brokoli 4x2.5 KG',
    brand: getBrand('fastro'),
    category: getCategory('frozen'),
    quantityPerBox: 4,
    boxWeight: '10 KG',
    unit: 'KOL',
    price: 835
  },
  {
    id: '4',
    name: 'Akdeniz Yeşilliği Fresh Mix 500 GR x 16',
    brand: getBrand('fasdat'),
    category: getCategory('vegetable'),
    quantityPerBox: 16,
    boxWeight: '8 KG',
    unit: 'KOL',
    price: 1280,
    freeShipping: true
  },
  {
    id: '5',
    name: 'Green Mix 1 KG x 8 Paket',
    brand: getBrand('fasdat'),
    category: getCategory('vegetable'),
    quantityPerBox: 8,
    boxWeight: '8 KG',
    unit: 'KOL',
    price: 1380
  },
  {
    id: '6',
    name: 'Kırmızı Lahana 1 KG x 8 Paket',
    brand: getBrand('fasdat'),
    category: getCategory('vegetable'),
    quantityPerBox: 8,
    boxWeight: '8 KG',
    unit: 'KOL',
    price: 780
  },
  {
    id: '7',
    name: 'Melus Çıtır Soğan 1000 GR x 6 Paket',
    brand: getBrand('melus'),
    category: getCategory('vegetable'),
    quantityPerBox: 6,
    boxWeight: '6 KG',
    unit: 'KOL',
    price: 1000
  },
  {
    id: '8',
    name: 'Rella Mozzarella Peyniri 12 KG',
    brand: getBrand('rella'),
    category: getCategory('dairy'),
    quantityPerBox: 1,
    boxWeight: '12 KG',
    unit: 'KOL',
    price: 3350
  },
  {
    id: '9',
    name: 'Peynir Stick 1.5 KG x 10 Adet',
    brand: getBrand('rella'),
    category: getCategory('dairy'),
    quantityPerBox: 10,
    boxWeight: '15 KG',
    unit: 'KOL',
    price: 3350
  },
  {
    id: '10',
    name: 'Fasdat Göbek Marul 1 KG x 8 Paket',
    brand: getBrand('fasdat'),
    category: getCategory('vegetable'),
    quantityPerBox: 8,
    boxWeight: '8 KG',
    unit: 'KOL',
    price: 1180
  },
  {
    id: '11',
    name: 'Kaplamasız Patates 6x2.5 KG',
    brand: getBrand('fastro'),
    category: getCategory('frozen'),
    quantityPerBox: 6,
    boxWeight: '15 KG',
    unit: 'KOL',
    price: 780,
    freeShipping: true
  },
  {
    id: '12',
    name: 'Fastro Donuk Ispanak 4x2.5 KG',
    brand: getBrand('fastro'),
    category: getCategory('frozen'),
    quantityPerBox: 4,
    boxWeight: '10 KG',
    unit: 'KOL',
    price: 680
  }
]

const productCountByCategoryId = mockSupplyProducts.reduce<Record<string, number>>((acc, product) => {
  acc[product.category.id] = (acc[product.category.id] ?? 0) + 1
  return acc
}, {})

export const mockSupplyCategories: SupplyCategory[] = mockSupplyCategoryStubs.map(category => ({
  id: category.id,
  name: category.name,
  productCount: productCountByCategoryId[category.id] ?? 0
}))
