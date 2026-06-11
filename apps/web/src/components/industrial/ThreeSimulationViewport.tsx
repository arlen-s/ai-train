import { useEffect, useRef } from "react";
import * as THREE from "three";

import type { CockpitData } from "./cockpitData";
import { SensorDock } from "./SensorStack";

const SCENE_WIDTH = 18;
const SCENE_DEPTH = 12;

function mapPointToScene(point: number[], mapWidth: number, mapHeight: number): THREE.Vector3 {
  const x = (point[0] / Math.max(mapWidth, 1) - 0.5) * SCENE_WIDTH;
  const z = (point[1] / Math.max(mapHeight, 1) - 0.5) * SCENE_DEPTH;
  return new THREE.Vector3(x, 0.08, z);
}

function createLine(points: THREE.Vector3[], color: number, yOffset = 0.15): THREE.Line {
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map((point) => point.clone().setY(point.y + yOffset)));
  const material = new THREE.LineBasicMaterial({ color, linewidth: 2 });
  return new THREE.Line(geometry, material);
}

function createPetMesh(): THREE.Group {
  const pet = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xd9ad67, roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.46, 5, 10), bodyMaterial);
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;
  pet.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), bodyMaterial);
  head.position.set(0.33, 0.07, 0);
  head.castShadow = true;
  pet.add(head);

  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.018, 0.34, 8), bodyMaterial);
  tail.position.set(-0.34, 0.11, 0);
  tail.rotation.z = -0.8;
  tail.castShadow = true;
  pet.add(tail);

  return pet;
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else if (material) {
      material.dispose();
    }
  });
}

function canCreateWebGLContext(): boolean {
  if (!window.WebGLRenderingContext) {
    return false;
  }
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl"));
}

