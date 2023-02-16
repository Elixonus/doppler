const btnTimeStrt = document.getElementById("button-time-start");
const btnTimeStop = document.getElementById("button-time-stop");
const btnBufrSave = document.getElementById("button-buffer-save");
const btnBufrRstr = document.getElementById("button-buffer-restore");
const btnFmodFlat = document.getElementById("button-fmod-flat");
const btnFmodSquare = document.getElementById("button-fmod-square");
const btnFmodSweep = document.getElementById("button-fmod-sweep");
const btnFmodTriangle = document.getElementById("button-fmod-triangle");
const btnFmodSine = document.getElementById("button-fmod-sine");
const btnSndOn = document.getElementById("button-sound-on");
const btnSndOff = document.getElementById("button-sound-off");
const btnTwavOn = document.getElementById("button-twave-on");
const btnTwavOff = document.getElementById("button-twave-off");
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

let ctxPos = null;
let ctxFreq = null;
let ctxAmp = null;
let ctxSnd = null;
let oscl = null;
let gain = null;

let frm = 0;
let time = 0;
let run = true;
let bufr = null;
let fmod = 0;
let snd = false;
let twav = false;
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
let freqh = {src: [], obs: []};
let amph = {src: [], obs: []};

for(let t = 0; t < 150; t++)
{
    wavs[t] = null;
    freqh.src[t] = null;
    freqh.obs[t] = null;
    amph.src[t] = null;
    amph.obs[t] = null;
}

fixTime();
fixBufr();
fixFmod();
fixSnd();
fixTwav();
fixCtrl();
fixType();
fixDir();
fixMag();

window.requestAnimationFrame(doView);

window.setInterval(function()
{
    if(run === true)
    {
        setFmod();
        doTime();
    }
}, 1000 / 20);

window.setInterval(function()
{
    if(snd === true)
    {
        setSnd();
    }
}, 1000 / 100);

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

    let ws = time % 150;

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

    freqh.src[ws] = src.freq;
    amph.src[ws] = src.amp;

    let diffs = [];

    for(let w = 0; w < 150; w++)
    {
        if(wavs[w] !== null)
        {
            diffs[w] = 0.03 * (time - wavs[w].time) - Math.hypot(obs.pos.x - wavs[w].pos.x, obs.pos.y - wavs[w].pos.y);
        }

        else
        {
            diffs[w] = null;
        }
    }

    let wo = null;

    for(let w = 0; w < 150; w++)
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
        let svel = (obs.wav.vel.x * (obs.wav.pos.x - obs.pos.x) + obs.wav.vel.y * (obs.wav.pos.y - obs.pos.y)) / dist;

        if(isNaN(svel))
        {
            svel = 0;
        }

        let ovel = (obs.vel.x * (obs.pos.x - obs.wav.pos.x) + obs.vel.y * (obs.pos.y - obs.wav.pos.y)) / dist;

        if(isNaN(ovel))
        {
            ovel = 0;
        }

        obs.freq = obs.wav.freq * (0.03 - ovel) / (0.03 + svel);

        if(isNaN(obs.freq))
        {
            obs.freq = obs.wav.freq;
        }

        obs.amp = obs.wav.amp * Math.pow(0.99, time - obs.wav.time);
    }
    
    else
    {
        obs.wav = null;
        obs.freq = null;
        obs.amp = null;
    }

    freqh.obs[ws] = obs.freq;
    amph.obs[ws] = obs.amp;

    time++;
}

function doView()
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
        ctxPos.translate(30 * obs.vel.x, 30 * obs.vel.y);
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
        ctxPos.translate(30 * src.vel.x, 30 * src.vel.y);
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

    for(let w = 0; w < 150; w += 10)
    {
        if(wavs[w] !== null)
        {
            if(time - wavs[w].time < 150)
            {
                ctxPos.beginPath();
                ctxPos.arc(wavs[w].pos.x, wavs[w].pos.y, 0.03 * (time - wavs[w].time), 0, 2 * Math.PI);
                ctxPos.globalAlpha = Math.min(Math.max(1 - (time - wavs[w].time) / 150, 0), 1);
                ctxPos.lineWidth = 0.03;
                ctxPos.strokeStyle = "#ffffff";
                ctxPos.stroke();
            }
        }
    }

    ctxPos.restore();

    if(isTwav())
    {
        ctxPos.beginPath();
        ctxPos.arc(obs.wav.pos.x, obs.wav.pos.y, 0.03 * (time - obs.wav.time), 0, 2 * Math.PI);
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
            ctxPos.translate(30 * obs.wav.vel.x, 30 * obs.wav.vel.y);
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

    if(frm % 50 === 0)
    {
        window.requestAnimationFrame(doPlot);
    }

    frm++;
    
    window.requestAnimationFrame(doView);
}

