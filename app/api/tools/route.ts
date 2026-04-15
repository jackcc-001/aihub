// app/api/tools/route.ts
// REST API 路由，相当于 Django REST Framework 的 APIView
// 如果以后做小程序或者移动端可以直接调用这个接口

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma, Pricing } from '@prisma/client'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const category = sp.get('category')
  const pricing  = sp.get('pricing')
  const q        = sp.get('q')
  const sort     = sp.get('sort') ?? 'latest'
  const page     = Math.max(1, Number(sp.get('page') ?? 1))
  const pageSize = 20

  const where: Prisma.ToolWhereInput = { approved: true }
  if (category) where.category = { slug: category }
  if (pricing)  where.pricing  = pricing as Pricing
  if (q) {
    where.OR = [
      { name:        { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }

  const orderBy: Prisma.ToolOrderByWithRelationInput =
    sort === 'rating' ? { rating: 'desc' } :
    sort === 'views'  ? { viewCount: 'desc' } :
    { createdAt: 'desc' }

  const [tools, total] = await Promise.all([
    db.tool.findMany({
      where, orderBy,
      include: { category: { select: { name: true, slug: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.tool.count({ where }),
  ])

  return NextResponse.json({
    data: tools,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  })
}
