import aboutData from '@/content/data/about.json'
import homeData from '@/content/data/home.json'
import caseIndex from '@/content/data/cases/index.json'
import coldChain from '@/content/data/cases/cold-chain.json'
import foodFactory from '@/content/data/cases/food-factory.json'
import productIndex from '@/content/data/products/index.json'
import xz3000 from '@/content/data/products/xz-3000.json'
import xz5000 from '@/content/data/products/xz-5000.json'
import solutionIndex from '@/content/data/solutions/index.json'
import truckScaleSystem from '@/content/data/solutions/truck-scale-system.json'
import warehouseSystem from '@/content/data/solutions/warehouse-system.json'

export const companyInfo = {
  brandName: { zh: 'NextSCAD Studio', en: 'NextSCAD Studio' },
  fullName: aboutData.company.name,
  tagline: {
    zh: '參數化 CAD 建模 × 智能稱重系統',
    en: 'Parametric CAD modeling × Intelligent weighing systems'
  },
  description: aboutData.company.desc,
  mission: aboutData.company.mission,
  phone: '—',
  mobile: '—',
  fax: '—',
  email: 'kongzhanliang24@github',
  hours: { zh: '依 GitHub Issues 回覆', en: 'Respond via GitHub Issues' },
  storeAddress: {
    zh: 'GitHub：github.com/kongzhanliang24-cmyk/NextSCAD-Studio',
    en: 'GitHub: github.com/kongzhanliang24-cmyk/NextSCAD-Studio'
  },
  factoryAddress: {
    zh: '開源倉庫（歡迎 Pull Request）',
    en: 'Open-source repository (Pull Requests welcome)'
  },
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/kongzhanliang24-cmyk/NextSCAD-Studio' },
    { label: 'Facebook', href: 'https://github.com/kongzhanliang24-cmyk/NextSCAD-Studio' },
    { label: 'LINE', href: 'https://github.com/kongzhanliang24-cmyk/NextSCAD-Studio' }
  ]
}

export const primaryNavigation = [
  { href: '/', label: { zh: '首頁', en: 'Home' } },
  { href: '/products', label: { zh: '產品', en: 'Products' } },
  { href: '/solutions', label: { zh: '解決方案', en: 'Solutions' } },
  { href: '/cases', label: { zh: '案例', en: 'Cases' } },
  { href: '/about', label: { zh: '關於我們', en: 'About' } },
  { href: '/contact', label: { zh: '聯絡我們', en: 'Contact' } }
]

export const products = [xz3000, xz5000]
export const solutions = [warehouseSystem, truckScaleSystem]
export const cases = [foodFactory, coldChain]

export const productCategories = homeData.categories.map((category) => ({
  ...category,
  count: products.filter((product) => product.category === category.slug).length
}))

export const featuredProducts = productIndex.products
export const featuredSolutions = solutionIndex.solutions
export const featuredCases = (homeData.featured_cases || [])
  .map((slug) => cases.find((item) => item.slug === slug))
  .filter(Boolean)

export const heroMetrics = aboutData.stats
export const aboutMetrics = aboutData.stats
export const aboutAdvantages = aboutData.advantages
export const aboutCertifications = aboutData.certifications
export const caseIndustries = caseIndex.industries

