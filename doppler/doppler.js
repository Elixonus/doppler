const buttonTimeStrt = document.getElementById("button-time-strt");
const buttonTimeStop = document.getElementById("button-time-stop");
const buttonBufrSave = document.getElementById("button-bufr-save");
const buttonBufrRstr = document.getElementById("button-bufr-rstr");
const buttonSoundOn = document.getElementById("button-sound-on");
const buttonSoundOff = document.getElementById("button-sound-off");
const buttonCtrlSrc = document.getElementById("button-ctrl-src");
const buttonCtrlObs = document.getElementById("button-ctrl-obs");
const buttonTypeVel = document.getElementById("button-type-vel");
const buttonTypeAcc = document.getElementById("button-type-acc");
const buttonDirLeft = document.getElementById("button-dir-left");
const buttonDirRght = document.getElementById("button-dir-rght");
const buttonDirUp = document.getElementById("button-dir-up");
const buttonDirDown = document.getElementById("button-dir-down");
const buttonDirZero = document.getElementById("button-dir-zero");
const buttonMagLow = document.getElementById("button-mag-low");
const buttonMagMed = document.getElementById("button-mag-med");
const buttonMagHigh = document.getElementById("button-mag-high");
const canvasView = document.getElementById("canvas-view");
const canvasFreq = document.getElementById("canvas-freq");
const canvasAmp = document.getElementById("canvas-amp");
let contextAudio;
let oscillator;
let volume;

let run = true;
let time = 0;
let bufr = null;
let sound = false;
let obj = null;

let src = {
    freq: 1,
    amp: 1,
    type: 1,
    dir: 0,
    mag: 2,
    pos: {
        x: -1,
        y: 0
    },
    vel: {
        x: 0,
        y: 0
    },
    acc: {
        x: 0,
        y: 0
    }
};

let obs = {
    freq: null,
    amp: null,
    type: 1,
    dir: 0,
    mag: 2,
    pos: {
        x: 1,
        y: 0
    },
    vel: {
        x: 0,
        y: 0
    },
    acc: {
        x: 0,
        y: 0
    }
};

let wavs = [];
let freqs = [];
let amps = [];

for(let w = 0; w < 1000; w++)
{
    doStep();
}

fixTime();
fixBufr();
fixSound();
fixCtrl();
fixType();
fixDir();
fixMag();

window.requestAnimationFrame(doFrame);

function doStep()
{
    if(obj !== null)
    {
        if(obj.dir !== null)
        {
            if(obj.type === 1)
            {
                if(obj.dir === 0)
                {
                    obj.vel.x = 0;
                    obj.vel.y = 0;
                }

                else if(obj.dir === 1)
                {
                    obj.vel.x = -0.004 * obj.mag;
                    obj.vel.y = 0;
                }

                else if(obj.dir === 2)
                {
                    obj.vel.x = 0.004 * obj.mag;
                    obj.vel.y = 0;
                }

                else if(obj.dir === 3)
                {
                    obj.vel.x = 0;
                    obj.vel.y = 0.004 * obj.mag;
                }

                else if(obj.dir === 4)
                {
                    obj.vel.x = 0;
                    obj.vel.y = -0.004 * obj.mag;
                }

                obj.acc.x = 0;
                obj.acc.y = 0;
            }
        
            else if(obj.type === 2)
            {
                if(obj.dir === 0)
                {
                    obj.acc.x = 0;
                    obj.acc.y = 0;
                }

                else if(obj.dir === 1)
                {
                    obj.acc.x = -0.0001 * obj.mag;
                    obj.acc.y = 0;
                }

                else if(obj.dir === 2)
                {
                    obj.acc.x = 0.0001 * obj.mag;
                    obj.acc.y = 0;
                }

                else if(obj.dir === 3)
                {
                    obj.acc.x = 0;
                    obj.acc.y = 0.0001 * obj.mag;
                }

                else if(obj.dir === 4)
                {
                    obj.acc.x = 0;
                    obj.acc.y = -0.0001 * obj.mag;
                }
            }
        }
    }

    src.vel.x += src.acc.x;
    src.vel.y += src.acc.y;
    src.pos.x += src.vel.x;
    src.pos.y += src.vel.y;

    obs.vel.x += obs.acc.x;
    obs.vel.y += obs.acc.y;
    obs.pos.x += obs.vel.x;
    obs.pos.y += obs.vel.y;

    wavs[time % 1000] = {
        time: time,
        freq: src.freq,
        amp: src.amp,
        pos: {
            x: src.pos.x,
            y: src.pos.y
        },
        vel: {
            x: src.vel.x,
            y: src.vel.y
        }
    }

    let diffs = [];

    for(let w = 0; w < wavs.length; w++)
    {
        diffs[w] = Math.abs(0.01 * (time - wavs[w].time) - Math.hypot(obs.pos.x - wavs[w].pos.x, obs.pos.y - wavs[w].pos.y));
    }

    let wo = 0;

    for(let w = 1; w < wavs.length; w++)
    {
        if(diffs[w] < diffs[wo])
        {
            wo = w;
        }
    }

    let wav = wavs[wo];
    let dist = Math.hypot(wav.pos.x - obs.pos.x, wav.pos.y - obs.pos.y);
    let velw = (wav.vel.x * (wav.pos.x - obs.pos.x) + wav.vel.y * (wav.pos.y - obs.pos.y)) / dist;
    let velo = (obs.vel.x * (obs.pos.x - wav.pos.x) + obs.vel.y * (obs.pos.y - wav.pos.y)) / dist;
    obs.freq = Math.abs(wav.freq * (0.01 - velo) / (0.01 + velw));
    obs.amp = wav.amp * Math.pow(0.995, time - wav.time);
    freqs[time % 1000] = obs.freq;
    amps[time % 1000] = obs.amp;

    time += 1;
}

