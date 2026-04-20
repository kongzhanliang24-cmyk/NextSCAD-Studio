'use client'

/**
 * ConfiguratorRail
 * -----------------
 * Owns all the side-rail + drawer UI for the 3D product configurator.
 * - Desktop (lg+): slim vertical icon rail + slide-out drawer beside the 3D canvas.
 * - Mobile: bottom tab bar + expanding panel below the canvas.
 *
 * Keyboard:
 *  - Esc closes the drawer
 *  - 1 / 2 / 3 (when drawer closed) switch between the three camera presets
 *
 * Also supports click-outside to dismiss on desktop.
 */

import { Boxes, Camera, CheckCircle2, ListChecks, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function AccessoryOptionButton({ option, active, onClick, t, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start justify-between gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        active
          ? 'border-accent bg-accent/10 text-white shadow-[0_0_24px_rgba(232,168,56,0.18)]'
          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:bg-white/[0.06]'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{t(option.label)}</div>
        {!compact ? (
          <div className="mt-1 text-[11px] leading-5 opacity-70 line-clamp-2">{t(option.description)}</div>
        ) : null}
      </div>
      <div
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
          active ? 'border-accent bg-accent' : 'border-white/25'
        }`}
      >
        {active ? <CheckCircle2 className="h-3 w-3 text-primary-dark" /> : null}
      </div>
    </button>
  )
}

function CameraPresetButton({ preset, active, onClick, t, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        active
          ? 'border-primary-200/60 bg-primary-300/15 text-white shadow-[0_0_24px_rgba(45,90,142,0.2)]'
          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25'
      }`}
    >
      <div className="text-sm font-medium">{t(preset.label)}</div>
      {!compact && preset.description ? (
        <div className="mt-1 text-[11px] leading-5 opacity-70">{t(preset.description)}</div>
      ) : null}
    </button>
  )
}

