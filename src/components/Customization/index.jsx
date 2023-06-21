import { useCustomization } from "../../contexts/useCustomization";
import { chairMaterials, floorMaterials } from "./material.data";

const Customization = () => {
  const { fabric, floor, setFabric, setFloor, dogAnimation, setDogAnimation } =
    useCustomization();
  return (
    <section className="customization">
      <div className="chair">
        <p>Đổi chất liệu ghế</p>
        {chairMaterials.map((item) => (
          <img
            className={item.path === fabric ? "active" : ""}
            key={item.id}
            src={item.value}
            alt="chair material"
            onClick={() => setFabric(item.path)}
          />
        ))}
      </div>
      <div className="floor">
        <p>Đổi chất liệu sàn nhà</p>
        {floorMaterials.map((item) => (
          <img
            className={item.path === floor ? "active" : ""}
            key={item.id}
            src={item.value}
            alt="floor material"
            onClick={() => setFloor(item.path)}
          />
        ))}
      </div>
      <div className="floor">
        <p>Cậu vàng cử động</p>
        <input
          type="checkbox"
          id="switch"
          className="switch-input"
          checked={dogAnimation}
          onChange={(e) => setDogAnimation(e.target.checked)}
        />
        <label htmlFor="switch" className="switch"></label>
      </div>
    </section>
  );
};

export default Customization;
