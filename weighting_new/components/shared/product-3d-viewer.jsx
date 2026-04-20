'use client'

import { Component, memo, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Float, Line, OrbitControls, Sparkles, Stage, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const fallbackProfile = {
  sceneTitle: { zh: '智能秤 3D Configurator', en: 'Smart Scale 3D Configurator' },
  sceneDescription: {
    zh: '先用示意結構建立選配邏輯，之後可直接替換為正式 GLB 模型。',
    en: 'Use a structural prototype now, then swap in production GLB assets later.'
  },
  cameraPresets: [
    {
      id: 'overview',
      label: { zh: '整體總覽', en: 'Overview' },
      description: { zh: '看整體配置', en: 'Inspect the overall configuration.' },
      position: [0, 0.1, 4],
      target: [0, 0, 0]
    }
  ],
  accessories: []
}

const SAFE_PRESET = {
  id: 'overview',
  label: { zh: '整體總覽', en: 'Overview' },
  description: { zh: '看整體配置', en: 'Inspect the overall configuration.' },
  position: [0, 0.1, 4],
  target: [0, 0, 0]
}

// 1a. 程序化 placeholder — 只有儀表頭（符合使用者偏好：無支架、無底座）
function ProceduralBaseTerminalInner() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1.2, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#38bdf8"
          emissiveIntensity={0.5}
          roughness={0}
        />
      </mesh>
    </group>
  )
}
const ProceduralBaseTerminal = memo(ProceduralBaseTerminalInner)

// 1b. GLB 版本 — 從 /public/models/*.glb 載入真實模型（自動適配畫面）
function GLBBaseTerminalInner({ path, transform }) {
  const { scene } = useGLTF(path)

  // clone 並計算 bounding box 以自動縮放+置中，避免因單位差異（mm/cm/m）導致看不見
  const { object, autoScale, autoOffset, bounds } = useMemo(() => {
    const copy = scene.clone(true)
    copy.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(copy)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // 將最長邊縮放到 2 單位（與原程序化儀表尺寸相當）
    const targetSize = 2
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? targetSize / maxDim : 1

    return {
      object: copy,
      autoScale: scale,
      autoOffset: [-center.x * scale, -center.y * scale, -center.z * scale],
      bounds: {
        size: [size.x, size.y, size.z],
        center: [center.x, center.y, center.z]
      }
    }
  }, [scene])

  // 診斷日誌：每次 GLB 載入時印出原始尺寸，方便調整
  useEffect(() => {
    console.log('[Product3DViewer] GLB loaded:', {
      path,
      rawSize: bounds.size.map((n) => n.toFixed(3)),
      rawCenter: bounds.center.map((n) => n.toFixed(3)),
      autoScale: autoScale.toFixed(4),
      mode: transform?.autoFit === false ? 'manual' : 'auto-fit'
    })
  }, [path, autoScale, bounds, transform?.autoFit])

  // 預設啟用 auto-fit；若使用者在 JSON 設 autoFit:false，則改用手動 transform
  const useAutoFit = transform?.autoFit !== false
  const finalScale = useAutoFit ? autoScale : (transform?.scale ?? 1)
  const finalPosition = useAutoFit ? autoOffset : (transform?.position ?? [0, 0, 0])
  const finalRotation = transform?.rotation ?? [0, 0, 0]

  return (
    <primitive
      object={object}
      scale={finalScale}
      rotation={finalRotation}
      position={finalPosition}
      dispose={null}
    />
  )
}
const GLBBaseTerminal = memo(GLBBaseTerminalInner)

// 1c. 錯誤邊界 — GLB 載入失敗時降級成程序化版本，避免整個 3D 區塊崩潰
class GLBErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('[Product3DViewer] GLB load failed, falling back to procedural geometry:', error)
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// 1d. 智慧分派 — 根據 baseModel.status 決定用 GLB 還是程序化 placeholder
function BaseTerminal({ baseModel }) {
  const shouldUseGLB = baseModel?.status === 'ready' && baseModel?.path

  if (!shouldUseGLB) {
    return <ProceduralBaseTerminal />
  }

  return (
    <GLBErrorBoundary fallback={<ProceduralBaseTerminal />}>
      <Suspense fallback={<ProceduralBaseTerminal />}>
        <GLBBaseTerminal path={baseModel.path} transform={baseModel.transform} />
      </Suspense>
    </GLBErrorBoundary>
  )
}