function RailButton({ icon: Icon, label, activeColor, active, count, onClick, t }) {
  const colorCls = active
    ? activeColor === 'accent'
      ? 'border-accent bg-accent/15 text-accent-light shadow-[0_0_30px_rgba(232,168,56,0.22)]'
      : activeColor === 'primary'
        ? 'border-primary-200/60 bg-primary-300/15 text-white shadow-[0_0_30px_rgba(45,90,142,0.28)]'
        : 'border-white/30 bg-white/10 text-white'
    : 'border-white/10 bg-slate-950/55 text-slate-300 hover:border-white/25 hover:bg-slate-900/70'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={t(label)}
      title={t(label)}
      className={`group relative flex h-14 w-14 flex-col items-center justify-center rounded-2xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${colorCls}`}
    >
      <Icon className="h-5 w-5" />
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] opacity-80">{t(label)}</span>
      {typeof count === 'number' && count > 0 ? (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border border-slate-950 bg-accent px-1.5 text-[10px] font-bold text-primary-dark shadow-[0_0_10px_rgba(232,168,56,0.6)]"
          aria-label={`${count} selected`}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

export default function ConfiguratorRail({
  t,
  configuratorProfile,
  accessoryOptions,
  cameraPresets,
  selectedAccessories,
  activeAccessories,
  focusedAccessoryId,
  activeFocusedAccessory,
  activePresetId,
  onToggleAccessory,
  onSelectPreset,
  onFocusAccessory
}) {
  const [openDrawer, setOpenDrawer] = useState(null)
  const wrapperRef = useRef(null)

  const toggleDrawer = useCallback(
    (key) => setOpenDrawer((prev) => (prev === key ? null : key)),
    []
  )
  const closeDrawer = useCallback(() => setOpenDrawer(null), [])

  // Keyboard: Esc closes drawer; 1/2/3 switches camera preset when drawer closed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && openDrawer) {
        event.preventDefault()
        closeDrawer()
        return
      }

      // Only intercept digit keys when user is not typing in an input/textarea
      const target = event.target
      const isEditable = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if (isEditable) return

      if (!cameraPresets?.length) return
      const digit = Number(event.key)
      if (!Number.isInteger(digit) || digit < 1 || digit > cameraPresets.length) return
      const preset = cameraPresets[digit - 1]
      if (preset) {
        event.preventDefault()
        onSelectPreset(preset.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openDrawer, closeDrawer, cameraPresets, onSelectPreset])

  // Click-outside (desktop): clicking anywhere outside the rail+drawer closes it
  useEffect(() => {
    if (!openDrawer) return

    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        closeDrawer()
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [openDrawer, closeDrawer])

  const selectedCount = selectedAccessories?.length || 0

  const drawerHeader = useMemo(
    () => ({
      accessories: {
        title: { zh: '選配配件', en: 'Configure' },
        subtitle: { zh: '點選即時加入 3D 場景', en: 'Toggle to see live 3D updates' }
      },
      camera: {
        title: { zh: '鏡頭視角', en: 'Camera Presets' },
        subtitle: { zh: '按 1 / 2 / 3 快速切換', en: 'Press 1 / 2 / 3 to switch' }
      },
      summary: {
        title: { zh: '目前配置', en: 'Current Setup' },
        subtitle: selectedCount
          ? { zh: `${selectedCount} / ${accessoryOptions.length} 項已選`, en: `${selectedCount} / ${accessoryOptions.length} selected` }
          : { zh: '僅基本配置', en: 'Base only' }
      }
    }),
    [accessoryOptions.length, selectedCount]
  )

  return (
    <>
      {/* ===================== DESKTOP (lg+) ===================== */}
      <div ref={wrapperRef} className="hidden lg:contents">
        {/* LEFT RAIL — slim icon toggles */}
        <div className="hidden flex-shrink-0 flex-col gap-2 lg:flex">
          {accessoryOptions?.length ? (
            <RailButton
              icon={Boxes}
              label={{ zh: '選配', en: 'Parts' }}
              activeColor="accent"
              active={openDrawer === 'accessories'}
              count={selectedCount}
              onClick={() => toggleDrawer('accessories')}
              t={t}
            />
          ) : null}
          {cameraPresets?.length ? (
            <RailButton
              icon={Camera}
              label={{ zh: '視角', en: 'View' }}
              activeColor="primary"
              active={openDrawer === 'camera'}
              onClick={() => toggleDrawer('camera')}
              t={t}
            />
          ) : null}
          <RailButton
            icon={ListChecks}
            label={{ zh: '摘要', en: 'Setup' }}
            active={openDrawer === 'summary'}
            onClick={() => toggleDrawer('summary')}
            t={t}
          />
        </div>

        {/* DRAWER — fixed width, slides via transform (GPU-accelerated) */}
        <div
          className={`hidden flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-out lg:block ${
            openDrawer ? 'w-[320px]' : 'w-0'
          }`}
          aria-hidden={!openDrawer}
        >
          <div
            className={`h-full w-[320px] rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl shadow-[0_24px_80px_rgba(2,6,23,0.5)] transition-transform duration-300 ease-out ${
              openDrawer ? 'translate-x-0' : '-translate-x-4'
            }`}
          >
            {openDrawer ? (
              <div className="flex h-full flex-col">
                {/* shared header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                      {t(drawerHeader[openDrawer].title)}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{t(drawerHeader[openDrawer].subtitle)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={t({ zh: '關閉面板', en: 'Close panel' })}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* body — swap by openDrawer */}
                {openDrawer === 'accessories' ? (
                  <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
                    {accessoryOptions.map((opt) => (
                      <AccessoryOptionButton
                        key={opt.id}
                        option={opt}
                        active={selectedAccessories.includes(opt.id)}
                        onClick={() => onToggleAccessory(opt)}
                        t={t}
                      />
                    ))}
                  </div>
                ) : null}

                {openDrawer === 'camera' ? (
                  <div className="mt-4 grid gap-2">
                    {cameraPresets.map((preset, index) => (
                      <div key={preset.id} className="relative">
                        <CameraPresetButton
                          preset={preset}
                          active={activePresetId === preset.id}
                          onClick={() => onSelectPreset(preset.id)}
                          t={t}
                        />
                        {index < 9 ? (
                          <span className="pointer-events-none absolute right-3 top-3 rounded-md border border-white/10 bg-slate-950/60 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                            {index + 1}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                {openDrawer === 'summary' ? (
                  <div className="mt-4 flex-1 overflow-y-auto">
                    {configuratorProfile ? (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                          {t({ zh: '場景', en: 'Scene' })}
                        </div>
                        <div className="mt-2 text-sm font-medium leading-6 text-white">
                          {t(configuratorProfile.sceneTitle)}
                        </div>
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {activeAccessories.length ? (
                        activeAccessories.map((accessory) => (
                          <button
                            key={accessory.id}
                            type="button"
                            onClick={() => onFocusAccessory(accessory)}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                              focusedAccessoryId === accessory.id
                                ? 'border-accent/60 bg-accent/10 text-accent-light'
                                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
                            }`}
                          >
                            {t(accessory.label)}
                          </button>
                        ))
                      ) : (
                        <div className="text-xs text-slate-400">
                          {t({ zh: '尚未選配，僅顯示基本配置。', en: 'No accessories selected yet.' })}
                        </div>
                      )}
                    </div>
                    {activeFocusedAccessory ? (
                      <div className="mt-4 border-t border-white/5 pt-4 text-xs leading-6 text-slate-400">
                        {t(activeFocusedAccessory.description)}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Mobile controls — rendered separately because they live BELOW the canvas in the DOM.
 * Consumes the same props; internal state is local to this component.
 */
export function ConfiguratorMobileSheet({
  t,
  configuratorProfile,
  accessoryOptions,
  cameraPresets,
  selectedAccessories,
  activeAccessories,
  focusedAccessoryId,
  activeFocusedAccessory,
  activePresetId,
  onToggleAccessory,
  onSelectPreset,
  onFocusAccessory
}) {
  const [tab, setTab] = useState('accessories')
  const selectedCount = selectedAccessories?.length || 0

  const tabs = useMemo(
    () => [
      { id: 'accessories', label: { zh: '選配', en: 'Parts' }, icon: Boxes, badge: selectedCount },
      { id: 'camera', label: { zh: '視角', en: 'View' }, icon: Camera },
      { id: 'summary', label: { zh: '摘要', en: 'Setup' }, icon: ListChecks }
    ],
    [selectedCount]
  )

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 backdrop-blur-xl lg:hidden">
      {/* tab bar */}
      <div className="flex gap-1 border-b border-white/10 p-2">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              tab === id ? 'bg-accent/10 text-accent-light' : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Icon className="h-4 w-4" />
            {t(label)}
            {typeof badge === 'number' && badge > 0 ? (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-primary-dark">
                {badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* panel body */}
      <div className="p-4">
        {tab === 'accessories' ? (
          <div className="grid gap-2">
            {accessoryOptions.map((opt) => (
              <AccessoryOptionButton
                key={opt.id}
                option={opt}
                active={selectedAccessories.includes(opt.id)}
                onClick={() => onToggleAccessory(opt)}
                t={t}
                compact
              />
            ))}
          </div>
        ) : null}

        {tab === 'camera' ? (
          <div className="grid grid-cols-3 gap-2">
            {cameraPresets.map((preset) => (
              <CameraPresetButton
                key={preset.id}
                preset={preset}
                active={activePresetId === preset.id}
                onClick={() => onSelectPreset(preset.id)}
                t={t}
                compact
              />
            ))}
          </div>
        ) : null}

        {tab === 'summary' ? (
          <div>
            {configuratorProfile ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {t({ zh: '場景', en: 'Scene' })}
                </div>
                <div className="mt-1 text-sm font-medium text-white">{t(configuratorProfile.sceneTitle)}</div>
              </div>
            ) : null}
            <div className="mt-3 text-xs text-slate-400">
              {activeAccessories.length
                ? `${activeAccessories.length} / ${accessoryOptions.length} ${t({ zh: '項已選', en: 'selected' })}`
                : t({ zh: '僅基本配置', en: 'Base only' })}
            </div>
            {activeAccessories.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {activeAccessories.map((accessory) => (
                  <button
                    key={accessory.id}
                    type="button"
                    onClick={() => onFocusAccessory(accessory)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${
                      focusedAccessoryId === accessory.id
                        ? 'border-accent/60 bg-accent/10 text-accent-light'
                        : 'border-white/10 bg-white/5 text-slate-300'
                    }`}
                  >
                    {t(accessory.label)}
                  </button>
                ))}
              </div>
            ) : null}
            {activeFocusedAccessory ? (
              <div className="mt-3 border-t border-white/5 pt-3 text-xs leading-5 text-slate-400">
                {t(activeFocusedAccessory.description)}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
