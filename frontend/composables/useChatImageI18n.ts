import { aspectRatios, carouselImages, featureMeta, planMeta, promptExampleMeta, toolMeta } from '@/data/chatimageData'

export type ChatImageLocale = 'en' | 'zh'

export interface ChatImageMessages {
  nav: string[]
  header: {
    signIn: string
    langLabel: string
    langFlag: string
  }
  generator: {
    badge: string
    title: string
    subtitle1: string
    subtitle2: string
    textToImage: string
    imageToImage: string
    uploadTitle: string
    uploadHint: string
    imageModel: string
    recommended: string
    modelDesc: string
    credits3: string
    promptLabel: string
    promptPlaceholder: string
    resolution: string
    quality: string
    qualities: string[]
    aspectRatio: string
    generateBtn: string
    creditsLeft: (n: number) => string
    openPreview: string
    promptWord: string
    watermarkNote: string
    recentTitle: string
    recentDesc: string
    recentEmpty: string
    carousel: { title: string, category: string, prompt: string }[]
  }
  tools: {
    badge: string
    title: string
    desc: string
    viewMore: string
    openTool: string
    items: { title: string, description: string }[]
  }
  prompts: {
    title: string
    desc: string
    viewAll: string
    caseLabel: string
    curatedFrom: string
    promptSample: string
    viewFull: string
    hidePrompt: string
    items: { category: string, title: string, prompt: string }[]
  }
  features: {
    badge: string
    title: string
    desc: string
    sections: { tag: string, title: string, subtitle: string, description: string }[]
    promptToImage: { tag: string, title: string, subtitle: string, desc: string, bullets: string[] }
    referenceEditing: { tag: string, title: string, subtitle: string, desc: string, bullets: string[] }
  }
  howItWorks: {
    badge: string
    title: string
    desc: string
    stepWord: string
    steps: { title: string, description: string }[]
  }
  useCases: {
    badge: string
    title: string
    desc: string
    examplesLabel: string
    items: { title: string, heading: string, description: string, examples: string }[]
    audienceBadge: string
    audienceTitle: string
    audienceDesc: string
    audiences: { title: string, description: string }[]
  }
  pricing: {
    badge: string
    title: string
    desc: string
    monthly: string
    annually: string
    save: string
    usage: string
    billedAnnually: string
    plans: { tier: string, name: string, tagline: string, usage: string, credits: string, badge?: string, features: string[], cta: string }[]
  }
  faq: {
    badge: string
    title: string
    items: { question: string, answer: string }[]
  }
  cta: {
    badge: string
    title: string
    desc: string
    open: string
    pricing: string
  }
  footer: {
    desc: string
    openGenerator: string
    viewPricing: string
    product: string
    resources: string
    hotBlogs: string
    links: {
      product: string[]
      resources: string[]
      hotBlogs: string[]
    }
    copyright: string
    terms: string
    privacy: string
  }
  cookie: {
    title: string
    badge: string
    body: string
    decline: string
    accept: string
  }
}

