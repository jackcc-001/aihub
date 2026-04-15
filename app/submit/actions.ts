// app/submit/actions.ts
'use server'

import { db } from '@/lib/db'

export async function submitTool(formData: FormData) {
  try {
    const name        = String(formData.get('name') ?? '').trim()
    const website     = String(formData.get('website') ?? '').trim()
    const category    = String(formData.get('category') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const email       = String(formData.get('email') ?? '').trim()

    if (!name || !website || !category || !description) {
      return { ok: false, error: '请填写必填项' }
    }

    await db.submission.create({
      data: { name, website, category, description, email: email || null },
    })

    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'server error' }
  }
}
