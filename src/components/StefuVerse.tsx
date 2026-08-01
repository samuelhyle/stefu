import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function StefuVerse() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; animId: number } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = 600

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(4, 3, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Ambient light
    const ambient = new THREE.AmbientLight(0x404060)
    scene.add(ambient)

    // Main light
    const mainLight = new THREE.DirectionalLight(0xff6b9d, 1)
    mainLight.position.set(5, 10, 7)
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x6b5bff, 0.5)
    fillLight.position.set(-5, 0, 5)
    scene.add(fillLight)

    // Floating particles
    const particleCount = 500
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: 0x6b5bff, size: 0.03, transparent: true, opacity: 0.6 })
    )
    scene.add(particles)

    // Central torus knot
    const knotGeo = new THREE.TorusKnotGeometry(1, 0.3, 128, 16)
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0xff6b9d,
      emissive: 0x6b5bff,
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    })
    const knot = new THREE.Mesh(knotGeo, knotMat)
    knot.position.y = 0.5
    scene.add(knot)

    // Ring
    const ringGeo = new THREE.TorusGeometry(1.8, 0.05, 16, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6b5bff, transparent: true, opacity: 0.5 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.5
    scene.add(ring)

    // Second ring
    const ring2Geo = new THREE.TorusGeometry(2.2, 0.02, 16, 64)
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xff6b9d, transparent: true, opacity: 0.3 })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.z = Math.PI / 3
    ring2.position.y = 0.5
    scene.add(ring2)

    // Floor glow
    const floorGeo = new THREE.PlaneGeometry(8, 8)
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0x6b5bff,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.5
    scene.add(floor)

    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      knot.rotation.x = elapsed * 0.2
      knot.rotation.y = elapsed * 0.3
      ring.rotation.z = elapsed * 0.1
      ring2.rotation.x = elapsed * 0.15
      particles.rotation.y = elapsed * 0.02

      renderer.render(scene, camera)
      sceneRef.current!.animId = requestAnimationFrame(animate)
    }

    sceneRef.current = { scene, camera, renderer, animId: 0 }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(sceneRef.current!.animId)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div ref={containerRef} className="w-full" style={{ height: 600 }} />
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        <h3 className="text-3xl font-display font-bold text-white mb-2">Stefu Verse</h3>
        <p className="text-white/50">A 3D interactive space</p>
      </div>
    </div>
  )
}
