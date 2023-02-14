const btnTimeStrt = document.getElementById("button-time-start");
const btnTimeStop = document.getElementById("button-time-stop");
const btnBufrSave = document.getElementById("button-buffer-save");
const btnBufrRstr = document.getElementById("button-buffer-restore");
const btnSndOn = document.getElementById("button-sound-on");
const btnSndOff = document.getElementById("button-sound-off");
const btnOwvOn = document.getElementById("button-owave-on");
const btnOwvOff = document.getElementById("button-owave-off");
const btnCtrlSrc = document.getElementById("button-control-source");
const btnCtrlObs = document.getElementById("button-control-observer");
const btnTypePos = document.getElementById("button-type-position");
const btnTypeVel = document.getElementById("button-type-velocity");
const btnTypeAcc = document.getElementById("button-type-acceleration");
const btnDirLeft = document.getElementById("button-direction-left");
const btnDirRght = document.getElementById("button-direction-right");
const btnDirUp = document.getElementById("button-direction-up");
const btnDirDown = document.getElementById("button-direction-down");
const btnDirZero = document.getElementById("button-direction-zero");
const btnMagLow = document.getElementById("button-magnitude-low");
const btnMagMed = document.getElementById("button-magnitude-medium");
const btnMagHigh = document.getElementById("button-magnitude-high");
const canvPos = document.getElementById("canvas-position");
const canvFreq = document.getElementById("canvas-frequency");
const canvAmp = document.getElementById("canvas-amplitude");
const canvPrs = document.getElementById("canvas-pressure");

let ctxPos;
let ctxFreq;
let ctxAmp;
let ctxPrs;
let ctxSnd;
let oscl;
let gain;

let time = 0;
let run = true;
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
let prs = [];

for(let t = 0; t < 1000; t++)
{
    wavs[t] = null;
    freqs[t] = null;
    amps[t] = null;
    prs[t] = null;
}

fixTime();
fixBufr();
fixSnd();
fixOwv();
fixCtrl();
fixType();
fixDir();
fixMag();

window.requestAnimationFrame(doDspl);

function doTime()
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
        if(wavs[w] !== null)
        {
            diffs[w] = 0.01 * (time - wavs[w].time) - Math.hypot(obs.pos.x - wavs[w].pos.x, obs.pos.y - wavs[w].pos.y);
        }

        else
        {
            diffs[w] = null;
        }
    }

    let wo = null;

    for(let w = 0; w < 1000; w++)
    {
        if(diffs[w] !== null)
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
        prs[ws] = obs.amp * Math.sin(0.1 * obs.freq * dist - 0.1 * obs.freq * time);
    }
    
    else
    {
        obs.wav = null;
        obs.freq = null;
        obs.amp = null;
        freqs[ws] = null;
        amps[ws] = null;
        prs[ws] = null;
    }

    time += 1;
}

