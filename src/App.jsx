import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState, useEffect, useCallback } from 'react'
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import TimerUI from './TimerUI'
import SidebarUI from './SidebarUI'
import { generateScramble } from './utils/scrambler'
import { executeMove } from './moves'
import { loadData, saveData, exportData } from './utils/storage'

/* ---------------- COLORS ---------------- */
const COLORS = {
  right: 'red',
  left: 'darkorange',
  top: 'white',
  bottom: 'yellow',
  front: 'green',
  back: 'blue',
  internal: 'black'
}

/* ---------------- CUBELET ---------------- */
function Cubelet({ position, geometry }) {
  const meshRef = useRef()

  const materials = useMemo(() => {
    const [x, y, z] = position
    return [
      x === 1 ? COLORS.right : COLORS.internal,  // +X
      x === -1 ? COLORS.left : COLORS.internal,  // -X
      y === 1 ? COLORS.top : COLORS.internal,    // +Y
      y === -1 ? COLORS.bottom : COLORS.internal, // -Y
      z === 1 ? COLORS.front : COLORS.internal,  // +Z
      z === -1 ? COLORS.back : COLORS.internal   // -Z
    ].map((col, i) => (
      <meshStandardMaterial key={i} attach={`material-${i}`} color={col} roughness={0.1} />
    ))
  }, [position])

  return (
    <mesh ref={meshRef} position={position} geometry={geometry} userData={{ origin: [...position] }}>
      {materials}
    </mesh>
  )
}

/* ---------------- ENGINE LOGIC ---------------- */
const rotateAction = (cubeGroup, rotationGroup, axis, limit, dir, setAnimating, instant = false) => {
  if (!cubeGroup || !rotationGroup || (!instant && TWEEN.getAll().length > 0)) return

  setAnimating(true)

  const currentPieces = [...rotationGroup.children]
  currentPieces.forEach(p => cubeGroup.attach(p))
  rotationGroup.quaternion.set(0, 0, 0, 1)
  rotationGroup.updateMatrixWorld()

  const targets = cubeGroup.children.filter(c => {
    const worldPos = new THREE.Vector3()
    c.getWorldPosition(worldPos)
    return Math.round(worldPos[axis]) === limit
  })

  targets.forEach(p => rotationGroup.attach(p))

  if (instant) {
    rotationGroup.rotation[axis] += (Math.PI / 2) * dir
    rotationGroup.updateMatrixWorld()

    const finalPieces = [...rotationGroup.children]
    finalPieces.forEach(p => {
      cubeGroup.attach(p)
      p.position.set(Math.round(p.position.x), Math.round(p.position.y), Math.round(p.position.z))
      p.rotation.set(
        Math.round(p.rotation.x / (Math.PI / 2)) * (Math.PI / 2),
        Math.round(p.rotation.y / (Math.PI / 2)) * (Math.PI / 2),
        Math.round(p.rotation.z / (Math.PI / 2)) * (Math.PI / 2)
      )
      p.updateMatrixWorld()
    })
    rotationGroup.quaternion.set(0, 0, 0, 1)
    setAnimating(false)
  } else {
    new TWEEN.Tween(rotationGroup.rotation)
      .to({ [axis]: rotationGroup.rotation[axis] + (Math.PI / 2) * dir }, 250)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        const finalPieces = [...rotationGroup.children]
        finalPieces.forEach(p => {
          cubeGroup.attach(p)
          p.position.set(Math.round(p.position.x), Math.round(p.position.y), Math.round(p.position.z))
          p.rotation.set(
            Math.round(p.rotation.x / (Math.PI / 2)) * (Math.PI / 2),
            Math.round(p.rotation.y / (Math.PI / 2)) * (Math.PI / 2),
            Math.round(p.rotation.z / (Math.PI / 2)) * (Math.PI / 2)
          )
        })
        setAnimating(false)
      })
      .start()
  }
}

const resetAction = (cubeGroup, rotationGroup, setAnimating) => {
  TWEEN.removeAll()
  const all = [...cubeGroup.children, ...rotationGroup.children]
  all.forEach(p => {
    cubeGroup.add(p)
    p.position.set(...p.userData.origin)
    p.quaternion.set(0, 0, 0, 1)
  })
  rotationGroup.quaternion.set(0, 0, 0, 1)
  setAnimating(false)
}

