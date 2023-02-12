const buttonTimeStrt = document.getElementById("button-time-start");
const buttonTimeStop = document.getElementById("button-time-stop");
const buttonBufrSave = document.getElementById("button-buffer-save");
const buttonBufrRstr = document.getElementById("button-buffer-restore");
const buttonSndOn = document.getElementById("button-sound-on");
const buttonSndOff = document.getElementById("button-sound-off");
const buttonOwvOn = document.getElementById("button-owave-on");
const buttonOwvOff = document.getElementById("button-owave-off");
const buttonCtrlSrc = document.getElementById("button-control-source");
const buttonCtrlObs = document.getElementById("button-control-observer");
const buttonTypeVel = document.getElementById("button-type-velocity");
const buttonTypeAcc = document.getElementById("button-type-acceleration");
const buttonDirLeft = document.getElementById("button-direction-left");
const buttonDirRght = document.getElementById("button-direction-right");
const buttonDirUp = document.getElementById("button-direction-up");
const buttonDirDown = document.getElementById("button-direction-down");
const buttonDirZero = document.getElementById("button-direction-zero");
const buttonMagLow = document.getElementById("button-magnitude-low");
const buttonMagMed = document.getElementById("button-magnitude-medium");
const buttonMagHigh = document.getElementById("button-magnitude-high");
const canvasPos = document.getElementById("canvas-position");
const canvasFreq = document.getElementById("canvas-frequency");
const canvasAmp = document.getElementById("canvas-amplitude");
const contextPos = canvasPos.getContext("2d");
const contextFreq = canvasFreq.getContext("2d");
const contextAmp = canvasAmp.getContext("2d");
let contextAudio;
let oscillator;
let volume;

let run = true;
let time = 0;
let bufr = null;
let snd = false;
let owv = false;
let obj = null;

