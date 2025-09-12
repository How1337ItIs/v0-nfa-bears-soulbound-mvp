"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Plane, OrthographicCamera } from "@react-three/drei"
import * as THREE from "three"

interface LiquidLightEngineProps {
  audioData?: {
    volume: number
    bass: number
    mids: number
    treble: number
    beatDetected: boolean
    tempo: number
  }
  songMode?: "darkStar" | "fireOnTheMountain" | "terraPinStation" | "scarletBegonias"
  intensity?: number
  interactive?: boolean
  performanceMode?: "high" | "medium" | "low"
  className?: string
}

const authenticModes = {
  darkStar: {
    colors: [0x1e0a3c, 0x4c0b7a, 0x240b5c, 0x2d0f6b],
    movement: "slow_mysterious_depth",
    energy: "contemplative_cosmic",
  },
  fireOnTheMountain: {
    colors: [0xffd700, 0xff4500, 0xff6347, 0xff8c00],
    movement: "building_intensity_upward_flow",
    energy: "accelerating_climactic",
  },
  terraPinStation: {
    colors: [0x00ffff, 0x00ff80, 0x20b2aa, 0x48d1cc],
    movement: "flowing_water_organic_curves",
    energy: "narrative_storytelling",
  },
  scarletBegonias: {
    colors: [0xff2500, 0xff0080, 0xff1493, 0xff69b4],
    movement: "vibrant_blooming_radial",
    energy: "joyful_celebratory",
  },
}

const liquidLightShader = {
  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform float uBass;
    uniform float uMids;
    uniform float uTreble;
    uniform float uVolume;
    uniform bool uBeatDetected;
    uniform float uIntensity;
    uniform vec3 uColors[4];
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    
    varying vec2 vUv;
    
    vec2 hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                     dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                 mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                     dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * 2.0;
      
      float time = uTime * 0.15;
      
      vec2 flow1 = vec2(
        fbm(p * 2.0 + time * 0.3 + vec2(uBass * 2.0, 0.0)),
        fbm(p * 2.0 + time * 0.3 + vec2(0.0, uMids * 2.0))
      ) * 0.4;
      
      vec2 flow2 = vec2(
        fbm(p * 1.5 + time * 0.2 + flow1),
        fbm(p * 1.5 + time * 0.2 + flow1 + vec2(3.7, 1.3))
      ) * 0.3;
      
      vec2 finalFlow = flow1 + flow2;
      vec2 flowUv = uv + finalFlow;
      
      float pattern1 = fbm(flowUv * 3.0 + time * 0.4);
      float pattern2 = fbm(flowUv * 6.0 - time * 0.3);
      float pattern3 = fbm(flowUv * 12.0 + time * 0.6);
      
      float combined = (pattern1 * 0.5 + pattern2 * 0.3 + pattern3 * 0.2);
      
      float hue = fract(
        time * 0.05 + 
        combined * 0.3 + 
        length(finalFlow) * 0.4 + 
        uTreble * 0.2
      );
      
      vec3 color;
      hue = hue * 6.0;
      float segment = floor(hue);
      float t = fract(hue);
      
      if (segment < 1.0) {
        color = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), t);
      } else if (segment < 2.0) {
        color = mix(vec3(1.0, 1.0, 0.0), vec3(0.0, 1.0, 0.0), t);
      } else if (segment < 3.0) {
        color = mix(vec3(0.0, 1.0, 0.0), vec3(0.0, 1.0, 1.0), t);
      } else if (segment < 4.0) {
        color = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 0.0, 1.0), t);
      } else if (segment < 5.0) {
        color = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 0.0, 1.0), t);
      } else {
        color = mix(vec3(1.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), t);
      }
      
      float audioBoost = 0.6 + (uBass * 0.4 + uMids * 0.3 + uTreble * 0.2) * uIntensity;
      float saturation = 0.8 + uVolume * 0.2;
      
      vec3 gray = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
      color = mix(gray, color, saturation);
      color *= audioBoost;
      color = max(color, vec3(0.15));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
}

function LiquidSimulation({
  audioData,
  songMode = "darkStar",
  intensity = 1.0,
  interactive = true,
}: LiquidLightEngineProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size, mouse, viewport } = useThree()

  console.log("[v0] LiquidSimulation rendering with songMode:", songMode)
  console.log("[v0] Audio data:", audioData)
  console.log("[v0] Viewport size:", viewport.width, viewport.height)

  const modeColors = useMemo(() => {
    const mode = authenticModes[songMode]
    return mode.colors.map((color) => {
      const r = ((color >> 16) & 255) / 255
      const g = ((color >> 8) & 255) / 255
      const b = (color & 255) / 255
      return new THREE.Vector3(r, g, b)
    })
  }, [songMode])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBass: { value: audioData?.bass || 0.5 },
      uMids: { value: audioData?.mids || 0.5 },
      uTreble: { value: audioData?.treble || 0.5 },
      uVolume: { value: audioData?.volume || 0.5 },
      uBeatDetected: { value: audioData?.beatDetected || false },
      uIntensity: { value: intensity },
      uColors: { value: modeColors },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [audioData, intensity, modeColors, size],
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial

      console.log("[v0] Updating shader uniforms, time:", state.clock.elapsedTime)

      material.uniforms.uTime.value = state.clock.elapsedTime

      if (audioData) {
        material.uniforms.uBass.value = audioData.bass
        material.uniforms.uMids.value = audioData.mids
        material.uniforms.uTreble.value = audioData.treble
        material.uniforms.uVolume.value = audioData.volume
        material.uniforms.uBeatDetected.value = audioData.beatDetected
      }

      if (interactive) {
        material.uniforms.uMouse.value.set(mouse.x, mouse.y)
      }

      material.uniforms.uResolution.value.set(size.width, size.height)
    }
  })

  return (
    <Plane ref={meshRef} args={[viewport.width, viewport.height]}>
      <shaderMaterial
        vertexShader={liquidLightShader.vertexShader}
        fragmentShader={liquidLightShader.fragmentShader}
        uniforms={uniforms}
        transparent={false}
      />
    </Plane>
  )
}

export default function LiquidLightEngine(props: LiquidLightEngineProps) {
  const { className = "", performanceMode = "high" } = props

  const performanceSettings = useMemo(() => {
    switch (performanceMode) {
      case "high":
        return {
          pixelRatio: [1, 2],
          glConfig: { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" },
        }
      case "medium":
        return {
          pixelRatio: [1, 1.5],
          glConfig: { antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" },
        }
      case "low":
        return {
          pixelRatio: [1, 1],
          glConfig: { antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" },
        }
      default:
        return {
          pixelRatio: [1, 2],
          glConfig: { antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" },
        }
    }
  }, [performanceMode])

  return (
    <div className={`w-full h-full relative ${className}`}>
      <Canvas
        dpr={performanceSettings.pixelRatio}
        gl={performanceSettings.glConfig}
        style={{ width: "100%", height: "100%" }}
        role="img"
        aria-label={`Authentic liquid light show simulation in ${props.songMode} mode`}
      >
        <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={1} />
        <LiquidSimulation {...props} />
      </Canvas>
    </div>
  )
}

export type { LiquidLightEngineProps }