function doFrame()
{
    const ctxView = canvasView.getContext("2d");
    ctxView.fillStyle = "#000000";
    ctxView.fillRect(0, 0, 800, 600);

    ctxView.save();
    ctxView.translate(400, 300);
    ctxView.scale(100, -100);

    ctxView.beginPath();
    ctxView.arc(obs.pos.x, obs.pos.y, 0.2, 0, 2 * Math.PI);
    ctxView.fillStyle = "#00ff00";
    ctxView.fill();

    ctxView.beginPath();
    ctxView.arc(src.pos.x, src.pos.y, 0.2, 0, 2 * Math.PI);
    ctxView.fillStyle = "#ff0000";
    ctxView.fill();

    ctxView.save();

    for(let w = 0; w < wavs.length; w += 20)
    {
        ctxView.beginPath();
        ctxView.arc(wavs[w].pos.x, wavs[w].pos.y, 0.01 * (time - wavs[w].time), 0, 2 * Math.PI);
        ctxView.globalAlpha = Math.max(1 - (time - wavs[w].time) / 1000, 0);
        ctxView.lineWidth = 0.03;
        ctxView.strokeStyle = "#ffffff";
        ctxView.stroke();
    }

    ctxView.restore();
    ctxView.restore();

    const ctxFreq = canvasFreq.getContext("2d");
    ctxFreq.fillStyle = "#000000";
    ctxFreq.fillRect(0, 0, 800, 200);

    ctxFreq.save();
    ctxFreq.translate(0, 200);
    ctxFreq.scale(800, -200);

    ctxFreq.beginPath();
    ctxFreq.lineTo(0, 0.5);
    ctxFreq.lineTo(1, 0.5);
    ctxFreq.lineTo(1, 0);
    ctxFreq.lineTo(0, 0);
    ctxFreq.fillStyle = "#ff0000";
    ctxFreq.fill();
    ctxFreq.lineWidth = 0.01;
    ctxFreq.strokeStyle = "#ff0000";
    ctxFreq.stroke();

    ctxFreq.beginPath();

    for(let f = 0; f < freqs.length; f++)
    {
        ctxFreq.lineTo(f / (freqs.length - 1), 0.5 * freqs[(f + time) % 1000]);
    }

    ctxFreq.lineTo(1, 0);
    ctxFreq.lineTo(0, 0);
    ctxFreq.fillStyle = "#00ff00";
    ctxFreq.fill();
    ctxFreq.lineWidth = 0.01;
    ctxFreq.strokeStyle = "#00aa00";
    ctxFreq.stroke();

    ctxFreq.restore();

    const ctxAmp = canvasAmp.getContext("2d");
    ctxAmp.fillStyle = "#000000";
    ctxAmp.fillRect(0, 0, 800, 200);

    ctxAmp.save();
    ctxAmp.translate(0, 200);
    ctxAmp.scale(800, -200);

    ctxAmp.beginPath();
    ctxAmp.lineTo(0, 0.8);
    ctxAmp.lineTo(1, 0.8);
    ctxAmp.lineTo(1, 0);
    ctxAmp.lineTo(0, 0);
    ctxAmp.fillStyle = "#ff0000";
    ctxAmp.fill();
    ctxAmp.lineWidth = 0.01;
    ctxAmp.strokeStyle = "#ff0000";
    ctxAmp.stroke();

    ctxAmp.beginPath();

    for(let a = 0; a < amps.length; a++)
    {
        ctxAmp.lineTo(a / (amps.length - 1), 0.8 * amps[(a + time) % 1000]);
    }

    ctxAmp.lineTo(1, 0);
    ctxAmp.lineTo(0, 0);
    ctxAmp.fillStyle = "#00ff00";
    ctxAmp.fill();
    ctxAmp.lineWidth = 0.01;
    ctxAmp.strokeStyle = "#00ff00";
    ctxAmp.stroke();

    ctxAmp.restore();

    if(sound === true)
    {
        setSound();
    }

    if(run === true)
    {
        doStep();
    }

    window.requestAnimationFrame(doFrame);
}

