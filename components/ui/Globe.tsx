"use client";

import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

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
  directionalTopLightLight?: string;
  pointLight?: string;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

const aspect = 1.2;
const cameraZ = 300;

function GlobeMesh({ globeConfig, data }: WorldProps) {
  const globeObj = useRef<any>(new ThreeGlobe());
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    const pts: any[] = [];
    data.forEach((arc) => {
      pts.push(
        { lat: arc.startLat, lng: arc.startLng, color: arc.color },
        { lat: arc.endLat, lng: arc.endLng, color: arc.color }
      );
    });
    setPoints(pts);
  }, [data]);

  useEffect(() => {
    const globe = globeObj.current;

    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(globeConfig.showAtmosphere ?? true)
      .atmosphereColor(globeConfig.atmosphereColor ?? "#ffffff")
      .atmosphereAltitude(globeConfig.atmosphereAltitude ?? 0.1)
      .hexPolygonColor(() => globeConfig.polygonColor ?? "rgba(255,255,255,0.7)");

    globe
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

    globe
      .pointsData(points)
      .pointColor((d: any) => d.color)
      .pointsMerge(true)
      .pointRadius(2);
  }, [points, data, globeConfig]);

  return <primitive object={globeObj.current} />;
}

function WebGLConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
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

      <ambientLight intensity={0.6} />

      <directionalLight position={new Vector3(-400, 100, 400)} />
      <directionalLight position={new Vector3(-200, 500, 200)} />
      <pointLight position={new Vector3(-200, 500, 200)} intensity={0.8} />

      <GlobeMesh {...props} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
}
