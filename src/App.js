import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [iteration, setIteration] = useState(0);
  const [randomArray, setRandomArray] = useState([]);
  const [message, setMessage] = useState([]);

  const [otp, newOtp] = useState();
  const [verfied, setVerfied] = useState(false);
  const [start, setStart] = useState(false);
  const [otpVal, setOtpVal] = useState([]);
  const textBase = useRef(null);

  // generate random otp for each first render

  useEffect(() => {
    newOtp(Math.floor(1000 + Math.random() * 9000));
  }, []);

  const clearAll = () => {
    textBase.current.classList.remove("otp-error");
    textBase.current.childNodes.forEach((child) => {
      child.value = "";
    });
    setOtpVal([]);
    setVerfied(false);
  };
  const clear = () => {
    textBase.current.classList.remove("otp-error");
    textBase.current.childNodes.forEach((child) => {
      child.value = "";
    });
    setOtpVal([]);
  };

  const getOtp = () => {
    if (parseInt(otpVal.join("")) === otp) {
      textBase.current.classList.remove("otp-error");
      setVerfied(true);
    } else {
      textBase.current.classList.add("otp-error");
    }
  };

  const focusNext = (e) => {
    const childCount = textBase.current.childElementCount;
    const currentIndex = [...e.target.parentNode.children].indexOf(e.target);
    if (currentIndex !== childCount - 1) {
      e.target.nextSibling.focus();
    } else {
      const values = [];
      textBase.current.childNodes.forEach((child) => {
        values.push(child.value);
      });
      if (values.length !== 0) {
        setOtpVal(values);
      }
      handleGuess(e, values.toString());
      
      
    }
  };

  useEffect(() => {
    if (otpVal.length === textBase.current.childElementCount) {
      getOtp();
    }
  }, [otpVal]);

  const generateRandomArray = (length) => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let currentIndex = 10;
    let randomIndex;

    // mengacak elemen array dengan algoritma Fisher-Yates
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // menukar nilai elemen array
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr.slice(0, length);
  };

  const handleGuess = (event,guess) => {
    event.preventDefault();
    
    if (guess.toString() === randomArray.toString()) {
      setMessage([`Congratulation! You Win!`]);
      setVerfied(true)
    } else if (iteration === 10) {
      setMessage([`Game Over! The answer is ${randomArray}`]);
      setVerfied(true)
    } else {
      let rightPosition = 0;
      let rightValue = 0;
      for (let i = 0; i < randomArray.length; i++) {
        console.log('result',randomArray[i].toString())
        console.log('result',guess[i*2])
        if (randomArray[i].toString() === guess[i*2]) {
          rightPosition++;
        }

        for (let j = 0; j < guess.length; j++) {
          if (randomArray[i].toString() === guess[j]) {
            rightValue++;
          }
        }
      }

      setMessage([...message,`${guess} | Right Position: ${rightPosition}, Right Value: ${rightValue}`]);
      setIteration(iteration + 1);
      
      clear();
      event.target.previousSibling.previousSibling.focus();
    }
  };

  const handleReset = () => {
    setRandomArray(generateRandomArray(3));
    setMessage([]);
    setIteration(0);
    clearAll();
    setStart(true);
  };

  return (
    <>
      {!start ? (
        <div className="base">
        <div className="otp-base" ref={textBase}></div>
        <button
          className={`button show`}
          onClick={() => {handleReset();}}
        >
          Start
        </button>
      </div>
      )
      :
      !verfied ? (
        <div className="base">
          <h1>Guess the Number</h1>
          <p>Guess the 3-digit number in 10 turns or less.</p>
          <div className="otp-base" ref={textBase}>
            {new Array(3).fill(null).map((input) => {
              return <input type="text" maxLength={1} onChange={(e) => focusNext(e)} />;
            })}
          </div>
          
          {message && message.map((d) => (
            <p>{d}</p>
          ))}
        </div>
      ) : (
        <div className="base">
          <div className="otp-base" ref={textBase}></div>
          {message && message.map((d) => (
            <p>{d}</p>
          ))}
          <button
            className={`button ${otpVal.length > 0 && "show"}`}
            onClick={() => {handleReset();}}
          >
            reset
          </button>
        </div>
        
      )}
    </>
  );
  

  // return (
  //   <>
  //     {!verfied ? (
  //       <div className="base">
  //         {/* <h1> Enter OTP : {otp}</h1>
  //         <div className="otp-base" ref={textBase}>
  //           {new Array(4).fill(null).map((input) => {
  //             return <input type="text" onChange={(e) => focusNext(e)} />;
  //           })}
  //         </div>
  
  //         <button
  //           className={`button ${otpVal.length > 0 && "show"}`}
  //           onClick={() => clearAll()}
  //         >
  //           clear otp
  //         </button> */}
  //         {/* <div className="container"> */}
  //         <h1>Guess the Number</h1>
  //         <p>Guess the 3-digit number in 10 turns or less.</p>
  //         <form onSubmit={handleGuess}>
  //           <input
  //             type="text"
  //             value={guess}
  //             onChange={(event) => setGuess(event.target.value)}
  //             placeholder="Enter your guess"
  //             maxLength="3"
  //             pattern="\d{3}"
  //             required
  //           />
  //           <button type="submit">Guess</button>
  //           <button type="button" onClick={handleReset}>
  //             Reset
  //           </button>
  //         </form>
  //         {message && message.map(d =>(
  //           <p>
  //             {d}
  //           </p>
  //         ))
  //         }
  //       {/* </div> */}
  //       </div>
        

  //     ) : (
  //       <div className="container">
  //         {message && message.map(d =>(
  //           <p>
  //             {d}
  //           </p>
  //         ))
  //         }
  //       </div>
  //     )}
  //   </>
  // );
  
}



export default App;
