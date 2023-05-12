import React from "react";
import { Logo } from "../assets";

const Splash = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEEEEE",
      }}
    >
      <img src={Logo} alt="Logo Splash" width={100} height={100} />
      <div>Loading...</div>
    </div>
  );
};

export default Splash;
