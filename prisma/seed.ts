// prisma/seed.ts
// 运行: npm run db:seed
// 相当于 Django 的 fixtures 或 management command

import { PrismaClient, Pricing } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 清空旧数据
  await prisma.tool.deleteMany()
  await prisma.category.deleteMany()

  // 创建分类
  const categories = await Promise.all([
    prisma.category.create({ data: { name: '对话机器人', slug: 'chat',    icon: '🤖', sort: 1 } }),
    prisma.category.create({ data: { name: '图像生成',   slug: 'image',   icon: '🎨', sort: 2 } }),
    prisma.category.create({ data: { name: '写作助手',   slug: 'writing', icon: '✍️', sort: 3 } }),
    prisma.category.create({ data: { name: '编程开发',   slug: 'coding',  icon: '💻', sort: 4 } }),
    prisma.category.create({ data: { name: '视频创作',   slug: 'video',   icon: '🎬', sort: 5 } }),
    prisma.category.create({ data: { name: '音频语音',   slug: 'audio',   icon: '🎙️', sort: 6 } }),
    prisma.category.create({ data: { name: 'AI搜索',     slug: 'search',  icon: '🔍', sort: 7 } }),
    prisma.category.create({ data: { name: '办公效率',   slug: 'office',  icon: '📊', sort: 8 } }),
  ])

  const [chat, image, writing, coding, video, audio, search, office] = categories

  // 初始工具数据
  const tools = [
    {
      name: 'Claude', slug: 'claude',
      description: 'Anthropic出品，长文理解和分析能力突出，中文支持优秀',
      website: 'https://claude.ai', icon: '🤖',
      pricing: Pricing.FREEMIUM, rating: 4.9, ratingCount: 1203,
      featured: true, approved: true, tags: ['长文本', '分析', '中文'],
      categoryId: chat.id,
    },
    {
      name: 'ChatGPT', slug: 'chatgpt',
      description: 'OpenAI旗舰产品，GPT-4o支持图文混合输入，插件生态丰富',
      website: 'https://chatgpt.com', icon: '💬',
      pricing: Pricing.FREEMIUM, rating: 4.8, ratingCount: 3401,
      featured: true, approved: true, tags: ['插件', '多模态', '编程'],
      categoryId: chat.id,
    },
    {
      name: 'Midjourney', slug: 'midjourney',
      description: '顶级AI图像生成，艺术风格独特，摄影级写实效果',
      website: 'https://midjourney.com', icon: '🎨',
      pricing: Pricing.PAID, rating: 4.8, ratingCount: 2198,
      featured: true, approved: true, tags: ['艺术', '写实', 'Discord'],
      categoryId: image.id,
    },
    {
      name: 'FLUX.1', slug: 'flux',
      description: '开源图像生成模型，本地部署友好，商用免费',
      website: 'https://blackforestlabs.ai', icon: '🖼️',
      pricing: Pricing.FREE, rating: 4.7, ratingCount: 876,
      featured: false, approved: true, tags: ['开源', '本地部署', '免费商用'],
      categoryId: image.id,
    },
    {
      name: 'Cursor', slug: 'cursor',
      description: 'AI代码编辑器，基于VS Code，Agent模式可自主修改多个文件',
      website: 'https://cursor.sh', icon: '💻',
      pricing: Pricing.FREEMIUM, rating: 4.9, ratingCount: 1567,
      featured: true, approved: true, tags: ['编辑器', 'Agent', '代码补全'],
      categoryId: coding.id,
    },
    {
      name: 'GitHub Copilot', slug: 'github-copilot',
      description: '微软+OpenAI联合出品，IDE代码补全的行业标准',
      website: 'https://github.com/features/copilot', icon: '⚡',
      pricing: Pricing.PAID, rating: 4.6, ratingCount: 2341,
      featured: false, approved: true, tags: ['VS Code', 'JetBrains', 'Python'],
      categoryId: coding.id,
    },
    {
      name: 'Notion AI', slug: 'notion-ai',
      description: '集成在Notion中，文档写作、会议纪要总结一站式',
      website: 'https://notion.so', icon: '📝',
      pricing: Pricing.FREEMIUM, rating: 4.5, ratingCount: 987,
      featured: false, approved: true, tags: ['文档', '总结', '团队协作'],
      categoryId: writing.id,
    },
    {
      name: 'Runway Gen-3', slug: 'runway',
      description: 'AI视频生成新标杆，文字和图片都能转高质量视频',
      website: 'https://runwayml.com', icon: '🎬',
      pricing: Pricing.FREEMIUM, rating: 4.7, ratingCount: 654,
      featured: true, approved: true, tags: ['文生视频', '图生视频', '特效'],
      categoryId: video.id,
    },
    {
      name: 'ElevenLabs', slug: 'elevenlabs',
      description: '声音克隆和文字转语音，效果接近真人，支持中文',
      website: 'https://elevenlabs.io', icon: '🎙️',
      pricing: Pricing.FREEMIUM, rating: 4.7, ratingCount: 823,
      featured: false, approved: true, tags: ['声音克隆', 'TTS', '中文'],
      categoryId: audio.id,
    },
    {
      name: 'Perplexity', slug: 'perplexity',
      description: 'AI搜索引擎，实时联网检索，所有答案都有来源引用',
      website: 'https://perplexity.ai', icon: '🔍',
      pricing: Pricing.FREEMIUM, rating: 4.6, ratingCount: 1102,
      featured: true, approved: true, tags: ['实时联网', '引用来源', '学术'],
      categoryId: search.id,
    },
    {
      name: 'Gamma', slug: 'gamma',
      description: '输入主题，AI自动生成精美PPT，支持中文，10秒出结果',
      website: 'https://gamma.app', icon: '📊',
      pricing: Pricing.FREEMIUM, rating: 4.5, ratingCount: 743,
      featured: false, approved: true, tags: ['PPT', '演示文稿', '中文'],
      categoryId: office.id,
    },
    {
      name: 'Suno AI', slug: 'suno',
      description: '输入描述或歌词，秒生成完整歌曲，含人声，每天50首免费',
      website: 'https://suno.com', icon: '🎵',
      pricing: Pricing.FREEMIUM, rating: 4.8, ratingCount: 1298,
      featured: true, approved: true, tags: ['音乐生成', '人声', '免费额度'],
      categoryId: audio.id,
    },
  ]

  for (const tool of tools) {
    await prisma.tool.create({ data: tool })
  }

  console.log(`✅ 已创建 ${categories.length} 个分类, ${tools.length} 个工具`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