// 2. 配件模型：掃碼槍 (這只是一個示意，未來會換成你的 GLB 模型)
const Scanner = memo(function Scanner({ accessory, focused }) {
  return (
    <group position={accessory.position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color={focused ? '#f59e0b' : '#334155'} metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0.1, 0.38, 0]} rotation={[0, 0, Math.PI / 2.7]} castShadow>
        <boxGeometry args={[0.18, 0.34, 0.16]} />
        <meshStandardMaterial color={focused ? '#fbbf24' : '#475569'} />
      </mesh>
    </group>
  )
})

// 3. 配件模型：USB 隨身碟
const USBDrive = memo(function USBDrive({ accessory, focused }) {
  return (
    <group position={accessory.position}>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.12, 0.12]} />
        <meshStandardMaterial color={focused ? '#f97316' : '#ef4444'} />
      </mesh>
      <mesh position={[0.18, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.12} />
      </mesh>
    </group>
  )
})

const Printer = memo(function Printer({ accessory, focused }) {
  return (
    <group position={accessory.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.48, 0.6]} />
        <meshStandardMaterial color={focused ? '#f8fafc' : '#cbd5e1'} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.24, 0.25]} castShadow>
        <boxGeometry args={[0.65, 0.06, 0.12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  )
})

const CameraAccessory = memo(function CameraAccessory({ accessory, focused }) {
  return (
    <group position={accessory.position}>
      <mesh castShadow>
        <boxGeometry args={[0.32, 0.12, 0.12]} />
        <meshStandardMaterial color={focused ? '#f8fafc' : '#64748b'} metalness={0.35} roughness={0.28} />
      </mesh>
      <mesh position={[0.16, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 24]} />
        <meshStandardMaterial color={focused ? '#38bdf8' : '#0f172a'} emissive={focused ? '#38bdf8' : '#000000'} emissiveIntensity={focused ? 0.4 : 0} />
      </mesh>
    </group>
  )
})

const GPIOModule = memo(function GPIOModule({ accessory, focused }) {
  return (
    <group position={accessory.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.24, 0.08]} />
        <meshStandardMaterial color={focused ? '#22c55e' : '#16a34a'} roughness={0.28} />
      </mesh>
      {[-0.14, -0.04, 0.06, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.16, 0]} castShadow>
          <boxGeometry args={[0.04, 0.08, 0.04]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}
    </group>
  )
})

function AccessoryMesh({ accessory, focused }) {
  if (accessory.type === 'scanner') return <Scanner accessory={accessory} focused={focused} />
  if (accessory.type === 'usb') return <USBDrive accessory={accessory} focused={focused} />
  if (accessory.type === 'printer') return <Printer accessory={accessory} focused={focused} />
  if (accessory.type === 'camera') return <CameraAccessory accessory={accessory} focused={focused} />
  if (accessory.type === 'gpio') return <GPIOModule accessory={accessory} focused={focused} />
  return null
}

function AccessoryConnection({ accessory, active, focused }) {
  return (
    <group>
      <mesh position={accessory.anchor} castShadow>
        <sphereGeometry args={[focused ? 0.055 : 0.04, 24, 24]} />
        <meshStandardMaterial
          color={focused ? '#f59e0b' : active ? '#38bdf8' : '#94a3b8'}
          emissive={focused ? '#f59e0b' : active ? '#38bdf8' : '#000000'}
          emissiveIntensity={focused || active ? 0.45 : 0}
        />
      </mesh>
      <Line
        points={[accessory.anchor, accessory.position]}
        color={focused ? '#f59e0b' : active ? '#38bdf8' : '#64748b'}
        lineWidth={focused ? 2.2 : 1.2}
        transparent
        opacity={active ? 0.88 : 0.16}
      />
    </group>
  )
}