function doDspl()
{
    ctxPos = canvPos.getContext("2d");

    ctxPos.fillStyle = "#000000";
    ctxPos.fillRect(0, 0, 800, 600);

    ctxPos.save();
    ctxPos.translate(400, 300);
    ctxPos.scale(100, -100);

    ctxPos.beginPath();
    ctxPos.arc(obs.pos.x, obs.pos.y, 0.2, 0, 2 * Math.PI);
    ctxPos.fillStyle = "#00ff00";
    ctxPos.fill();

    if(Math.hypot(obs.vel.x, obs.vel.y) > 0.001)
    {
        ctxPos.save();
        ctxPos.translate(obs.pos.x, obs.pos.y);
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0);
        ctxPos.translate(50 * obs.vel.x, 50 * obs.vel.y);
        ctxPos.rotate(Math.atan2(obs.vel.y, obs.vel.x));
        ctxPos.lineTo(0.05, 0);
        ctxPos.lineWidth = 0.05;
        ctxPos.strokeStyle = "#00ff00";
        ctxPos.stroke();
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0.1);
        ctxPos.lineTo(0, -0.1);
        ctxPos.lineTo(0.1, 0);
        ctxPos.closePath();
        ctxPos.fillStyle = "#00ff00";
        ctxPos.fill();
        ctxPos.restore();
    }

    ctxPos.beginPath();
    ctxPos.arc(src.pos.x, src.pos.y, 0.2, 0, 2 * Math.PI);
    ctxPos.fillStyle = "#ff0000";
    ctxPos.fill();

    if(Math.hypot(src.vel.x, src.vel.y) > 0.001)
    {
        ctxPos.save();
        ctxPos.translate(src.pos.x, src.pos.y);
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0);
        ctxPos.translate(50 * src.vel.x, 50 * src.vel.y);
        ctxPos.rotate(Math.atan2(src.vel.y, src.vel.x));
        ctxPos.lineTo(0.05, 0);
        ctxPos.lineWidth = 0.05;
        ctxPos.strokeStyle = "#ff0000";
        ctxPos.stroke();
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0.1);
        ctxPos.lineTo(0, -0.1);
        ctxPos.lineTo(0.1, 0);
        ctxPos.closePath();
        ctxPos.fillStyle = "#ff0000";
        ctxPos.fill();
        ctxPos.restore();
    }

    ctxPos.save();

    for(let w = 0; w < 1000; w += 20)
    {
        if(wavs[w] !== null)
        {
            if(time - wavs[w].time < 500)
            {
                ctxPos.beginPath();
                ctxPos.arc(wavs[w].pos.x, wavs[w].pos.y, 0.01 * (time - wavs[w].time), 0, 2 * Math.PI);
                ctxPos.globalAlpha = Math.min(Math.max(1 - (time - wavs[w].time) / 500, 0), 1);
                ctxPos.lineWidth = 0.03;
                ctxPos.strokeStyle = "#ffffff";
                ctxPos.stroke();
            }
        }
    }

    ctxPos.restore();

    if(isOwv())
    {
        ctxPos.beginPath();
        ctxPos.arc(obs.wav.pos.x, obs.wav.pos.y, 0.01 * (time - obs.wav.time), 0, 2 * Math.PI);
        ctxPos.lineWidth = 0.05;
        ctxPos.strokeStyle = "#ffff00";
        ctxPos.stroke();

        ctxPos.beginPath();
        ctxPos.arc(obs.wav.pos.x, obs.wav.pos.y, 0.05, 0, 2 * Math.PI);
        ctxPos.fillStyle = "#ffff00";
        ctxPos.fill();

        if(Math.hypot(obs.wav.vel.x, obs.wav.vel.y) > 0.001)
        {
            ctxPos.save();
            ctxPos.translate(obs.wav.pos.x, obs.wav.pos.y);
            ctxPos.beginPath();
            ctxPos.lineTo(0, 0);
            ctxPos.translate(50 * obs.wav.vel.x, 50 * obs.wav.vel.y);
            ctxPos.rotate(Math.atan2(obs.wav.vel.y, obs.wav.vel.x));
            ctxPos.lineTo(0.05, 0);
            ctxPos.lineWidth = 0.05;
            ctxPos.strokeStyle = "#ffff00";
            ctxPos.stroke();
            ctxPos.beginPath();
            ctxPos.lineTo(0, 0.1);
            ctxPos.lineTo(0, -0.1);
            ctxPos.lineTo(0.1, 0);
            ctxPos.closePath();
            ctxPos.fillStyle = "#ffff00";
            ctxPos.fill();
            ctxPos.restore();
        }
    }

    ctxPos.restore();

    if(time % 10 === 0)
    {
        ctxFreq = canvFreq.getContext("2d");

        ctxFreq.fillStyle = "#000000";
        ctxFreq.fillRect(0, 0, 800, 200);
    
        ctxFreq.save();
        ctxFreq.scale(200, 200);
        ctxFreq.translate(2, 0.5);
        ctxFreq.scale(-1, -1);
        ctxFreq.translate(-2, -0.5);

        ctxFreq.fillStyle = "#ff0000";
        ctxFreq.fillRect(0, 0, Math.min(4 * time / 1000, 4), 0.25);

        ctxFreq.beginPath();

        for(let f = 0; f < 1000; f++)
        {
            let freq = freqs[(time - f - 1) % 1000];

            if(freq !== null)
            {
                ctxFreq.fillStyle = "#00ff00";
                ctxFreq.fillRect(4 * f / 1000, 0, 8 / 1000, Math.min(0.25 * Math.abs(freq), 1));
            }
        }

        if(isOwv())
        {
            ctxFreq.fillStyle = "#ffff00";
            ctxFreq.fillRect(0, 0, 0.04, Math.min(0.25 * Math.abs(src.freq), 1));
        }

        for(let b = 0; b < 3; b++)
        {
            ctxFreq.fillStyle = "#666666";
            ctxFreq.fillRect(0, (b + 1) / 4, 4, 0.01);
        }

        ctxFreq.restore();
    
        ctxAmp = canvAmp.getContext("2d");

        ctxAmp.fillStyle = "#000000";
        ctxAmp.fillRect(0, 0, 800, 200);
    
        ctxAmp.save();
        ctxAmp.scale(200, 200);
        ctxAmp.translate(2, 0.5);
        ctxAmp.scale(-1, -1);
        ctxAmp.translate(-2, -0.5);
    
        ctxAmp.fillStyle = "#ff0000";
        ctxAmp.fillRect(0, 0, Math.min(4 * time / 1000, 4), 0.8);

        for(let a = 0; a < 1000; a++)
        {
            let amp = amps[(time - a - 1) % 1000];

            if(amp !== null)
            {
                ctxAmp.fillStyle = "#00ff00";
                ctxAmp.fillRect(4 * a / 1000, 0, 8 / 1000, 0.8 * amp);
            }
        }

        if(isOwv())
        {
            ctxAmp.fillStyle = "#ffff00";
            ctxAmp.fillRect(0, 0, 0.04, 0.8 * obs.amp);
        }

        for(let b = 0; b < 4; b++)
        {
            ctxAmp.fillStyle = "#666666";
            ctxAmp.fillRect(0, 0.8 * (b + 1) / 4, 4, 0.01);
        }

        ctxAmp.restore();

        ctxPrs = canvPrs.getContext("2d");

        ctxPrs.fillStyle = "#000000";
        ctxPrs.fillRect(0, 0, 800, 200);

        ctxPrs.save();
        ctxPrs.scale(200, 200);
        ctxPrs.translate(2, 0.5);
        ctxPrs.scale(-1, -1);
        ctxPrs.translate(-2, -0.5);

        for(let p = 0; p < 1000; p++)
        {
            let pr = prs[(time - p - 1) % 1000];

            if(pr !== null)
            {
                ctxPrs.fillStyle = "#00ff00";
                ctxPrs.fillRect(4 * p / 1000, 0, 8 / 1000, 0.5 + 0.4 * pr);
            }
        }

        ctxPrs.restore();
    }

    if(snd === true)
    {
        setSnd();
    }

    if(run === true)
    {
        doTime();
    }

    window.requestAnimationFrame(doDspl);
}

