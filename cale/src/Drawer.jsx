import React from "react";

const Drawer = ({ setShowDrawer, event }) => {
  const handleCloseDrower = (e) => {
    if (e.target.classList.contains("drower-overlay")) {
      setShowDrawer(false);
    }
  };

  return (
    <div
      className="drower-overlay"
      onClick={handleCloseDrower}
      style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "100vw", background: "rgba(0,0,0,0.5)" }}>
      <div style={{ width: "400px", background: "red", padding: "20px", margin: "100px auto" }} onClick={(e) => e.stopPropagation()}>
        <h1>Sono il Drower</h1>
        <h3>{event?.title}</h3>
        <h3>{event?.description}</h3>
      </div>
    </div>
  );
};

export default Drawer;
