'use client'

const fallbackProfile = {
  sceneTitle: { zh: '智能秤 Configurator Preview', en: 'Smart Scale Configurator Preview' },
  sceneDescription: {
    zh: '目前先以穩定的靜態預覽呈現配置邏輯，避免 3D 相依套件造成頁面中斷。',
    en: 'The configurator is currently presented as a stable static preview to avoid runtime issues from 3D dependencies.'
  },
  fallbackMedia: {
    eyebrow: { zh: 'Stable Product Preview', en: 'Stable Product Preview' },
    title: { zh: '產品詳情頁已切換為穩定預覽模式', en: 'The product detail page is currently using stable preview mode.' },
    description: {
      zh: '目前產品頁仍保留配件、鏡頭與場景狀態同步，但視覺層先暫時停用 3D Canvas。',
      en: 'Accessory, camera, and scene state sync are preserved, while the 3D canvas is temporarily disabled.'
    }
  },
  cameraPresets: [
    {
      id: 'overview',
      label: { zh: '整體總覽', en: 'Overview' },
      description: { zh: '查看目前配置與產品定位。', en: 'Review the current configuration and product positioning.' }
    }
  ],
  accessories: []
}

export default function ProductConfiguratorPreview({ profile, selectedAccessoryIds = [], focusedAccessoryId = null, activePresetId = 'overview', t = (value) => value }) {
  const resolvedProfile = profile || fallbackProfile
  const cameraPresets = resolvedProfile.cameraPresets?.length ? resolvedProfile.cameraPresets : fallbackProfile.cameraPresets
  const accessories = resolvedProfile.accessories || []
  const activePreset = cameraPresets.find((item) => item.id === activePresetId) || cameraPresets[0]
  const activeAccessories = accessories.filter((item) => selectedAccessoryIds.includes(item.id))
  const focusedAccessory = accessories.find((item) => item.id === focusedAccessoryId) || null
  const fallbackMedia = resolvedProfile.fallbackMedia || fallbackProfile.fallbackMedia

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 shadow-[0_34px_120px_rgba(2,6,23,0.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(245,158,11,0.12),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.45),rgba(2,6,23,0.9))]" />
      <div className="grid-backdrop absolute inset-0 opacity-[0.1]" />
      <div className="ambient-orb -left-12 top-20 h-64 w-64 bg-sky-400/15" />
      <div className="ambient-orb right-0 top-12 h-56 w-56 bg-accent/15" />

      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-md rounded-[1.5rem] border border-white/10 bg-slate-950/55 px-4 py-4 backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">{t(fallbackMedia.eyebrow)}</div>
            <div className="mt-3 text-xl font-semibold text-white md:text-2xl">{t(fallbackMedia.title || resolvedProfile.sceneTitle)}</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(fallbackMedia.description || resolvedProfile.sceneDescription)}</p>
          </div>

          <div className="hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55 px-4 py-4 text-right backdrop-blur-xl md:block">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Render Mode</div>
            <div className="mt-3 text-sm font-medium text-white">{t({ zh: '穩定預覽模式', en: 'Stable Preview Mode' })}</div>
            <div className="mt-1 text-xs text-slate-400">{t({ zh: '已暫時停用 3D Canvas', en: '3D canvas temporarily disabled' })}</div>
          </div>
        </div>

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">{t({ zh: '當前視角', en: 'Current View' })}</div>
            <div className="mt-4 text-3xl font-semibold text-white">{t(activePreset.label)}</div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">{t(activePreset.description)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {activeAccessories.length ? activeAccessories.map((accessory) => (
                <div key={accessory.id} className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${focusedAccessoryId === accessory.id ? 'border-accent/60 bg-accent/15 text-accent-light' : 'border-white/10 bg-white/5 text-slate-300'}`}>
                  {t(accessory.label)}
                </div>
              )) : (
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  {t({ zh: '基本配置', en: 'Base Configuration' })}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{t({ zh: '配件狀態', en: 'Accessory State' })}</div>
              <div className="mt-3 text-base font-medium text-white">{activeAccessories.length ? `${activeAccessories.length} / ${accessories.length}` : t({ zh: '僅基本配置', en: 'Base setup only' })}</div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{t({ zh: '目前聚焦', en: 'Current Focus' })}</div>
              <div className="mt-3 text-sm leading-6 text-slate-300">{focusedAccessory ? t(focusedAccessory.description) : t({ zh: '目前沒有指定聚焦配件，顯示產品基礎配置。', en: 'No accessory is currently focused, so the base product setup is shown.' })}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.28em] text-slate-400">
          <div className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5 backdrop-blur-md">
            {t(resolvedProfile.sceneTitle)}
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5 backdrop-blur-md">
            {resolvedProfile.baseModel?.renderMode || 'static-preview'}
          </div>
        </div>
      </div>
    </div>
  )
}
