import { Text3D } from "@react-three/drei";

const Text = () => {
  return (
    <Text3D
      font="./fonts/UTM Avo_Regular.json"
      position={[-3.07, 2.5, 0]}
      size={0.4}
      scale={[0.5, 0.5, 0.5]}
      rotation={[0, Math.PI * 0.5, 0]}
    >
      Phòng khách
      <meshNormalMaterial />
    </Text3D>
  );
};

export default Text;