let src = {
    wav: null,
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
    wav: null,
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

fixTime();
fixBufr();
fixSnd();
fixOwv();
fixCtrl();
fixType();
fixDir();
fixMag();

window.requestAnimationFrame(doFrame);

function doStep()
{
    src.vel.x += src.acc.x;
    src.vel.y += src.acc.y;
    src.pos.x += src.vel.x;
    src.pos.y += src.vel.y;

    obs.vel.x += obs.acc.x;
    obs.vel.y += obs.acc.y;
    obs.pos.x += obs.vel.x;
    obs.pos.y += obs.vel.y;

    let ws = time % 1000;

    wavs[ws] = {
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

    src.wav = wavs[ws];

    let diffs = [];

    for(let w = 0; w < 1000; w++)
    {
        if(wavs[w] !== undefined)
        {
            diffs[w] = 0.01 * (time - wavs[w].time) - Math.hypot(obs.pos.x - wavs[w].pos.x, obs.pos.y - wavs[w].pos.y);
        }
    }

    let wo = null;

    for(let w = 0; w < 1000; w++)
    {
        if(diffs[w] !== undefined)
        {
            if((wo === null || diffs[w] < diffs[wo]) && diffs[w] > 0)
            {
                wo = w;
            }
        }
    }

    if(wo !== null)
    {
        obs.wav = wavs[wo];
        let dist = Math.hypot(obs.wav.pos.x - obs.pos.x, obs.wav.pos.y - obs.pos.y);
        let vels = (obs.wav.vel.x * (obs.wav.pos.x - obs.pos.x) + obs.wav.vel.y * (obs.wav.pos.y - obs.pos.y)) / dist;
        let velo = (obs.vel.x * (obs.pos.x - obs.wav.pos.x) + obs.vel.y * (obs.pos.y - obs.wav.pos.y)) / dist;
        obs.freq = obs.wav.freq * (0.01 - velo) / (0.01 + vels);
        obs.amp = obs.wav.amp * Math.pow(0.995, time - obs.wav.time);
        freqs[ws] = obs.freq;
        amps[ws] = obs.amp;
    }

    time += 1;
}

function doFrame()
{
    contextPos.fillStyle = "#000000";
    contextPos.fillRect(0, 0, 800, 600);

    contextPos.save();
    contextPos.translate(400, 300);
    contextPos.scale(100, -100);

    contextPos.beginPath();
    contextPos.arc(obs.pos.x, obs.pos.y, 0.2, 0, 2 * Math.PI);
    contextPos.fillStyle = "#00ff00";
    contextPos.fill();

    if(Math.hypot(obs.vel.x, obs.vel.y) > 0.001)
    {
        contextPos.save();
        contextPos.translate(obs.pos.x, obs.pos.y);
        contextPos.beginPath();
        contextPos.lineTo(0, 0);
        contextPos.translate(50 * obs.vel.x, 50 * obs.vel.y);
        contextPos.rotate(Math.atan2(obs.vel.y, obs.vel.x));
        contextPos.lineTo(0.05, 0);
        contextPos.lineWidth = 0.05;
        contextPos.strokeStyle = "#00ff00";
        contextPos.stroke();
        contextPos.beginPath();
        contextPos.lineTo(0, 0.1);
        contextPos.lineTo(0, -0.1);
        contextPos.lineTo(0.1, 0);
        contextPos.closePath();
        contextPos.fillStyle = "#00ff00";
        contextPos.fill();
        contextPos.restore();
    }

    contextPos.beginPath();
    contextPos.arc(src.pos.x, src.pos.y, 0.2, 0, 2 * Math.PI);
    contextPos.fillStyle = "#ff0000";
    contextPos.fill();

    if(Math.hypot(src.vel.x, src.vel.y) > 0.001)
    {
        contextPos.save();
        contextPos.translate(src.pos.x, src.pos.y);
        contextPos.beginPath();
        contextPos.lineTo(0, 0);
        contextPos.translate(50 * src.vel.x, 50 * src.vel.y);
        contextPos.rotate(Math.atan2(src.vel.y, src.vel.x));
        contextPos.lineTo(0.05, 0);
        contextPos.lineWidth = 0.05;
        contextPos.strokeStyle = "#ff0000";
        contextPos.stroke();
        contextPos.beginPath();
        contextPos.lineTo(0, 0.1);
        contextPos.lineTo(0, -0.1);
        contextPos.lineTo(0.1, 0);
        contextPos.closePath();
        contextPos.fillStyle = "#ff0000";
        contextPos.fill();
        contextPos.restore();
    }

    contextPos.save();

    for(let w = 0; w < 1000; w += 20)
    {
        if(wavs[w] !== undefined)
        {
            if(time - wavs[w].time < 500)
            {
                contextPos.beginPath();
                contextPos.arc(wavs[w].pos.x, wavs[w].pos.y, 0.01 * (time - wavs[w].time), 0, 2 * Math.PI);
                contextPos.globalAlpha = Math.min(Math.max(1 - (time - wavs[w].time) / 500, 0), 1);
                contextPos.lineWidth = 0.03;
                contextPos.strokeStyle = "#ffffff";
                contextPos.stroke();
            }
        }
    }

    contextPos.restore();

    if(isOwv())
    {
        contextPos.beginPath();
        contextPos.arc(obs.wav.pos.x, obs.wav.pos.y, 0.01 * (time - obs.wav.time), 0, 2 * Math.PI);
        contextPos.lineWidth = 0.05;
        contextPos.strokeStyle = "#ffff00";
        contextPos.stroke();

        contextPos.beginPath();
        contextPos.arc(obs.wav.pos.x, obs.wav.pos.y, 0.05, 0, 2 * Math.PI);
        contextPos.fillStyle = "#ffff00";
        contextPos.fill();

        if(Math.hypot(obs.wav.vel.x, obs.wav.vel.y) > 0.001)
        {
            contextPos.save();
            contextPos.translate(obs.wav.pos.x, obs.wav.pos.y);
            contextPos.beginPath();
            contextPos.lineTo(0, 0);
            contextPos.translate(50 * obs.wav.vel.x, 50 * obs.wav.vel.y);
            contextPos.rotate(Math.atan2(obs.wav.vel.y, obs.wav.vel.x));
            contextPos.lineTo(0.05, 0);
            contextPos.lineWidth = 0.05;
            contextPos.strokeStyle = "#ffff00";
            contextPos.stroke();
            contextPos.beginPath();
            contextPos.lineTo(0, 0.1);
            contextPos.lineTo(0, -0.1);
            contextPos.lineTo(0.1, 0);
            contextPos.closePath();
            contextPos.fillStyle = "#ffff00";
            contextPos.fill();
            contextPos.restore();
        }
    }

    contextPos.restore();

    if(time % 10 === 0)
    {
        contextFreq.fillStyle = "#000000";
        contextFreq.fillRect(0, 0, 800, 200);
    
        contextFreq.save();
        contextFreq.scale(800, 200);
        contextFreq.translate(0.5, 0.5);
        contextFreq.scale(-1, -1);
        contextFreq.translate(-0.5, -0.5);

        contextFreq.fillStyle = "#ff0000";
        contextFreq.fillRect(0, 0, Math.min(time / 1000, 4), 0.25);

        contextFreq.beginPath();

        for(let f = 0; f < 1000; f++)
        {
            let freq = freqs[(time - f - 1) % 1000];

            if(freq !== undefined)
            {
                contextFreq.fillStyle = "#00ff00";
                contextFreq.fillRect(f / 1000, 0, 2 / 1000, Math.min(0.25 * Math.abs(freq), 1));
            }
        }

        if(isOwv())
        {
            contextFreq.fillStyle = "#ffff00";
            contextFreq.fillRect(0, 0, 0.01, Math.min(0.25 * Math.abs(src.freq), 1));
        }

        for(let b = 0; b < 3; b++)
        {
            contextFreq.fillStyle = "#666666";
            contextFreq.fillRect(0, (b + 1) / 4, 1, 0.01);
        }

        contextFreq.restore();
    
        contextAmp.fillStyle = "#000000";
        contextAmp.fillRect(0, 0, 800, 200);
    
        contextAmp.save();
        contextAmp.scale(800, 200);
        contextAmp.translate(0.5, 0.5);
        contextAmp.scale(-1, -1);
        contextAmp.translate(-0.5, -0.5);
    
        contextAmp.fillStyle = "#ff0000";
        contextAmp.fillRect(0, 0, Math.min(time / 1000, 1), 0.8);

        for(let a = 0; a < 1000; a++)
        {
            let amp = amps[(time - a - 1) % 1000];

            if(amp !== undefined)
            {
                contextAmp.fillStyle = "#00ff00";
                contextAmp.fillRect(a / 1000, 0, 2 / 1000, 0.8 * amp);
            }
        }

        if(isOwv())
        {
            contextAmp.fillStyle = "#ffff00";
            contextAmp.fillRect(0, 0, 0.01, 0.8 * obs.amp);
        }

        for(let b = 0; b < 3; b++)
        {
            contextAmp.fillStyle = "#666666";
            contextAmp.fillRect(0, 0.8 * (b + 1) / 4, 1, 0.01);
        }

        contextAmp.restore();
    }

    if(snd === true)
    {
        setSnd();
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
buttonSndOn.onclick = setSndOn;
buttonSndOff.onclick = setSndOff;
buttonOwvOn.onclick = setOwvOn;
buttonOwvOff.onclick = setOwvOff;
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
document.onkeydown = doKeyDown;

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

    for(let w = 0; w < 1000; w++)
    {
        if(wavs[w] !== undefined)
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
                    x: wavs[w].vel.x,
                    y: wavs[w].vel.y
                }
            };
        }
    }

    bufr.freqs = [];

    for(let f = 0; f < 1000; f++)
    {
        if(freqs[f] !== undefined)
        {
            bufr.freqs[f] = freqs[f];
        }
    }

    bufr.amps = [];

    for(let a = 0; a < 1000; a++)
    {
        if(amps[a] !== undefined)
        {
            bufr.amps[a] = amps[a];
        }
    }

    fixBufr();
}

