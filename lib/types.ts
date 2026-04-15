// lib/types.ts
// 类似 Django 的 serializers，定义前后端共用的数据类型

import { Prisma } from '@prisma/client'

// 工具列表用（带分类信息）
export type ToolWithCategory = Prisma.ToolGetPayload<{
  include: { category: true }
}>

// 工具详情用（带评论）
export type ToolWithDetails = Prisma.ToolGetPayload<{
  include: { category: true; reviews: true }
}>

// 查询参数类型
export interface ToolQuery {
  category?: string   // category slug
  pricing?: string    // FREE | FREEMIUM | PAID
  q?: string          // 搜索关键词
  sort?: 'latest' | 'rating' | 'views'
  page?: number
}