const en: ChatImageMessages = {
  nav: ['Home', 'RDR', 'Tools', 'Prompts', 'Blogs', 'Pricing'],
  header: { signIn: 'Sign In', langLabel: 'EN', langFlag: '🇺🇸' },
  generator: {
    badge: 'RDR Generator',
    title: 'RDR',
    subtitle1: 'RDR brings detail back where it belongs: sharper structure, richer texture, and cleaner edges.',
    subtitle2: 'All without sacrificing realism or visual balance.',
    textToImage: 'Text to Image',
    imageToImage: 'Image to Image',
    uploadTitle: 'Upload reference images',
    uploadHint: 'PNG, JPG, WEBP up to 10MB',
    imageModel: 'Image Model',
    recommended: 'Recommended',
    modelDesc: 'Fast, high-quality image generation and editing',
    credits3: '3 credits',
    promptLabel: 'RDR Prompt',
    promptPlaceholder: 'Describe the image you want to create...',
    resolution: 'Resolution',
    quality: 'Quality',
    qualities: ['Low', 'Medium', 'High'],
    aspectRatio: 'Aspect Ratio',
    generateBtn: 'Generate with RDR',
    creditsLeft: (n: number) => `${n} credits left`,
    openPreview: 'Open full preview',
    promptWord: 'Prompt',
    watermarkNote: 'Upgrade to download generated images directly without a watermark.',
    recentTitle: 'Recent generations',
    recentDesc: 'Review your latest RDR outputs, compare versions, and reopen prompts without leaving the browser.',
    recentEmpty: 'No image tasks yet. Generate an image to create the first history row.',
    carousel: [
      { title: 'Douyin livestream UI mockup', category: 'UI & Social Media Mockups', prompt: 'A polished social livestream interface with product cards, chat overlays, creator framing, and mobile-first composition.' },
      { title: 'Soft airy 35mm portrait', category: 'Portrait & Photography', prompt: 'A soft, airy 35mm film portrait with natural window light, shallow depth of field, and warm skin tones.' },
      { title: 'Boston spring city poster', category: 'Poster & Illustration', prompt: 'A bright city poster concept with seasonal energy, clean layout, local landmarks, and print-ready composition.' },
      { title: 'Vintage Amalfi travel poster', category: 'Character Design', prompt: 'A retro travel poster with Mediterranean color, elegant typography space, coastal architecture, and sunlit atmosphere.' },
      { title: 'Chengdu food map illustration', category: 'UI & Social Media Mockups', prompt: 'An illustrated food map with local dishes, playful icons, dense details, and clear information hierarchy.' },
      { title: 'Surreal koi nebula illustration', category: 'Community Examples', prompt: 'A dreamy koi-and-nebula scene with glowing particles, layered depth, and a refined fantasy illustration style.' },
      { title: 'Character relationship map poster', category: 'Community Examples', prompt: 'A structured poster that maps multiple characters, connection lines, labels, and a cinematic composition.' },
      { title: 'Handwritten notebook photo', category: 'Portrait & Photography', prompt: 'A realistic notebook-style social post mockup with handwritten notes, paper texture, and casual desk lighting.' },
      { title: 'Science encyclopedia vertical poster', category: 'Poster & Illustration', prompt: 'A vertical science encyclopedia poster with detailed illustrations, labeled diagrams, and educational layout.' },
      { title: 'Korean idol collage portrait', category: 'Portrait & Photography', prompt: 'A 3x3 grid collage portrait with consistent lighting, editorial styling, and magazine-quality composition.' },
    ],
  },
  tools: {
    badge: 'Tools',
    title: 'AI image tools for specific visual tasks',
    desc: 'Choose a focused tool, upload the required image, set output options, and generate a result without writing prompts or selecting models.',
    viewMore: 'View more tools',
    openTool: 'Open tool',
    items: [
      { title: 'Palm Reading', description: 'Turn a hand photo into a visual palm reading result with line art, cards, and short guide sections.' },
      { title: 'AI Hairstyle Changer', description: 'Analyze your face shape and generate hairstyle ideas that fit your features.' },
      { title: 'Pretty Scale Test', description: 'Generate a pretty scale report with a face rating, proportions, face shape, and grooming guidance.' },
      { title: 'AI Makeup Generator', description: 'Compare cosmetics directions, skin undertone, foundation, lip, blush, and the most flattering makeup style.' },
      { title: 'AI Outfit Generator', description: 'Compare suitable clothing silhouettes, outfit directions, and body-type-friendly styling options.' },
      { title: '360 World Image Generator', description: 'Generate a 16:9 360 world panorama from one upload, then inspect it with drag, zoom, auto-rotate, and fullscreen controls.' },
      { title: 'AI Image Cutout', description: 'Select multiple targets from an image and name them, let AI remove the background to get multiple image cutouts at once.' },
      { title: 'Image Watermark Remover', description: 'Upload one image, remove the watermark, and return a cleaned result in jpeg, png, or webp.' },
      { title: 'Image Face Swap', description: 'Upload one face source and one target image, then swap the selected face with jpeg, png, or webp output.' },
      { title: 'Ghibli Style Filter', description: 'Turn a photo into a warm storybook anime image with a draggable before-and-after comparison.' },
    ],
  },
  prompts: {
    title: 'RDR prompt examples and image results',
    desc: 'Browse prompt ideas for posters, UI mockups, portraits, and product visuals. Study how prompt wording changes composition, detail, and style before writing your own.',
    viewAll: 'View all prompts',
    caseLabel: 'Case',
    curatedFrom: 'Curated from',
    promptSample: 'Prompt sample',
    viewFull: 'View full prompt',
    hidePrompt: 'Hide prompt',
    items: [
      { category: 'Poster & Illustration', title: 'Boston spring city poster', prompt: 'A bright city poster concept with seasonal energy, clean layout, local landmarks, and print-ready composition.' },
      { category: 'UI & Social Media Mockups', title: 'Chengdu food map illustration', prompt: 'An illustrated food map with local dishes, playful icons, dense details, and clear information hierarchy.' },
      { category: 'Poster & Illustration', title: 'Douyin livestream UI mockup', prompt: 'A polished social livestream interface with product cards, chat overlays, creator framing, and mobile-first composition.' },
      { category: 'Community Examples', title: 'Character relationship map poster', prompt: 'A structured poster that maps multiple characters, connection lines, labels, and a cinematic composition.' },
      { category: 'Community Examples', title: 'Surreal koi nebula illustration', prompt: 'A dreamy koi-and-nebula scene with glowing particles, layered depth, and a refined fantasy illustration style.' },
      { category: 'Portrait & Photography', title: 'Handwritten notebook photo', prompt: 'A realistic notebook-style social post mockup with handwritten notes, paper texture, and casual desk lighting.' },
      { category: 'Character Design', title: 'Vintage Amalfi travel poster', prompt: 'A retro travel poster with Mediterranean color, elegant typography space, coastal architecture, and sunlit atmosphere.' },
    ],
  },
  features: {
    badge: 'RDR image generator',
    title: 'Create new images or edit existing ones in one place',
    desc: 'RDR helps you turn prompts and reference images into polished visuals for ads, thumbnails, product images, posters, app screens, and branded content.',
    sections: [
      { tag: 'From prompts', title: 'Text to Image', subtitle: 'Turn prompts into finished visuals', description: 'Generate posters, thumbnails, product shots, concept art, and social graphics from a clear text prompt.' },
      { tag: 'From prompts', title: 'Image to Image', subtitle: 'Edit with reference images', description: 'Upload one or more images when you need closer control over style, composition, brand details, or object changes.' },
      { tag: 'From prompts', title: 'Prompt history', subtitle: 'Compare results and reuse good prompts', description: 'Keep recent generations close so you can test variations, reopen winning prompts, and move faster on the next round.' },
    ],
    promptToImage: {
      tag: 'From prompts',
      title: 'Prompt to image',
      subtitle: 'Generate posters, mockups, and graphics from text',
      desc: 'Use RDR when you want a fast first draft or a finished asset. Adjust size, quality, and aspect ratio to fit feeds, landing pages, and creative briefs.',
      bullets: [
        'Start from a text prompt and generate from scratch',
        'Choose portrait, landscape, or square layouts',
        'Iterate on different styles without rebuilding the workflow',
      ],
    },
    referenceEditing: {
      tag: 'From prompts',
      title: 'Reference editing',
      subtitle: 'Use image uploads for cleaner edits and stronger consistency',
      desc: 'When the output needs to stay closer to a source image, upload references and guide the edit with a focused prompt. This works well for product updates, branded assets, and layout changes.',
      bullets: [
        'Use one or more images as references',
        'Edit parts of an image or restyle the full composition',
        'Keep subjects, products, and visual direction more consistent',
      ],
    },
  },
  howItWorks: {
    badge: 'How it works',
    title: 'How RDR Turns Rough Ideas into Polished Visuals',
    desc: 'Use RDR when image quality, text placement, and visual consistency matter. This workflow is built for teams that want stronger first passes and fewer cleanup rounds.',
    stepWord: 'Step',
    steps: [
      { title: 'Start from the final asset', description: 'Define what you are making before you describe how it should look. Tell RDR whether the output is a poster, hero image, product visual, or campaign graphic, then add audience, tone, and format.' },
      { title: 'Lock the visual language', description: 'Add style cues, reference images, layout notes, brand details, or text hierarchy when the image needs tighter art direction. This is where RDR starts feeling less generic and more production-ready.' },
      { title: 'Polish the last 20 percent', description: 'Generate a few strong versions, then use the best one to improve details, spacing, text rendering, or product accuracy. Small prompt changes often make the difference between a draft and a launch-ready visual.' },
    ],
  },
  useCases: {
    badge: 'Use Cases',
    title: 'What RDR Is Good At in Real Creative Work',
    desc: 'RDR works well when teams care about stronger visual finish, clearer brand direction, and assets that look closer to something they can actually publish, present, or print.',
    examplesLabel: 'Examples:',
    items: [
      { title: 'Campaign Launches', heading: 'Build key visuals for launches and seasonal campaigns', description: 'Use RDR when you need a campaign look that can stretch across multiple formats instead of a single one-off image.', examples: 'launch posters, seasonal sale graphics, countdown banners, event promotion visuals.' },
      { title: 'Product Storytelling', heading: 'Show products in cleaner and more styled scenes', description: 'Create polished product compositions for ecommerce, product pages, feature rollouts, and packaging stories without booking a full shoot for each variation.', examples: 'hero product scenes, packaging mockups, unboxing concepts, lifestyle compositions.' },
      { title: 'Editorial Publishing', heading: 'Create richer visuals for articles, essays, and features', description: 'RDR can support long-form content with visuals that feel more deliberate than generic stock-style illustrations.', examples: 'feature art, magazine-style covers, essay illustrations, newsletter lead visuals.' },
      { title: 'Event Materials', heading: 'Design visual systems for events and presentations', description: 'Use RDR when one event needs more than one graphic, from the announcement post to the stage screen.', examples: 'summit posters, agenda covers, booth panels, keynote background visuals.' },
      { title: 'Brand Systems', heading: 'Explore mascot, illustration, and campaign art directions', description: 'Creative teams can test visual directions before committing to a broader brand illustration system or a larger production cycle.', examples: 'mascot refreshes, brand moodboards, illustration directions, visual identity concepts.' },
      { title: 'Print Graphics', heading: 'Prepare visuals that need stronger composition for print', description: 'RDR is useful when the layout and density of the image matter more than a quick social draft.', examples: 'infographics, menu boards, retail signage, wall posters, printed explainers.' },
    ],
    audienceBadge: 'Use cases',
    audienceTitle: 'Built for everyday creative work',
    audienceDesc: 'Use RDR for campaign art, ecommerce visuals, UI concepts, blog images, social posts, thumbnails, and internal design exploration.',
    audiences: [
      { title: 'Marketing teams', description: 'Make ad creatives, launch graphics, social posts, and landing-page visuals from one prompt workflow.' },
      { title: 'Ecommerce and product', description: 'Create product hero images, packaging mockups, and background variations with reference-based edits.' },
      { title: 'Designers', description: 'Explore directions, test layouts, and develop visual concepts before moving into detailed production tools.' },
      { title: 'Content teams', description: 'Produce blog images, thumbnails, explainers, and branded illustrations faster for publishing.' },
    ],
  },
  pricing: {
    badge: 'Pricing',
    title: 'Pricing for RDR generation and edits',
    desc: 'Choose a plan for prompt testing, reference-image editing, or higher-volume production across teams and campaigns.',
    monthly: 'Monthly',
    annually: 'Annually',
    save: 'Save 25%',
    usage: 'Usage',
    billedAnnually: 'Billed annually',
    plans: [
      { tier: 'Explore', name: 'Free', tagline: 'Try the core image workflow before committing.', usage: '3 trial credits', credits: '', features: ['Text-to-image generation', 'Reference image upload', 'Recent generation history', 'Community support'], cta: 'Start Free' },
      { tier: 'Create', name: 'Basic', tagline: 'A practical plan for solo creators and light production.', usage: 'For regular personal projects', credits: '300 credits monthly · 3,600 total', features: ['More RDR credits', 'Text and reference-image workflows', 'Commercial-ready downloads', 'Email support'], cta: 'Buy Now' },
      { tier: 'Scale', name: 'Professional', tagline: 'Best for creators who iterate daily and need momentum.', usage: 'Best value for daily creation', credits: '650 credits monthly · 7,800 total', badge: 'Most popular', features: ['Higher monthly credit allowance', 'Priority creative iteration', 'Prompt and reference history', 'Priority support'], cta: 'Buy Now' },
      { tier: 'Operate', name: 'Enterprise', tagline: 'For teams building repeatable visual production systems.', usage: 'For teams and heavier workloads', credits: '5,000 credits monthly · 60,000 total', features: ['Largest credit allocation', 'Team production workflow', 'Custom usage guidance', 'Dedicated support'], cta: 'Buy Now' },
    ],
  },
  faq: {
    badge: 'FAQ',
    title: 'RDR FAQ',
    items: [
      { question: 'What is RDR?', answer: 'RDR is an advanced AI image generation and editing model that creates high-quality visuals from text prompts or reference images. It excels at posters, product shots, UI mockups, portraits, and social graphics with strong text rendering and visual consistency.' },
      { question: 'Can RDR edit existing images?', answer: 'Yes. Switch to Image to Image mode and upload one or more reference images. You can restyle compositions, update products, change layouts, or edit specific parts while keeping subjects and brand details more consistent.' },
      { question: 'What can I make with RDR?', answer: 'You can create campaign posters, product hero images, UI mockups, social media graphics, portraits, illustrations, travel posters, infographics, and more. The model supports multiple aspect ratios and quality levels for different use cases.' },
      { question: 'Do I need a reference image to use RDR?', answer: 'No. Text to Image mode lets you generate from scratch using only a prompt. Reference images are optional and useful when you need closer control over style, composition, or visual consistency with existing assets.' },
    ],
  },
  cta: {
    badge: 'Start creating',
    title: 'Create your next image with RDR',
    desc: 'Open the generator, write a prompt, upload references if needed, and make your next poster, mockup, product image, or social graphic in the browser.',
    open: 'Open RDR',
    pricing: 'View pricing',
  },
  footer: {
    desc: 'ChatImage helps teams generate and refine high-quality visuals from prompts and reference images through a simpler, more focused web experience.',
    openGenerator: 'Open Generator',
    viewPricing: 'View Pricing',
    product: 'Product',
    resources: 'Resources',
    hotBlogs: 'Hot Blogs',
    links: {
      product: ['Home', 'Generator', 'Pricing'],
      resources: ['Blogs', 'Terms', 'Privacy'],
      hotBlogs: ['Prompt examples', 'AI image tools', 'Feature guide'],
    },
    copyright: '© 2026 ChatImage. All rights reserved.',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
  },
  cookie: {
    title: 'We use cookies',
    badge: 'Privacy friendly',
    body: 'We use essential cookies to keep ChatImage working and optional analytics to understand how people use the product. You can review details in our Cookie Policy.',
    decline: 'Decline',
    accept: 'Accept all',
  },
}