function Scene({ cubeGroup, rotationGroup, visible }) {
  const geom = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.05), [])
  useFrame(() => TWEEN.update())

  const positions = useMemo(() => {
    const pts = []
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) pts.push([x, y, z])
    return pts
  }, [])

  return (
    <group visible={visible}>
      <group ref={cubeGroup}>
        {positions.map((pos, i) => (
          <Cubelet key={i} position={pos} geometry={geom} />
        ))}
      </group>
      <group ref={rotationGroup} />
    </group>
  )
}

export default function App() {
  const cubeGroup = useRef()
  const rotationGroup = useRef()
  // eslint-disable-next-line no-unused-vars
  const [animating, setAnimating] = useState(false)

  const [sidebarOpen, setSidebarOpen] = useState(false) // eslint-disable-line no-unused-vars

  const [appState, setAppState] = useState('IDLE')
  const [timeMs, setTimeMs] = useState(0)
  const [scrambleText, setScrambleText] = useState([])
  const [cubeVisible, setCubeVisible] = useState(true)

  const [data, setData] = useState(loadData)

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false)
  const [cubeSize, setCubeSize] = useState(400)

  useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        // On mobile: cube should be comfortably centered in upper half
        // Keep it smaller so timer text below never collides
        const size = Math.min(window.innerWidth * 0.82, window.innerHeight * 0.42, 320)
        setCubeSize(size)
      } else {
        setCubeSize(400)
      }
    }
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  const appStateRef = useRef(appState)
  const startTimeRef = useRef(0)
  const timerIntervalRef = useRef(null)
  const holdTimeoutRef = useRef(null)
  const scrambleRef = useRef(scrambleText)

  const inspectionStartTimeRef = useRef(0)
  const inspectionIntervalRef = useRef(null)
  const [inspectionTimeMs, setInspectionTimeMs] = useState(15000)

  useEffect(() => { appStateRef.current = appState }, [appState])
  useEffect(() => { scrambleRef.current = scrambleText }, [scrambleText])
  useEffect(() => { saveData(data) }, [data])

  const applyScramble = useCallback((scramble) => {
    if (!cubeGroup.current || !rotationGroup.current) return
    resetAction(cubeGroup.current, rotationGroup.current, () => { })
    scramble.forEach(move => {
      executeMove(move, cubeGroup, rotationGroup, (cg, rg, ax, lim, dir) =>
        rotateAction(cg, rg, ax, lim, dir, () => { }, true)
      )
    })
  }, [])

  useEffect(() => {
    const initScramble = generateScramble(20)
    setScrambleText(initScramble)

    // Poll to ensure R3F children are fully mounted before applying rotation filters
    const checkAndScramble = () => {
      if (cubeGroup.current?.children.length === 27) {
        applyScramble(initScramble)
      } else {
        setTimeout(checkAndScramble, 20)
      }
    }
    checkAndScramble()
  }, [applyScramble])

  const updateTimer = useCallback(() => {
    const now = performance.now()
    setTimeMs(now - startTimeRef.current)
    timerIntervalRef.current = requestAnimationFrame(updateTimer)
  }, [])

  const updateInspection = useCallback(() => {
    const state = appStateRef.current;
    if (state !== 'INSPECTING' && state !== 'READYING_RED' && state !== 'READYING_GREEN') return;

    const elapsed = performance.now() - inspectionStartTimeRef.current;
    const remaining = 15000 - elapsed;

    if (remaining <= 0) {
      setAppState('STOPPED');
      setCubeVisible(true);
      setTimeMs(0);

      setData(prev => {
        const activeSession = prev.sessions.find(s => s.id === prev.activeSessionId);
        if (!activeSession) return prev;
        const newSolves = [...activeSession.solves, {
          id: Date.now().toString(),
          timeMs: 0,
          scramble: scrambleRef.current.join(' '),
          penalty: -1, // DNF for exceeding 15s
          date: Date.now()
        }];
        return {
          ...prev,
          sessions: prev.sessions.map(s => s.id === prev.activeSessionId ? { ...s, solves: newSolves } : s)
        };
      });
      return;
    }

    if (state === 'INSPECTING') {
      setInspectionTimeMs(remaining);
    }
    inspectionIntervalRef.current = requestAnimationFrame(updateInspection);
  }, []);

  // ── Keyboard controls (desktop) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'SELECT') return;

      if (e.code !== 'Space') return
      e.preventDefault()
      if (e.repeat) return

      const state = appStateRef.current

      if (state === 'IDLE') {
        setAppState('READYING_INSPECT')
      } else if (state === 'INSPECTING') {
        setAppState('READYING_RED')
        setCubeVisible(false)
        setTimeMs(0)

        holdTimeoutRef.current = setTimeout(() => {
          if (appStateRef.current === 'READYING_RED') {
            setAppState('READYING_GREEN')
          }
        }, 500)
      } else if (state === 'RUNNING') {
        cancelAnimationFrame(timerIntervalRef.current)
        setCubeVisible(true)

        const finalTime = performance.now() - startTimeRef.current;
        setTimeMs(finalTime);

        const nextScramble = generateScramble(20)
        setScrambleText(nextScramble)
        applyScramble(nextScramble)

        setData(prev => {
          const activeSession = prev.sessions.find(s => s.id === prev.activeSessionId);
          if (!activeSession) return prev;
          const newSolves = [...activeSession.solves, {
            id: Date.now().toString(),
            timeMs: finalTime,
            scramble: scrambleRef.current.join(' '),
            penalty: 0,
            date: Date.now()
          }];
          return {
            ...prev,
            sessions: prev.sessions.map(s => s.id === prev.activeSessionId ? { ...s, solves: newSolves } : s)
          };
        });
        setAppState('STOPPED')

      } else if (state === 'STOPPED') {
        setAppState('READYING_INSPECT')
      }
    }

    const handleKeyUp = (e) => {
      if (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'SELECT') return;

      if (e.code !== 'Space') return
      e.preventDefault()

      const state = appStateRef.current

      if (state === 'READYING_INSPECT') {
        setAppState('INSPECTING')
        setInspectionTimeMs(15000)
        inspectionStartTimeRef.current = performance.now()
        inspectionIntervalRef.current = requestAnimationFrame(updateInspection)
      } else if (state === 'READYING_RED') {
        clearTimeout(holdTimeoutRef.current)
        setAppState('INSPECTING')
        setCubeVisible(true)
      } else if (state === 'READYING_GREEN') {
        cancelAnimationFrame(inspectionIntervalRef.current)
        setAppState('RUNNING')
        startTimeRef.current = performance.now()
        timerIntervalRef.current = requestAnimationFrame(updateTimer)
      }
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearTimeout(holdTimeoutRef.current)
      cancelAnimationFrame(timerIntervalRef.current)
      cancelAnimationFrame(inspectionIntervalRef.current)
    }
  }, [applyScramble, updateTimer, updateInspection])

  // ── Touch controls (mobile) ──
  const handleTouchStart = useCallback(() => {
    const state = appStateRef.current
    if (state === 'IDLE' || state === 'STOPPED') {
      setAppState('READYING_INSPECT')
    } else if (state === 'INSPECTING') {
      setAppState('READYING_RED')
      setCubeVisible(false)
      setTimeMs(0)

      holdTimeoutRef.current = setTimeout(() => {
        if (appStateRef.current === 'READYING_RED') {
          setAppState('READYING_GREEN')
        }
      }, 500)
    } else if (state === 'RUNNING') {
      cancelAnimationFrame(timerIntervalRef.current)
      setCubeVisible(true)

      const finalTime = performance.now() - startTimeRef.current
      setTimeMs(finalTime)

      const nextScramble = generateScramble(20)
      setScrambleText(nextScramble)
      applyScramble(nextScramble)

      setData(prev => {
        const activeSession = prev.sessions.find(s => s.id === prev.activeSessionId)
        if (!activeSession) return prev
        const newSolves = [...activeSession.solves, {
          id: Date.now().toString(),
          timeMs: finalTime,
          scramble: scrambleRef.current.join(' '),
          penalty: 0,
          date: Date.now()
        }]
        return {
          ...prev,
          sessions: prev.sessions.map(s => s.id === prev.activeSessionId ? { ...s, solves: newSolves } : s)
        }
      })
      setAppState('STOPPED')
    }
  }, [applyScramble, updateTimer])

  const handleTouchEnd = useCallback(() => {
    const state = appStateRef.current
    if (state === 'READYING_INSPECT') {
      setAppState('INSPECTING')
      setInspectionTimeMs(15000)
      inspectionStartTimeRef.current = performance.now()
      inspectionIntervalRef.current = requestAnimationFrame(updateInspection)
    } else if (state === 'READYING_RED') {
      clearTimeout(holdTimeoutRef.current)
      setAppState('INSPECTING')
      setCubeVisible(true)
    } else if (state === 'READYING_GREEN') {
      cancelAnimationFrame(inspectionIntervalRef.current)
      setAppState('RUNNING')
      startTimeRef.current = performance.now()
      timerIntervalRef.current = requestAnimationFrame(updateTimer)
    }
  }, [updateInspection, updateTimer])

  const handleSessionChange = (id) => setData(p => ({ ...p, activeSessionId: id }));
  const handleAddSession = () => {
    const newId = Date.now().toString();
    setData(p => ({
      ...p,
      activeSessionId: newId,
      sessions: [...p.sessions, { id: newId, name: 'Session ' + (p.sessions.length + 1), solves: [] }]
    }));
  };
  const handleClearSession = () => {
    setData(p => ({
      ...p,
      sessions: p.sessions.map(s => s.id === p.activeSessionId ? { ...s, solves: [] } : s)
    }))
  };
  const handlePenalty = (solveId, penalty) => {
    setData(p => ({
      ...p,
      sessions: p.sessions.map(s => s.id === p.activeSessionId ? {
        ...s,
        solves: s.solves.map(slv => slv.id === solveId ? { ...slv, penalty: penalty } : slv)
      } : s)
    }))
  };
  const handleDeleteSolve = (solveId) => {
    setData(p => ({
      ...p,
      sessions: p.sessions.map(s => s.id === p.activeSessionId ? {
        ...s,
        solves: s.solves.filter(slv => slv.id !== solveId)
      } : s)
    }))
  };

  useEffect(() => {
    if (!document.getElementById('inter-font')) {
      const link = document.createElement('link');
      link.id = 'inter-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const isFocusMode = appState === 'INSPECTING' || appState === 'READYING_RED' || appState === 'READYING_GREEN' || appState === 'RUNNING'

  // Compute cube position: centered, but shifted up slightly on desktop
  const cubeTop = isMobile
    ? `calc(50% - ${cubeSize / 2}px - 30px)` // center-ish, above timer
    : '50%'

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#060210',
      position: 'relative', overflow: 'hidden',
      fontFamily: '"Inter", sans-serif',
      touchAction: 'none',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');

        * { box-sizing: border-box; }

        html, body {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }

        .glass-panel {
          border: 0.5px solid rgba(255, 255, 255, 0.1);
          box-shadow: none;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
        }
      `}</style>

      {/* Deep Amethyst static base */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: '#060210'
      }} />

      {/* Professional Mesh Grid — dynamically centered spotlight */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(140, 70, 255, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(140, 70, 255, 0.35) 1px, transparent 1px)',
        backgroundSize: '55px 55px',
        maskImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 5%, rgba(255,255,255,0.3) 30%, transparent 65%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 5%, rgba(255,255,255,0.3) 30%, transparent 65%)'
      }} />

      {/* Horizon glow strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '40%', zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(100, 30, 200, 0.12) 0%, transparent 100%)'
      }} />

      {/* 2% Noise Grain Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
        opacity: 0.025
      }} />

      <SidebarUI
        data={data}
        appState={appState}
        onSessionChange={handleSessionChange}
        onAddSession={handleAddSession}
        onClearSession={handleClearSession}
        onPenalty={handlePenalty}
        onDeleteSolve={handleDeleteSolve}
        onExport={exportData}
        isFocusMode={isFocusMode}
      />

      <TimerUI
        appState={appState}
        timeMs={timeMs}
        scrambleText={scrambleText}
        inspectionTimeMs={inspectionTimeMs}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        isMobile={isMobile}
      />

      {/* Soft amethyst ground glow under cube */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '50%' : '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? `${cubeSize * 1.4}px` : '500px',
        height: isMobile ? `${cubeSize * 1.4}px` : '500px',
        background: 'radial-gradient(ellipse at center, rgba(120, 40, 200, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 4,
        opacity: isFocusMode ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out'
      }} />

      {/* 3D Cube Canvas — responsive size, centered at 44% on mobile */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '50%' : '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${cubeSize}px`,
        height: `${cubeSize}px`,
        zIndex: 5,
        opacity: isFocusMode ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out'
      }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />

            <group position={[0, 1.2, 0]} scale={[1.0, 1.0, 1.0]}>
              <Scene
                cubeGroup={cubeGroup}
                rotationGroup={rotationGroup}
                visible={cubeVisible}
              />
              <ContactShadows position={[0, -2.0, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
            </group>

            <OrbitControls makeDefault enablePan={false} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}