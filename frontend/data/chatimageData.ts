// Locale-neutral structural data (images, ids, slugs, prices). All display text
// lives in `composables/useChatImageI18n.ts` and is merged with this by index.

export const aspectRatios = ['1:1', '3:2', '2:3', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']

export const navHrefs = ['#home', '#generator', '#tools', '#prompts', '#features', '#pricing']

export const carouselImages = [
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1501596510947-1c2c0c0c0c0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1533105079780-92b9be482357?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1528360980567-abaa312fb066?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1455390582260-0446debbce0a?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=600&fit=crop',
]

export interface ToolMeta {
  slug: string
  image: string
}

export const toolMeta: ToolMeta[] = [
  { slug: 'palm-reading', image: 'https://images.unsplash.com/photo-1516570178947-d9b42b4620f7?w=400&h=300&fit=crop' },
  { slug: 'ai-hairstyle-changer', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop' },
  { slug: 'pretty-scale-test', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop' },
  { slug: 'ai-makeup-generator', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop' },
  { slug: 'ai-outfit-generator', image: 'https://images.unsplash.com/photo-1483985988354-763728e3685b?w=400&h=300&fit=crop' },
  { slug: '360-world-image-generator', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop' },
  { slug: 'ai-image-cutout', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop' },
  { slug: 'image-watermark-remover', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { slug: 'image-face-swap', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop' },
  { slug: 'ghibli-style-filter', image: 'https://images.unsplash.com/photo-1578632762642-2fe4f4d4b4c4?w=400&h=300&fit=crop' },
]

export interface PromptExampleMeta {
  id: number
  curator: string
  image: string
}

export const promptExampleMeta: PromptExampleMeta[] = [
  { id: 39, curator: '@MrLarus', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=750&fit=crop' },
  { id: 34, curator: '@loglogrog', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=750&fit=crop' },
  { id: 68, curator: '@verysmallwoods', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=750&fit=crop' },
  { id: 33, curator: '@joshesye', image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=750&fit=crop' },
  { id: 34, curator: '@FixlationAI', image: 'https://images.unsplash.com/photo-1528360980567-abaa312fb066?w=600&h=750&fit=crop' },
  { id: 4, curator: '@BubbleBrain', image: 'https://images.unsplash.com/photo-1455390582260-0446debbce0a?w=600&h=750&fit=crop' },
  { id: 5, curator: '@Toshi_nyaruo_AI', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482357?w=600&h=750&fit=crop' },
]

export interface FeatureMeta {
  image: string
  caseLabel: string
}

export const featureMeta: FeatureMeta[] = [
  { image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=700&h=500&fit=crop', caseLabel: 'Case 36' },
  { image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&h=500&fit=crop', caseLabel: 'Case 9' },
  { image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&h=500&fit=crop', caseLabel: 'Case 11' },
]

export interface PlanMeta {
  price: string
  billing: string
  highlighted?: boolean
}

export const planMeta: PlanMeta[] = [
  { price: '$0', billing: '/mo' },
  { price: '$14.9', billing: '/mo' },
  { price: '$29.9', billing: '/mo', highlighted: true },
  { price: '$199.9', billing: '/mo' },
]
