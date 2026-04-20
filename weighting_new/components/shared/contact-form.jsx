'use client'

import { useMemo, useState } from 'react'
import { useLanguage } from '@/components/providers/language-provider'

const initialState = {
  name: '',
  phone: '',
  email: '',
  company: '',
  message: ''
}

export default function ContactForm({ source }) {
  const { t } = useLanguage()
  const [form, setForm] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fields = useMemo(
    () => [
      { key: 'name', label: { zh: '姓名', en: 'Name' }, required: true, type: 'text' },
      { key: 'phone', label: { zh: '電話', en: 'Phone' }, required: true, type: 'tel' },
      { key: 'email', label: { zh: '電子郵件', en: 'Email' }, required: false, type: 'email' },
      { key: 'company', label: { zh: '公司名稱', en: 'Company' }, required: false, type: 'text' }
    ],
    []
  )

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)

    const payload = {
      ...form,
      source,
      timestamp: new Date().toISOString()
    }

    try {
      const existing = JSON.parse(window.localStorage.getItem('weighing-contacts') || '[]')
      existing.push(payload)
      window.localStorage.setItem('weighing-contacts', JSON.stringify(existing))
    } catch (error) {
      console.error(error)
    }

    console.log('[ContactForm] Submitted:', payload)

    await new Promise((resolve) => setTimeout(resolve, 700))
    setSubmitting(false)
    setSubmitted(true)
    setForm(initialState)
    window.setTimeout(() => setSubmitted(false), 3200)
  }

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-6 md:p-8">
      <div className="text-2xl font-semibold text-white">{t({ zh: '開始你的需求對話', en: 'Start your consultation' })}</div>
      <p className="mt-3 text-sm leading-7 text-slate-400">{t({ zh: '留下需求與聯絡方式，我們會依據應用場景提供產品或系統建議。', en: 'Leave your requirements and contact information, and we will recommend the right product or system.' })}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className={`block ${field.key === 'email' || field.key === 'company' ? '' : ''}`}>
            <div className="mb-2 text-sm font-medium text-slate-200">{t(field.label)} {field.required ? '*' : ''}</div>
            <input
              required={field.required}
              type={field.type}
              value={form[field.key]}
              onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-200/50 focus:bg-white/[0.08]"
            />
          </label>
        ))}
      </div>
      <label className="mt-4 block">
        <div className="mb-2 text-sm font-medium text-slate-200">{t({ zh: '需求描述', en: 'Project Brief' })} *</div>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-primary-200/50 focus:bg-white/[0.08]"
        />
      </label>
      {submitted ? (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {t({ zh: '提交成功，我們將盡快與你聯繫。', en: 'Submitted successfully. We will contact you soon.' })}
        </div>
      ) : null}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">{source}</div>
        <button type="submit" disabled={submitting} className="solid-button disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? t({ zh: '提交中...', en: 'Submitting...' }) : t({ zh: '送出需求', en: 'Submit Request' })}
        </button>
      </div>
    </form>
  )
}
