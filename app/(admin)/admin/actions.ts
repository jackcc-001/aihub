// app/(admin)/admin/actions.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// 通过提交：把 Submission 转成正式 Tool
export async function approveSubmission(formData: FormData) {
  const id = Number(formData.get('id'))

  const sub = await db.submission.findUnique({ where: { id } })
  if (!sub) return

  // 找到对应分类
  const category = await db.category.findFirst({
    where: { name: { contains: sub.category } },
  })

  if (category) {
    const slug = sub.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await db.tool.create({
      data: {
        name: sub.name,
        slug: slug + '-' + Date.now(),
        description: sub.description,
        website: sub.website,
        categoryId: category.id,
        approved: true,
      },
    })
  }

  await db.submission.update({ where: { id }, data: { status: 'APPROVED' } })
  revalidatePath('/')
  revalidatePath('/admin')
}