function doPlot()
{
    ctxFreq = canvFreq.getContext("2d");

    ctxFreq.fillStyle = "#000000";
    ctxFreq.fillRect(0, 0, 800, 200);

    ctxFreq.save();
    ctxFreq.scale(200, 200);
    ctxFreq.translate(2, 0.5);
    ctxFreq.scale(-1, -1);
    ctxFreq.translate(-2, -0.5);

    for(let f = 0; f < 150; f++)
    {
        let freq = freqh.src[(time - f - 1) % 150];

        if(freq !== null)
        {
            ctxFreq.fillStyle = "#ff0000";
            ctxFreq.fillRect(4 * f / 150, 0, 2 * 4 / 150, Math.min(0.25 * Math.abs(freq), 1));
        }
    }

    for(let f = 0; f < 150; f++)
    {
        let freq = freqh.obs[(time - f - 1) % 150];

        if(freq !== null)
        {
            ctxFreq.fillStyle = "#00ff00";
            ctxFreq.fillRect(4 * f / 150, 0, 2 * 4 / 150, Math.min(0.25 * Math.abs(freq), 1));
        }
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

    for(let a = 0; a < 150; a++)
    {
        let amp = amph.src[(time - a - 1) % 150];

        if(amp !== null)
        {
            ctxAmp.fillStyle = "#ff0000";
            ctxAmp.fillRect(4 * a / 150, 0, 8 / 150, 0.8 * amp);
        }
    }

    for(let a = 0; a < 150; a++)
    {
        let amp = amph.obs[(time - a - 1) % 150];

        if(amp !== null)
        {
            ctxAmp.fillStyle = "#00ff00";
            ctxAmp.fillRect(4 * a / 150, 0, 8 / 150, 0.8 * amp);
        }
    }

    for(let b = 0; b < 4; b++)
    {
        ctxAmp.fillStyle = "#666666";
        ctxAmp.fillRect(0, 0.8 * (b + 1) / 4, 4, 0.01);
    }

    ctxAmp.restore();
}

btnTimeStrt.onclick = setTimeStrt;
btnTimeStop.onclick = setTimeStop;
btnBufrSave.onclick = doBufrSave;
btnBufrRstr.onclick = doBufrRstr;
btnFmodFlat.onclick = setFmodFlat;
btnFmodSquare.onclick = setFmodSquare;
btnFmodSweep.onclick = setFmodSweep;
btnFmodTriangle.onclick = setFmodTriangle;
btnFmodSine.onclick = setFmodSine;
btnSndOn.onclick = setSndOn;
btnSndOff.onclick = setSndOff;
btnTwavOn.onclick = setTwavOn;
btnTwavOff.onclick = setTwavOff;
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

function setTimeStrt()
{
    run = true;
    fixTime();
}

function setTimeStop()
{
    run = false;
    fixTime();
    setSnd();
}

function doBufrSave()
{
    bufr = {};
    bufr.run = false;
    bufr.time = time;
    bufr.fmod = fmod;
    bufr.obj = null;

    bufr.src = {
        w: wavs.indexOf(src.wav),
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
        w: wavs.indexOf(obs.wav),
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

    for(let w = 0; w < 150; w++)
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

    bufr.freqh = {src: [], obs: []};

    for(let f = 0; f < 150; f++)
    {
        if(freqh.src[f] !== null)
        {
            bufr.freqh.src[f] = freqh.src[f];
        }

        else
        {
            bufr.freqh.src[f] = null;
        }

        if(freqh.obs[f] !== null)
        {
            bufr.freqh.obs[f] = freqh.obs[f];
        }

        else
        {
            bufr.freqh.obs[f] = null;
        }
    }

    bufr.amph = {src: [], obs: []};

    for(let a = 0; a < 150; a++)
    {
        if(amph.src[a] !== null)
        {
            bufr.amph.src[a] = amph.src[a];
        }

        else
        {
            bufr.amph.src[a] = null;
        }

        if(amph.obs[a] !== null)
        {
            bufr.amph.obs[a] = amph.obs[a];
        }

        else
        {
            bufr.amph.obs[a] = null;
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
        fmod = bufr.fmod;
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
    
        for(let w = 0; w < 150; w++)
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

        if(bufr.src.w >= 0)
        {
            src.wav = wavs[bufr.src.w];
        }

        else
        {
            src.wav = null;
        }

        if(bufr.obs.w >= 0)
        {
            obs.wav = wavs[bufr.obs.w];
        }

        else
        {
            obs.wav = null;
        }

        for(let f = 0; f < 150; f++)
        {
            if(bufr.freqh.src[f] !== null)
            {
                freqh.src[f] = bufr.freqh.src[f];
            }

            else
            {
                freqh.src[f] = null;
            }

            if(bufr.freqh.obs[f] !== null)
            {
                freqh.obs[f] = bufr.freqh.obs[f];
            }

            else
            {
                freqh.obs[f] = null;
            }
        }
    
        for(let a = 0; a < 150; a++)
        {
            if(bufr.amph.src[a] !== null)
            {
                amph.src[a] = bufr.amph.src[a];
            }

            else
            {
                amph.src[a] = null;
            }

            if(bufr.amph.obs[a] !== null)
            {
                amph.obs[a] = bufr.amph.obs[a];
            }

            else
            {
                amph.obs[a] = null;
            }
        }

        fixTime();
        fixFmod();
        fixCtrl();
        fixType();
        fixDir();
        fixMag();
    }
}

function setFmodFlat()
{
    fmod = 0;
    fixFmod();
}

function setFmodSquare()
{
    fmod = 1;
    fixFmod();
}

function setFmodSweep()
{
    fmod = 2;
    fixFmod();
}

function setFmodTriangle()
{
    fmod = 3;
    fixFmod();
}

function setFmodSine()
{
    fmod = 4;
    fixFmod();
}

function setFmod()
{
    let prd = 50;
    let phs = time % prd;

    if(fmod === 0)
    {
        src.freq = 1;
    }

    else if(fmod === 1)
    {
        if(phs / prd < 0.5)
        {
            src.freq = 0.5;
        }

        else
        {
            src.freq = 1.5;
        }
    }

    else if(fmod === 2)
    {
        src.freq = 0.5 + phs / prd;
    }

    else if(fmod === 3)
    {
        src.freq = 0.5 + Math.abs(2 * phs / prd - 1);
    }

    else if(fmod === 4)
    {
        src.freq = 1 + 0.5 * Math.sin(2 * Math.PI * phs / prd);
    }
}

function setSndOn()
{
    let temp = snd;
    snd = true;
    fixSnd();

    if(temp === false)
    {
        ctxSnd = new window.AudioContext();
        oscl = ctxSnd.createOscillator();
        oscl.type = "sawtooth";
        gain = ctxSnd.createGain();
        setSnd();
        oscl.connect(gain);
        gain.connect(ctxSnd.destination);
        oscl.start();
    }
}

function setSndOff()
{
    let temp = snd;
    snd = false;
    fixSnd();

    if(temp === true)
    {
        oscl.stop();
        oscl.disconnect();
        gain.disconnect();
        ctxSnd.close();
    }
}

function setSnd()
{
    if(snd === true)
    {
        if(run === true && obs.freq !== null && obs.amp !== null)
        {
            oscl.frequency.value = Math.min(Math.max(1000 * Math.abs(obs.freq), 50), 3000);
            gain.gain.value = 0.2 * obs.amp;
        }
        
        else
        {
            oscl.frequency.value = 0;
            gain.gain.value = 0;
        }
    }
}

function setTwavOn()
{
    twav = true;
    fixTwav();
}

function setTwavOff()
{
    twav = false;
    fixTwav();
}

function isTwav()
{
    return (twav === true && obs.wav !== null && time - obs.wav.time < 500);
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
                    obj.vel.x = -0.008 * obj.mag;
                    obj.vel.y = 0;
                }

                else if(obj.dir === 2)
                {
                    obj.vel.x = 0.008 * obj.mag;
                    obj.vel.y = 0;
                }

                else if(obj.dir === 3)
                {
                    obj.vel.x = 0;
                    obj.vel.y = 0.008 * obj.mag;
                }

                else if(obj.dir === 4)
                {
                    obj.vel.x = 0;
                    obj.vel.y = -0.008 * obj.mag;
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

function fixFmod()
{
    btnFmodFlat.disabled = false;
    btnFmodSquare.disabled = false;
    btnFmodSweep.disabled = false;
    btnFmodTriangle.disabled = false;
    btnFmodSine.disabled = false;

    if(fmod === 0)
    {
        btnFmodFlat.disabled = true;
    }

    else if(fmod === 1)
    {
        btnFmodSquare.disabled = true;
    }

    else if(fmod === 2)
    {
        btnFmodSweep.disabled = true;
    }

    else if(fmod === 3)
    {
        btnFmodTriangle.disabled = true;
    }

    else if(fmod === 4)
    {
        btnFmodSine.disabled = true;
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

function fixTwav()
{
    btnTwavOn.disabled = false;
    btnTwavOff.disabled = false;

    if(twav === true)
    {
        btnTwavOn.disabled = true;
    }

    else if(twav === false)
    {
        btnTwavOff.disabled = true;
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
        event.preventDefault();
        return;
    }

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

    else if(event.key.toUpperCase() === "W")
    {
        if(twav === true)
        {
            setTwavOff();
        }

        else if(twav === false)
        {
            setTwavOn();
        }
    }

    else if(event.key.toUpperCase() === "F")
    {
        if(fmod === 0)
        {
            setFmodSquare();
        }

        else if(fmod === 1)
        {
            setFmodSweep();
        }

        else if(fmod === 2)
        {
            setFmodTriangle();
        }

        else if(fmod === 3)
        {
            setFmodSine();
        }

        else if(fmod === 4)
        {
            setFmodFlat();
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
