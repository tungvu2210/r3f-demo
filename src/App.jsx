/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/no-unknown-property */
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { Suspense } from "react";
import Room from "./components/Room";
import Text from "./components/Text";
import Customization from "./components/Customization";
import { CustomizationProvider } from "./contexts/useCustomization";

function App() {
  return (
    <>
      <CustomizationProvider>
        <Canvas
          style={{
            backgroundColor: "#111a21",
            height: "100vh",
            cursor: "grab",
          }}
          shadows
          camera={{ position: [1, 2, 4] }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight castShadow position={[0, 5, -6]} intensity={0.5} />
          <Suspense fallback={null}>
            <Text />
            <Room />
          </Suspense>
        </Canvas>
        <Customization />
      </CustomizationProvider>
      <Loader />
    </>
  );
}

export default App;
