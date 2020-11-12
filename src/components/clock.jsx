import React, {useState, useEffect} from 'react';
import useSound from 'use-sound';

import StartSound from '../sounds/start.wav';
import StopRest from '../sounds/stop-rest.wav';

import '../styles/clock.css';

function Clock() {
    const [time, setTime] = useState('25:00');
    const [minutes, setMinutes] = useState(25);
    const [bMinutes, setBMinutes] = useState(5);
    const [interv, setInterv] = useState();
    const [isValid, setIsValid] = useState(true);
    const [isValid2, setIsValid2] = useState(true);
    const [started, setStarted] = useState(false);
    const [breakS, setBreakS] = useState(false);

    const [playStart] = useSound(StartSound);
    const [playStop] = useSound(StopRest);


    //checks if it's break time or not

    useEffect(() => {
        clearInterval(interv);

    }, [breakS]);


    //Starts the timer

    function start() {
        let min = minutes;
        let sec = '00';
        
        playStart();

        setStarted(true);

        setInterv(setInterval(() => {
            if(min === '00' && sec === '00') {
                playStop();
                
                setBreakS(true);
                
                breakSession();
            
                sec = '00-';
                
                setTime(`${bMinutes}:00`);
    
            }else {
                if(sec === '00' && min !== '00') {
                    sec = 59;
    
                    min < 11 ? min = `0${min - 1}` : min--;
    
                }else if(sec !== '00-') {
                    sec < 11 ? sec = `0${sec - 1}` : sec--;
    
                }

            }
            
            setTime(`${min}:${sec}`);
            
        }, 1000));
        
    }


    //starts the break session

    function breakSession() {
        let min = bMinutes;
        let sec = '00';

        setInterv(setInterval(() => {
            if(min === '00' && sec === '00') {                
                setBreakS(false);
                
                start();
                
                sec = '00-';
                
                setTime(`${minutes}:00`);
                  
            }else {
                if(sec === '00' && min !== '00') {
                    sec = 59;
    
                    min < 11 ? min = `0${min - 1}` : min--;
    
                }else if(sec !== '00-') {
                    sec < 11 ? sec = `0${sec - 1}` : sec--;
    
                }

            }
            
            setTime(`${min}:${sec}`);
            
        }, 1000));

    }


    //pauses the timer

    function pause() {
        clearInterval(interv);

        setStarted(false);

    }


    //resets the timer to it's initial value

    function reset() {
        clearInterval(interv);

        setTime('25:00');
        setMinutes(25);
        setBMinutes(5);

        setStarted(false);

    }



    return (
        <div className="container-clock">
            <header>
                <h1> {time} </h1>

            </header>

            <div className="warning">
                {
                    isValid === false &&
                        <span>Invalid Input on Working Session! Make sure the value is between 1 and 60.</span>
                }

                {
                    isValid2 === false &&
                        <span>Invalid Input on Break Session! Make sure the value is between 1 and 10.</span>
                }

            </div>

            <main>
                <div className="container-input">
                    <label htmlFor="work">Working Session <small>(mins)</small></label>
                    <input
                        id="work" 
                        type="number" 
                        min="1" 
                        max="60" 
                        defaultValue={minutes}
                        disabled={started ? true : false}
                        onChange={e => {
                            if(e.target.validity.valid) {
                                setMinutes(e.target.value);
                                setTime(e.target.value < 10 ? `0${e.target.value}:00` : `${e.target.value}:00`);

                                setIsValid(true);

                            }else {
                                setTime('00:00');

                                setIsValid(false);

                            }

                        }} 
                    />

                    <label htmlFor="break">Break Session <small>(mins)</small></label>
                    <input 
                        id="break" 
                        type="number"
                        min="1"
                        max="10"
                        defaultValue={bMinutes}
                        disabled={started ? true : false}
                        onChange={e => {
                            if(e.target.validity.valid) {
                                setBMinutes(e.target.value);

                                setIsValid2(true);

                            }else {
                                setIsValid2(false);

                            }
                        }}
                    />
                </div>

                <div className="container-buttons">

                    {!started 
                        ? 
                        <button type="button" onClick={start} disabled={!isValid ? true : false}>Start</button>
                        :
                        <button type="button" onClick={pause}>Pause</button>
                        
                        
                    }

                    <button type="button" onClick={reset}>Reset</button>
                </div>

            </main>

        </div>
    );
}

export default Clock;