const zh: ChatImageMessages = {
  nav: ['首页', 'RDR', '工具', '提示词', '博客', '定价'],
  header: { signIn: '登录', langLabel: '中文', langFlag: '🇨🇳' },
  generator: {
    badge: 'RDR 生成器',
    title: 'RDR',
    subtitle1: 'RDR 让细节回归本位：更锐利的结构、更丰富的纹理、更干净的边缘。',
    subtitle2: '同时不牺牲真实感与视觉平衡。',
    textToImage: '文生图',
    imageToImage: '图生图',
    uploadTitle: '上传参考图',
    uploadHint: '支持 PNG、JPG、WEBP，最大 10MB',
    imageModel: '图像模型',
    recommended: '推荐',
    modelDesc: '快速、高质量的图像生成与编辑',
    credits3: '3 积分',
    promptLabel: 'RDR 提示词',
    promptPlaceholder: '描述你想要创建的图像……',
    resolution: '分辨率',
    quality: '质量',
    qualities: ['低', '中', '高'],
    aspectRatio: '宽高比',
    generateBtn: '使用 RDR 生成',
    creditsLeft: (n: number) => `剩余 ${n} 积分`,
    openPreview: '打开完整预览',
    promptWord: '提示词',
    watermarkNote: '升级后可直接下载无水印的生成图像。',
    recentTitle: '最近生成',
    recentDesc: '查看你最新的 RDR 输出、比较不同版本，并在浏览器中重新打开提示词。',
    recentEmpty: '暂无图像任务。生成一张图像即可创建第一条历史记录。',
    carousel: [
      { title: '抖音直播 UI 原型', category: 'UI 与社交媒体原型', prompt: '精致的社交直播界面，包含商品卡片、聊天浮层、创作者画面和移动端优先的构图。' },
      { title: '柔和通透的 35mm 人像', category: '人像与摄影', prompt: '柔和通透的 35mm 胶片人像，自然窗光、浅景深、温暖肤色。' },
      { title: '波士顿春季城市海报', category: '海报与插画', prompt: '明亮的城市海报概念，富有季节气息、布局简洁、本地地标、可印刷构图。' },
      { title: '复古阿马尔菲旅行海报', category: '角色设计', prompt: '复古旅行海报，地中海色彩、优雅的排版空间、海岸建筑和阳光氛围。' },
      { title: '成都美食地图插画', category: 'UI 与社交媒体原型', prompt: '插画风美食地图，包含本地菜肴、俏皮图标、丰富细节和清晰的信息层级。' },
      { title: '超现实锦鲤星云插画', category: '社区作品', prompt: '梦幻的锦鲤与星云场景，发光粒子、层次纵深、精致的奇幻插画风格。' },
      { title: '人物关系图海报', category: '社区作品', prompt: '结构化海报，映射多个人物、连接线、标签和电影化构图。' },
      { title: '手写笔记照片', category: '人像与摄影', prompt: '逼真的笔记本风格社交帖原型，含手写笔记、纸张质感和随性的桌面灯光。' },
      { title: '科普百科竖版海报', category: '海报与插画', prompt: '竖版科普百科海报，含精细插图、标注图解和教育性布局。' },
      { title: '韩国偶像拼贴人像', category: '人像与摄影', prompt: '3x3 网格拼贴人像，灯光统一、编辑风格造型、杂志级构图。' },
    ],
  },
  tools: {
    badge: '工具',
    title: '针对特定视觉任务的 AI 图像工具',
    desc: '选择一个专注的工具，上传所需图像，设置输出选项，无需编写提示词或选择模型即可生成结果。',
    viewMore: '查看更多工具',
    openTool: '打开工具',
    items: [
      { title: '手相分析', description: '将手部照片转化为可视化手相结果，含线条图、卡片和简短解读。' },
      { title: 'AI 发型更换', description: '分析你的脸型，生成适合你五官的发型创意。' },
      { title: '颜值评分测试', description: '生成颜值评分报告，含面部评分、比例、脸型和形象建议。' },
      { title: 'AI 妆容生成', description: '比较彩妆方向、肤色调性、粉底、唇色、腮红以及最适合的妆容风格。' },
      { title: 'AI 穿搭生成', description: '比较合适的服装廓形、穿搭方向以及适合体型的造型选项。' },
      { title: '360 全景图生成', description: '从单张上传图生成 16:9 的 360 全景图，并可拖拽、缩放、自动旋转和全屏查看。' },
      { title: 'AI 图像抠图', description: '从图像中选择并命名多个目标，让 AI 去除背景，一次性获得多张抠图。' },
      { title: '图像水印去除', description: '上传一张图像，去除水印，并返回 jpeg、png 或 webp 的干净结果。' },
      { title: '图像换脸', description: '上传一张人脸源图和一张目标图，将选中的人脸替换，输出 jpeg、png 或 webp。' },
      { title: '吉卜力风格滤镜', description: '将照片转化为温暖的故事书动漫风格，并可拖拽对比前后效果。' },
    ],
  },
  prompts: {
    title: 'RDR 提示词示例与图像结果',
    desc: '浏览海报、UI 原型、人像和产品视觉的提示词创意。在动笔之前，研究提示词措辞如何改变构图、细节和风格。',
    viewAll: '查看全部提示词',
    caseLabel: '案例',
    curatedFrom: '精选自',
    promptSample: '提示词示例',
    viewFull: '查看完整提示词',
    hidePrompt: '收起提示词',
    items: [
      { category: '海报与插画', title: '波士顿春季城市海报', prompt: '明亮的城市海报概念，富有季节气息、布局简洁、本地地标、可印刷构图。' },
      { category: 'UI 与社交媒体原型', title: '成都美食地图插画', prompt: '插画风美食地图，包含本地菜肴、俏皮图标、丰富细节和清晰的信息层级。' },
      { category: '海报与插画', title: '抖音直播 UI 原型', prompt: '精致的社交直播界面，包含商品卡片、聊天浮层、创作者画面和移动端优先的构图。' },
      { category: '社区作品', title: '人物关系图海报', prompt: '结构化海报，映射多个人物、连接线、标签和电影化构图。' },
      { category: '社区作品', title: '超现实锦鲤星云插画', prompt: '梦幻的锦鲤与星云场景，发光粒子、层次纵深、精致的奇幻插画风格。' },
      { category: '人像与摄影', title: '手写笔记照片', prompt: '逼真的笔记本风格社交帖原型，含手写笔记、纸张质感和随性的桌面灯光。' },
      { category: '角色设计', title: '复古阿马尔菲旅行海报', prompt: '复古旅行海报，地中海色彩、优雅的排版空间、海岸建筑和阳光氛围。' },
    ],
  },
  features: {
    badge: 'RDR 图像生成器',
    title: '在同一处创建新图像或编辑现有图像',
    desc: 'RDR 帮助你将提示词和参考图转化为精致的视觉作品，用于广告、缩略图、产品图、海报、应用界面和品牌内容。',
    sections: [
      { tag: '来自提示词', title: '文生图', subtitle: '将提示词变为成品视觉', description: '从清晰的文本提示生成海报、缩略图、产品图、概念艺术和社交媒体图。' },
      { tag: '来自提示词', title: '图生图', subtitle: '使用参考图进行编辑', description: '当你需要对风格、构图、品牌细节或物体改动进行更精细控制时，上传一张或多张图像。' },
      { tag: '来自提示词', title: '提示词历史', subtitle: '比较结果并复用优秀提示词', description: '将最近的生成保留在身边，方便测试变体、重新打开优胜提示词，并在下一轮中更快推进。' },
    ],
    promptToImage: {
      tag: '来自提示词',
      title: '提示词生成图像',
      subtitle: '从文本生成海报、原型和图形',
      desc: '当你想要快速初稿或成品资产时使用 RDR。调整尺寸、质量和宽高比，以适配信息流、落地页和创意需求。',
      bullets: [
        '从文本提示开始，从零生成',
        '选择竖版、横版或方形布局',
        '在不重建工作流的情况下迭代不同风格',
      ],
    },
    referenceEditing: {
      tag: '来自提示词',
      title: '参考图编辑',
      subtitle: '使用图像上传获得更干净的编辑和更强的一致性',
      desc: '当输出需要更贴近源图时，上传参考图并用专注的提示词引导编辑。这非常适合产品更新、品牌资产和布局调整。',
      bullets: [
        '使用一张或多张图像作为参考',
        '编辑图像局部或重塑整体构图',
        '让主体、产品和视觉方向更一致',
      ],
    },
  },
  howItWorks: {
    badge: '工作原理',
    title: 'RDR 如何将粗略想法变为精致视觉',
    desc: '当图像质量、文字排布和视觉一致性很重要时使用 RDR。该工作流专为希望获得更强初稿、减少返工的团队打造。',
    stepWord: '步骤',
    steps: [
      { title: '从最终成品出发', description: '在描述外观之前先确定你要做什么。告诉 RDR 输出是海报、主视觉、产品图还是活动图形，再补充受众、调性和格式。' },
      { title: '锁定视觉语言', description: '当图像需要更严谨的艺术指导时，加入风格线索、参考图、布局说明、品牌细节或文字层级。这正是 RDR 开始变得不那么通用、更具量产水准的地方。' },
      { title: '打磨最后 20%', description: '先生成几个出色的版本，然后用最好的一个去改进细节、间距、文字渲染或产品准确度。微小的提示词改动往往决定了草稿与可上线视觉之间的差别。' },
    ],
  },
  useCases: {
    badge: '应用场景',
    title: 'RDR 在真实创意工作中的强项',
    desc: '当团队在意更强的视觉完成度、更清晰的品牌方向，以及更接近可直接发布、展示或印刷的成品时，RDR 表现出色。',
    examplesLabel: '示例：',
    items: [
      { title: '活动发布', heading: '为发布和季节性活动打造关键视觉', description: '当你需要一套能延展到多种格式而非单张图的活动视觉时，使用 RDR。', examples: '发布海报、季节促销图、倒计时横幅、活动推广视觉。' },
      { title: '产品叙事', heading: '在更干净、更有质感的场景中展示产品', description: '为电商、产品页、功能上线和包装故事创建精致的产品构图，无需为每个变体安排完整拍摄。', examples: '产品主视觉、包装原型、开箱概念、生活方式构图。' },
      { title: '内容出版', heading: '为文章、随笔和专题创建更丰富的视觉', description: 'RDR 可为长文内容提供比通用素材图更有意图感的视觉。', examples: '专题配图、杂志风封面、随笔插画、新闻通讯主图。' },
      { title: '活动物料', heading: '为活动和演示设计视觉体系', description: '当一场活动需要不止一张图形时（从预告帖到舞台大屏），使用 RDR。', examples: '峰会海报、议程封面、展位面板、主题演讲背景视觉。' },
      { title: '品牌体系', heading: '探索吉祥物、插画和活动艺术方向', description: '创意团队可在投入更大的品牌插画体系或量产周期之前测试视觉方向。', examples: '吉祥物焕新、品牌情绪板、插画方向、视觉识别概念。' },
      { title: '印刷图形', heading: '准备需要更强构图的印刷视觉', description: '当图像的布局和密度比快速社交草稿更重要时，RDR 很有用。', examples: '信息图、菜单板、零售标识、墙面海报、印刷说明图。' },
    ],
    audienceBadge: '应用场景',
    audienceTitle: '为日常创意工作而生',
    audienceDesc: '将 RDR 用于活动艺术、电商视觉、UI 概念、博客配图、社交帖、缩略图和内部设计探索。',
    audiences: [
      { title: '市场团队', description: '通过同一套提示词工作流制作广告创意、发布图形、社交帖和落地页视觉。' },
      { title: '电商与产品', description: '通过基于参考图的编辑创建产品主视觉、包装原型和背景变体。' },
      { title: '设计师', description: '在进入精细的量产工具之前，探索方向、测试布局并发展视觉概念。' },
      { title: '内容团队', description: '更快地为发布制作博客配图、缩略图、说明图和品牌插画。' },
    ],
  },
  pricing: {
    badge: '定价',
    title: 'RDR 生成与编辑的定价',
    desc: '选择适合提示词测试、参考图编辑，或面向团队与活动的更高产量生产的方案。',
    monthly: '按月',
    annually: '按年',
    save: '节省 25%',
    usage: '用量',
    billedAnnually: '按年计费',
    plans: [
      { tier: '探索', name: '免费版', tagline: '在投入之前先体验核心图像工作流。', usage: '3 个试用积分', credits: '', features: ['文生图生成', '参考图上传', '最近生成历史', '社区支持'], cta: '免费开始' },
      { tier: '创作', name: '基础版', tagline: '适合个人创作者和轻量生产的实用方案。', usage: '适合常规个人项目', credits: '每月 300 积分 · 共 3,600', features: ['更多 RDR 积分', '文本与参考图工作流', '可商用下载', '邮件支持'], cta: '立即购买' },
      { tier: '进阶', name: '专业版', tagline: '最适合每天迭代、需要保持节奏的创作者。', usage: '日常创作的最佳性价比', credits: '每月 650 积分 · 共 7,800', badge: '最受欢迎', features: ['更高的月度积分额度', '优先创意迭代', '提示词与参考图历史', '优先支持'], cta: '立即购买' },
      { tier: '运营', name: '企业版', tagline: '面向构建可复用视觉生产体系的团队。', usage: '面向团队和更重的工作负载', credits: '每月 5,000 积分 · 共 60,000', features: ['最大的积分配额', '团队生产工作流', '定制用量指导', '专属支持'], cta: '立即购买' },
    ],
  },
  faq: {
    badge: '常见问题',
    title: 'RDR 常见问题',
    items: [
      { question: '什么是 RDR？', answer: 'RDR 是一款先进的 AI 图像生成与编辑模型，可从文本提示或参考图创建高质量视觉。它在海报、产品图、UI 原型、人像和社交图方面表现出色，文字渲染和视觉一致性都很强。' },
      { question: 'RDR 能编辑现有图像吗？', answer: '可以。切换到图生图模式并上传一张或多张参考图。你可以重塑构图、更新产品、更改布局或编辑特定部分，同时让主体和品牌细节更一致。' },
      { question: '我可以用 RDR 做什么？', answer: '你可以创建活动海报、产品主视觉、UI 原型、社交媒体图形、人像、插画、旅行海报、信息图等。该模型支持多种宽高比和质量等级，适配不同的使用场景。' },
      { question: '使用 RDR 需要参考图吗？', answer: '不需要。文生图模式让你仅凭提示词从零生成。参考图是可选项，当你需要对风格、构图或与现有资产的视觉一致性进行更精细控制时会很有用。' },
    ],
  },
  cta: {
    badge: '开始创作',
    title: '用 RDR 创建你的下一张图像',
    desc: '打开生成器，写下提示词，按需上传参考图，在浏览器中制作你的下一张海报、原型、产品图或社交图形。',
    open: '打开 RDR',
    pricing: '查看定价',
  },
  footer: {
    desc: 'ChatImage 通过更简洁、更专注的网页体验，帮助团队从提示词和参考图生成并精修高质量视觉。',
    openGenerator: '打开生成器',
    viewPricing: '查看定价',
    product: '产品',
    resources: '资源',
    hotBlogs: '热门博客',
    links: {
      product: ['首页', '生成器', '定价'],
      resources: ['博客', '条款', '隐私'],
      hotBlogs: ['提示词示例', 'AI 图像工具', '功能指南'],
    },
    copyright: '© 2026 ChatImage 版权所有。',
    terms: '服务条款',
    privacy: '隐私政策',
  },
  cookie: {
    title: '我们使用 Cookie',
    badge: '注重隐私',
    body: '我们使用必要的 Cookie 来保持 ChatImage 正常运行，并使用可选的分析来了解人们如何使用产品。你可以在我们的 Cookie 政策中查看详情。',
    decline: '拒绝',
    accept: '全部接受',
  },
}

const messages: Record<ChatImageLocale, ChatImageMessages> = { en, zh }

export function useChatImageI18n() {
  const locale = useState<ChatImageLocale>('chatimage-locale', () => 'en')

  function setLocale(next: ChatImageLocale) {
    locale.value = next
    if (import.meta.client) {
      try {
        localStorage.setItem('chatimage-locale', next)
      }
      catch {
        // ignore storage errors (private mode, etc.)
      }
    }
  }

  function toggleLocale() {
    setLocale(locale.value === 'en' ? 'zh' : 'en')
  }

  onMounted(() => {
    try {
      const saved = localStorage.getItem('chatimage-locale') as ChatImageLocale | null
      if (saved === 'en' || saved === 'zh') {
        locale.value = saved
      }
    }
    catch {
      // ignore
    }
  })

  const t = computed(() => messages[locale.value])

  return {
    locale,
    t,
    setLocale,
    toggleLocale,
    aspectRatios,
    carouselImages,
    toolMeta,
    promptExampleMeta,
    featureMeta,
    planMeta,
  }
}
