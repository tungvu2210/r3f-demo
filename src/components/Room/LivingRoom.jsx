/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */

import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import IndoorControl from "../../system/IndoorControl";
import { RepeatWrapping, TextureLoader } from "three";
import { useCustomization } from "../../contexts/useCustomization";

export default function LivingRoom(props) {
  let ground = [];
  const { scene, nodes } = useGLTF("/public/models/living_room.glb");
  const beachTexture = useLoader(TextureLoader, "public/images/beach.jpg");
  const { floor } = useCustomization();
  const floorTexture = floor ? useLoader(TextureLoader, floor) : null;
  if (floorTexture) {
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(6, 3);
  }

  Object.keys(nodes).forEach((key) => {
    if (nodes[key].isMesh) {
      if (nodes[key].material.name === "Birch_Wood_Flooring__English") {
        nodes[key].receiveShadow = true;
        if (floorTexture) {
          nodes[key].material.map = floorTexture;
        }
        ground.push(nodes[key]);
      }
      if (nodes[key].material.name === "Material.004") {
        nodes[key].material.map = beachTexture;
      }
      if (nodes[key].material.name === "Material.023") {
        nodes[key].castShadow = true;
      }
    }
  });

  return (
    <>
      <primitive {...props} object={scene}></primitive>
      <IndoorControl ground={ground} />
    </>
  );
}

useGLTF.preload("/public/models/living_room.glb");
