/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader } from "three";
import { useCustomization } from "../../contexts/useCustomization";

export default function Chair(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/public/models/chair.glb");
  const { fabric } = useCustomization();
  const texture = fabric ? useLoader(TextureLoader, fabric) : null;
  if (texture) {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(3, 3);
  }

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={[0.01, 0.01, 0.01]}
      position={[0, 0.05, 0]}
    >
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="f3289a7cc2474fef924dbdfa796eb9fefbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="Body"
                  position={[0.14, 27.77, 0.25]}
                  rotation={[-Math.PI / 2, 0, -0.56]}
                  scale={100}
                >
                  <group name="Foot_1_1" position={[0.23, -0.18, -0.21]}>
                    <mesh
                      name="Foot_1_1_Foot_1_0"
                      geometry={nodes.Foot_1_1_Foot_1_0.geometry}
                      material={materials.Foot_1}
                    />
                  </group>
                  <group
                    name="Foot_2_1"
                    position={[-0.23, 0.28, -0.21]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-1}
                  >
                    <mesh
                      name="Foot_2_1_Foot_2_0"
                      geometry={nodes.Foot_2_1_Foot_2_0.geometry}
                      material={materials.Foot_2}
                    />
                  </group>
                  <group
                    name="Arm_1"
                    position={[0.33, 0.15, 0.25]}
                    scale={0.97}
                  >
                    <mesh
                      name="Arm_1_Arm_0"
                      geometry={nodes.Arm_1_Arm_0.geometry}
                      material={materials.material}
                    />
                  </group>
                  <group
                    name="Arm_2"
                    position={[-0.33, 0.15, 0.25]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-0.97}
                  >
                    <mesh
                      name="Arm_2_Arm_0"
                      geometry={nodes.Arm_2_Arm_0.geometry}
                      material={materials.material}
                    />
                  </group>
                  <group
                    name="Foot_1_1001"
                    position={[-0.23, -0.18, -0.21]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-1}
                  >
                    <mesh
                      name="Foot_1_1001_Foot_1_0"
                      geometry={nodes.Foot_1_1001_Foot_1_0.geometry}
                      material={materials.Foot_1}
                    />
                  </group>
                  <group name="Foot_2_1001" position={[0.23, 0.28, -0.21]}>
                    <mesh
                      name="Foot_2_1001_Foot_2_0"
                      geometry={nodes.Foot_2_1001_Foot_2_0.geometry}
                      material={materials.Foot_2}
                    />
                  </group>
                  <mesh
                    name="Body_Body_0"
                    geometry={nodes.Body_Body_0.geometry}
                    material={materials.Body}
                  >
                    {fabric ? <meshBasicMaterial map={texture} /> : null}
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/public/models/chair.glb");