function CameraRig({ activePreset, controlsRef }) {
  const { camera } = useThree()
  const desiredPosition = useMemo(() => new THREE.Vector3(...(activePreset?.position || [0, 0, 4])), [activePreset])
  const desiredTarget = useMemo(() => new THREE.Vector3(...(activePreset?.target || [0, 0, 0])), [activePreset])
  const transitioningRef = useRef(true)

  // Re-arm the transition whenever the active preset changes
  useLayoutEffect(() => {
    transitioningRef.current = true
  }, [desiredPosition, desiredTarget])

  useFrame(() => {
    if (!transitioningRef.current) return

    camera.position.lerp(desiredPosition, 0.1)

    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredTarget, 0.1)
      controlsRef.current.update()
    } else {
      camera.lookAt(desiredTarget)
    }

    const positionDone = camera.position.distanceToSquared(desiredPosition) < 0.0004
    const targetDone = controlsRef.current
      ? controlsRef.current.target.distanceToSquared(desiredTarget) < 0.0004
      : true

    if (positionDone && targetDone) {
      camera.position.copy(desiredPosition)
      if (controlsRef.current) {
        controlsRef.current.target.copy(desiredTarget)
        controlsRef.current.update()
      }
      transitioningRef.current = false
    }
  })

  return null
}

function SceneContents({ profile, selectedAccessoryIds, focusedAccessoryId, activePreset }) {
  const controlsRef = useRef(null)
  const selectedSet = useMemo(() => new Set(selectedAccessoryIds), [selectedAccessoryIds])
  const focusedAccessory = profile.accessories.find((item) => item.id === focusedAccessoryId) || null

  // GLB 模式下，procedural 配件的 anchor 座標不再對齊真實接口 —— 暫時隱藏
  // 等你有配件 GLB 後，可在 JSON 的每個 accessory 補上正確 anchor 座標並改回顯示
  const isGLBMode = profile.baseModel?.status === 'ready'
  const showProceduralAccessories = !isGLBMode

  return (
    <>
      <ambientLight intensity={0.7} />
      <spotLight position={[8, 8, 10]} angle={0.22} penumbra={1} intensity={1.3} castShadow />
      <pointLight position={[-5, 2, 4]} intensity={0.55} color="#38bdf8" />
      <pointLight position={[5, -2, 2]} intensity={0.45} color="#f59e0b" />

      <Suspense fallback={null}>
        <Stage intensity={0.35} contactShadow={false} adjustCamera={false}>
          <Float speed={1.15} rotationIntensity={0.18} floatIntensity={0.22}>
            <BaseTerminal baseModel={profile.baseModel} />
            {showProceduralAccessories
              ? profile.accessories.map((accessory) => {
                  const active = selectedSet.has(accessory.id)
                  const focused = focusedAccessoryId === accessory.id

                  return (
                    <group key={accessory.id}>
                      <AccessoryConnection accessory={accessory} active={active} focused={focused} />
                      {active ? <AccessoryMesh accessory={accessory} focused={focused} /> : null}
                    </group>
                  )
                })
              : null}
          </Float>
          {focusedAccessory && showProceduralAccessories ? (
            <Sparkles
              count={42}
              scale={[1.6, 1.2, 1.2]}
              position={focusedAccessory.position}
              size={2.4}
              speed={0.3}
              color="#fde68a"
            />
          ) : null}
        </Stage>
        {/* 儀表頭約 1.2 高、中心在 y=0，所以底部在 y=-0.6；shadow 放更低一點產生飄浮感 */}
        <ContactShadows position={[0, -0.9, 0]} opacity={0.35} scale={8} blur={2.4} far={4} />
      </Suspense>

      <CameraRig activePreset={activePreset} controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        enableZoom
        enableDamping
        dampingFactor={0.08}
        minDistance={1.5}
        maxDistance={8}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.12}
      />
    </>
  )
}

