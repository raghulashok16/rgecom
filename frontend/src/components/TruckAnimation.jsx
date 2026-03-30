import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';

function buildTruck(scene) {
  const truck = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffd000, metalness: 0.4, roughness: 0.3 });
  const cabMat = new THREE.MeshStandardMaterial({ color: 0xf5c400, metalness: 0.5, roughness: 0.25 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x90e0ef, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.55 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.2, roughness: 0.7 });
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xffe169, emissive: 0xffe169, emissiveIntensity: 0.8 });
  const taillightMat = new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff1111, emissiveIntensity: 0.6 });
  const undercarriageMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.8 });

  // === CARGO BOX ===
  const cargoBox = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 1.5), bodyMat);
  cargoBox.position.set(-0.6, 0.85, 0);
  truck.add(cargoBox);

  const ridge = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.06, 1.52), chromeMat);
  ridge.position.set(-0.6, 1.57, 0);
  truck.add(ridge);

  const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.07, 1.52), chromeMat);
  bottomRail.position.set(-0.6, 0.115, 0);
  truck.add(bottomRail);

  const cornerPositions = [
    [-2.03, 0, 0.77], [-2.03, 0, -0.77],
    [0.81, 0, 0.77],  [0.81, 0, -0.77]
  ];
  cornerPositions.forEach(([x, y, z]) => {
    const corner = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.45, 0.06), chromeMat);
    corner.position.set(x, 0.85 + y, z);
    truck.add(corner);
  });

  const rearLine1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.38, 0.04), darkMat);
  rearLine1.position.set(-2.04, 0.85, 0);
  truck.add(rearLine1);

  [-0.5, 0.5].forEach(z => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.34), taillightMat);
    tl.position.set(-2.02, 0.55, z);
    truck.add(tl);
  });

  // === CAB ===
  const cab = new THREE.Group();

  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.2, 1.45), cabMat);
  cabBody.position.set(0, 0.22, 0);
  cab.add(cabBody);

  const roofGeo = new THREE.BoxGeometry(1.1, 0.35, 1.35);
  const roof = new THREE.Mesh(roofGeo, cabMat);
  roof.position.set(0.06, 0.83, 0);
  cab.add(roof);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.62, 1.18), glassMat);
  windshield.position.set(0.6, 0.6, 0);
  windshield.rotation.z = THREE.MathUtils.degToRad(18);
  cab.add(windshield);

  [-0.76, 0.76].forEach(z => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.06), glassMat);
    win.position.set(0.1, 0.68, z);
    cab.add(win);
  });

  [-0.46, 0.46].forEach(z => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.3), lightMat);
    hl.position.set(0.68, 0.2, z);
    cab.add(hl);
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.34), chromeMat);
    bezel.position.set(0.67, 0.2, z);
    cab.add(bezel);
  });

  const grill = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.32, 0.88), darkMat);
  grill.position.set(0.69, -0.1, 0);
  cab.add(grill);

  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.9), chromeMat);
    bar.position.set(0.69, -0.02 + i * 0.07, 0);
    cab.add(bar);
  }

  const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 1.4), chromeMat);
  bumper.position.set(0.65, -0.42, 0);
  cab.add(bumper);

  [-0.6, 0.6].forEach(z => {
    const step = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.09), chromeMat);
    step.position.set(0.15, -0.53, z);
    cab.add(step);
  });

  [-0.73, 0.73].forEach(z => {
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.05), chromeMat);
    handle.position.set(0.05, 0.4, z);
    cab.add(handle);
  });

  [-0.76, 0.76].forEach((z, i) => {
    const mirrorArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.22), darkMat);
    mirrorArm.position.set(0.52, 0.88, z + (i === 0 ? -0.12 : 0.12));
    cab.add(mirrorArm);
    const mirrorHead = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.06), darkMat);
    mirrorHead.position.set(0.52, 0.88, z + (i === 0 ? -0.2 : 0.2));
    cab.add(mirrorHead);
  });

  cab.position.set(1.28, 0.54, 0);
  truck.add(cab);

  // === FRAME ===
  const frame = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.14, 0.6), undercarriageMat);
  frame.position.set(0, -0.03, 0);
  truck.add(frame);

  for (let i = -4; i <= 4; i++) {
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 1.6), undercarriageMat);
    cross.position.set(i * 0.45, -0.01, 0);
    truck.add(cross);
  }

  // === WHEELS ===
  const R = 0.42;
  const TT = 0.16;
  const RR = R - TT + 0.04;

  const tyreMat2 = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1.0, metalness: 0.0 });
  const rimMat2  = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.15 });
  const hubMat2  = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 });

  function makeWheel() {
    const wg = new THREE.Group();
    wg.add(new THREE.Mesh(new THREE.TorusGeometry(R, TT, 20, 48), tyreMat2));
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(RR, RR, 0.24, 28), rimMat2);
    barrel.rotation.x = Math.PI / 2;
    wg.add(barrel);
    const outerFace = new THREE.Mesh(new THREE.CircleGeometry(RR, 28), rimMat2);
    outerFace.position.z = 0.12;
    wg.add(outerFace);
    const innerFace = new THREE.Mesh(new THREE.CircleGeometry(RR, 28), rimMat2);
    innerFace.position.z = -0.12;
    innerFace.rotation.y = Math.PI;
    wg.add(innerFace);
    for (let s = 0; s < 6; s++) {
      const a = (s / 6) * Math.PI * 2;
      const len = RR * 0.9;
      const sp = new THREE.Mesh(new THREE.BoxGeometry(len, 0.07, 0.05), rimMat2);
      sp.rotation.z = a;
      sp.position.set(Math.cos(a) * len * 0.5, Math.sin(a) * len * 0.5, 0.08);
      wg.add(sp);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.28, 14), hubMat2);
    hub.rotation.x = Math.PI / 2;
    wg.add(hub);
    const hubFace = new THREE.Mesh(new THREE.CircleGeometry(0.09, 14), hubMat2);
    hubFace.position.z = 0.14;
    wg.add(hubFace);
    for (let n = 0; n < 6; n++) {
      const a = (n / 6) * Math.PI * 2;
      const lug = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.06, 8), hubMat2);
      lug.rotation.x = Math.PI / 2;
      lug.position.set(Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0.15);
      wg.add(lug);
    }
    return wg;
  }

  const axlePositions = [
    [1.55,  0.82], [1.55, -0.82],
    [-0.78,  0.82], [-0.78, -0.82],
    [-1.45,  0.82], [-1.45, -0.82],
  ];
  axlePositions.forEach(([x, z]) => {
    const w = makeWheel();
    if (z < 0) w.rotation.y = Math.PI;
    w.position.set(x, -0.12, z);
    truck.add(w);
  });

  // === EXHAUST ===
  const exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 12), chromeMat);
  exhaustPipe.position.set(0.6, 0.85, -0.85);
  truck.add(exhaustPipe);
  const exhaustTop = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.06, 0.12, 12), chromeMat);
  exhaustTop.position.set(0.6, 1.42, -0.85);
  truck.add(exhaustTop);

  const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.85, 16), chromeMat);
  fuelTank.rotation.z = Math.PI / 2;
  fuelTank.position.set(0.2, -0.08, -0.95);
  truck.add(fuelTank);

  truck.position.y = 0.54;
  scene.add(truck);
  return truck;
}