btnTimeStrt.onclick = settimeStrt;
btnTimeStop.onclick = settimeStop;
btnBufrSave.onclick = doBufrSave;
btnBufrRstr.onclick = doBufrRstr;
btnSndOn.onclick = setSndOn;
btnSndOff.onclick = setSndOff;
btnOwvOn.onclick = setOwvOn;
btnOwvOff.onclick = setOwvOff;
btnCtrlSrc.onclick = setCtrlSrc;
btnCtrlObs.onclick = setCtrlObs;
btnTypePos.onclick = setTypePos;
btnTypeVel.onclick = setTypeVel;
btnTypeAcc.onclick = setTypeAcc;
btnDirLeft.onclick = setDirLeft;
btnDirRght.onclick = setDirRght;
btnDirUp.onclick = setDirUp;
btnDirDown.onclick = setDirDown;
btnDirZero.onclick = setDirZero;
btnMagLow.onclick = setMagLow;
btnMagMed.onclick = setMagMed;
btnMagHigh.onclick = setMagHigh;

function settimeStrt()
{
    run = true;
    fixTime();
}

function settimeStop()
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
        if(wavs[w] !== null)
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

        else
        {
            bufr.wavs[w] = null;
        }
    }

    bufr.freqs = [];

    for(let f = 0; f < 1000; f++)
    {
        if(freqs[f] !== null)
        {
            bufr.freqs[f] = freqs[f];
        }

        else
        {
            bufr.freqs[f] = null;
        }
    }

    bufr.amps = [];

    for(let a = 0; a < 1000; a++)
    {
        if(amps[a] !== null)
        {
            bufr.amps[a] = amps[a];
        }

        else
        {
            bufr.amps[a] = null;
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
            if(bufr.wavs[w] !== null)
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
                wavs[w] = null;
            }
        }
    
        for(let f = 0; f < 1000; f++)
        {
            if(bufr.freqs[f] !== null)
            {
                freqs[f] = bufr.freqs[f];
            }

            else
            {
                freqs[f] = null;
            }
        }
    
        for(let a = 0; a < 1000; a++)
        {
            if(bufr.amps[a] !== null)
            {
                amps[a] = bufr.amps[a];
            }

            else
            {
                amps[a] = null;
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
        ctxSnd = new window.AudioContext();
        oscl = ctxSnd.createOscillator();
        oscl.type = "sawtooth";
        gain = ctxSnd.createGain();
        oscl.connect(gain);
        gain.connect(ctxSnd.destination);
        oscl.start();
    }

    snd = true;
    setSnd();
    fixSnd();
}

