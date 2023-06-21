/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCustomization } from "../../contexts/useCustomization";

export default function Dog(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/public/models/dog.glb");
  const { actions, names } = useAnimations(animations, group);
  const { dogAnimation } = useCustomization();

  useEffect(() => {
    const object = actions[names[0]].reset().fadeIn(0.5);
    dogAnimation ? object.play() : object.stop();
  }, [actions, names, dogAnimation]);

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={[0.4, 0.4, 0.4]}
      position={[1.5, 0.1, -0.4]}
    >
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={2.472}
        >
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group name="Playful_dog_124">
                <group name="Playful_dog_Skeleton_123" scale={0.01}>
                  <group name="geo1_0" />
                  <group name="skeletal3_1">
                    <group name="GLTF_created_0">
                      <primitive object={nodes.GLTF_created_0_rootJoint} />
                      <group name="shiba_inu2_125_correction">
                        <group name="shiba_inu2_125" />
                      </group>
                      <skinnedMesh
                        name="Object_132"
                        geometry={nodes.Object_132.geometry}
                        material={materials.material0}
                        skeleton={nodes.Object_132.skeleton}
                      />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/public/models/dog.glb");
