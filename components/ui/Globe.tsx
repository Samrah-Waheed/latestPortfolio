"use client";

import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

extend({ ThreeGlobe });

const aspect = 1.2;
const cameraZ = 300;
const RING_PROPAGATION_SPEED = 3;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  globeColor?: string;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  showAtmosphere?: boolean;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings: number[] = [];

function GlobeMesh({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<any>(null);
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    if (!globeRef.current) return;

    const pts: any[] = [];
    data.forEach((arc) => {
      const rgb = hexToRgb(arc.color);
      if (!rgb) return;

      pts.push(
        {
          lat: arc.startLat,
          lng: arc.startLng,
          color: `rgb(${rgb.r},${rgb.g},${rgb.b})`,
        },
        {
          lat: arc.endLat,
          lng: arc.endLng,
          color: `rgb(${rgb.r},${rgb.g},${rgb.b})`,
        }
      );
    });

    setPoints(pts);
  }, [data]);

  useEffect(() => {
    if (!globeRef.current || points.length === 0) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(globeConfig.showAtmosphere ?? true)
      .atmosphereColor(globeConfig.atmosphereColor ?? "#ffffff")
      .atmosphereAltitude(globeConfig.atmosphereAltitude ?? 0.1)
      .hexPolygonColor(() => globeConfig.polygonColor ?? "rgba(255,255,255,0.7)");

    globeRef.current
      .arcsData(data)
      .arcStartLat((d: any) => d.startLat)
      .arcStartLng((d: any) => d.startLng)
      .arcEndLat((d: any) => d.endLat)
      .arcEndLng((d: any) => d.endLng)
      .arcColor((d: any) => d.color)
      .arcAltitude((d: any) => d.arcAlt)
      .arcDashLength(globeConfig.arcLength ?? 0.9)
      .arcDashGap(15)
      .arcDashAnimateTime(globeConfig.arcTime ?? 2000);

    globeRef.current
      .pointsData(points)
      .pointColor((d: any) => d.color)
      .pointsMerge(true)
      .pointRadius(2);

    const interval = setInterval(() => {
      numbersOfRings = genRandomNumbers(0, points.length, Math.floor(points.length / 2));
      globeRef.current.ringsData(points.filter((_, i) => numbersOfRings.includes(i)));
    }, 2000);

    return () => clearInterval(interval);
  }, [points, data, globeConfig]);

  return <threeGlobe ref={globeRef} />;
}

function WebGLConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    if (typeof window === "undefined") return;
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);

  return null;
}

export function World(props: WorldProps) {
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLConfig />

      <ambientLight color={props.globeConfig.ambientLight} intensity={0.6} />

      <directionalLight
        color={props.globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />

      <directionalLight
        color={props.globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />

      <pointLight
        color={props.globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />

      <GlobeMesh {...props} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
        minDistance={cameraZ}
        maxDistance={cameraZ}
      />
    </Canvas>
  );
}

function hexToRgb(hex: string) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res
    ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) }
    : null;
}

function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}