buttonTimeStrt.onclick = setTimeStrt;
buttonTimeStop.onclick = setTimeStop;
buttonBufrSave.onclick = doBufrSave;
buttonBufrRstr.onclick = doBufrRstr;
buttonSoundOn.onclick = setSoundOn;
buttonSoundOff.onclick = setSoundOff;
buttonCtrlSrc.onclick = setCtrlSrc;
buttonCtrlObs.onclick = setCtrlObs;
buttonTypeVel.onclick = setTypeVel;
buttonTypeAcc.onclick = setTypeAcc;
buttonDirLeft.onclick = setDirLeft;
buttonDirRght.onclick = setDirRght;
buttonDirUp.onclick = setDirUp;
buttonDirDown.onclick = setDirDown;
buttonDirZero.onclick = setDirZero;
buttonMagLow.onclick = setMagLow;
buttonMagMed.onclick = setMagMed;
buttonMagHigh.onclick = setMagHigh;

function setTimeStrt()
{
    run = true;
    fixTime();
}

function setTimeStop()
{
    run = false;
    fixTime();
}

function doBufrSave()
{
    bufr = {};
    bufr.run = false;
    bufr.time = time;
    bufr.obj = null;

    bufr.src = {
        freq: src.freq,
        amp: src.amp,
        type: src.type,
        dir: src.dir,
        mag: src.mag,
        pos: {
            x: src.pos.x,
            y: src.pos.y
        },
        vel: {
            x: src.vel.x,
            y: src.vel.y
        },
        acc: {
            x: src.acc.x,
            y: src.acc.y
        }
    };

    bufr.obs = {
        freq: obs.freq,
        amp: obs.amp,
        type: obs.type,
        dir: obs.dir,
        mag: obs.mag,
        pos: {
            x: obs.pos.x,
            y: obs.pos.y
        },
        vel: {
            x: obs.vel.x,
            y: obs.vel.y
        },
        acc: {
            x: obs.acc.x,
            y: obs.acc.y
        }
    };
    
    bufr.wavs = [];

    for(let w = 0; w < wavs.length; w++)
    {
        bufr.wavs[w] = {
            time: wavs[w].time,
            freq: wavs[w].freq,
            amp: wavs[w].amp,
            pos: {
                x: wavs[w].pos.x,
                y: wavs[w].pos.y
            },
            vel: {
                x: wavs[w].pos.x,
                y: wavs[w].pos.y
            }
        };
    }

    bufr.freqs = [];

    for(let f = 0; f < freqs.length; f++)
    {
        bufr.freqs[f] = src.freq;
    }

    bufr.amps = [];

    for(let a = 0; a < amps.length; a++)
    {
        bufr.amps[a] = src.amp;
    }

    fixBufr();
}

