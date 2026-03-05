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
      scene.background = new THREE.Color("#0d0d1a")
      scene.fog = new THREE.FogExp2("#0d0d1a", 0.08)

      const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 100)
      camera.position.set(0, 0, 6)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      containerRef.current.appendChild(renderer.domElement)

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.2)
      scene.add(ambient)
      const dir = new THREE.DirectionalLight(0xffffff, 0.5)
      dir.position.set(5, 5, 5)
      scene.add(dir)
      const green = new THREE.PointLight(0x4ade80, 0.8, 20)
      green.position.set(-3, 2, -3)
      scene.add(green)
      const orange = new THREE.PointLight(0xf5a623, 0.4, 20)
      orange.position.set(3, -1, 3)
      scene.add(orange)
      const spot = new THREE.SpotLight(0x4ade80, 0.4, 15, 0.5)
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

      // GPU
      const gpuGroup = new THREE.Group()
      gpuGroup.position.set(2, 0.5, 0)
      gpuGroup.rotation.set(0.2, 0.5, 0.1)
      const gpuBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.5), darkMetal)
      gpuGroup.add(gpuBody)
      for (const x of [-0.2, 0.2]) {
        const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 20), new THREE.MeshStandardMaterial({ color: 0x1a1a2e }))
        fan.position.set(x, 0.08, 0)
        gpuGroup.add(fan)
      }
      mainGroup.add(gpuGroup)

      // CPU
      const cpuGroup = new THREE.Group()
      cpuGroup.position.set(-1.5, 1, 1)
      cpuGroup.rotation.set(0.3, -0.4, 0.1)
      cpuGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.08), silverMetal))
      const ihs = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.03), chromeIHS)
      ihs.position.z = 0.05
      cpuGroup.add(ihs)
      mainGroup.add(cpuGroup)

      // RAM
      const ramGroup = new THREE.Group()
      ramGroup.position.set(0, -0.8, 2)
      ramGroup.rotation.set(0.1, 0.8, -0.2)
      ramGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.3), pcbGreen))
      const ramHeat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.32), ramTop)
      ramHeat.position.y = 0.42
      ramGroup.add(ramHeat)
      mainGroup.add(ramGroup)

      // Motherboard
      const moboGroup = new THREE.Group()
      moboGroup.position.set(-2, -0.5, -1)
      moboGroup.rotation.set(0.5, 0.3, -0.1)
      moboGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.04), moboGreen))
      const cpuSocket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.015), socketGrey)
      cpuSocket.position.set(0, 0.2, 0.025)
      moboGroup.add(cpuSocket)
      for (const y of [0, 0.1, -0.1, -0.3]) {
        const trace = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.003, 0.001), traceMat)
        trace.position.set(0.2, y, 0.025)
        moboGroup.add(trace)
      }
      mainGroup.add(moboGroup)

      // SSD
      const ssdGroup = new THREE.Group()
      ssdGroup.position.set(1, 1.5, -1.5)
      ssdGroup.rotation.set(-0.3, 0.7, 0.2)
      ssdGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.25), ssdBlue))
      const nand = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.01, 0.15), chipBlack)
      nand.position.y = 0.025
      ssdGroup.add(nand)
      mainGroup.add(ssdGroup)

      // Cooler
      const coolerGroup = new THREE.Group()
      coolerGroup.position.set(-0.5, 1.8, 0.5)
      coolerGroup.rotation.set(0.4, -0.2, 0.3)
      coolerGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.08), frameDark))
      coolerGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 20), fanGrey))
      mainGroup.add(coolerGroup)

      // Particles
      const particleGeom = new THREE.BufferGeometry()
      const count = 200
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 12
      }
      particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      const particleMat = new THREE.PointsMaterial({ color: 0x4ade80, size: 0.02, transparent: true, opacity: 0.6 })
      scene.add(new THREE.Points(particleGeom, particleMat))

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableZoom = false
      controls.enablePan = false
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.3
      controls.maxPolarAngle = Math.PI / 1.8
      controls.minPolarAngle = Math.PI / 3

      sceneRef.current = { scene, camera, renderer, controls, mainGroup }

      const clock = new THREE.Clock()

      function animate() {
        if (cancelled) return
        requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        mainGroup.rotation.y = t * 0.15
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
