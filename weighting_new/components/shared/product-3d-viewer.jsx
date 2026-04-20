'use client'

import { Component, memo, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CubicBezierLine, ContactShadows, Float, Line, OrbitControls, Sparkles, Stage, useGLTF } from '@react-three/drei'
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
    const size = bounds.size
    const center = bounds.center
    console.log(
      `%c[GLB BOUNDS] ${path}\n  rawSize  = [${size.map((n) => n.toFixed(2)).join(', ')}]\n  rawCenter= [${center.map((n) => n.toFixed(2)).join(', ')}]\n  autoScale= ${autoScale.toFixed(5)}\n  scaled   = [${(size[0] * autoScale).toFixed(3)}, ${(size[1] * autoScale).toFixed(3)}, ${(size[2] * autoScale).toFixed(3)}]`,
      'background:#1e293b;color:#38bdf8;padding:4px 8px;border-radius:4px;font-family:monospace;'
    )
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

// GLB 配件：自動縮放到 targetSize，放置在 accessory.position
// 配件可在 JSON 以 accessory.glbTransform 進一步微調 (scale / rotation / offset / targetSize / autoFit:false)
function GLBAccessoryInner({ path, position, glbTransform = {} }) {
  const { scene } = useGLTF(path)

  const { object, autoScale, autoOffset } = useMemo(() => {
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
    const targetSize = glbTransform.targetSize ?? 0.65
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? targetSize / maxDim : 1
    return {
      object: copy,
      autoScale: scale,
      autoOffset: [-center.x * scale, -center.y * scale, -center.z * scale]
    }
  }, [scene, glbTransform.targetSize])

  const useAutoFit = glbTransform.autoFit !== false
  const baseScale = useAutoFit ? autoScale : (glbTransform.scale ?? 1)
  const finalScale = Array.isArray(baseScale) ? baseScale : baseScale * (glbTransform.scaleMultiplier ?? 1)
  const rotation = glbTransform.rotation ?? [0, 0, 0]
  const offset = glbTransform.offset ?? [0, 0, 0]
  const finalPosition = useAutoFit
    ? [position[0] + autoOffset[0] + offset[0], position[1] + autoOffset[1] + offset[1], position[2] + autoOffset[2] + offset[2]]
    : [position[0] + offset[0], position[1] + offset[1], position[2] + offset[2]]

  return (
    <primitive
      object={object}
      scale={finalScale}
      rotation={rotation}
      position={finalPosition}
      dispose={null}
    />
  )
}
const GLBAccessory = memo(GLBAccessoryInner)

function GLBAccessoryWithFallback({ accessory, focused }) {
  return (
    <GLBErrorBoundary fallback={<ProceduralAccessory accessory={accessory} focused={focused} />}>
      <Suspense fallback={null}>
        <GLBAccessory
          path={accessory.glbPath}
          position={accessory.position}
          glbTransform={accessory.glbTransform}
        />
      </Suspense>
    </GLBErrorBoundary>
  )
}

function ProceduralAccessory({ accessory, focused }) {
  if (accessory.type === 'scanner') return <Scanner accessory={accessory} focused={focused} />
  if (accessory.type === 'usb') return <USBDrive accessory={accessory} focused={focused} />
  if (accessory.type === 'printer') return <Printer accessory={accessory} focused={focused} />
  if (accessory.type === 'camera') return <CameraAccessory accessory={accessory} focused={focused} />
  if (accessory.type === 'gpio') return <GPIOModule accessory={accessory} focused={focused} />
  return null
}

function AccessoryMesh({ accessory, focused }) {
  if (accessory.glbPath) {
    return <GLBAccessoryWithFallback accessory={accessory} focused={focused} />
  }
  return <ProceduralAccessory accessory={accessory} focused={focused} />
}

// 接口朝外方向 — 從面決定
const FACE_NORMALS = {
  bottom: [0, -1, 0],
  top: [0, 1, 0],
  left: [-1, 0, 0],
  right: [1, 0, 0],
  front: [0, 0, 1],
  back: [0, 0, -1]
}

// 接口外殼 — 一個嵌在儀表上的矩形插座
function PortSocket({ pos, face = 'bottom', type = 'usb' }) {
  const dims = type === 'rs232' ? [0.15, 0.07, 0.05] : [0.13, 0.05, 0.04] // [w, h, depth]
  const rot = face === 'bottom' || face === 'top'
    ? [Math.PI / 2, 0, 0]
    : face === 'back' || face === 'front'
      ? [0, face === 'back' ? Math.PI : 0, 0]
      : [0, face === 'right' ? Math.PI / 2 : -Math.PI / 2, 0]
  const normal = FACE_NORMALS[face] || FACE_NORMALS.bottom
  // 把外殼向面外偏半個深度，讓它剛好貼在面上
  const offset = dims[2] / 2
  const pCenter = [pos[0] + normal[0] * offset, pos[1] + normal[1] * offset, pos[2] + normal[2] * offset]
  return (
    <group position={pCenter} rotation={rot}>
      {/* 插座外殼 */}
      <mesh castShadow>
        <boxGeometry args={[dims[0], dims[1], dims[2]]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* 金屬內凹開口 */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[dims[0] * 0.78, dims[1] * 0.55, dims[2] * 0.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.35} metalness={0.9} />
      </mesh>
    </group>
  )
}

// 小黑圓盤：模擬線纜進入配件本體的孔（cable passthrough hole）
function CableHole({ position, normal = [0, -1, 0], radius = 0.04, color = '#050505' }) {
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(...normal).normalize()
    )
    return q
  }, [normal[0], normal[1], normal[2]])
  return (
    <mesh position={position} quaternion={quaternion}>
      <circleGeometry args={[radius, 24]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.95} />
    </mesh>
  )
}