function doBufrRstr()
{
    run = bufr.run;
    time = bufr.time;
    obj = bufr.obj;

    src.freq = bufr.src.freq;
    src.amp = bufr.src.amp;
    src.type = bufr.src.type;
    src.dir = bufr.src.dir;
    src.mag = bufr.src.mag;
    src.pos.x = bufr.src.pos.x;
    src.pos.y = bufr.src.pos.y;
    src.vel.x = bufr.src.vel.x;
    src.vel.y = bufr.src.vel.y;
    src.acc.x = bufr.src.acc.x;
    src.acc.y = bufr.src.acc.y;

    obs.freq = bufr.obs.freq;
    obs.amp = bufr.obs.amp;
    obs.type = bufr.obs.type;
    obs.dir = bufr.obs.dir;
    obs.mag = bufr.obs.mag;
    obs.pos.x = bufr.obs.pos.x;
    obs.pos.y = bufr.obs.pos.y;
    obs.vel.x = bufr.obs.vel.x;
    obs.vel.y = bufr.obs.vel.y;
    obs.acc.x = bufr.obs.acc.x;
    obs.acc.y = bufr.obs.acc.y;

    for(let w = 0; w < bufr.wavs.length; w++)
    {
        wavs[w].time = bufr.wavs[w].time;
        wavs[w].freq = bufr.wavs[w].freq;
        wavs[w].amp = bufr.wavs[w].amp;
        wavs[w].pos.x = bufr.wavs[w].pos.x;
        wavs[w].pos.y = bufr.wavs[w].pos.y;
        wavs[w].vel.x = bufr.wavs[w].vel.x;
        wavs[w].vel.y = bufr.wavs[w].vel.y;
    }

    for(let f = 0; f < bufr.freqs.length; f++)
    {
        freqs[f] = bufr.freqs[f];
    }

    for(let a = 0; a < bufr.amps.length; a++)
    {
        amps[a] = bufr.amps[a];
    }
    
    for(let w = 0; w < 1000; w++)
    {
        doStep();
    }

    fixTime();
    fixCtrl();
    fixType();
    fixDir();
    fixMag();
}

function setSoundOn()
{
    if(sound === false)
    {
        contextAudio = new window.AudioContext();
        oscillator = contextAudio.createOscillator();
        oscillator.type = "sawtooth";
        volume = contextAudio.createGain();
        oscillator.connect(volume);
        volume.connect(contextAudio.destination);
        setSound();
        oscillator.start();
        sound = true;
        fixSound();
    }
}

function setSoundOff()
{
    if(sound === true)
    {
        sound = false;
        fixSound();
        oscillator.stop();
        oscillator.disconnect(contextAudio.destination);
    }
}

function setSound()
{
    if(sound === true)
    {
        if(run === true)
        {
            oscillator.frequency.value = Math.min(1000 * obs.freq, 3000);
            volume.gain.value = 0.2 * obs.amp;
        }

        else if(run === false)
        {
            oscillator.frequency.value = 0;
            volume.gain.value = 0;
        }
    }
}

function setCtrlSrc()
{
    obj = src;
    fixCtrl();

    if(src.type === 1)
    {
        setTypeVel();
    }

    else if(src.type === 2)
    {
        setTypeAcc();
    }

    if(src.dir === 0)
    {
        setDirZero();
    }

    else if(src.dir === 1)
    {
        setDirLeft();
    }

    else if(src.dir === 2)
    {
        setDirRght();
    }

    else if(src.dir === 3)
    {
        setDirUp();
    }

    else if(src.dir === 4)
    {
        setDirDown();
    }

    if(src.mag === 1)
    {
        setMagLow();
    }

    else if(src.mag === 2)
    {
        setMagMed();
    }
    
    else if(src.mag === 3)
    {
        setMagHigh();
    }
}

function setCtrlObs()
{
    obj = obs;
    fixCtrl();

    if(obs.type === 1)
    {
        setTypeVel();
    }

    else if(obs.type === 2)
    {
        setTypeAcc();
    }

    if(obs.dir === 0)
    {
        setDirZero();
    }

    else if(obs.dir === 1)
    {
        setDirLeft();
    }

    else if(obs.dir === 2)
    {
        setDirRght();
    }

    else if(obs.dir === 3)
    {
        setDirUp();
    }

    else if(obs.dir === 4)
    {
        setDirDown();
    }

    if(obs.mag === 1)
    {
        setMagLow();
    }

    else if(obs.mag === 2)
    {
        setMagMed();
    }
    
    else if(obs.mag === 3)
    {
        setMagHigh();
    }
}

function isCtrl()
{
    return (obj === src || obj === obs);
}

function isCtrlSrc()
{
    return (obj === src);
}