export const homeStoryMoments = [
  {
    eyebrow: { zh: 'Hardware Precision', en: 'Hardware Precision' },
    title: { zh: '從智能秤終端、感測模組到通訊介面，精準度與連接能力同時建立', en: 'Precision and connectivity begin together from the smart-scale terminal, sensing module, and communication interface.' },
    description: {
      zh: '針對潮濕、低溫、重載與連續作業等場景，我們讓智能秤同時兼具穩定感測、耐用結構與資料輸出能力。',
      en: 'For humid, cold, heavy-duty, and continuous operations, our smart scales combine stable sensing, durable structure, and connected data output.'
    },
    bullets: [
      { zh: '高精度感測與穩定長時間輸出', en: 'High-precision sensing with stable long-duration output' },
      { zh: '支援通訊介面與現場資料採集', en: 'Supports communication interfaces and on-site data capture' },
      { zh: '適應食品、冷鏈、物流與製造現場', en: 'Ready for food, cold-chain, logistics, and manufacturing operations' }
    ]
  },
  {
    eyebrow: { zh: 'System Integration', en: 'System Integration' },
    title: { zh: '不只是賣設備，而是把智能秤、流程、報表與 ERP / WMS 串成系統', en: 'We do not just deliver devices—we connect smart scales, workflows, reporting, and ERP / WMS into one system.' },
    description: {
      zh: '透過資料自動採集、權限管理、標籤列印與系統對接，智能秤現場可被轉成可管理的營運資料。',
      en: 'With automatic data capture, permission control, label printing, and system integration, smart-scale operations become manageable business data.'
    },
    bullets: [
      { zh: '倉儲、冷鏈與車輛過磅多情境支援', en: 'Support for warehouse, cold-chain, and vehicle-weighing scenarios' },
      { zh: '報表、追溯與異常管理一次到位', en: 'Reporting, traceability, and anomaly control in one flow' },
      { zh: '支援 ERP / WMS / 財務系統整合', en: 'Integrates with ERP, WMS, and finance systems' }
    ]
  },
  {
    eyebrow: { zh: 'Business Impact', en: 'Business Impact' },
    title: { zh: '最終交付的不是一台秤，而是更快、更準、更可追溯的智能稱重流程', en: 'The final deliverable is not just a scale, but a faster, more accurate, and traceable smart weighing workflow.' },
    description: {
      zh: '從現場上秤到資料回傳管理端，每一個節點都為效率與決策服務，讓企業在擴張時仍保有秩序。',
      en: 'From the smart-scale station to the management dashboard, every node is designed for operational efficiency and better decisions.'
    },
    bullets: [
      { zh: '降低人工重複輸入與錯誤率', en: 'Reduce repetitive manual input and error rates' },
      { zh: '縮短入出庫、過磅與對帳流程', en: 'Shorten inbound, weighing, and reconciliation cycles' },
      { zh: '強化管理層對即時數據的掌握', en: 'Strengthen managerial control over real-time data' }
    ]
  }
]

export const homeValuePoints = [
  {
    title: { zh: '精準度', en: 'Accuracy' },
    body: { zh: '以穩定感測、結構設計與校準流程，讓智能秤維持長時間可靠輸出。', en: 'Stable sensing, structural design, and calibration processes keep smart scales reliable over time.' }
  },
  {
    title: { zh: '系統化', en: 'Systemization' },
    body: { zh: '將智能秤現場變成有資料、有流程、有追溯的作業系統。', en: 'Turn smart-scale operations into a traceable, data-driven workflow system.' }
  },
  {
    title: { zh: '可擴充', en: 'Scalability' },
    body: { zh: '支援多台智能秤、多站點與多角色管理，讓導入可以跟著業務一起成長。', en: 'Support multi-scale, multi-site, and multi-role management for scalable deployments.' }
  }
]

export const contactPromises = [
  { zh: '快速評估智能秤需求與規格方向', en: 'Fast smart-scale requirement assessment and specification guidance' },
  { zh: '提供智能秤選型與系統整合建議', en: 'Smart scale selection and system integration advice' },
  { zh: '可安排展示、安裝、培訓與導入規劃', en: 'Demo, installation, training, and rollout planning available' }
]

export const productConfiguratorProfiles = Object.fromEntries(
  products
    .filter((product) => product.configurator)
    .map((product) => [
      product.slug,
      {
        ...product.configurator,
        baseModelPath: product.configurator.baseModel?.path || ''
      }
    ])
)

export function getCategoryBySlug(slug) {
  return productCategories.find((category) => category.slug === slug) || null
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug) || null
}

export function getProductConfiguratorProfile(slug) {
  return productConfiguratorProfiles[slug] || null
}

export function getProductsByCategory(slug) {
  return products.filter((product) => product.category === slug)
}

export function getSolutionBySlug(slug) {
  return solutions.find((solution) => solution.slug === slug) || null
}

export function getCaseBySlug(slug) {
  return cases.find((caseItem) => caseItem.slug === slug) || null
}

export function getRelatedProducts(slug) {
  return products.filter((product) => product.slug !== slug).slice(0, 2)
}

export function getRelatedSolutions(slug) {
  return solutions.filter((solution) => solution.slug !== slug).slice(0, 2)
}

export function getRelatedCases(slug) {
  return cases.filter((caseItem) => caseItem.slug !== slug).slice(0, 2)
}