// Easing helpers
const easeOutBack = (t) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const TruckAnimation = ({ startPos, onComplete }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    const key = new THREE.DirectionalLight(0xfff5e0, 2.5);
    key.position.set(5, 8, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4466aa, 1.2);
    fill.position.set(-4, 3, -2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xff8844, 0.6);
    rim.position.set(0, 2, -6);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Convert screen px → world coords at z=0 plane
    const screenToWorld = (sx, sy) => {
      const v = new THREE.Vector3((sx / W) * 2 - 1, -(sy / H) * 2 + 1, 0.5).unproject(camera);
      const dir = v.sub(camera.position).normalize();
      const t = -camera.position.z / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(t));
    };

    const startWorld = screenToWorld(startPos.x, startPos.y);
    const exitWorld  = screenToWorld(W + 400, startPos.y); // off-screen right

    const truck = buildTruck(scene);
    const SCALE = 0.14;
    truck.scale.setScalar(0);
    truck.position.set(startWorld.x, startWorld.y, 0);
    truck.rotation.y = 0; // cab faces +X (right)

    // Spin the wheels during movement
    const wheelGroups = [];
    truck.traverse((child) => {
      if (child.isGroup && child !== truck) {
        const hasTorus = child.children.some(c => c.geometry?.type === 'TorusGeometry');
        if (hasTorus) wheelGroups.push(child);
      }
    });

    // ── Fire particle system ──────────────────────────────
    const PARTICLE_COUNT = 80;
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const colors     = new Float32Array(PARTICLE_COUNT * 3);
    const sizes      = new Float32Array(PARTICLE_COUNT);

    // Each particle: { life, maxLife, vx, vy, vz }
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({ life: 0, maxLife: 0 }));

    const fireGeo = new THREE.BufferGeometry();
    fireGeo.setAttribute('position', new THREE.BufferAttribute(positions,  3));
    fireGeo.setAttribute('color',    new THREE.BufferAttribute(colors,     3));
    fireGeo.setAttribute('size',     new THREE.BufferAttribute(sizes,      1));

    // Circle sprite texture (drawn on canvas)
    const spriteCvs = document.createElement('canvas');
    spriteCvs.width = spriteCvs.height = 64;
    const sctx = spriteCvs.getContext('2d');
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,220,80,0.9)');
    grad.addColorStop(0.7, 'rgba(255,60,0,0.4)');
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(spriteCvs);

    const fireMat = new THREE.PointsMaterial({
      size: 0.18,
      map: spriteTex,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const firePoints = new THREE.Points(fireGeo, fireMat);
    scene.add(firePoints);

    const spawnParticle = (i, truckX, truckY) => {
      // Emit from rear of truck (left side, truck faces +X)
      const rear = truckX - 0.55;
      positions[i * 3]     = rear + (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 1] = truckY + (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      particles[i].vx      = -(Math.random() * 0.04 + 0.02); // drift left
      particles[i].vy      =  (Math.random() * 0.03 - 0.01); // slight up
      particles[i].vz      =  (Math.random() - 0.5) * 0.01;
      particles[i].maxLife =   Math.random() * 0.25 + 0.12;
      particles[i].life    =   particles[i].maxLife;
    };

    // Init all particles as dead
    particles.forEach((p) => { p.life = 0; p.maxLife = 1; });

    // Phase durations (seconds)
    const POP_DUR  = 0.35;
    const MOVE_DUR = 0.9;

    const clock = new THREE.Clock();
    let phase = 0; // 0=pop, 1=move
    let phaseStart = 0;
    let raf;
    let lastDt = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t   = clock.getElapsedTime();
      const dt  = t - lastDt;
      lastDt    = t;
      const e   = t - phaseStart;

      if (phase === 0) {
        // Pop in with overshoot spring
        const p = Math.min(e / POP_DUR, 1);
        truck.scale.setScalar(SCALE * easeOutBack(p));
        truck.rotation.x = (1 - p) * -0.3;
        if (p >= 1) {
          truck.scale.setScalar(SCALE);
          truck.rotation.x = 0;
          phase = 1;
          phaseStart = t;
        }
      } else if (phase === 1) {
        // Straight dash to the right
        const p = Math.min(e / MOVE_DUR, 1);
        const eased = easeInOutQuad(p);
        truck.position.x = startWorld.x + (exitWorld.x - startWorld.x) * eased;
        truck.rotation.y = 0;

        // Spin wheels
        const wheelSpin = e * 8;
        wheelGroups.forEach(wg => { wg.rotation.z = wheelSpin; });

        // ── Update fire particles ──
        const spawnRate = 5; // particles per frame
        let spawned = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          if (particles[i].life <= 0) {
            if (spawned < spawnRate && p < 0.95) {
              spawnParticle(i, truck.position.x, truck.position.y);
              spawned++;
            } else {
              // Hide dead particle far away
              positions[i * 3]     = 9999;
              positions[i * 3 + 1] = 9999;
              positions[i * 3 + 2] = 9999;
              sizes[i] = 0;
            }
            continue;
          }

          // Age particle
          particles[i].life -= dt;
          const lifeRatio = Math.max(particles[i].life / particles[i].maxLife, 0);

          // Move
          positions[i * 3]     += particles[i].vx;
          positions[i * 3 + 1] += particles[i].vy;
          positions[i * 3 + 2] += particles[i].vz;

          // Color: white → yellow → orange → red, fade with life
          const hot = Math.min(lifeRatio * 2, 1);        // 1=hot, 0=cooling
          colors[i * 3]     = 1;                          // R always full
          colors[i * 3 + 1] = hot * 0.8;                 // G fades
          colors[i * 3 + 2] = hot * 0.3;                 // B tiny
          sizes[i] = lifeRatio * 0.22;
        }

        fireGeo.attributes.position.needsUpdate = true;
        fireGeo.attributes.color.needsUpdate    = true;
        fireGeo.attributes.size.needsUpdate     = true;

        // Shrink + fade out in last 30%
        if (p > 0.7) {
          const fade = (p - 0.7) / 0.3;
          truck.scale.setScalar(SCALE * (1 - fade));
        }

        if (p >= 1) {
          cancelAnimationFrame(raf);
          onComplete?.();
          return;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (el?.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return createPortal(
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}
    />,
    document.body
  );
};

export default TruckAnimation;
