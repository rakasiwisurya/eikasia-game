import { Button, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { GameOver, Splash } from "./components";

function App() {
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const [guessLength, setGuessLength] = useState(3);
  const [randomResults, setRandomResults] = useState([]);
  const [guessValues, setGuessValues] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [chance, setChance] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSplashScreen(false);
      clearTimeout(timeout);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setRandomResults(getRandomResults(guessLength));
  }, [guessLength]);

  useEffect(() => {
    if (!isSplashScreen && guessValues.length === guessLength) handleGuess();
  }, [isSplashScreen, guessValues, guessLength]);

  const getRandomResults = (length) => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let currentIndex = 9;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr.slice(0, length);
  };

  const handleGuess = () => {
    if (guessLength > 0) {
      if (guessValues.toString() === randomResults.toString()) {
        setMessages([`Congratulation! You Win!`]);
        setIsGameOver(true);
      } else if (chance === 10) {
        setMessages([`Game Over! The answer is ${randomResults}`]);
        setIsGameOver(true);
      } else {
        let rightPosition = 0;
        let rightValue = 0;
        for (let i = 0; i < randomResults.length; i++) {
          if (randomResults[i].toString() === guessValues[i * 2]) {
            rightPosition++;
          }

          for (let j = 0; j < guessValues.length; j++) {
            if (randomResults[i].toString() === guessValues[j]) {
              rightValue++;
            }
          }
        }

        setMessages([
          ...messages,
          `${guessValues} | Right Position: ${rightPosition}, Right Value: ${rightValue}`,
        ]);
        setChance((prevState) => prevState + 1);
      }
    }
  };

  const handleResetResult = () => {
    getRandomResults(guessLength);
    setGuessValues([]);
  };

  const handleChangeGuess = (value) => {
    setGuessValues(value.split(""));
  };

  const handleGuessLengthChange = (e) => {
    setGuessLength(+e.target.value);
    setGuessValues([]);
  };

  const handleRestart = () => {
    setRandomResults(getRandomResults(guessLength));
    setGuessValues([]);
    setMessages([])
    setChance(1)
    setIsGameOver(false);
  };

  if (isSplashScreen) return <Splash />;

  if (isGameOver) return <GameOver onRestart={handleRestart} messages={messages} />;

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
      <div style={{ width: 300 }}>
        <div style={{ marginBottom: 20 }}>
          <Input value={guessLength} type="number" onChange={handleGuessLengthChange} />
        </div>

        <OTPInput
          value={guessValues.join("")}
          onChange={handleChangeGuess}
          numInputs={guessLength}
          containerStyle={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          inputStyle={{ minWidth: 45 }}
          renderSeparator={<div style={{ padding: 10 }} />}
          renderInput={(props) => <Input {...props} />}
          shouldAutoFocus
        />

        {messages.length > 0 &&
          messages.map((message) => <Typography.Text keyboard>{message}</Typography.Text>)}

        <div style={{ marginTop: 20 }}>
          <Button type="primary" danger onClick={handleResetResult} style={{ width: "100%" }}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
