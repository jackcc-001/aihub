# AIHub — AI工具聚合导航站

Next.js 14 + Prisma + Neon PostgreSQL

---

## 项目结构

```
aihub/
├── app/
│   ├── page.tsx              # 首页（工具列表+筛选）
│   ├── page.module.css
│   ├── layout.tsx            # 根布局（相当于 base.html）
│   ├── globals.css
│   ├── tools/[slug]/
│   │   ├── page.tsx          # 工具详情页
│   │   ├── ReviewForm.tsx    # 评论表单（Client Component）
│   │   └── actions.ts        # Server Actions（处理POST）
│   ├── submit/
│   │   ├── page.tsx          # 工具提交页
│   │   ├── SubmitForm.tsx
│   │   └── actions.ts
│   ├── (admin)/admin/
│   │   ├── page.tsx          # 管理后台
│   │   └── actions.ts
│   └── api/tools/
│       └── route.ts          # REST API（给移动端/小程序用）
├── components/
│   ├── layout/Header.tsx
│   └── ui/ToolCard.tsx
├── lib/
│   ├── db.ts                 # Prisma 客户端单例
│   └── types.ts              # 类型定义
├── prisma/
│   ├── schema.prisma         # 数据库模型（相当于 models.py）
│   └── seed.ts               # 初始数据（相当于 fixtures）
└── .env.example
```

---

## 本地开发步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

**推荐：Neon（免费 PostgreSQL）**

1. 访问 https://neon.tech，注册账号
2. 新建项目，选择离你最近的区域（新加坡/日本）
3. 在 Connection Details 里复制连接串

```bash
cp .env.example .env.local
# 编辑 .env.local，填入你的 DATABASE_URL 和 DIRECT_URL
```

### 3. 初始化数据库

```bash
# 推送 schema 到数据库（相当于 Django 的 migrate）
npm run db:push

# 导入初始数据（相当于 Django 的 loaddata）
npm run db:seed

# 可选：打开可视化数据库管理界面（相当于 Django Admin）
npm run db:studio
```

### 4. 启动开发服务器

```bash
npm run dev
# 访问 http://localhost:3000
```

---

## 部署到 Vercel（推荐，5分钟完成）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录并部署
vercel

# 3. 在 Vercel 控制台 → Settings → Environment Variables
#    添加：DATABASE_URL 和 DIRECT_URL（从 Neon 复制）

# 4. 重新部署
vercel --prod
```

---

## 部署到 Cloudflare Pages

Cloudflare Pages 需要额外配置，因为 Prisma 默认不支持 Edge Runtime：

```bash
# 在 next.config.ts 里保持默认（Node.js runtime）
# Cloudflare 部署时选择 Framework: Next.js
# Build command: npm run build
# Build output: .next

# 注意：Cloudflare Pages 的 Node.js 支持需要在设置里开启
```

**建议：优先用 Vercel**，与 Next.js 集成最好，零配置。

---

## 数据库选择对比

| 数据库 | 免费额度 | 连接方式 | 推荐指数 |
|--------|----------|----------|----------|
| **Neon** | 0.5GB存储，无限请求 | Serverless PostgreSQL | ⭐⭐⭐⭐⭐ |
| **Railway** | $5/月免费额度 | PostgreSQL，有可视化 | ⭐⭐⭐⭐ |
| **PlanetScale** | 5GB存储（已收费） | MySQL兼容 | ⭐⭐⭐ |
| **Turso** | 500MB，每月1B次读 | SQLite边缘数据库 | ⭐⭐⭐⭐ |

---

## 后台管理

访问 `/admin` 页面可以：
- 查看用户提交的工具
- 一键通过并收录到首页

**生产环境保护后台：** 在 `middleware.ts` 添加 Basic Auth：

```typescript
// middleware.ts（放在项目根目录）
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const auth = request.headers.get('authorization')
    const valid = 'Basic ' + Buffer.from('admin:你的密码').toString('base64')
    if (auth !== valid) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
      })
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
```

---

## API 接口

工具列表接口，供移动端/小程序调用：

```
GET /api/tools
  ?category=chat     # 按分类筛选（slug）
  ?pricing=FREE      # FREE | FREEMIUM | PAID
  ?q=关键词          # 搜索
  ?sort=rating       # latest | rating | views
  ?page=1            # 分页

返回：
{
  "data": [...],
  "meta": { "total": 100, "page": 1, "pageSize": 20, "totalPages": 5 }
}
```

---

## 后续扩展方向

- [ ] 用户系统（NextAuth.js，支持 GitHub/Google 登录）
- [ ] 工具收藏功能
- [ ] 每周精选邮件订阅（Resend）
- [ ] 工具对比页（A vs B）
- [ ] 中文 SEO 优化（sitemap.xml、结构化数据）
- [ ] 付费收录/置顶功能（Stripe）
