import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function Room({ images, onImageClick }) {
  const meshRef = useRef()
  const frameRefs = useRef([])
  
  const wallTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f5f0e8'
    ctx.fillRect(0, 0, 512, 512)
    ctx.fillStyle = '#e8e0d0'
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(0, i * 26, 512, 2)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
    return texture
  }, [])

  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#2a1810'
    ctx.fillRect(0, 0, 512, 512)
    ctx.strokeStyle = '#3d2817'
    ctx.lineWidth = 1
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 512)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(512, i)
      ctx.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    return texture
  }, [])

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={floorTexture} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2.5, -8]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.8} />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, 2.5, 8]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.8} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-9, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.8} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[9, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[16, 5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.8} />
      </mesh>

      {/* Picture Frames on Back Wall */}
      {images.map((image, index) => (
        <group
          key={`back-${index}`}
          position={[-6 + index * 4, 2.8, -7.9]}
          ref={el => frameRefs.current[index] = el}
        >
          <mesh onClick={() => onImageClick(image)}>
            <boxGeometry args={[2.2, 1.6, 0.1]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2, 1.4]} />
            <meshBasicMaterial map={image.texture} />
          </mesh>
        </group>
      ))}

      {/* Picture Frames on Left Wall */}
      {images.slice(0, 3).map((image, index) => (
        <group
          key={`left-${index}`}
          position={[-8.9, 2.8, -4 + index * 4]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <mesh>
            <boxGeometry args={[2.2, 1.6, 0.1]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2, 1.4]} />
            <meshBasicMaterial map={image.texture} />
          </mesh>
        </group>
      ))}

      {/* Spotlights */}
      <pointLight position={[0, 4.5, 0]} intensity={0.5} distance={10} color="#fff5e6" />
      <pointLight position={[-6, 4.5, -5]} intensity={0.3} distance={8} color="#fff5e6" />
      <pointLight position={[6, 4.5, -5]} intensity={0.3} distance={8} color="#fff5e6" />
    </group>
  )
}

function Viewer3D({ images, onImageClick }) {
  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 60 }}
      shadows
      gl={{ preserveDrawingBuffer: true }}
    >
      <color attach="background" args={['#1a1a1a']} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
      <Room images={images} onImageClick={onImageClick} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2}
        target={[0, 2, 0]}
      />
      <Environment preset="city" />
    </Canvas>
  )
  
}

export default Viewer3D