function setSndOff()
{
    if(snd === true)
    {
        oscl.stop();
    }

    snd = false;
    fixSnd();
}

function setSnd()
{
    if(snd === true)
    {
        if(run === true && obs.freq !== null && obs.amp !== null)
        {
            oscl.frequency.value = Math.min(Math.max(1000 * Math.abs(obs.freq), 1), 3000);
            gain.gain.value = 0.2 * obs.amp;
        }
        
        else
        {
            oscl.frequency.value = 0;
            gain.gain.value = 0;
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

    if(src.type === 0)
    {
        setTypePos();
    }

    else if(src.type === 1)
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

    if(obs.type === 0)
    {
        setTypePos();
    }

    else if(obs.type === 1)
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
    return (isCtrlSrc() || isCtrlObs());
}

function isCtrlSrc()
{
    return (obj === src);
}

function isCtrlObs()
{
    return (obj === obs);
}

function setTypePos()
{
    if(isCtrl() === true)
    {
        obj.type = 0;
        fixType();
        setType();
    }
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
            if(obj.type === 0)
            {
                if(obj.dir === 0)
                {
                    obj.pos.x = 0;
                    obj.pos.y = 0;
                }

                else if(obj.dir === 1)
                {
                    obj.pos.x = -obj.mag;
                    obj.pos.y = 0;
                }

                else if(obj.dir === 2)
                {
                    obj.pos.x = obj.mag;
                    obj.pos.y = 0;
                }

                else if(obj.dir === 3)
                {
                    obj.pos.x = 0;
                    obj.pos.y = obj.mag;
                }

                else if(obj.dir === 4)
                {
                    obj.pos.x = 0;
                    obj.pos.y = -obj.mag;
                }

                obj.vel.x = 0;
                obj.vel.y = 0;
                obj.acc.x = 0;
                obj.acc.y = 0;
            }

            else if(obj.type === 1)
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
    btnTimeStrt.disabled = false;
    btnTimeStop.disabled = false;

    if(run === true)
    {
        btnTimeStrt.disabled = true;
    }

    else if(run === false)
    {
        btnTimeStop.disabled = true;
    }
}

function fixBufr()
{
    btnBufrRstr.disabled = false;

    if(bufr === null)
    {
        btnBufrRstr.disabled = true;
    }
}

function fixSnd()
{
    btnSndOn.disabled = false;
    btnSndOff.disabled = false;

    if(snd === true)
    {
        btnSndOn.disabled = true;
    }

    else if(snd === false)
    {
        btnSndOff.disabled = true;
    }
}

function fixOwv()
{
    btnOwvOn.disabled = false;
    btnOwvOff.disabled = false;

    if(owv === true)
    {
        btnOwvOn.disabled = true;
    }

    else if(owv === false)
    {
        btnOwvOff.disabled = true;
    }
}

function fixCtrl()
{
    btnCtrlSrc.disabled = false;
    btnCtrlObs.disabled = false;

    if(isCtrlSrc())
    {
        btnCtrlSrc.disabled = true;
    }

    else if(isCtrlObs())
    {
        btnCtrlObs.disabled = true;
    }
}

function fixType()
{
    if(isCtrl())
    {
        btnTypePos.disabled = false;
        btnTypeVel.disabled = false;
        btnTypeAcc.disabled = false;

        if(obj.type === 0)
        {
            btnTypePos.disabled = true;
        }

        else if(obj.type === 1)
        {
            btnTypeVel.disabled = true;
        }
    
        else if(obj.type === 2)
        {
            btnTypeAcc.disabled = true;
        }
    }

    else
    {
        btnTypePos.disabled = true;
        btnTypeVel.disabled = true;
        btnTypeAcc.disabled = true;
    }
}

function fixDir()
{
    if(isCtrl())
    {
        btnDirLeft.disabled = false;
        btnDirRght.disabled = false;
        btnDirUp.disabled = false;
        btnDirDown.disabled = false;
        btnDirZero.disabled = false;

        if(obj.dir === 0)
        {
            btnDirZero.disabled = true;
        }
    
        else if(obj.dir === 1)
        {
            btnDirLeft.disabled = true;
        }
    
        else if(obj.dir === 2)
        {
            btnDirRght.disabled = true;
        }
    
        else if(obj.dir === 3)
        {
            btnDirUp.disabled = true;
        }
    
        else if(obj.dir === 4)
        {
            btnDirDown.disabled = true;
        }
    }

    else
    {
        btnDirZero.disabled = true;
        btnDirLeft.disabled = true;
        btnDirRght.disabled = true;
        btnDirUp.disabled = true;
        btnDirDown.disabled = true;
    }
}

function fixMag()
{
    if(isCtrl())
    {
        btnMagLow.disabled = false;
        btnMagMed.disabled = false;
        btnMagHigh.disabled = false;

        if(obj.mag === 1)
        {
            btnMagLow.disabled = true;
        }
    
        else if(obj.mag === 2)
        {
            btnMagMed.disabled = true;
        }
    
        else if(obj.mag === 3)
        {
            btnMagHigh.disabled = true;
        }
    }

    else
    {
        btnMagLow.disabled = true;
        btnMagMed.disabled = true;
        btnMagHigh.disabled = true;
    }
}

window.onkeydown = doKeyDown;

function doKeyDown(event)
{
    if(event.repeat)
    {
        return;
    }

    if(event.key.toUpperCase() === "P")
    {
        if(run === true)
        {
            settimeStop();
        }

        else if(run === false)
        {
            settimeStrt();
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
        if(isCtrlSrc())
        {
            setCtrlObs();
        }

        else if(isCtrlObs())
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
            if(obj.type === 0)
            {
                setTypeVel();
            }

            else if(obj.type === 1)
            {
                setTypeAcc();
            }

            else if(obj.type === 2)
            {
                setTypePos();
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
