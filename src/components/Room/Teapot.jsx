/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */

import { useGLTF } from "@react-three/drei";

export default function Teapot(props) {
  const { nodes, materials } = useGLTF("/public/models/teapot.glb");
  return (
    <group
      {...props}
      dispose={null}
      scale={[0.003, 0.003, 0.003]}
      position={[-1.1, 0.35, -0.1]}
    >
      <mesh
        geometry={nodes.Teapot001__0.geometry}
        material={materials["Scene_-_Root"]}
        position={[-1.96, 0, -5.14]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#bababa" />
      </mesh>
    </group>
  );
}

useGLTF.preload("/public/models/teapot.glb");
