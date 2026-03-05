"use client"

import { useEffect, useRef } from "react"

function LandingScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)

  useEffect(() => {
    console.log("LandingScene montado, container:", containerRef.current)
    if (!containerRef.current) return

    let cancelled = false

    async function init() {
      console.log("Iniciando carga de THREE.js...")
      const THREE = await import("three")
      console.log("THREE.js cargado")
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js")
      console.log("OrbitControls cargados")

      if (cancelled || !containerRef.current) return

      const scene = new THREE.Scene()
      scene.background = new THREE.Color("#0f0f1a")
      scene.fog = new THREE.FogExp2("#0f0f1a", 0.06)

      const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100)
      camera.position.set(3, 1, 5)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      containerRef.current.appendChild(renderer.domElement)

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambient)
      const dir = new THREE.DirectionalLight(0xffffff, 1)
      dir.position.set(5, 5, 5)
      scene.add(dir)
      const green = new THREE.PointLight(0x4ade80, 1.2, 25)
      green.position.set(-3, 2, -3)
      scene.add(green)
      const orange = new THREE.PointLight(0xf5a623, 0.6, 25)
      orange.position.set(3, -1, 3)
      scene.add(orange)
      const spot = new THREE.SpotLight(0x4ade80, 0.8, 20, 0.5)
      spot.position.set(0, 5, 0)
      scene.add(spot)

      // Materials
      const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a2a3e, metalness: 0.8, roughness: 0.2 })
      const silverMetal = new THREE.MeshStandardMaterial({ color: 0x8a8a9e, metalness: 0.9, roughness: 0.1 })
      const chromeIHS = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 1, roughness: 0.05 })
      const pcbGreen = new THREE.MeshStandardMaterial({ color: 0x1b5e20, metalness: 0.4, roughness: 0.6 })
      const ramTop = new THREE.MeshStandardMaterial({ color: 0x2e7d32, metalness: 0.7, roughness: 0.3, emissive: new THREE.Color(0x4ade80), emissiveIntensity: 0.2 })
      const moboGreen = new THREE.MeshStandardMaterial({ color: 0x0d4a2d, metalness: 0.3, roughness: 0.7 })
      const ssdBlue = new THREE.MeshStandardMaterial({ color: 0x0d47a1, metalness: 0.6, roughness: 0.4 })
      const chipBlack = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 })
      const frameDark = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.7 })
      const fanGrey = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 })
      const traceMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, emissive: new THREE.Color(0x4ade80), emissiveIntensity: 0.5 })
      const socketGrey = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 })

      const mainGroup = new THREE.Group()
      scene.add(mainGroup)

      // PC Case (Gabinete)
      const pcCase = new THREE.Group()
      
      // Panel trasero
      const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 4, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x1e1e30, metalness: 0.8, roughness: 0.2 })
      )
      backPanel.position.set(0, 0, -1)
      pcCase.add(backPanel)

      // Panel izquierdo
      const leftPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 4, 2),
        new THREE.MeshStandardMaterial({ color: 0x24243a, metalness: 0.7, roughness: 0.3 })
      )
      leftPanel.position.set(-1.1, 0, 0)
      pcCase.add(leftPanel)

      // Panel derecho (cristal templado)
      const rightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 4, 2),
        new THREE.MeshStandardMaterial({ 
          color: 0x1a1a2e, 
          transparent: true, 
          opacity: 0.3,
          metalness: 0.9, 
          roughness: 0.1 
        })
      )
      rightPanel.position.set(1.1, 0, 0)
      pcCase.add(rightPanel)

      // Panel superior
      const topPanel = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.05, 2),
        new THREE.MeshStandardMaterial({ color: 0x20203a, metalness: 0.7, roughness: 0.3 })
      )
      topPanel.position.set(0, 2, 0)
      pcCase.add(topPanel)

      // Panel inferior
      const bottomPanel = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.05, 2),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.7, roughness: 0.3 })
      )
      bottomPanel.position.set(0, -2, 0)
      pcCase.add(bottomPanel)

      // Panel frontal (con ventilación)
      const frontTop = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.5, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.6, roughness: 0.4 })
      )
      frontTop.position.set(0, 1, 1)
      pcCase.add(frontTop)

      const frontBottom = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 2, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x0d0d1a, metalness: 0.5, roughness: 0.5 })
      )
      frontBottom.position.set(0, -1, 1)
      pcCase.add(frontBottom)

      // Componentes internos visibles (motherboard)
      const mobo = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.04, 1.5),
        moboGreen
      )
      mobo.position.set(0, -0.5, -0.3)
      mobo.rotation.y = Math.PI / 16
      pcCase.add(mobo)

      // GPU visible
      const gpu = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.15, 0.5),
        darkMetal
      )
      gpu.position.set(0.2, -0.3, 0.2)
      gpu.rotation.y = Math.PI / 16
      pcCase.add(gpu)

      // Ventiladores GPU
      for (const x of [-0.2, 0.2]) {
        const fan = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.02, 20),
          fanGrey
        )
        fan.position.set(0.2 + x, -0.15, 0.2)
        fan.rotation.x = Math.PI / 2
        fan.rotation.z = Math.PI / 16
        pcCase.add(fan)
      }

      // RAM sticks
      for (let i = 0; i < 2; i++) {
        const ram = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.8, 0.3),
          pcbGreen
        )
        ram.position.set(-0.3 + i * 0.2, 0.3, -0.3)
        ram.rotation.y = Math.PI / 16
        pcCase.add(ram)
        
        const ramHeat = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.6, 0.32),
          ramTop
        )
        ramHeat.position.set(-0.3 + i * 0.2, 0.3, -0.3)
        ramHeat.rotation.y = Math.PI / 16
        pcCase.add(ramHeat)
      }

      // Cooler CPU
      const cooler = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.08, 24),
        fanGrey
      )
      cooler.position.set(-0.4, 0.8, -0.2)
      cooler.rotation.x = Math.PI / 2
      pcCase.add(cooler)

      // LED strips (tira LED verde)
      const ledStrip1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 3.5, 0.05),
        new THREE.MeshStandardMaterial({ 
          color: 0x4ade80, 
          emissive: 0x4ade80, 
          emissiveIntensity: 1 
        })
      )
      ledStrip1.position.set(1, 0, 0.8)
      pcCase.add(ledStrip1)

      mainGroup.add(pcCase)

      // Particles
      const particleGeom = new THREE.BufferGeometry()
      const count = 100
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15
      }
      particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      const particleMat = new THREE.PointsMaterial({ color: 0x4ade80, size: 0.015, transparent: true, opacity: 0.4 })
      scene.add(new THREE.Points(particleGeom, particleMat))

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableZoom = false
      controls.enablePan = false
      controls.autoRotate = false
      controls.maxPolarAngle = Math.PI / 1.8
      controls.minPolarAngle = Math.PI / 3

      sceneRef.current = { scene, camera, renderer, controls, mainGroup }

      function animate() {
        if (cancelled) return
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      function onResize() {
        if (!containerRef.current) return
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      }
      window.addEventListener("resize", onResize)
      sceneRef.current.onResize = onResize
    }

    init()

    return () => {
      cancelled = true
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose()
        if (sceneRef.current.onResize) {
          window.removeEventListener("resize", sceneRef.current.onResize)
        }
        if (containerRef.current && sceneRef.current.renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement)
        }
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}

export default LandingScene