function doBufrRstr()
{
    if(bufr !== null)
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
    
        for(let w = 0; w < 1000; w++)
        {
            if(bufr.wavs[w] !== undefined)
            {
                wavs[w].time = bufr.wavs[w].time;
                wavs[w].freq = bufr.wavs[w].freq;
                wavs[w].amp = bufr.wavs[w].amp;
                wavs[w].pos.x = bufr.wavs[w].pos.x;
                wavs[w].pos.y = bufr.wavs[w].pos.y;
                wavs[w].vel.x = bufr.wavs[w].vel.x;
                wavs[w].vel.y = bufr.wavs[w].vel.y;
            }
    
            else
            {
                wavs[w] = undefined;
            }
        }
    
        for(let f = 0; f < 1000; f++)
        {
            if(bufr.freqs[f] !== undefined)
            {
                freqs[f] = bufr.freqs[f];
            }
    
            else
            {
                freqs[f] = undefined;
            }
        }
    
        for(let a = 0; a < 1000; a++)
        {
            if(bufr.amps[a] !== undefined)
            {
                amps[a] = bufr.amps[a];
            }
    
            else
            {
                amps[a] = undefined;
            }
        }
    
        fixTime();
        fixCtrl();
        fixType();
        fixDir();
        fixMag();
    }
}

function setSndOn()
{
    if(snd === false)
    {
        snd = true;
        contextAudio = new window.AudioContext();
        oscillator = contextAudio.createOscillator();
        oscillator.type = "sawtooth";
        volume = contextAudio.createGain();
        oscillator.connect(volume);
        volume.connect(contextAudio.destination);
        setSnd();
        oscillator.start();
        fixSnd();
    }
}

