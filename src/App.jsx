import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
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
  
  const [appState, setAppState] = useState('IDLE') 
  const [timeMs, setTimeMs] = useState(0)
  const [scrambleText, setScrambleText] = useState([])
  const [cubeVisible, setCubeVisible] = useState(true)

  const [data, setData] = useState(loadData)

  const appStateRef = useRef(appState)
  const startTimeRef = useRef(0)
  const timerIntervalRef = useRef(null)
  const holdTimeoutRef = useRef(null)
  const scrambleRef = useRef(scrambleText)

  useEffect(() => { appStateRef.current = appState }, [appState])
  useEffect(() => { scrambleRef.current = scrambleText }, [scrambleText])
  useEffect(() => { saveData(data) }, [data])

  const applyScramble = useCallback((scramble) => {
    if (!cubeGroup.current || !rotationGroup.current) return
    resetAction(cubeGroup.current, rotationGroup.current, () => {})
    scramble.forEach(move => {
      executeMove(move, cubeGroup, rotationGroup, (cg, rg, ax, lim, dir) => 
        rotateAction(cg, rg, ax, lim, dir, () => {}, true)
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'SELECT') return;

      if (e.code !== 'Space') return
      e.preventDefault()
      if (e.repeat) return

      const state = appStateRef.current

      if (state === 'IDLE') {
        setAppState('READYING_RED')
        setCubeVisible(false)
        setTimeMs(0)
        
        holdTimeoutRef.current = setTimeout(() => {
          setAppState('READYING_GREEN')
        }, 300) 
      } else if (state === 'RUNNING') {
        cancelAnimationFrame(timerIntervalRef.current)
        setAppState('STOPPED')
        setCubeVisible(true)
        
        const finalTime = performance.now() - startTimeRef.current;
        setTimeMs(finalTime);
        
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

      } else if (state === 'STOPPED') {
         setTimeMs(0)
         setAppState('READYING_RED')
         setCubeVisible(false)
         holdTimeoutRef.current = setTimeout(() => {
            setAppState('READYING_GREEN')
         }, 300)
      }
    }

    const handleKeyUp = (e) => {
      if (document.activeElement.tagName === 'BUTTON' || document.activeElement.tagName === 'SELECT') return;

      if (e.code !== 'Space') return
      e.preventDefault()

      const state = appStateRef.current

      if (state === 'READYING_RED') {
        clearTimeout(holdTimeoutRef.current)
        setAppState('IDLE')
        setCubeVisible(true) 
      } else if (state === 'READYING_GREEN') {
        setAppState('RUNNING')
        startTimeRef.current = performance.now()
        timerIntervalRef.current = requestAnimationFrame(updateTimer)
      } else if (state === 'STOPPED') {
        const newScramble = generateScramble(20)
        setScrambleText(newScramble)
        applyScramble(newScramble)
        setAppState('IDLE')
      }
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearTimeout(holdTimeoutRef.current)
      cancelAnimationFrame(timerIntervalRef.current)
    }
  }, [applyScramble, updateTimer])


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

  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      background: 'radial-gradient(circle at 50% 20%, #4B1A8D 0%, #0B001A 100%)', 
      position: 'relative', overflow: 'hidden',
      fontFamily: '"Inter", sans-serif'
    }}>
      
      <SidebarUI 
        data={data}
        appState={appState}
        onSessionChange={handleSessionChange}
        onAddSession={handleAddSession}
        onClearSession={handleClearSession}
        onPenalty={handlePenalty}
        onDeleteSolve={handleDeleteSolve}
        onExport={exportData}
      />

      <TimerUI appState={appState} timeMs={timeMs} scrambleText={scrambleText} />

      <div style={{ position: 'absolute', top: '100px', bottom: '150px', left: 0, right: 0 }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            
            <Scene 
              cubeGroup={cubeGroup} 
              rotationGroup={rotationGroup} 
              visible={cubeVisible}
            />
            
            <OrbitControls makeDefault enablePan={false} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}