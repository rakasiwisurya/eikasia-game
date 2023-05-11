import { Button } from "antd";
import React from "react";

const GameOver = (onRestart) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        padding: "0 20px",
      }}
    >
      <div style={{ marginBottom: 15 }}>{messages[0]}</div>
      <Button type="primary" onClick={onRestart}>
        Restart Game
      </Button>
    </div>
  );
};

export default GameOver;