// 電纜：從儀表接口到配件，使用三次貝茲曲線讓線有自然垂落感
// 使用 TubeGeometry 讓粗細在 3D 中一致（lineWidth 是像素，遠近會不同）
// 支援 portLead / exitLead：從兩端各延伸一段沿插頭背面方向的直線段（模擬應力緩衝段），
// 才進入自然垂落的貝茲曲線，避免線從插頭側面鑽出的不自然感。
function AccessoryCable({
  portPos,
  exitPos,
  portLead,
  exitLead,
  leadLength = 0.074,
  color = '#1f2937',
  sag = 0.35,
  thickness = 0.018
}) {
  const geo = useMemo(() => {
    const p0 = new THREE.Vector3(...portPos)
    const p3 = new THREE.Vector3(...exitPos)

    // 若 leadDir 有提供，計算延伸後的端點 p0L / p3L；否則退化為與端點相同
    const leadVec = (dir) => {
      if (!dir || (dir[0] === 0 && dir[1] === 0 && dir[2] === 0)) return new THREE.Vector3(0, 0, 0)
      return new THREE.Vector3(...dir).normalize().multiplyScalar(leadLength)
    }
    const p0L = p0.clone().add(leadVec(portLead))
    const p3L = p3.clone().add(leadVec(exitLead))

    const dist = p0L.distanceTo(p3L)
    const dip = Math.max(0.2, dist * sag)
    const midA = new THREE.Vector3(
      p0L.x + (p3L.x - p0L.x) * 0.3,
      Math.min(p0L.y, p3L.y) - dip,
      p0L.z + (p3L.z - p0L.z) * 0.3
    )
    const midB = new THREE.Vector3(
      p0L.x + (p3L.x - p0L.x) * 0.7,
      Math.min(p0L.y, p3L.y) - dip,
      p0L.z + (p3L.z - p0L.z) * 0.7
    )

    const path = new THREE.CurvePath()
    if (portLead) path.add(new THREE.LineCurve3(p0, p0L))
    path.add(new THREE.CubicBezierCurve3(p0L, midA, midB, p3L))
    if (exitLead) path.add(new THREE.LineCurve3(p3L, p3))

    return new THREE.TubeGeometry(path, 64, thickness, 10, false)
  }, [portPos, exitPos, portLead, exitLead, leadLength, sag, thickness])

  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} />
    </mesh>
  )
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

  // 使用者開始拖曳/縮放時立即取消預設相機動畫，避免「彈回」
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const cancel = () => {
      transitioningRef.current = false
    }
    controls.addEventListener('start', cancel)
    return () => {
      controls.removeEventListener('start', cancel)
    }
  }, [controlsRef])

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

  // GLB 模式下，有 glbPath 的配件直接載入 GLB；沒有 glbPath 的配件降級為 procedural。
  // 連接線（anchor）在 GLB 模式下隱藏，因為座標未重新校準
  const isGLBMode = profile.baseModel?.status === 'ready'
  const showProceduralAccessories = true
  const showConnectionLines = !isGLBMode

  return (
    <>
      {/* 白色背景的工作室全方位打光（上下前後都有） */}
      <ambientLight intensity={2.6} />
      {/* 半球光：上下顏色都設亮，避免底面偏暗 */}
      <hemisphereLight args={["#ffffff", "#f5f2ea", 2.0]} />
      {/* 上方主光群 */}
      <directionalLight position={[5, 8, 6]} intensity={2.4} castShadow />
      <directionalLight position={[-6, 4, -4]} intensity={1.5} />
      <directionalLight position={[0, 6, -6]} intensity={1.2} />
      {/* 下方補光群（新增，避免從底視角時接口全黑） */}
      <directionalLight position={[0, -8, 0]} intensity={1.8} />
      <directionalLight position={[4, -6, 4]} intensity={1.0} />
      <directionalLight position={[-4, -6, -4]} intensity={1.0} />
      {/* 前方近距離補光 */}
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, -3, 2]} intensity={1.2} color="#ffffff" />
      <pointLight position={[3, 2, 2]} intensity={0.6} color="#fff7e6" />

      <Suspense fallback={null}>
        <group>
          <Float speed={1.15} rotationIntensity={0.18} floatIntensity={0.22}>
            <BaseTerminal baseModel={profile.baseModel} />
            {/* 儲表 GLB 已經有真實接口孔洞，不重複繪製 PortSocket */}
            {showProceduralAccessories
              ? profile.accessories.map((accessory) => {
                  const active = selectedSet.has(accessory.id)
                  const focused = focusedAccessoryId === accessory.id

                  // 電纜資訊：accessory.cable = { portId, exit:[x,y,z], color, sag, thickness }
                  const cable = accessory.cable
                  const portEntry = cable?.portId ? profile.ports?.[cable.portId] : null
                  const portPos = portEntry
                    ? (Array.isArray(portEntry) ? portEntry : portEntry.pos)
                    : null
                  const exitPos = cable
                    ? [
                        accessory.position[0] + (cable.exit?.[0] ?? 0),
                        accessory.position[1] + (cable.exit?.[1] ?? 0),
                        accessory.position[2] + (cable.exit?.[2] ?? 0)
                      ]
                    : null

                  return (
                    <group key={accessory.id}>
                      {showConnectionLines ? (
                        <AccessoryConnection accessory={accessory} active={active} focused={focused} />
                      ) : null}
                      {active ? <AccessoryMesh accessory={accessory} focused={focused} /> : null}
                      {active && portPos && exitPos ? (() => {
                        // 若有 plug 配置，cable 附著在 plug 的 backshell 尾端（bbox 中心 + leadDir × 尾端偏移）
                        // 否則退化到原本的 port/exit 座標
                        const tailOffset = (plug) => {
                          if (!plug?.leadDir || !plug?.position) return null
                          const ts = plug.targetSize ?? 0.18
                          const off = (ts / 37.2) * 18.6 // 以 plug max dim 37.2mm 與 backshell 半長 18.6mm 換算
                          return [
                            plug.position[0] + plug.leadDir[0] * off,
                            plug.position[1] + plug.leadDir[1] * off,
                            plug.position[2] + plug.leadDir[2] * off
                          ]
                        }
                        const attachPort = tailOffset(cable.plugs?.[0]) || portPos
                        const attachExit = tailOffset(cable.plugs?.[1]) || exitPos
                        return (
                          <AccessoryCable
                            portPos={attachPort}
                            exitPos={attachExit}
                            portLead={cable.plugs?.[0]?.leadDir}
                            exitLead={cable.plugs?.[1]?.leadDir}
                            leadLength={cable.leadLength}
                            color={cable.color || (focused ? '#f59e0b' : '#1f2937')}
                            sag={cable.sag}
                            thickness={cable.thickness}
                          />
                        )
                      })() : null}
                      {active && cable?.plugs?.length
                        ? cable.plugs.map((plug, i) => (
                            <Suspense key={`${accessory.id}-plug-${i}`} fallback={null}>
                              <GLBAccessory
                                path={plug.glbPath || '/models/rs232_plug.glb'}
                                position={plug.position}
                                glbTransform={{
                                  rotation: plug.rotation,
                                  targetSize: plug.targetSize ?? 0.18
                                }}
                              />
                            </Suspense>
                          ))
                        : null}
                      {active && cable?.hole ? (
                        <CableHole
                          position={cable.hole.position}
                          normal={cable.hole.normal}
                          radius={cable.hole.radius}
                          color={cable.hole.color}
                        />
                      ) : null}
                    </group>
                  )
                })
              : null}
          </Float>
        </group>
        {focusedAccessory && selectedSet.has(focusedAccessory.id) ? (
            <Sparkles
              count={42}
              scale={[1.6, 1.2, 1.2]}
              position={focusedAccessory.position}
              size={2.4}
              speed={0.3}
              color="#fde68a"
            />
          ) : null}
        {/* 儀表底部約在 y=-0.89；shadow 放更低一點產生飄浮感 */}
        <ContactShadows position={[0, -1.1, 0]} opacity={0.35} scale={8} blur={2.4} far={4} />
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
    <div className="relative h-[640px] w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[#f5f2ea] shadow-[0_34px_120px_rgba(15,23,42,0.12)] lg:h-[780px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.9),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(226,217,198,0.55),transparent_50%),linear-gradient(180deg,#faf7f1,#ece4d3)]" />
      <Canvas dpr={[1, 1.5]} shadows camera={{ position: activePreset.position, fov: 40 }}>
        <SceneContents
          profile={resolvedProfile}
          selectedAccessoryIds={selectedAccessoryIds}
          focusedAccessoryId={focusedAccessoryId}
          activePreset={activePreset}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-slate-300/60 bg-white/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-slate-600 backdrop-blur-md">
        {t({ zh: '拖曳旋轉 · 滾輪縮放 · 右鍵平移', en: 'Drag to rotate · Scroll to zoom · Right-click to pan' })}
      </div>
    </div>
  )
}
