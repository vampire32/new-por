"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT = new THREE.Color("#2A4A7F");
const INK = new THREE.Color("#1C2533");
const POINTS = 360;
const NEIGHBOURS = 3;
const PACKETS = 14;

// Evenly spread points on a sphere (Fibonacci lattice).
function spherePoints(n, r) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * radius * r, y * r, Math.sin(theta) * radius * r));
  }
  return pts;
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  g.beginPath();
  g.arc(32, 32, 28, 0, Math.PI * 2);
  g.fillStyle = "#fff";
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// The hero's 3D "network globe": nodes joined to their neighbours, with packets travelling along the links.
export default function HeroScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the hero still works without the globe.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const globe = new THREE.Group();
    globe.rotation.set(0.35, 0, 0.12);
    scene.add(globe);

    const pts = spherePoints(POINTS, 2.2);
    const texture = dotTexture();

    // Nodes: depth-tinted so the far side reads lighter.
    const nodeGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const nodeMat = new THREE.PointsMaterial({ color: ACCENT, size: 0.08, map: texture, transparent: true, alphaTest: 0.3 });
    globe.add(new THREE.Points(nodeGeo, nodeMat));

    // Links to nearest neighbours.
    const edges = [];
    const seen = new Set();
    pts.forEach((p, i) => {
      pts
        .map((q, j) => [j, p.distanceToSquared(q)])
        .filter(([j]) => j !== i)
        .sort((a, b) => a[1] - b[1])
        .slice(0, NEIGHBOURS)
        .forEach(([j]) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) {
            seen.add(key);
            edges.push([i, j]);
          }
        });
    });
    const linePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => {
      pts[a].toArray(linePositions, k * 6);
      pts[b].toArray(linePositions, k * 6 + 3);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.12 });
    globe.add(new THREE.LineSegments(lineGeo, lineMat));

    // Outer orbit ring for depth.
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.004, 8, 200),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.25 })
    );
    ring.rotation.set(1.2, 0.3, 0);
    scene.add(ring);

    // Packets travelling along great-circle arcs between random nodes.
    const packetGeo = new THREE.BufferGeometry();
    const packetPos = new Float32Array(PACKETS * 3);
    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
    const packetMat = new THREE.PointsMaterial({ color: ACCENT, size: 0.13, map: texture, transparent: true, alphaTest: 0.3 });
    globe.add(new THREE.Points(packetGeo, packetMat));
    const newTrip = () => ({
      from: pts[Math.floor(Math.random() * POINTS)],
      to: pts[Math.floor(Math.random() * POINTS)],
      t: Math.random(),
      speed: 0.12 + Math.random() * 0.18,
    });
    const trips = Array.from({ length: PACKETS }, newTrip);
    const tmp = new THREE.Vector3();
    const placePackets = () => {
      trips.forEach((trip, i) => {
        tmp.copy(trip.from).lerp(trip.to, trip.t).setLength(2.2 + Math.sin(trip.t * Math.PI) * 0.35);
        tmp.toArray(packetPos, i * 3);
      });
      packetGeo.attributes.position.needsUpdate = true;
    };

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const pointer = { x: 0, y: 0 };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    visibility.observe(mount);

    let last = performance.now();
    let frame = 0;
    const tick = (now = performance.now()) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      globe.rotation.y += dt * 0.12;
      globe.rotation.x += (0.35 + pointer.y * 0.25 - globe.rotation.x) * 0.04;
      globe.rotation.z += (0.12 - pointer.x * 0.15 - globe.rotation.z) * 0.04;
      ring.rotation.z += dt * 0.05;
      trips.forEach((trip, i) => {
        trip.t += dt * trip.speed;
        if (trip.t >= 1) trips[i] = { ...newTrip(), t: 0 };
      });
      placePackets();
      renderer.render(scene, camera);
    };

    placePackets();
    if (reduceMotion) renderer.render(scene, camera);
    else tick();
    mount.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointer);
      [nodeGeo, lineGeo, packetGeo, ring.geometry].forEach((g) => g.dispose());
      [nodeMat, lineMat, packetMat, ring.material].forEach((m) => m.dispose());
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100 [&>canvas]:block [&>canvas]:size-full ${className}`}
    />
  );
}