function setSndOff()
{
    if(snd === true)
    {
        snd = false;
        fixSnd();
        oscillator.stop();
    }
}

function setSnd()
{
    if(snd === true)
    {
        if(run === true && obs.freq !== null && obs.amp !== null)
        {
            oscillator.frequency.value = Math.min(Math.max(1000 * Math.abs(obs.freq), 1), 3000);
            volume.gain.value = 0.2 * obs.amp;
        }

        else
        {
            oscillator.frequency.value = 0;
            volume.gain.value = 0;
        }
    }
}

function setOwvOn()
{
    owv = true;
    fixOwv();
}

function setOwvOff()
{
    owv = false;
    fixOwv();
}

function isOwv()
{
    return (owv === true && obs.wav !== null && time - obs.wav.time < 500);
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
        setType();
    }
}

function setTypeAcc()
{
    if(isCtrl() === true)
    {
        obj.type = 2;
        fixType();
        setType();
    }
}

function setType()
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
}

function setDirLeft()
{
    if(isCtrl() === true)
    {
        obj.dir = 1;
        fixDir();
        setType();
    }
}

function setDirRght()
{
    if(isCtrl() === true)
    {
        obj.dir = 2;
        fixDir();
        setType();
    }
}

function setDirUp()
{
    if(isCtrl() === true)
    {
        obj.dir = 3;
        fixDir();
        setType();
    }
}

function setDirDown()
{
    if(isCtrl() === true)
    {
        obj.dir = 4;
        fixDir();
        setType();
    }
}

function setDirZero()
{
    if(isCtrl() === true)
    {
        obj.dir = 0;
        fixDir();
        setType();
    }
}

function setMagLow()
{
    if(isCtrl() === true)
    {
        obj.mag = 1;
        fixMag();
        setType();
    }
}

function setMagMed()
{
    if(isCtrl() === true)
    {
        obj.mag = 2;
        fixMag();
        setType();
    }
}

function setMagHigh()
{
    if(isCtrl() === true)
    {
        obj.mag = 3;
        fixMag();
        setType();
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

function fixSnd()
{
    buttonSndOn.disabled = false;
    buttonSndOff.disabled = false;

    if(snd === true)
    {
        buttonSndOn.disabled = true;
    }

    else if(snd === false)
    {
        buttonSndOff.disabled = true;
    }
}

function fixOwv()
{
    buttonOwvOn.disabled = false;
    buttonOwvOff.disabled = false;

    if(owv === true)
    {
        buttonOwvOn.disabled = true;
    }

    else if(owv === false)
    {
        buttonOwvOff.disabled = true;
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

function doKeyDown(event)
{
    if(event.key.toUpperCase() === "P")
    {
        if(run === true)
        {
            setTimeStop();
        }

        else if(run === false)
        {
            setTimeStrt();
        }
    }

    else if(event.key.toUpperCase() === "S")
    {
        doBufrSave();
    }

    else if(event.key.toUpperCase() === "R")
    {
        doBufrRstr();
    }

    else if(event.key.toUpperCase() === "M")
    {
        if(snd === true)
        {
            setSndOff();
        }

        else if(snd === false)
        {
            setSndOn();
        }
    }

    else if(event.key.toUpperCase() === "O")
    {
        if(owv === true)
        {
            setOwvOff();
        }

        else if(owv === false)
        {
            setOwvOn();
        }
    }

    else if(event.key.toUpperCase() === "C")
    {
        if(obj === src)
        {
            setCtrlObs();
        }

        else if(obj === obs)
        {
            setCtrlSrc();
        }

        else
        {
            setCtrlSrc();
        }
    }

    else if(event.key.toUpperCase() === "T")
    {
        if(isCtrl())
        {
            if(obj.type === 1)
            {
                setTypeAcc();
            }

            else if(obj.type === 2)
            {
                setTypeVel();
            }
        }
    }

    else if(event.key === "ArrowLeft")
    {
        event.preventDefault();
        setDirLeft();
    }

    else if(event.key === "ArrowRight")
    {
        event.preventDefault();
        setDirRght();
    }

    else if(event.key === "ArrowUp")
    {
        event.preventDefault();
        setDirUp();
    }

    else if(event.key === "ArrowDown")
    {
        event.preventDefault();
        setDirDown();
    }

    else if(event.key === "0")
    {
        setDirZero();
    }

    else if(event.key === "1")
    {
        setMagLow();
    }

    else if(event.key === "2")
    {
        setMagMed();
    }

    else if(event.key === "3")
    {
        setMagHigh();
    }
}
