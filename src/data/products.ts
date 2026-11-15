export type ProductCategory = 'Shoes' | 'Apparel' | 'Accessories'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  tagline: string
  colors: string[]
  /** CSS gradient used as the procedural product art until real renders land. */
  gradient: string
  /** Optional corner badge, e.g. NEW. */
  badge?: string
}

export const productCategories: ProductCategory[] = [
  'Shoes',
  'Apparel',
  'Accessories',
]

export const categoryFilters = ['All', ...productCategories] as const

export type CategoryFilter = (typeof categoryFilters)[number]

export const products: Product[] = [
  // --- Shoes (6) -----------------------------------------------------------
  {
    id: 'air-volt-runner',
    badge: 'NEW',
    name: 'Air Volt Runner',
    category: 'Shoes',
    price: 149.99,
    tagline: 'Built for the ones who never slow down.',
    colors: ['Volt', 'Black', 'White'],
    gradient:
      'linear-gradient(135deg, #d4ff3f 0%, #8bcf00 38%, #1c1c1c 100%)',
  },
  {
    id: 'court-legend-82',
    name: 'Court Legend 82',
    category: 'Shoes',
    price: 109.99,
    tagline: 'Old-school hardwood. New-school attitude.',
    colors: ['Bone', 'Black', 'Gum'],
    gradient:
      'linear-gradient(150deg, #f7f2e8 0%, #d8cbb4 52%, #151515 100%)',
  },
  {
    id: 'aero-max-270',
    name: 'Aero Max 270',
    category: 'Shoes',
    price: 179.99,
    tagline: 'Big air. Bigger statements.',
    colors: ['White', 'Volt', 'Grey'],
    gradient:
      'linear-gradient(135deg, #ffffff 0%, #c3cbd1 48%, #111111 100%)',
  },
  {
    id: 'tempo-track-spike',
    name: 'Tempo Track Spike',
    category: 'Shoes',
    price: 129.99,
    tagline: 'Every split is a statement.',
    colors: ['Crimson', 'Black', 'White'],
    gradient:
      'linear-gradient(140deg, #ff5a36 0%, #c21807 46%, #111111 100%)',
  },
  {
    id: 'cloud-foam-glide',
    name: 'Cloud Foam Glide',
    category: 'Shoes',
    price: 139.99,
    tagline: 'Feels like landing on nothing.',
    colors: ['Ice', 'Slate', 'Volt'],
    gradient:
      'linear-gradient(135deg, #d6f0ff 0%, #7fa9bf 50%, #0e1c24 100%)',
  },
  {
    id: 'metro-hi-court',
    name: 'Metro Hi Court',
    category: 'Shoes',
    price: 119.99,
    tagline: 'Street-ready from the first step.',
    colors: ['Black', 'Bone', 'Orange'],
    gradient:
      'linear-gradient(145deg, #111111 0%, #2e2e2e 48%, #ff7a1a 100%)',
  },

  // --- Apparel (4) ---------------------------------------------------------
  {
    id: 'tech-fleece-hoodie',
    name: 'Tech Fleece Hoodie',
    category: 'Apparel',
    price: 89.99,
    tagline: 'Warmth without the weight.',
    colors: ['Heather Grey', 'Black', 'Volt'],
    gradient:
      'linear-gradient(135deg, #dedede 0%, #9a9a9a 50%, #1a1a1a 100%)',
  },
  {
    id: 'windrunner-jacket',
    badge: 'NEW',
    name: 'Windrunner Jacket',
    category: 'Apparel',
    price: 119.99,
    tagline: 'Cheat the wind. Own the weather.',
    colors: ['Black', 'Volt', 'White'],
    gradient:
      'linear-gradient(120deg, #111111 0%, #2c4a12 50%, #d4ff3f 100%)',
  },
  {
    id: 'pro-dri-fit-tee',
    name: 'Pro Dri-FIT Tee',
    category: 'Apparel',
    price: 34.99,
    tagline: 'Sweat-wicking. Zero excuses.',
    colors: ['White', 'Black', 'Volt'],
    gradient:
      'linear-gradient(135deg, #fbfbfb 0%, #dedede 55%, #b0b0b0 100%)',
  },
  {
    id: 'everyday-cargo-pant',
    name: 'Everyday Cargo Pant',
    category: 'Apparel',
    price: 79.99,
    tagline: 'Utility that moves with you.',
    colors: ['Olive', 'Black', 'Sand'],
    gradient:
      'linear-gradient(140deg, #4c5036 0%, #2b2e1e 55%, #111111 100%)',
  },

  // --- Accessories (2) -----------------------------------------------------
  {
    id: 'heritage-backpack',
    badge: 'NEW',
    name: 'Heritage Backpack',
    category: 'Accessories',
    price: 59.99,
    tagline: 'Carry everything. Feel nothing.',
    colors: ['Black', 'Volt', 'Grey'],
    gradient:
      'linear-gradient(145deg, #1b1b1b 0%, #3a3a3a 55%, #d4ff3f 125%)',
  },
  {
    id: 'pro-training-cap',
    name: 'Pro Training Cap',
    category: 'Accessories',
    price: 29.99,
    tagline: 'Shade for the grind.',
    colors: ['Black', 'White', 'Volt'],
    gradient:
      'linear-gradient(135deg, #161616 0%, #454545 55%, #f5f5f5 100%)',
  },
]

/** Default size used when a product is added to the bag without an explicit user choice. */
export function defaultSizeFor(product: Product): string | undefined {
  if (product.category === 'Shoes') {
    return 'US 9'
  }
  if (product.category === 'Apparel') {
    return 'M'
  }
  return undefined
}

/** Uppercase typographic monogram (first letter of every word) used for procedural art overlays. */
export function productMonogram(product: Product): string {
  return product.name
    .toUpperCase()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')
}
