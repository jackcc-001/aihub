// prisma/seed.ts
import { PrismaClient, Pricing } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.review.deleteMany()
  await prisma.tool.deleteMany()
  await prisma.category.deleteMany()

  const categories = await Promise.all([
    prisma.category.create({ data: { name: '对话大模型', slug: 'chat',    icon: '🤖', sort: 1 } }),
    prisma.category.create({ data: { name: '图像生成',   slug: 'image',   icon: '🎨', sort: 2 } }),
    prisma.category.create({ data: { name: '写作助手',   slug: 'writing', icon: '✍️', sort: 3 } }),
    prisma.category.create({ data: { name: '编程开发',   slug: 'coding',  icon: '💻', sort: 4 } }),
    prisma.category.create({ data: { name: '视频创作',   slug: 'video',   icon: '🎬', sort: 5 } }),
    prisma.category.create({ data: { name: '音频语音',   slug: 'audio',   icon: '🎙️', sort: 6 } }),
    prisma.category.create({ data: { name: 'AI搜索',     slug: 'search',  icon: '🔍', sort: 7 } }),
    prisma.category.create({ data: { name: '办公效率',   slug: 'office',  icon: '📊', sort: 8 } }),
    prisma.category.create({ data: { name: 'AI绘画',     slug: 'paint',   icon: '🖌️', sort: 9 } }),
    prisma.category.create({ data: { name: '智能体',     slug: 'agent',   icon: '🧠', sort: 10 } }),
  ])

  const [chat, image, writing, coding, video, audio, search, office, paint, agent] = categories

  const tools = [
    // ===== 国际对话大模型 =====
    {
      name: 'Claude', slug: 'claude',
      description: 'Anthropic出品，长文理解和分析能力突出，中文表达自然，安全性行业领先',
      detail: 'Claude 是由 Anthropic 开发的新一代 AI 助手，以长上下文（200K tokens）、严谨分析和安全性著称。Claude 3.7 Sonnet 在代码、数学、写作等多个维度超越竞品，是目前中文使用体验最好的国际模型之一。',
      website: 'https://claude.ai', icon: '🤖',
      pricing: Pricing.FREEMIUM, rating: 4.9, ratingCount: 1203,
      featured: true, approved: true, tags: ['长文本', '分析', '中文', '安全'],
      categoryId: chat.id,
    },
    {
      name: 'ChatGPT', slug: 'chatgpt',
      description: 'OpenAI旗舰产品，GPT-4o多模态输入，插件生态最丰富',
      detail: 'ChatGPT 是全球用户最多的 AI 对话产品。GPT-4o 支持文字、图片、语音多模态交互，配合 GPTs 插件市场可扩展出无数场景。适合日常问答、内容创作和复杂推理。',
      website: 'https://chatgpt.com', icon: '💬',
      pricing: Pricing.FREEMIUM, rating: 4.8, ratingCount: 3401,
      featured: true, approved: true, tags: ['多模态', '插件', 'GPTs', '语音'],
      categoryId: chat.id,
    },
    {
      name: 'Gemini', slug: 'gemini',
      description: 'Google最强大模型，深度集成Google搜索和Workspace',
      detail: 'Gemini 是 Google DeepMind 开发的多模态大模型，Ultra版本在多项基准测试中表现优异。与 Gmail、Docs、Drive 深度集成，适合 Google 生态用户。',
      website: 'https://gemini.google.com', icon: '♊',
      pricing: Pricing.FREEMIUM, rating: 4.7, ratingCount: 1876,
      featured: false, approved: true, tags: ['Google', '多模态', '搜索增强'],
      categoryId: chat.id,
    },

    // ===== 中国对话大模型 =====
    {
      name: '文心一言', slug: 'wenxin',
      description: '百度出品，中文理解最强，接入文库/地图/搜索等百度生态',
      detail: '文心一言（ERNIE Bot）是百度基于文心大模型开发的生成式AI产品。在中文语言理解、知识问答、内容创作方面表现优秀，并深度集成百度搜索、百度地图、百度文库等生态产品。企业版提供 API 接入。',
      website: 'https://yiyan.baidu.com', icon: '🌊',
      pricing: Pricing.FREEMIUM, rating: 4.5, ratingCount: 2341,
      featured: true, approved: true, tags: ['百度', '中文', '搜索增强', '国产'],
      categoryId: chat.id,
    },
    {
      name: '通义千问', slug: 'tongyi',
      description: '阿里云出品，多模态能力强，免费额度大，支持API',
      detail: '通义千问（Qwen）是阿里云推出的大语言模型，开源版本在国际榜单表现亮眼。支持文字、图片、语音、视频多模态，免费额度慷慨，是开发者首选的国产模型之一。',
      website: 'https://tongyi.aliyun.com', icon: '🔮',
      pricing: Pricing.FREEMIUM, rating: 4.6, ratingCount: 1987,
      featured: true, approved: true, tags: ['阿里', '开源', '多模态', 'API'],
      categoryId: chat.id,
    },
    {
      name: '讯飞星火', slug: 'xinghuo',
      description: '科大讯飞出品，语音识别全球领先，中文对话自然流畅',
      detail: '讯飞星火认知大模型由科大讯飞发布，依托其在语音识别领域多年积累，在语音交互体验上具有明显优势。支持多轮对话、文档解析、代码生成，在教育场景有深度布局。',
      website: 'https://xinghuo.xfyun.cn', icon: '✨',
      pricing: Pricing.FREEMIUM, rating: 4.4, ratingCount: 1234,
      featured: false, approved: true, tags: ['讯飞', '语音', '教育', '国产'],
      categoryId: chat.id,
    },
    {
      name: '智谱清言', slug: 'zhipu',
      description: '清华技术背景，GLM系列模型，学术推理能力突出',
      detail: '智谱清言基于清华大学 KEG 实验室开发的 GLM 系列大模型，在学术推理、逻辑分析方面表现出色。提供 ChatGLM 开源版本，是科研和开发者社区热门选择。',
      website: 'https://chatglm.cn', icon: '🎯',
      pricing: Pricing.FREEMIUM, rating: 4.5, ratingCount: 876,
      featured: false, approved: true, tags: ['清华', 'GLM', '开源', '学术'],
      categoryId: chat.id,
    },
    {
      name: 'DeepSeek', slug: 'deepseek',
      description: '深度求索出品，推理能力媲美GPT-4，API价格极低，开源',
      detail: 'DeepSeek 是深度求索开发的大语言模型，DeepSeek-R1 在数学、代码推理方面达到国际顶尖水平，且完全开源。API 调用价格仅为 OpenAI 的 1/10，受到全球开发者追捧。2025年初引发全球关注。',
      website: 'https://chat.deepseek.com', icon: '🐳',
      pricing: Pricing.FREEMIUM, rating: 4.8, ratingCount: 3210,
      featured: true, approved: true, tags: ['开源', '推理', '低价API', '国产'],
      categoryId: chat.id,
    },
    {
      name: '豆包', slug: 'doubao',
      description: '字节跳动出品，免费不限量，日常对话体验流畅',
      detail: '豆包是字节跳动旗下的AI对话产品，基于自研云雀大模型。免费使用无额度限制，适合日常问答、写作辅助、学习帮助。与抖音、剪映等字节系产品逐步打通。',
      website: 'https://www.doubao.com', icon: '🫘',
      pricing: Pricing.FREE, rating: 4.4, ratingCount: 2109,
      featured: true, approved: true, tags: ['字节', '免费', '日常对话', '国产'],
      categoryId: chat.id,
    },
    {
      name: '月之暗面 Kimi', slug: 'kimi',
      description: '长文本处理冠军，支持200万字上下文，读论文/合同首选',
      detail: 'Kimi 是月之暗面（Moonshot AI）推出的 AI 助手，以超长上下文处理能力著称，最高支持 200 万字输入。适合读取长篇论文、法律合同、财务报告等场景，中文写作质量优秀。',
      website: 'https://kimi.moonshot.cn', icon: '🌙',
      pricing: Pricing.FREEMIUM, rating: 4.6, ratingCount: 1543,
      featured: true, approved: true, tags: ['长文本', '文档分析', '中文', '国产'],
      categoryId: chat.id,
    },
    {
      name: '混元大模型', slug: 'hunyuan',
      description: '腾讯出品，接入微信/企业微信生态，适合企业场景',
      detail: '腾讯混元大模型在中文对话、内容生成方面具备较强能力，深度整合腾讯云、微信、企业微信等生态。提供企业级 API 服务，适合有腾讯云基础设施的企业客户。',
      website: 'https://hunyuan.tencent.com', icon: '🐧',
      pricing: Pricing.FREEMIUM, rating: 4.3, ratingCount: 876,
      featured: false, approved: true, tags: ['腾讯', '企业', '微信生态', '国产'],
      categoryId: chat.id,
    },
    {
      name: '商量 SenseChat', slug: 'sensechat',
      description: '商汤科技出品，多模态能力强，在医疗/法律等专业领域有优势',
      detail: '商量（SenseChat）是商汤科技基于自研日日新大模型推出的 AI 助手，在专业知识问答、文档理解、图像分析方面表现优秀，提供行业定制化解决方案。',
      website: 'https://chat.sensetime.com', icon: '🔭',
      pricing: Pricing.FREEMIUM, rating: 4.2, ratingCount: 432,
      featured: false, approved: true, tags: ['商汤', '专业领域', '多模态', '国产'],
      categoryId: chat.id,
    },
    {
      name: '海螺AI', slug: 'hailuo',
      description: 'MiniMax出品，角色扮演和情感陪伴体验出色',
      detail: '海螺 AI 是 MiniMax 旗下的 AI 对话产品，在创意写作、角色扮演、情感交流方面体验独特。MiniMax 同时提供视频生成产品 Hailuo Video，在国际市场颇具影响力。',
      website: 'https://hailuoai.com', icon: '🐚',
      pricing: Pricing.FREEMIUM, rating: 4.3, ratingCount: 654,
      featured: false, approved: true, tags: ['MiniMax', '角色扮演', '创意', '国产'],
      categoryId: chat.id,
    },

    // ===== 图像生成 =====
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
      name: '即梦AI', slug: 'jimeng',
      description: '字节跳动出品，中文提示词生图体验最好，免费额度充足',
      detail: '即梦 AI（原剪映旗下）是字节跳动推出的 AI 绘画产品，支持中文提示词直接生图，无需翻译。在人物生成、国风插画方面表现优秀，与剪映视频创作深度整合。',
      website: 'https://jimeng.jianying.com', icon: '🌸',
      pricing: Pricing.FREEMIUM, rating: 4.5, ratingCount: 1876,
      featured: true, approved: true, tags: ['中文提示词', '国风', '字节', '国产'],
      categoryId: image.id,
    },
    {
      name: '通义万象', slug: 'wanxiang',
      description: '阿里云图像生成，支持中文提示，商业授权清晰',
      website: 'https://tongyi.aliyun.com/wanxiang', icon: '🌈',
      pricing: Pricing.FREEMIUM, rating: 4.3, ratingCount: 654,
      featured: false, approved: true, tags: ['阿里', '中文', '商业授权', '国产'],
      categoryId: image.id,
    },
    {
      name: '文心一格', slug: 'yige',
      description: '百度AI绘画，中国元素和国风风格生成效果突出',
      website: 'https://yige.baidu.com', icon: '🏮',
      pricing: Pricing.FREEMIUM, rating: 4.2, ratingCount: 543,
      featured: false, approved: true, tags: ['百度', '国风', '中国元素', '国产'],
      categoryId: image.id,
    },

    // ===== 视频创作 =====
    {
      name: 'Runway Gen-3', slug: 'runway',
      description: 'AI视频生成新标杆，文字和图片都能转高质量视频',
      website: 'https://runwayml.com', icon: '🎬',
      pricing: Pricing.FREEMIUM, rating: 4.7, ratingCount: 654,
      featured: true, approved: true, tags: ['文生视频', '图生视频', '特效'],
      categoryId: video.id,
    },
    {
      name: '可灵AI', slug: 'kling',
      description: '快手出品，国产视频生成标杆，5秒/10秒高清视频生成',
      detail: '可灵 AI 是快手旗下的视频生成产品，基于自研视频生成大模型。支持文生视频、图生视频，最长可生成 3 分钟视频，在运动流畅性和物理真实感方面国内领先，已在国际市场引发广泛关注。',
      website: 'https://klingai.com', icon: '🎞️',
      pricing: Pricing.FREEMIUM, rating: 4.7, ratingCount: 1432,
      featured: true, approved: true, tags: ['快手', '视频生成', '国产', '高清'],
      categoryId: video.id,
    },
    {
      name: '即梦视频', slug: 'jimeng-video',
      description: '字节跳动出品，与剪映深度集成，视频生成+剪辑一体化',
      website: 'https://jimeng.jianying.com', icon: '✂️',
      pricing: Pricing.FREEMIUM, rating: 4.5, ratingCount: 876,
      featured: false, approved: true, tags: ['字节', '剪映', '一体化', '国产'],
      categoryId: video.id,
    },
    {
      name: 'Sora', slug: 'sora',
      description: 'OpenAI视频生成，物理世界模拟能力惊艳，现已对外开放',
      website: 'https://sora.com', icon: '🌀',
      pricing: Pricing.PAID, rating: 4.6, ratingCount: 987,
      featured: false, approved: true, tags: ['OpenAI', '物理模拟', '高质量'],
      categoryId: video.id,
    },

    // ===== 编程开发 =====
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
      name: '通义灵码', slug: 'lingma',
      description: '阿里云出品，国产代码助手，免费不限量，中文注释友好',
      detail: '通义灵码是阿里云推出的智能编程助手，基于通义大模型，支持代码补全、注释生成、单测生成、代码解释等功能。完全免费，插件支持 VS Code 和 JetBrains，对中文注释和国内编程习惯有针对性优化。',
      website: 'https://lingma.aliyun.com', icon: '🧩',
      pricing: Pricing.FREE, rating: 4.5, ratingCount: 1234,
      featured: true, approved: true, tags: ['阿里', '免费', '中文', '国产'],
      categoryId: coding.id,
    },
    {
      name: '文心快码', slug: 'comate',
      description: '百度出品的AI编程助手，接入文心大模型，支持100+编程语言',
      website: 'https://comate.baidu.com', icon: '🔧',
      pricing: Pricing.FREEMIUM, rating: 4.3, ratingCount: 654,
      featured: false, approved: true, tags: ['百度', '多语言', '国产'],
      categoryId: coding.id,
    },

    // ===== 写作助手 =====
    {
      name: 'Notion AI', slug: 'notion-ai',
      description: '集成在Notion中，文档写作、会议纪要总结一站式',
      website: 'https://notion.so', icon: '📝',
      pricing: Pricing.FREEMIUM, rating: 4.5, ratingCount: 987,
      featured: false, approved: true, tags: ['文档', '总结', '团队协作'],
      categoryId: writing.id,
    },
    {
      name: '秘塔写作猫', slug: 'xiezuomao',
      description: '国产写作神器，AI改写/润色/降重，学生党必备',
      detail: '写作猫是秘塔科技推出的 AI 写作平台，提供文章润色、语法纠错、AI 续写、降重改写等功能。在学术论文辅助、公文写作方面有特色功能，是国内学生和职场人士常用工具。',
      website: 'https://xiezuomao.com', icon: '🐱',
      pricing: Pricing.FREEMIUM, rating: 4.4, ratingCount: 2109,
      featured: true, approved: true, tags: ['降重', '润色', '学术', '国产'],
      categoryId: writing.id,
    },

    // ===== 音频语音 =====
    {
      name: 'ElevenLabs', slug: 'elevenlabs',
      description: '声音克隆和文字转语音，效果接近真人，支持中文',
      website: 'https://elevenlabs.io', icon: '🎙️',
      pricing: Pricing.FREEMIUM, rating: 4.7, ratingCount: 823,
      featured: false, approved: true, tags: ['声音克隆', 'TTS', '中文'],
      categoryId: audio.id,
    },
    {
      name: 'Suno AI', slug: 'suno',
      description: '输入描述或歌词，秒生成完整歌曲，含人声，每天50首免费',
      website: 'https://suno.com', icon: '🎵',
      pricing: Pricing.FREEMIUM, rating: 4.8, ratingCount: 1298,
      featured: true, approved: true, tags: ['音乐生成', '人声', '免费额度'],
      categoryId: audio.id,
    },
    {
      name: '天工音乐', slug: 'tiangong-music',
      description: '昆仑万维出品，国内首批AI音乐生成，中文歌词生成效果好',
      website: 'https://music.tiangong.cn', icon: '🎶',
      pricing: Pricing.FREEMIUM, rating: 4.3, ratingCount: 432,
      featured: false, approved: true, tags: ['中文歌词', '国产', '免费'],
      categoryId: audio.id,
    },

    // ===== AI搜索 =====
    {
      name: 'Perplexity', slug: 'perplexity',
      description: 'AI搜索引擎，实时联网检索，所有答案都有来源引用',
      website: 'https://perplexity.ai', icon: '🔍',
      pricing: Pricing.FREEMIUM, rating: 4.6, ratingCount: 1102,
      featured: true, approved: true, tags: ['实时联网', '引用来源', '学术'],
      categoryId: search.id,
    },
    {
      name: '秘塔AI搜索', slug: 'metaso',
      description: '国产AI搜索黑马，无广告，答案精准，学术搜索体验极佳',
      detail: '秘塔 AI 搜索是秘塔科技推出的 AI 搜索引擎，以无广告、答案精准著称。支持学术论文搜索、全网信息聚合，界面简洁。在国内 AI 搜索赛道迅速崛起，月活增长速度惊人。',
      website: 'https://metaso.cn', icon: '🔭',
      pricing: Pricing.FREE, rating: 4.7, ratingCount: 2341,
      featured: true, approved: true, tags: ['无广告', '学术', '国产', '免费'],
      categoryId: search.id,
    },
    {
      name: '天工AI搜索', slug: 'tiangong-search',
      description: '昆仑万维出品，AI搜索+对话一体，支持实时信息检索',
      website: 'https://search.tiangong.cn', icon: '🌤️',
      pricing: Pricing.FREE, rating: 4.3, ratingCount: 654,
      featured: false, approved: true, tags: ['实时', '国产', '免费'],
      categoryId: search.id,
    },

    // ===== 办公效率 =====
    {
      name: 'Gamma', slug: 'gamma',
      description: '输入主题，AI自动生成精美PPT，支持中文，10秒出结果',
      website: 'https://gamma.app', icon: '📊',
      pricing: Pricing.FREEMIUM, rating: 4.5, ratingCount: 743,
      featured: false, approved: true, tags: ['PPT', '演示文稿', '中文'],
      categoryId: office.id,
    },
    {
      name: 'WPS AI', slug: 'wps-ai',
      description: '金山出品，融入WPS办公套件，国内用户零学习成本',
      detail: 'WPS AI 是金山办公将 AI 能力集成到 WPS 文字、表格、演示中的功能集合。支持文档总结、内容生成、数据分析、智能排版，对于已有 WPS 使用习惯的国内用户几乎零门槛。',
      website: 'https://ai.wps.cn', icon: '📋',
      pricing: Pricing.FREEMIUM, rating: 4.4, ratingCount: 1876,
      featured: true, approved: true, tags: ['WPS', '文档', '表格', '国产'],
      categoryId: office.id,
    },

    // ===== 智能体 =====
    {
      name: 'Coze扣子', slug: 'coze',
      description: '字节跳动出品，零代码搭建AI智能体，可发布到各平台',
      detail: 'Coze（扣子）是字节跳动推出的 AI 应用开发平台，无需编程即可搭建 AI Bot。支持接入各类插件、知识库，发布到微信、飞书、豆包等平台。国内版免费额度充足，是创业者快速验证 AI 产品的首选工具。',
      website: 'https://www.coze.cn', icon: '🤝',
      pricing: Pricing.FREEMIUM, rating: 4.6, ratingCount: 1543,
      featured: true, approved: true, tags: ['无代码', '智能体', '字节', '国产'],
      categoryId: agent.id,
    },
    {
      name: 'Dify', slug: 'dify',
      description: '开源LLM应用开发平台，支持私有化部署，企业级首选',
      detail: 'Dify 是开源的 LLM 应用开发平台，支持工作流编排、RAG知识库、Agent 构建。可私有化部署，数据完全自控。在国内企业 AI 化改造中广泛使用，GitHub 星标超 10 万。',
      website: 'https://dify.ai', icon: '⚙️',
      pricing: Pricing.FREE, rating: 4.7, ratingCount: 987,
      featured: false, approved: true, tags: ['开源', '私有部署', '企业', '工作流'],
      categoryId: agent.id,
    },
  ]

  for (const tool of tools) {
    await prisma.tool.create({ data: tool })
  }

  console.log(`✅ 已创建 ${categories.length} 个分类, ${tools.length} 个工具`)
  console.log('工具列表:', tools.map(t => t.name).join(', '))
}

main().catch(console.error).finally(() => prisma.$disconnect())
