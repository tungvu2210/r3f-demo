/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const CustomizationContext = createContext({});

export const CustomizationProvider = ({ children }) => {
  const [fabric, setFabric] = useState("");
  const [floor, setFloor] = useState("");
  const [dogAnimation, setDogAnimation] = useState(true);

  return (
    <CustomizationContext.Provider
      value={{
        fabric,
        setFabric,
        floor,
        setFloor,
        dogAnimation,
        setDogAnimation,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  return context;
};
