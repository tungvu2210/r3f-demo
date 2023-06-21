/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { IndoorControls } from "./IndoorControls.js";
import gsap from "gsap";

const IndoorControl = ({ ground }) => {
  const { camera, gl } = useThree();
  const mouseHelper = useRef();
  const ringMouseHelper = useRef();
  const mouseHelperScale = useRef();
  const ringMouseHelperScale = useRef();
  const controls = new IndoorControls(camera, gl.domElement);
  controls.ground.push(...ground);
  controls.addEventListener("move", function (event) {
    if (!event.isRotating) {
      let intersect = event.intersect;
      let normal = intersect.face.normal;
      if (mouseHelper.current) {
        mouseHelper.current.position.set(0, 0, 0);
        mouseHelper.current.lookAt(normal);

        mouseHelper.current.position.copy(intersect.point);
        mouseHelper.current.position.addScaledVector(normal, 0.001);

        mouseHelper.current.visible = true;
      }
      controls.enabled_move = true;
    } else {
      if (mouseHelper.current) mouseHelper.current.visible = false;
    }
  });

  controls.addEventListener("mouseclick", () => {
    if (ringMouseHelper.current) {
      gsap.fromTo(ringMouseHelper.current, 1, { opacity: 1 }, { opacity: 0.8 });
    }
    if (mouseHelperScale.current) {
      gsap.fromTo(
        mouseHelperScale.current,
        0.5,
        { visible: true },
        { visible: false }
      );

      gsap.fromTo(
        mouseHelperScale.current.scale,
        { duration: 0.6, x: 1, y: 1, z: 1 },
        { duration: 0.6, x: 2, y: 2, z: 2 }
      );
    }
    if (ringMouseHelperScale.current) {
      gsap.fromTo(
        ringMouseHelperScale.current,
        0.5,
        { opacity: 1 },
        { opacity: 0 }
      );
    }
  });

  useFrame((state, delta) => {
    controls.update(delta);
  });

  return (
    <mesh visible={false} ref={mouseHelper}>
      <meshBasicMaterial opacity={0.2} transparent={true} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.2, 0.22, 50]} />
        <meshBasicMaterial
          ref={ringMouseHelper}
          opacity={0.8}
          transparent={true}
        />
      </mesh>
    </mesh>
  );
};

export default IndoorControl;