function isCtrlObs()
{
    return (obj === obs);
}

function setTypeVel()
{
    if(isCtrl() === true)
    {
        obj.type = 1;
        fixType();
    }
}

function setTypeAcc()
{
    if(isCtrl() === true)
    {
        obj.type = 2;
        fixType();
    }
}

function setDirLeft()
{
    if(isCtrl() === true)
    {
        obj.dir = 1;
        fixDir();
    }
}

function setDirRght()
{
    if(isCtrl() === true)
    {
        obj.dir = 2;
        fixDir();
    }
}

function setDirUp()
{
    if(isCtrl() === true)
    {
        obj.dir = 3;
        fixDir();
    }
}

function setDirDown()
{
    if(isCtrl() === true)
    {
        obj.dir = 4;
        fixDir();
    }
}

function setDirZero()
{
    if(isCtrl() === true)
    {
        obj.dir = 0;
        fixDir();
    }
}

function setMagLow()
{
    if(isCtrl() === true)
    {
        obj.mag = 1;
        fixMag();
    }
}

function setMagMed()
{
    if(isCtrl() === true)
    {
        obj.mag = 2;
        fixMag();
    }
}

function setMagHigh()
{
    if(isCtrl() === true)
    {
        obj.mag = 3;
        fixMag();
    }
}

function fixTime()
{
    buttonTimeStrt.disabled = false;
    buttonTimeStop.disabled = false;

    if(run === true)
    {
        buttonTimeStrt.disabled = true;
    }

    else if(run === false)
    {
        buttonTimeStop.disabled = true;
    }
}

function fixBufr()
{
    buttonBufrRstr.disabled = false;

    if(bufr === null)
    {
        buttonBufrRstr.disabled = true;
    }
}

function fixSound()
{
    buttonSoundOn.disabled = false;
    buttonSoundOff.disabled = false;

    if(sound === true)
    {
        buttonSoundOn.disabled = true;
    }

    else if(sound === false)
    {
        buttonSoundOff.disabled = true;
    }
}

function fixCtrl()
{
    buttonCtrlSrc.disabled = false;
    buttonCtrlObs.disabled = false;

    if(obj === src)
    {
        buttonCtrlSrc.disabled = true;
    }

    else if(obj === obs)
    {
        buttonCtrlObs.disabled = true;
    }
}

function fixType()
{
    if(isCtrl())
    {
        buttonTypeVel.disabled = false;
        buttonTypeAcc.disabled = false;
    
        if(obj.type === 1)
        {
            buttonTypeVel.disabled = true;
        }
    
        else if(obj.type === 2)
        {
            buttonTypeAcc.disabled = true;
        }
    }

    else
    {
        buttonTypeVel.disabled = true;
        buttonTypeAcc.disabled = true;
    }
}

function fixDir()
{
    if(isCtrl())
    {
        buttonDirLeft.disabled = false;
        buttonDirRght.disabled = false;
        buttonDirUp.disabled = false;
        buttonDirDown.disabled = false;
        buttonDirZero.disabled = false;

        if(obj.dir === 0)
        {
            buttonDirZero.disabled = true;
        }
    
        else if(obj.dir === 1)
        {
            buttonDirLeft.disabled = true;
        }
    
        else if(obj.dir === 2)
        {
            buttonDirRght.disabled = true;
        }
    
        else if(obj.dir === 3)
        {
            buttonDirUp.disabled = true;
        }
    
        else if(obj.dir === 4)
        {
            buttonDirDown.disabled = true;
        }
    }

    else
    {
        buttonDirZero.disabled = true;
        buttonDirLeft.disabled = true;
        buttonDirRght.disabled = true;
        buttonDirUp.disabled = true;
        buttonDirDown.disabled = true;
    }
}

function fixMag()
{
    if(isCtrl())
    {
        buttonMagLow.disabled = false;
        buttonMagMed.disabled = false;
        buttonMagHigh.disabled = false;

        if(obj.mag === 1)
        {
            buttonMagLow.disabled = true;
        }
    
        else if(obj.mag === 2)
        {
            buttonMagMed.disabled = true;
        }
    
        else if(obj.mag === 3)
        {
            buttonMagHigh.disabled = true;
        }
    }

    else
    {
        buttonMagLow.disabled = true;
        buttonMagMed.disabled = true;
        buttonMagHigh.disabled = true;
    }
}
