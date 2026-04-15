// app/tools/[slug]/actions.ts
// Server Actions —— 类似 Django 的 views.py 里处理 POST 的部分
// 这里直接操作数据库，不需要单独写 API 路由

'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
  try {
    const toolId  = Number(formData.get('toolId'))
    const rating  = Number(formData.get('rating'))
    const nickname = String(formData.get('nickname') ?? '').trim()
    const content = String(formData.get('content') ?? '').trim()

    if (!toolId || !nickname || rating < 1 || rating > 5) {
      return { ok: false, error: '参数不合法' }
    }

    // 写入评论
    await db.review.create({
      data: { toolId, rating, nickname, content: content || null },
    })

    // 重新计算工具平均评分（类似 Django 的 aggregate）
    const agg = await db.review.aggregate({
      where: { toolId },
      _avg: { rating: true },
      _count: true,
    })
    await db.tool.update({
      where: { id: toolId },
      data: {
        rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
        ratingCount: agg._count,
      },
    })

    // 让 Next.js 重新渲染该工具页面（相当于让缓存失效）
    revalidatePath(`/tools/`)

    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'server error' }
  }
}
