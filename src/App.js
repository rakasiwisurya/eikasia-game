import { Button, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { GameOver, Splash } from "./components";

function App() {
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const [guessLength, setGuessLength] = useState(0);
  const [randomResults, setRandomResults] = useState([]);
  const [guessValues, setGuessValues] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [chance, setChance] = useState(1);
  const [maxChance, setMaxChance] = useState(10);

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
    const firstOtpInput = document.getElementById("otp-container").children[0].children[0];

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
        let rightGuess = "";
        for (let i = 0; i < randomResults.length; i++) {
          if (randomResults[i].toString() === guessValues[i]) {
            rightPosition++;
            rightGuess += randomResults[i].toString() + ",";
          }

          for (let j = 0; j < guessValues.length; j++) {
            if (randomResults[i].toString() === guessValues[j]) {
              rightValue++;
            }
          }
        }

        let messageInfo = "";
        switch (guessLength) {
          case 3:
            messageInfo = `Right Position: ${rightPosition}, Right Value: ${rightValue}, Right Guess: ${rightGuess}`;
            break;
          case 4:
            messageInfo = `Right Position: ${rightPosition}, Right Value: ${rightValue} `;
            break;
          case 5:
            messageInfo = `Right Value: ${rightValue}`;
            break;
        }
        setMessages([...messages, `${guessValues} | ${messageInfo}`]);
        setGuessValues([]);
        firstOtpInput.focus();
        setChance((prevState) => prevState + 1);
      }
    }
  };

  const handleResetResult = () => {
    getRandomResults(guessLength);
    setGuessValues([]);
    setChance(1);
    setMessages([]);
  };

  const handleResetLevel = () => {
    setGuessLength(0);
  };

  const handleChangeGuess = (value) => {
    setGuessValues(value.split(""));
  };

  const handleGuessLengthChange = (e) => {
    setGuessLength(+e.target.value);
    setGuessValues([]);
    setChance(1);
    setMessages([]);
  };
  const handleLevel = (level) => {
    console.log("level", level);
    switch (level) {
      case "easy":
        setGuessLength(3);
        setMaxChance(6);
        break;
      case "medium":
        setGuessLength(4);
        setMaxChance(8);
        break;
      case "hard":
        setGuessLength(5);
        setMaxChance(10);
        break;
      case "default":
        setGuessLength(0);
        setMaxChance(0);
        break;
    }
  };

  const handleRestart = () => {
    setRandomResults(getRandomResults(guessLength));
    setGuessValues([]);
    setMessages([]);
    setChance(1);
    setIsGameOver(false);
  };

  if (isSplashScreen) return <Splash />;

  if (isGameOver) return <GameOver onRestart={handleRestart} messages={messages} />;

  const SelectLevelScreen = () => {
    return (
      <>
        <div style={{ width: 300 }}>
          <Typography.Title style={{ marginBottom: 20, textAlign: "center" }}>
            Eikasia
          </Typography.Title>

          <Typography.Paragraph>Select level.</Typography.Paragraph>

          <div style={{ marginBottom: 20 }}>
            <div style={{ marginTop: 20 }}>
              <Button
                type="primary"
                onClick={() => {
                  handleLevel("easy");
                }}
                danger
                style={{ width: "100%" }}
              >
                Easy
              </Button>
            </div>

            <div style={{ marginTop: 20 }}>
              <Button
                type="primary"
                onClick={() => {
                  handleLevel("medium");
                }}
                danger
                style={{ width: "100%" }}
              >
                Medium
              </Button>
            </div>

            <div style={{ marginTop: 20 }}>
              <Button
                type="primary"
                onClick={() => {
                  handleLevel("hard");
                }}
                danger
                style={{ width: "100%" }}
              >
                Hard
              </Button>
            </div>
            {/* <Input value={guessLength} type="number" onChange={handleGuessLengthChange} /> */}
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#EEEEEE",
      }}
    >
      {guessLength == 0 ? (
        <SelectLevelScreen />
      ) : (
        <div style={{ width: 300 }}>
          <Typography.Title style={{ marginBottom: 20, textAlign: "center" }}>
            Eikasia
          </Typography.Title>

          <Typography.Paragraph>
            Guess some of the unique numbers below and then you give {maxChance} chances to guess.
          </Typography.Paragraph>

          {/* <div style={{ marginBottom: 20 }}>
          <Input value={guessLength} type="number" onChange={handleGuessLengthChange} />
        </div> */}

          <div id="otp-container">
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
          </div>

          <div style={{ marginTop: 20 }}>
            {messages.length > 0 &&
              messages.map((message, index) => (
                <div
                  key={`message-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <Typography.Text style={{ fontSize: 13 }} keyboard>
                    {message}
                  </Typography.Text>
                </div>
              ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <Button type="primary" danger onClick={handleResetResult} style={{ width: "100%" }}>
              Reset
            </Button>
          </div>

          <div style={{ marginTop: 20 }}>
            <Button type="primary" danger onClick={handleResetLevel} style={{ width: "100%" }}>
              Reset Level
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