function StaticConfiguratorFallback({ profile, activeAccessories, activePreset, focusedAccessoryId, t }) {
  const fallbackMedia = profile.fallbackMedia || {}

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 shadow-[0_34px_120px_rgba(2,6,23,0.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(245,158,11,0.12),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.45),rgba(2,6,23,0.9))]" />
      <div className="grid-backdrop absolute inset-0 opacity-[0.1]" />
      <div className="ambient-orb -left-12 top-20 h-64 w-64 bg-sky-400/15" />
      <div className="ambient-orb right-0 top-12 h-56 w-56 bg-accent/15" />

      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-md rounded-[1.5rem] border border-white/10 bg-slate-950/55 px-4 py-4 backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">{t(fallbackMedia.eyebrow || { zh: 'Static Configurator', en: 'Static Configurator' })}</div>
            <div className="mt-3 text-xl font-semibold text-white md:text-2xl">{t(fallbackMedia.title || profile.sceneTitle)}</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(fallbackMedia.description || profile.sceneDescription)}</p>
          </div>

          <div className="hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55 px-4 py-4 text-right backdrop-blur-xl md:block">
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Render Mode</div>
            <div className="mt-3 text-sm font-medium text-white">{t({ zh: '靜態展示模式', en: 'Static Preview Mode' })}</div>
            <div className="mt-1 text-xs text-slate-400">{profile.baseModel?.status === 'ready' ? t({ zh: 'GLB 可用但目前降級', en: 'GLB available but degraded for performance' }) : t({ zh: '等待正式 GLB 模型', en: 'Waiting for production GLB assets' })}</div>
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
              <div className="mt-3 text-base font-medium text-white">{activeAccessories.length ? `${activeAccessories.length} / ${profile.accessories.length}` : t({ zh: '僅基本配置', en: 'Base setup only' })}</div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{t({ zh: '資產來源', en: 'Asset Source' })}</div>
              <div className="mt-3 text-sm leading-6 text-slate-300">{profile.baseModel?.path || t({ zh: '尚未設定', en: 'Not configured yet' })}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.28em] text-slate-400">
          <div className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5 backdrop-blur-md">
            {t({ zh: 'Reduced Motion / 低效能裝置自動切換', en: 'Auto fallback for reduced motion / low-power devices' })}
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1.5 backdrop-blur-md">
            {profile.baseModel?.renderMode || 'procedural'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Product3DViewer({ profile, selectedAccessoryIds = [], focusedAccessoryId = null, activePresetId = 'overview', t = (value) => value }) {
  const resolvedProfile = profile || fallbackProfile
  const cameraPresets = resolvedProfile.cameraPresets?.length ? resolvedProfile.cameraPresets : [SAFE_PRESET]
  const activePreset = cameraPresets.find((item) => item.id === activePresetId) || cameraPresets[0]
  const activeAccessories = resolvedProfile.accessories.filter((item) => selectedAccessoryIds.includes(item.id))
  const [renderMode, setRenderMode] = useState('fallback')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    const prefersReducedMotion = Boolean(motionQuery?.matches)
    const canvas = document.createElement('canvas')
    const hasWebGL = Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))

    // Fallback only when the device genuinely can't render 3D.
    // Procedural placeholder geometry is acceptable until real GLB assets arrive.
    if (prefersReducedMotion || !hasWebGL) {
      setRenderMode('fallback')
      return
    }

    setRenderMode('interactive')
  }, [resolvedProfile])

  if (renderMode === 'fallback') {
    return (
      <StaticConfiguratorFallback
        profile={resolvedProfile}
        activeAccessories={activeAccessories}
        activePreset={activePreset}
        focusedAccessoryId={focusedAccessoryId}
        t={t}
      />
    )
  }

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_34px_120px_rgba(2,6,23,0.5)] lg:h-[780px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_84%_12%,rgba(245,158,11,0.14),transparent_20%),linear-gradient(180deg,rgba(15,23,42,0.12),rgba(2,6,23,0.55))]" />
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: activePreset.position, fov: 40 }}>
        <SceneContents
          profile={resolvedProfile}
          selectedAccessoryIds={selectedAccessoryIds}
          focusedAccessoryId={focusedAccessoryId}
          activePreset={activePreset}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-slate-400 backdrop-blur-md">
        {t({ zh: '拖曳旋轉 · 滾輪縮放 · 右鍵平移', en: 'Drag to rotate · Scroll to zoom · Right-click to pan' })}
      </div>
    </div>
  )
}