export function ThreeSimulationViewport({ cockpit }: { cockpit: CockpitData }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    if (!canCreateWebGLContext()) {
      mount.dataset.webgl = "unavailable";
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      mount.dataset.webgl = "unavailable";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x091312);
    scene.fog = new THREE.Fog(0x091312, 15, 34);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(6.6, 5.9, 8.6);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xd0e6d7, 0.42);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xb7d8ff, 0x203415, 0.82);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffe1a8, 2.65);
    sun.position.set(-6, 12, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 35;
    scene.add(sun);

    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);

    function createSceneInstrumentation() {
      const grid = new THREE.GridHelper(SCENE_WIDTH, 18, 0x315456, 0x1b3032);
      grid.position.y = 0.16;
      const gridMaterial = grid.material as THREE.Material | THREE.Material[];
      if (Array.isArray(gridMaterial)) {
        gridMaterial.forEach((item) => {
          item.transparent = true;
          item.opacity = 0.24;
        });
      } else {
        gridMaterial.transparent = true;
        gridMaterial.opacity = 0.24;
      }
      scene.add(grid);

      const padMaterial = new THREE.MeshStandardMaterial({
        color: 0x18292b,
        metalness: 0.16,
        roughness: 0.72
      });
      const pad = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.04, 1.6), padMaterial);
      pad.position.set(-5.7, 0.12, -4.1);
      pad.rotation.y = -0.22;
      pad.receiveShadow = true;
      scene.add(pad);

      const beaconMaterial = new THREE.MeshStandardMaterial({
        color: 0x142224,
        emissive: 0x123c3a,
        metalness: 0.5,
        roughness: 0.36
      });
      [[-7.8, -4.9], [7.4, -5.1], [7.6, 4.7], [-7.7, 4.8]].forEach(([x, z], index) => {
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.1, 10), beaconMaterial);
        mast.position.set(x, 0.7, z);
        mast.castShadow = true;
        scene.add(mast);
        const beacon = new THREE.PointLight(index % 2 === 0 ? 0x31a7ff : 0x43ff99, 0.8, 3.4);
        beacon.position.set(x, 1.28, z);
        scene.add(beacon);
      });

      const borderMaterial = new THREE.MeshBasicMaterial({
        color: 0x3effd0,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide
      });
      const northBand = new THREE.Mesh(new THREE.PlaneGeometry(SCENE_WIDTH, 0.08), borderMaterial);
      northBand.rotation.x = -Math.PI / 2;
      northBand.position.set(0, 0.2, -SCENE_DEPTH / 2 + 0.18);
      scene.add(northBand);
      const southBand = northBand.clone();
      southBand.position.z = SCENE_DEPTH / 2 - 0.18;
      scene.add(southBand);
    }

    function createTerrain() {
      const geometry = new THREE.PlaneGeometry(SCENE_WIDTH, SCENE_DEPTH, 72, 48);
      geometry.rotateX(-Math.PI / 2);
      const position = geometry.attributes.position;
      const colors: number[] = [];
      const color = new THREE.Color();
      for (let index = 0; index < position.count; index += 1) {
        const x = position.getX(index);
        const z = position.getZ(index);
        const wave = Math.sin(x * 1.9) * 0.07 + Math.cos(z * 2.4) * 0.05 + Math.sin((x + z) * 3.1) * 0.025;
        position.setY(index, wave);
        const shade = 0.38 + wave * 0.9 + Math.sin(x * 5.2 + z) * 0.03;
        color.setHSL(0.29, 0.48, shade);
        colors.push(color.r, color.g, color.b);
      }
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({
        color: 0x4f8c3a,
        metalness: 0.02,
        roughness: 0.94,
        vertexColors: true
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.receiveShadow = true;
      scene.add(mesh);

      const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x6ad45e, roughness: 0.8, metalness: 0 });
      const bladeGeometry = new THREE.ConeGeometry(0.018, 0.34, 3);
      const instanced = new THREE.InstancedMesh(bladeGeometry, grassMaterial, 520);
      const matrix = new THREE.Matrix4();
      for (let index = 0; index < 520; index += 1) {
        const x = ((index * 37) % 1000) / 1000 * SCENE_WIDTH - SCENE_WIDTH / 2;
        const z = ((index * 71) % 1000) / 1000 * SCENE_DEPTH - SCENE_DEPTH / 2;
        const scale = 0.6 + (((index * 19) % 100) / 100) * 0.8;
        matrix.compose(
          new THREE.Vector3(x, 0.14 * scale, z),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, index, 0.05)),
          new THREE.Vector3(scale, scale, scale)
        );
        instanced.setMatrixAt(index, matrix);
      }
      instanced.castShadow = true;
      scene.add(instanced);

      const pathMaterial = new THREE.MeshStandardMaterial({ color: 0x8a7652, roughness: 0.88, metalness: 0.02 });
      [[-3.8, 2.4, 5.6, 0.72, -0.18], [2.5, -2.6, 5.8, 0.82, 0.34], [0.6, 0.15, 7.4, 0.64, -0.72], [5.8, 2.6, 4.1, 0.52, 1.12], [-5.6, -1.1, 3.4, 0.48, 0.78]].forEach(
        ([x, z, width, depth, rotation]) => {
          const path = new THREE.Mesh(new THREE.BoxGeometry(width, 0.035, depth), pathMaterial);
          path.position.set(x, 0.04, z);
          path.rotation.y = rotation;
          path.receiveShadow = true;
          scene.add(path);
        }
      );

      const flowerMaterial = new THREE.MeshStandardMaterial({ color: 0xe1b155, roughness: 0.62 });
      for (let index = 0; index < 76; index += 1) {
        const flower = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), flowerMaterial);
        flower.position.set(-8.1 + ((index * 29) % 160) / 10, 0.16, 5.2 - ((index * 17) % 42) / 10);
        flower.castShadow = true;
        scene.add(flower);
      }
    }

    function createGardenStructures() {
      const houseWall = new THREE.Mesh(
        new THREE.BoxGeometry(4.3, 1.8, 0.32),
        new THREE.MeshStandardMaterial({ color: 0x53615e, roughness: 0.7, metalness: 0.04 })
      );
      houseWall.position.set(-1.2, 0.96, -6.25);
      houseWall.castShadow = true;
      scene.add(houseWall);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(4.8, 0.22, 0.92),
        new THREE.MeshStandardMaterial({ color: 0x384442, roughness: 0.62, metalness: 0.1 })
      );
      roof.position.set(-1.2, 1.92, -6.18);
      roof.rotation.x = -0.08;
      roof.castShadow = true;
      scene.add(roof);

      const greenhouse = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.15, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x9fb8b4, transparent: true, opacity: 0.24, roughness: 0.22, metalness: 0.2 })
      );
      greenhouse.position.set(6.4, 0.64, -4.95);
      greenhouse.castShadow = true;
      scene.add(greenhouse);

      const benchMaterial = new THREE.MeshStandardMaterial({ color: 0x6d5138, roughness: 0.76 });
      const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.42), benchMaterial);
      benchSeat.position.set(-6.2, 0.36, -4.35);
      benchSeat.rotation.y = 0.3;
      benchSeat.castShadow = true;
      scene.add(benchSeat);
      const benchBack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.48, 0.1), benchMaterial);
      benchBack.position.set(-6.28, 0.62, -4.56);
      benchBack.rotation.y = 0.3;
      benchBack.castShadow = true;
      scene.add(benchBack);
    }

    function createFence() {
      const postMaterial = new THREE.MeshStandardMaterial({ color: 0x786653, roughness: 0.75 });
      const railMaterial = new THREE.MeshStandardMaterial({ color: 0x62523f, roughness: 0.8 });
      const postGeometry = new THREE.BoxGeometry(0.12, 1.1, 0.12);
      const railGeometry = new THREE.BoxGeometry(1.1, 0.09, 0.08);
      for (let side = 0; side < 2; side += 1) {
        const z = side === 0 ? -SCENE_DEPTH / 2 - 0.25 : SCENE_DEPTH / 2 + 0.25;
        for (let x = -SCENE_WIDTH / 2; x <= SCENE_WIDTH / 2; x += 1.1) {
          const post = new THREE.Mesh(postGeometry, postMaterial);
          post.position.set(x, 0.55, z);
          post.castShadow = true;
          scene.add(post);
          const rail = new THREE.Mesh(railGeometry, railMaterial);
          rail.position.set(x + 0.55, 0.72, z);
          rail.castShadow = true;
          scene.add(rail);
        }
      }
    }

    function createRobot(robotPosition: THREE.Vector3) {
      const robot = new THREE.Group();
      const deck = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 0.28, 1.05),
        new THREE.MeshStandardMaterial({ color: 0xd9e2df, metalness: 0.35, roughness: 0.42 })
      );
      deck.position.y = 0.35;
      deck.castShadow = true;
      robot.add(deck);

      const top = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.28, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x25363a, metalness: 0.45, roughness: 0.38 })
      );
      top.position.y = 0.63;
      top.castShadow = true;
      robot.add(top);

      const bladeDeck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.44, 0.5, 0.08, 36),
        new THREE.MeshStandardMaterial({ color: 0x2d3b35, metalness: 0.32, roughness: 0.48 })
      );
      bladeDeck.position.y = 0.22;
      bladeDeck.castShadow = true;
      robot.add(bladeDeck);

      const bumperMaterial = new THREE.MeshStandardMaterial({ color: 0x151f20, roughness: 0.46 });
      for (const z of [-0.57, 0.57]) {
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.08, 0.08), bumperMaterial);
        bumper.position.set(0, 0.39, z);
        bumper.castShadow = true;
        robot.add(bumper);
      }

      const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111819, roughness: 0.6 });
      for (const x of [-0.58, 0.58]) {
        for (const z of [-0.43, 0.43]) {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.18, 18), wheelMaterial);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 0.24, z);
          wheel.castShadow = true;
          robot.add(wheel);
        }
      }

      const lidar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.12, 28),
        new THREE.MeshStandardMaterial({ color: 0x0e1517, emissive: 0x113333, metalness: 0.6, roughness: 0.28 })
      );
      lidar.position.y = 0.84;
      lidar.castShadow = true;
      robot.add(lidar);

      const light = new THREE.PointLight(0x5dff9a, 1.7, 3);
      light.position.set(0.52, 0.75, -0.42);
      robot.add(light);

      robot.position.copy(robotPosition);
      robot.rotation.y = -0.62;
      scene.add(robot);
      return { robot, light };
    }

    function createObstacles() {
      const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x6a6f66, roughness: 0.9 });
      [[-5.2, -2.5], [4.9, -0.6], [6.2, 2.1], [-2.1, 3.6], [5.4, -3.2], [-6.2, 1.8]].forEach(([x, z], index) => {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 + index * 0.08, 0), rockMaterial);
        rock.scale.y = 0.55;
        rock.position.set(x, 0.3, z);
        rock.castShadow = true;
        scene.add(rock);
      });

      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5b422e, roughness: 0.85 });
      const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0x244d26, roughness: 0.8 });
      [[-6.8, 3.9], [7.1, -3.6], [2.6, 4.6], [-7.6, -3.5]].forEach(([x, z]) => {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.5, 10), trunkMaterial);
        trunk.position.set(x, 0.75, z);
        trunk.castShadow = true;
        scene.add(trunk);
        const canopy = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), canopyMaterial);
        canopy.position.set(x, 1.8, z);
        canopy.castShadow = true;
        scene.add(canopy);
      });

      const shrubMaterial = new THREE.MeshStandardMaterial({ color: 0x376d32, roughness: 0.84 });
      for (let index = 0; index < 26; index += 1) {
        const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28 + ((index * 7) % 5) * 0.035, 1), shrubMaterial);
        shrub.position.set(-8.2 + ((index * 13) % 42) / 4, 0.32, -5.4 + ((index * 19) % 34) / 5);
        shrub.scale.y = 0.68;
        shrub.castShadow = true;
        scene.add(shrub);
      }

      const personMaterial = new THREE.MeshStandardMaterial({ color: 0xd54a42, roughness: 0.42 });
      const person = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.86, 5, 12), personMaterial);
      person.position.set(5.7, 0.66, 4.1);
      person.castShadow = true;
      scene.add(person);

      const pet = createPetMesh();
      pet.position.set(4.75, 0.24, 3.45);
      pet.rotation.y = -0.68;
      scene.add(pet);

      const zone = new THREE.Mesh(
        new THREE.PlaneGeometry(3.0, 1.7),
        new THREE.MeshBasicMaterial({ color: 0xff3d3d, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
      );
      zone.rotation.x = -Math.PI / 2;
      zone.position.set(4.2, 0.12, 2.6);
      scene.add(zone);
    }

    function createReplayOverlays() {
      const pathPoints = cockpit.scene.path.map((point) => mapPointToScene(point, cockpit.scene.mapWidth, cockpit.scene.mapHeight));
      const planned = createLine(pathPoints, 0x31a7ff, 0.18);
      scene.add(planned);
      const completed = createLine(pathPoints.slice(0, Math.max(2, pathPoints.length - 1)), 0x69ff78, 0.22);
      scene.add(completed);

      pathPoints.forEach((point, index) => {
        const strip = new THREE.Mesh(
          new THREE.PlaneGeometry(1.25, 0.58),
          new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? 0x35e672 : 0x1fa857, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
        );
        strip.rotation.x = -Math.PI / 2;
        strip.rotation.z = -0.18 + index * 0.06;
        strip.position.copy(point).setY(0.13);
        scene.add(strip);
      });

      cockpit.scene.dynamicActors.forEach((actor, actorIndex) => {
        const last = actor.trajectory[actor.trajectory.length - 1];
        const position = mapPointToScene(last, cockpit.scene.mapWidth, cockpit.scene.mapHeight);
        const color = actor.actor_type === "person" ? 0xffcf6b : 0xb46dff;
        const body = new THREE.Mesh(
          actor.actor_type === "person" ? new THREE.CapsuleGeometry(0.18, 0.68, 5, 10) : new THREE.BoxGeometry(0.5, 0.28, 0.28),
          new THREE.MeshStandardMaterial({ color, roughness: 0.52 })
        );
        body.position.copy(position).setY(actor.actor_type === "person" ? 0.55 : 0.28);
        body.castShadow = true;
        scene.add(body);

        const actorPath = createLine(
          actor.trajectory.map((point) => mapPointToScene(point, cockpit.scene.mapWidth, cockpit.scene.mapHeight)),
          actorIndex === 0 ? 0xb46dff : 0xffcf6b,
          0.12
        );
        scene.add(actorPath);
      });
    }

    function createSensorOverlays(robotPosition: THREE.Vector3) {
      const lidarGroup = new THREE.Group();
      const rayMaterial = new THREE.LineBasicMaterial({ color: 0x3effd0, transparent: true, opacity: 0.5 });
      for (let index = 0; index < cockpit.sensors.lidarRayCount; index += 1) {
        const angle = -Math.PI * 0.72 + (Math.PI * 1.44 * index) / Math.max(cockpit.sensors.lidarRayCount - 1, 1);
        const end = robotPosition.clone().add(new THREE.Vector3(Math.cos(angle) * 3.1, 0.55, Math.sin(angle) * 3.1));
        const geometry = new THREE.BufferGeometry().setFromPoints([robotPosition.clone().setY(0.62), end]);
        const ray = new THREE.Line(geometry, rayMaterial);
        lidarGroup.add(ray);
        const point = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 8, 8),
          new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? 0x3effd0 : 0xffcf4a })
        );
        point.position.copy(end);
        lidarGroup.add(point);
      }
      scene.add(lidarGroup);

      const arcMaterial = new THREE.LineBasicMaterial({ color: 0x64a9ff, transparent: true, opacity: 0.42 });
      cockpit.sensors.ultrasonic.forEach((distance, index) => {
        const curve = new THREE.ArcCurve(0, 0, 0.7 + distance * 0.18, -0.5, 0.5);
        const points = curve.getPoints(20).map((point) => new THREE.Vector3(point.x, 0.18 + index * 0.04, point.y));
        const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), arcMaterial);
        arc.position.copy(robotPosition);
        arc.rotation.y = index * (Math.PI / 2);
        scene.add(arc);
      });
      return lidarGroup;
    }

    createTerrain();
    createSceneInstrumentation();
    createGardenStructures();
    createFence();
    createObstacles();
    createReplayOverlays();
    const robotPosition = mapPointToScene(
      cockpit.scene.path[cockpit.scene.path.length - 1] ?? [1, 1],
      cockpit.scene.mapWidth,
      cockpit.scene.mapHeight
    );
    const { robot, light } = createRobot(robotPosition);
    const scoutPosition = mapPointToScene([42, 24], cockpit.scene.mapWidth, cockpit.scene.mapHeight);
    const { robot: scoutRobot } = createRobot(scoutPosition);
    scoutRobot.scale.setScalar(0.78);
    scoutRobot.rotation.y = 0.74;
    const lidarGroup = createSensorOverlays(robotPosition);

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(rect.width, 320);
      const height = Math.max(rect.height, 280);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let frame = 0;
    let animationFrame = 0;
    const animate = () => {
      frame += 1;
      robot.rotation.y = -0.62 + Math.sin(frame * 0.015) * 0.035;
      scoutRobot.rotation.y = 0.74 + Math.sin(frame * 0.012) * 0.03;
      light.intensity = 1.2 + Math.sin(frame * 0.08) * 0.45;
      lidarGroup.rotation.y += 0.012;
      camera.lookAt(Math.sin(frame * 0.004) * 0.6, 0.2, Math.cos(frame * 0.004) * 0.4);
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      disposeObject(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [cockpit]);

  return (
    <div aria-label="Three.js simulation viewport" className="three-viewport-shell" ref={mountRef}>
      <div aria-label="Viewport command bar" className="viewport-command-bar">
        <strong>3D Simulation Viewport</strong>
        <span>Overlays</span>
        <span>Sensors</span>
        <span>4 Views</span>
        <span>Follow Robot</span>
      </div>
      <div aria-label="High fidelity render layers" className="viewport-hud render-layer-card">
        <strong>Physical Scene</strong>
        <span>terrain mesh</span>
        <span>raycast LiDAR</span>
        <span>dynamic actors</span>
      </div>
      <div className="viewport-hud robot-card">
        <strong>Robot {cockpit.robot.id}</strong>
        <span>{cockpit.robot.status} · {cockpit.robot.policyId}</span>
        <span>Battery {cockpit.robot.battery}% · {cockpit.robot.speed}</span>
      </div>
      <div className="viewport-hud viewport-mode-strip">
        <span>Costmap Overlay</span>
        <span>Route Replay</span>
        <span>Sensor Frustum</span>
      </div>
      <SensorDock cockpit={cockpit} embedded />
      <div aria-label="Viewport telemetry strip" className="viewport-bottom-strip">
        <article>
          <strong>RGB Camera</strong>
          <span className="rgb-mini" />
        </article>
        <article>
          <strong>Depth Range</strong>
          <span className="depth-mini" />
        </article>
        <article>
          <strong>Semantic Mask</strong>
          <span className="segmentation-mini" />
        </article>
        <article>
          <strong>Planned Path</strong>
          <svg viewBox="0 0 120 48" aria-hidden="true">
            <polyline points="6,40 24,31 44,35 62,15 82,18 112,8" />
          </svg>
        </article>
        <article>
          <strong>Coverage Map</strong>
          <span className="coverage-mini" />
        </article>
        <article>
          <strong>Terrain Slope</strong>
          <span className="slope-mini" />
        </article>
        <article>
          <strong>Grass Height</strong>
          <span className="height-mini" />
        </article>
        <article>
          <strong>Ultrasonic</strong>
          <span className="ultrasonic-mini" />
        </article>
        <article>
          <strong>GNSS Trajectory</strong>
          <svg viewBox="0 0 120 48" aria-hidden="true">
            <polyline className="gnss-a" points="5,38 20,30 38,33 58,18 80,22 112,12" />
            <polyline className="gnss-b" points="5,12 28,18 48,13 70,25 94,20 116,29" />
          </svg>
        </article>
      </div>
      <div className="viewport-hud viewport-legend">
        <span className="legend planned">Planned Path</span>
        <span className="legend covered">Coverage Completed</span>
        <span className="legend risk">No-Go Zone</span>
      </div>
      <div className="webgl-fallback">
        WebGL unavailable in this environment; browser runtime renders the real Three.js simulation scene.
      </div>
    </div>
  );
}
