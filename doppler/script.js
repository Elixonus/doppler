const n = 100;
const s = 0.05;

let time = 0;
let view = 0;
let plot = 0;

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

for (let t = 0; t < n; t++) {
    wavs[t] = null;

    freqh.src[t] = null;
    freqh.obs[t] = null;
    amph.src[t] = null;
    amph.obs[t] = null;
}

let ctxSnd = null;
let oscl = null;
let gain = null;

window.setInterval(doLgc, 50);

function doLgc() {
    if (run === true) {
        setFmod();
        doTime();
    }

    if (snd === true) {
        setSnd();
    }
}

function doTime() {
    src.vel.x += src.acc.x;
    src.vel.y += src.acc.y;
    src.pos.x += src.vel.x;
    src.pos.y += src.vel.y;

    obs.vel.x += obs.acc.x;
    obs.vel.y += obs.acc.y;
    obs.pos.x += obs.vel.x;
    obs.pos.y += obs.vel.y;

    for (let w = 0; w < wavs.length; w++) {
        if (wavs[w] !== null) {
            wavs[w].amp *= 1 - 0.01;
        }
    }

    let ws = time % n;

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

    for (let w = 0; w < n; w++) {
        if (wavs[w] !== null) {
            diffs[w] = s * (time - wavs[w].time) - Math.hypot(obs.pos.x - wavs[w].pos.x, obs.pos.y - wavs[w].pos.y);
        } else {
            diffs[w] = null;
        }
    }

    let wo = null;

    for (let w = 0; w < n; w++) {
        if (diffs[w] !== null) {
            if ((wo === null || diffs[w] < diffs[wo]) && diffs[w] > 0) {
                wo = w;
            }
        }
    }

    if (wo !== null) {
        obs.wav = wavs[wo];
    } else {
        obs.wav = null;
    }

    if (obs.wav !== null) {
        let dist = Math.hypot(obs.wav.pos.x - obs.pos.x, obs.wav.pos.y - obs.pos.y);
        let svel = (obs.wav.vel.x * (obs.wav.pos.x - obs.pos.x) + obs.wav.vel.y * (obs.wav.pos.y - obs.pos.y)) / dist;

        if (isNaN(svel)) {
            svel = 0;
        }

        let ovel = (obs.vel.x * (obs.pos.x - obs.wav.pos.x) + obs.vel.y * (obs.pos.y - obs.wav.pos.y)) / dist;

        if (isNaN(ovel)) {
            ovel = 0;
        }

        obs.freq = obs.wav.freq * (s - ovel) / (s + svel);

        if (isNaN(obs.freq)) {
            obs.freq = null;
        }

        obs.amp = obs.wav.amp;

        if (isNaN(obs.amp)) {
            obs.amp = null;
        }

    } else {
        obs.freq = null;
        obs.amp = null;
    }

    freqh.obs[ws] = obs.freq;
    amph.obs[ws] = obs.amp;

    time++;
}

const canvPos = document.getElementById("canvas-position");
const canvFreq = document.getElementById("canvas-frequency");
const canvAmp = document.getElementById("canvas-amplitude");

let ctxPos = null;
let ctxFreq = null;
let ctxAmp = null;

window.requestAnimationFrame(doAnim);

function doAnim() {
    doView();

    if (view % 10 === 1) {
        doPlot();
    }

    window.requestAnimationFrame(doAnim);
}

function doView() {
    ctxPos = canvPos.getContext("2d", {alpha: false});

    ctxPos.clearRect(0, 0, 800, 600);

    ctxPos.save();
    ctxPos.scale(100, 100);
    ctxPos.translate(4, 3);
    ctxPos.scale(1, -1);

    ctxPos.beginPath();
    ctxPos.arc(obs.pos.x, obs.pos.y, 0.2, 0, 2 * Math.PI);
    ctxPos.fillStyle = "#0f0";
    ctxPos.fill();

    if (Math.hypot(obs.vel.x, obs.vel.y) > 0.001) {
        ctxPos.save();

        ctxPos.translate(obs.pos.x, obs.pos.y);
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0);
        ctxPos.translate(15 * obs.vel.x, 15 * obs.vel.y);
        ctxPos.rotate(Math.atan2(obs.vel.y, obs.vel.x));
        ctxPos.lineTo(0.05, 0);
        ctxPos.lineWidth = 0.05;
        ctxPos.strokeStyle = "#0f0";
        ctxPos.stroke();
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0.1);
        ctxPos.lineTo(0, -0.1);
        ctxPos.lineTo(0.1, 0);
        ctxPos.closePath();
        ctxPos.fillStyle = "#0f0";
        ctxPos.fill();

        ctxPos.restore();
    }

    ctxPos.beginPath();
    ctxPos.arc(src.pos.x, src.pos.y, 0.2, 0, 2 * Math.PI);
    ctxPos.fillStyle = "#f00";
    ctxPos.fill();

    if (Math.hypot(src.vel.x, src.vel.y) > 0.001) {
        ctxPos.save();

        ctxPos.translate(src.pos.x, src.pos.y);
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0);
        ctxPos.translate(15 * src.vel.x, 15 * src.vel.y);
        ctxPos.rotate(Math.atan2(src.vel.y, src.vel.x));
        ctxPos.lineTo(0.05, 0);
        ctxPos.lineWidth = 0.05;
        ctxPos.strokeStyle = "#f00";
        ctxPos.stroke();
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0.1);
        ctxPos.lineTo(0, -0.1);
        ctxPos.lineTo(0.1, 0);
        ctxPos.closePath();
        ctxPos.fillStyle = "#f00";
        ctxPos.fill();

        ctxPos.restore();
    }

    ctxPos.save();

    for (let w = 0; w < n; w += 10) {
        if (wavs[w] !== null) {
            if (time - wavs[w].time < n) {
                ctxPos.beginPath();
                ctxPos.arc(wavs[w].pos.x, wavs[w].pos.y, s * (time - wavs[w].time), 0, 2 * Math.PI);
                ctxPos.globalAlpha = Math.min(Math.max(1 - (time - wavs[w].time) / n, 0), 1);
                ctxPos.lineWidth = 0.03;
                ctxPos.strokeStyle = "#fff";
                ctxPos.stroke();
            }
        }
    }

    ctxPos.restore();

    if (twav === true && obs.wav !== null) {
        ctxPos.beginPath();
        ctxPos.arc(obs.wav.pos.x, obs.wav.pos.y, s * (time - obs.wav.time), 0, 2 * Math.PI);
        ctxPos.lineWidth = 0.05;
        ctxPos.strokeStyle = "#ff0";
        ctxPos.stroke();

        ctxPos.beginPath();
        ctxPos.arc(obs.wav.pos.x, obs.wav.pos.y, 0.05, 0, 2 * Math.PI);
        ctxPos.fillStyle = "#ff0";
        ctxPos.fill();

        if (Math.hypot(obs.wav.vel.x, obs.wav.vel.y) > 0.001) {
            ctxPos.save();

            ctxPos.translate(obs.wav.pos.x, obs.wav.pos.y);
            ctxPos.beginPath();
            ctxPos.lineTo(0, 0);
            ctxPos.translate(15 * obs.wav.vel.x, 15 * obs.wav.vel.y);
            ctxPos.rotate(Math.atan2(obs.wav.vel.y, obs.wav.vel.x));
            ctxPos.lineTo(0.05, 0);
            ctxPos.lineWidth = 0.05;
            ctxPos.strokeStyle = "#ff0";
            ctxPos.stroke();
            ctxPos.beginPath();
            ctxPos.lineTo(0, 0.1);
            ctxPos.lineTo(0, -0.1);
            ctxPos.lineTo(0.1, 0);
            ctxPos.closePath();
            ctxPos.fillStyle = "#ff0";
            ctxPos.fill();

            ctxPos.restore();
        }
    }

    ctxPos.restore();

    view++;
}

function doPlot() {
    ctxFreq = canvFreq.getContext("2d", {alpha: false});

    ctxFreq.clearRect(0, 0, 800, 200);

    ctxFreq.save();
    ctxFreq.scale(800, 200);
    ctxFreq.translate(0.5, 0.5);
    ctxFreq.scale(-1, -1);
    ctxFreq.translate(-0.5, -0.5);

    ctxFreq.beginPath();

    for (let f = 0; f < n; f++) {
        let freq = freqh.src[((time - f - 1) + n) % n];

        if (freq === null) {
            freq = 0;
        }

        ctxFreq.lineTo(f / (n - 1), Math.min(0.25 * Math.abs(freq), 1));
    }

    ctxFreq.lineTo(1, 0);
    ctxFreq.lineTo(0, 0);
    ctxFreq.closePath();
    ctxFreq.fillStyle = "#f00";
    ctxFreq.fill();

    ctxFreq.beginPath();

    for (let f = 0; f < n; f++) {
        let freq = freqh.obs[((time - f - 1) + n) % n];

        if (freq === null) {
            freq = 0;
        }

        ctxFreq.lineTo(f / (n - 1), Math.min(0.25 * Math.abs(freq), 1));
    }

    ctxFreq.lineTo(1, 0);
    ctxFreq.lineTo(0, 0);
    ctxFreq.closePath();
    ctxFreq.fillStyle = "#0f0";
    ctxFreq.fill();

    if (twav === true && obs.wav !== null) {
        ctxFreq.fillStyle = "#ff0";
        ctxFreq.fillRect(0, Math.min(0.25 * Math.abs(obs.wav.freq), 1), 1, 0.025);
    }

    for (let b = 1; b < 4; b++) {
        ctxFreq.fillStyle = "#ddd";
        ctxFreq.fillRect(0, b / 4, 1, 0.01);
    }

    ctxFreq.restore();

    ctxAmp = canvAmp.getContext("2d", {alpha: false});

    ctxAmp.clearRect(0, 0, 800, 200);

    ctxAmp.save();
    ctxAmp.scale(800, 200);
    ctxAmp.translate(0.5, 0.5);
    ctxAmp.scale(-1, -1);
    ctxAmp.translate(-0.5, -0.5);

    ctxAmp.beginPath();

    for (let a = 0; a < n; a++) {
        let amp = amph.src[((time - a - 1) + n) % n];

        if (amp === null) {
            amp = 0;
        }

        ctxAmp.lineTo(a / (n - 1), 0.8 * amp);
    }

    ctxAmp.lineTo(1, 0);
    ctxAmp.lineTo(0, 0);
    ctxAmp.closePath();
    ctxAmp.fillStyle = "#f00";
    ctxAmp.fill();

    ctxAmp.beginPath();

    for (let a = 0; a < n; a++) {
        let amp = amph.obs[((time - a - 1) + n) % n];

        if (amp === null) {
            amp = 0;
        }

        ctxAmp.lineTo(a / (n - 1), 0.8 * amp);
    }

    ctxAmp.lineTo(1, 0);
    ctxAmp.lineTo(0, 0);
    ctxAmp.closePath();
    ctxAmp.fillStyle = "#0f0";
    ctxAmp.fill();

    if (twav === true && obs.wav !== null) {
        ctxAmp.fillStyle = "#ff0";
        ctxAmp.fillRect(0, 0.8 * obs.wav.amp, 1, 0.025);
    }

    for (let b = 1; b < 5; b++) {
        ctxAmp.fillStyle = "#ddd";
        ctxAmp.fillRect(0, 0.8 * b / 4, 1, 0.01);
    }

    ctxAmp.restore();

    plot++;
}

const btnTimeStrt = document.getElementById("button-time-start");
const btnTimeStop = document.getElementById("button-time-stop");
const btnBufrSave = document.getElementById("button-buffer-save");
const btnBufrRstr = document.getElementById("button-buffer-restore");
const btnFmodFlt = document.getElementById("button-fmod-flat");
const btnFmodSqr = document.getElementById("button-fmod-square");
const btnFmodSwp = document.getElementById("button-fmod-sweep");
const btnFmodTrg = document.getElementById("button-fmod-triangle");
const btnFmodSin = document.getElementById("button-fmod-sine");
const btnSndOn = document.getElementById("button-sound-on");
const btnSndOff = document.getElementById("button-sound-off");
const btnTwavShow = document.getElementById("button-twave-show");
const btnTwavHide = document.getElementById("button-twave-hide");
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

btnTimeStrt.onclick = setTimeStrt;
btnTimeStop.onclick = setTimeStop;
btnBufrSave.onclick = doBufrSave;
btnBufrRstr.onclick = doBufrRstr;
btnFmodFlt.onclick = setFmodFlt;
btnFmodSqr.onclick = setFmodSqr;
btnFmodSwp.onclick = setFmodSwp;
btnFmodTrg.onclick = setFmodTrg;
btnFmodSin.onclick = setFmodSin;
btnSndOn.onclick = setSndOn;
btnSndOff.onclick = setSndOff;
btnTwavShow.onclick = setTwavShow;
btnTwavHide.onclick = setTwavHide;
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

function setTimeStrt() {
    run = true;
    fixTime();
}

function setTimeStop() {
    run = false;
    fixTime();
}

function doBufrSave() {
    bufr = {};
    bufr.run = false;
    bufr.time = time;
    bufr.fmod = fmod;
    bufr.obj = obj;

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

    for (let w = 0; w < n; w++) {
        if (wavs[w] !== null) {
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
        } else {
            bufr.wavs[w] = null;
        }
    }

    bufr.freqh = {src: [], obs: []};

    for (let f = 0; f < n; f++) {
        if (freqh.src[f] !== null) {
            bufr.freqh.src[f] = freqh.src[f];
        } else {
            bufr.freqh.src[f] = null;
        }

        if (freqh.obs[f] !== null) {
            bufr.freqh.obs[f] = freqh.obs[f];
        } else {
            bufr.freqh.obs[f] = null;
        }
    }

    bufr.amph = {src: [], obs: []};

    for (let a = 0; a < n; a++) {
        if (amph.src[a] !== null) {
            bufr.amph.src[a] = amph.src[a];
        } else {
            bufr.amph.src[a] = null;
        }

        if (amph.obs[a] !== null) {
            bufr.amph.obs[a] = amph.obs[a];
        } else {
            bufr.amph.obs[a] = null;
        }
    }

    fixBufr();
}

function doBufrRstr() {
    if (bufr !== null) {
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

        for (let w = 0; w < n; w++) {
            if (bufr.wavs[w] !== null) {
                wavs[w].time = bufr.wavs[w].time;
                wavs[w].freq = bufr.wavs[w].freq;
                wavs[w].amp = bufr.wavs[w].amp;
                wavs[w].pos.x = bufr.wavs[w].pos.x;
                wavs[w].pos.y = bufr.wavs[w].pos.y;
                wavs[w].vel.x = bufr.wavs[w].vel.x;
                wavs[w].vel.y = bufr.wavs[w].vel.y;
            } else {
                wavs[w] = null;
            }
        }

        if (bufr.src.w >= 0) {
            src.wav = wavs[bufr.src.w];
        } else {
            src.wav = null;
        }

        if (bufr.obs.w >= 0) {
            obs.wav = wavs[bufr.obs.w];
        } else {
            obs.wav = null;
        }

        for (let f = 0; f < n; f++) {
            if (bufr.freqh.src[f] !== null) {
                freqh.src[f] = bufr.freqh.src[f];
            } else {
                freqh.src[f] = null;
            }

            if (bufr.freqh.obs[f] !== null) {
                freqh.obs[f] = bufr.freqh.obs[f];
            } else {
                freqh.obs[f] = null;
            }
        }

        for (let a = 0; a < n; a++) {
            if (bufr.amph.src[a] !== null) {
                amph.src[a] = bufr.amph.src[a];
            } else {
                amph.src[a] = null;
            }

            if (bufr.amph.obs[a] !== null) {
                amph.obs[a] = bufr.amph.obs[a];
            } else {
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

function setFmodFlt() {
    fmod = 0;
    fixFmod();
}

function setFmodSqr() {
    fmod = 1;
    fixFmod();
}

function setFmodSwp() {
    fmod = 2;
    fixFmod();
}

function setFmodTrg() {
    fmod = 3;
    fixFmod();
}

function setFmodSin() {
    fmod = 4;
    fixFmod();
}

function setFmod() {
    let prd = 30;
    let phs = time % prd;

    if (fmod === 0) {
        src.freq = 1;
    } else if (fmod === 1) {
        if (phs / prd < 0.5) {
            src.freq = 0.5;
        } else {
            src.freq = 1.5;
        }
    } else if (fmod === 2) {
        src.freq = 0.5 + phs / prd;
    } else if (fmod === 3) {
        src.freq = 0.5 + Math.abs(2 * phs / prd - 1);
    } else if (fmod === 4) {
        src.freq = 1 + 0.5 * Math.sin(2 * Math.PI * phs / prd);
    }
}

function setSndOn() {
    let temp = snd;
    snd = true;
    fixSnd();

    if (temp === false) {
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

function setSndOff() {
    let temp = snd;
    snd = false;
    fixSnd();

    if (temp === true) {
        oscl.stop();
        oscl.disconnect();
        gain.disconnect();
        ctxSnd.close();
    }
}

function setSnd() {
    if (snd === true) {
        if (run === true && obs.freq !== null && obs.amp !== null) {
            oscl.frequency.value = Math.min(Math.max(1000 * Math.abs(obs.freq), 50), 3000);
            gain.gain.value = 0.2 * obs.amp;
        } else {
            oscl.frequency.value = 0;
            gain.gain.value = 0;
        }
    }
}

function setTwavShow() {
    twav = true;
    fixTwav();
}

function setTwavHide() {
    twav = false;
    fixTwav();
}

function setCtrlSrc() {
    obj = src;
    fixCtrl();

    if (src.type === 0) {
        setTypePos();
    } else if (src.type === 1) {
        setTypeVel();
    } else if (src.type === 2) {
        setTypeAcc();
    }

    if (src.dir === 0) {
        setDirZero();
    } else if (src.dir === 1) {
        setDirLeft();
    } else if (src.dir === 2) {
        setDirRght();
    } else if (src.dir === 3) {
        setDirUp();
    } else if (src.dir === 4) {
        setDirDown();
    }

    if (src.mag === 1) {
        setMagLow();
    } else if (src.mag === 2) {
        setMagMed();
    } else if (src.mag === 3) {
        setMagHigh();
    }
}

function setCtrlObs() {
    obj = obs;
    fixCtrl();

    if (obs.type === 0) {
        setTypePos();
    } else if (obs.type === 1) {
        setTypeVel();
    } else if (obs.type === 2) {
        setTypeAcc();
    }

    if (obs.dir === 0) {
        setDirZero();
    } else if (obs.dir === 1) {
        setDirLeft();
    } else if (obs.dir === 2) {
        setDirRght();
    } else if (obs.dir === 3) {
        setDirUp();
    } else if (obs.dir === 4) {
        setDirDown();
    }

    if (obs.mag === 1) {
        setMagLow();
    } else if (obs.mag === 2) {
        setMagMed();
    } else if (obs.mag === 3) {
        setMagHigh();
    }
}

function setTypePos() {
    if (obj !== null) {
        obj.type = 0;
        fixType();
        setType();
    }
}

function setTypeVel() {
    if (obj !== null) {
        obj.type = 1;
        fixType();
        setType();
    }
}

function setTypeAcc() {
    if (obj !== null) {
        obj.type = 2;
        fixType();
        setType();
    }
}

function setType() {
    if (obj !== null) {
        if (obj.dir !== null) {
            if (obj.type === 0) {
                if (obj.dir === 0) {
                    obj.pos.x = 0;
                    obj.pos.y = 0;
                } else if (obj.dir === 1) {
                    obj.pos.x = -obj.mag;
                    obj.pos.y = 0;
                } else if (obj.dir === 2) {
                    obj.pos.x = obj.mag;
                    obj.pos.y = 0;
                } else if (obj.dir === 3) {
                    obj.pos.x = 0;
                    obj.pos.y = obj.mag;
                } else if (obj.dir === 4) {
                    obj.pos.x = 0;
                    obj.pos.y = -obj.mag;
                }

                obj.vel.x = 0;
                obj.vel.y = 0;
                obj.acc.x = 0;
                obj.acc.y = 0;
            } else if (obj.type === 1) {
                if (obj.dir === 0) {
                    obj.vel.x = 0;
                    obj.vel.y = 0;
                } else if (obj.dir === 1) {
                    obj.vel.x = -0.4 * s * obj.mag;
                    obj.vel.y = 0;
                } else if (obj.dir === 2) {
                    obj.vel.x = 0.4 * s * obj.mag;
                    obj.vel.y = 0;
                } else if (obj.dir === 3) {
                    obj.vel.x = 0;
                    obj.vel.y = 0.4 * s * obj.mag;
                } else if (obj.dir === 4) {
                    obj.vel.x = 0;
                    obj.vel.y = -0.4 * s * obj.mag;
                }

                obj.acc.x = 0;
                obj.acc.y = 0;
            } else if (obj.type === 2) {
                if (obj.dir === 0) {
                    obj.acc.x = 0;
                    obj.acc.y = 0;
                } else if (obj.dir === 1) {
                    obj.acc.x = -0.5 * Math.pow(s, 2) * obj.mag;
                    obj.acc.y = 0;
                } else if (obj.dir === 2) {
                    obj.acc.x = 0.5 * Math.pow(s, 2) * obj.mag;
                    obj.acc.y = 0;
                } else if (obj.dir === 3) {
                    obj.acc.x = 0;
                    obj.acc.y = 0.5 * Math.pow(s, 2) * obj.mag;
                } else if (obj.dir === 4) {
                    obj.acc.x = 0;
                    obj.acc.y = -0.5 * Math.pow(s, 2) * obj.mag;
                }
            }
        }
    }
}

function setDirLeft() {
    if (obj !== null) {
        obj.dir = 1;
        fixDir();
        setType();
    }
}

function setDirRght() {
    if (obj !== null) {
        obj.dir = 2;
        fixDir();
        setType();
    }
}

function setDirUp() {
    if (obj !== null) {
        obj.dir = 3;
        fixDir();
        setType();
    }
}

function setDirDown() {
    if (obj !== null) {
        obj.dir = 4;
        fixDir();
        setType();
    }
}

function setDirZero() {
    if (obj !== null) {
        obj.dir = 0;
        fixDir();
        setType();
    }
}

function setMagLow() {
    if (obj !== null) {
        obj.mag = 1;
        fixMag();
        setType();
    }
}

function setMagMed() {
    if (obj !== null) {
        obj.mag = 2;
        fixMag();
        setType();
    }
}

function setMagHigh() {
    if (obj !== null) {
        obj.mag = 3;
        fixMag();
        setType();
    }
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

function fixTime() {
    btnTimeStrt.disabled = false;
    btnTimeStop.disabled = false;

    if (run === true) {
        btnTimeStrt.disabled = true;
    } else if (run === false) {
        btnTimeStop.disabled = true;
    }
}

function fixBufr() {
    btnBufrRstr.disabled = false;

    if (bufr === null) {
        btnBufrRstr.disabled = true;
    }
}

function fixFmod() {
    btnFmodFlt.disabled = false;
    btnFmodSqr.disabled = false;
    btnFmodSwp.disabled = false;
    btnFmodTrg.disabled = false;
    btnFmodSin.disabled = false;

    if (fmod === 0) {
        btnFmodFlt.disabled = true;
    } else if (fmod === 1) {
        btnFmodSqr.disabled = true;
    } else if (fmod === 2) {
        btnFmodSwp.disabled = true;
    } else if (fmod === 3) {
        btnFmodTrg.disabled = true;
    } else if (fmod === 4) {
        btnFmodSin.disabled = true;
    }
}

function fixSnd() {
    btnSndOn.disabled = false;
    btnSndOff.disabled = false;

    if (snd === true) {
        btnSndOn.disabled = true;
    } else if (snd === false) {
        btnSndOff.disabled = true;
    }
}

function fixTwav() {
    btnTwavShow.disabled = false;
    btnTwavHide.disabled = false;

    if (twav === true) {
        btnTwavShow.disabled = true;
    } else if (twav === false) {
        btnTwavHide.disabled = true;
    }
}

function fixCtrl() {
    btnCtrlSrc.disabled = false;
    btnCtrlObs.disabled = false;

    if (obj === src) {
        btnCtrlSrc.disabled = true;
    } else if (obj === obs) {
        btnCtrlObs.disabled = true;
    }
}

function fixType() {
    if (obj !== null) {
        btnTypePos.disabled = false;
        btnTypeVel.disabled = false;
        btnTypeAcc.disabled = false;

        if (obj.type === 0) {
            btnTypePos.disabled = true;
        } else if (obj.type === 1) {
            btnTypeVel.disabled = true;
        } else if (obj.type === 2) {
            btnTypeAcc.disabled = true;
        }
    } else {
        btnTypePos.disabled = true;
        btnTypeVel.disabled = true;
        btnTypeAcc.disabled = true;
    }
}

function fixDir() {
    if (obj !== null) {
        btnDirLeft.disabled = false;
        btnDirRght.disabled = false;
        btnDirUp.disabled = false;
        btnDirDown.disabled = false;
        btnDirZero.disabled = false;

        if (obj.dir === 0) {
            btnDirZero.disabled = true;
        } else if (obj.dir === 1) {
            btnDirLeft.disabled = true;
        } else if (obj.dir === 2) {
            btnDirRght.disabled = true;
        } else if (obj.dir === 3) {
            btnDirUp.disabled = true;
        } else if (obj.dir === 4) {
            btnDirDown.disabled = true;
        }
    } else {
        btnDirZero.disabled = true;
        btnDirLeft.disabled = true;
        btnDirRght.disabled = true;
        btnDirUp.disabled = true;
        btnDirDown.disabled = true;
    }
}

function fixMag() {
    if (obj !== null) {
        btnMagLow.disabled = false;
        btnMagMed.disabled = false;
        btnMagHigh.disabled = false;

        if (obj.mag === 1) {
            btnMagLow.disabled = true;
        } else if (obj.mag === 2) {
            btnMagMed.disabled = true;
        } else if (obj.mag === 3) {
            btnMagHigh.disabled = true;
        }
    } else {
        btnMagLow.disabled = true;
        btnMagMed.disabled = true;
        btnMagHigh.disabled = true;
    }
}

window.onkeydown = doBtn;

function doBtn(event) {
    if (event.key.toUpperCase() === "P") {
        if (run === true) {
            setTimeStop();
        } else if (run === false) {
            setTimeStrt();
        }
    } else if (event.key.toUpperCase() === "S") {
        doBufrSave();
    } else if (event.key.toUpperCase() === "R") {
        doBufrRstr();
    } else if (event.key.toUpperCase() === "M") {
        if (snd === true) {
            setSndOff();
        } else if (snd === false) {
            setSndOn();
        }
    } else if (event.key.toUpperCase() === "W") {
        if (twav === true) {
            setTwavHide();
        } else if (twav === false) {
            setTwavShow();
        }
    } else if (event.key.toUpperCase() === "F") {
        if (fmod === 0) {
            setFmodSqr();
        } else if (fmod === 1) {
            setFmodSwp();
        } else if (fmod === 2) {
            setFmodTrg();
        } else if (fmod === 3) {
            setFmodSin();
        } else if (fmod === 4) {
            setFmodFlt();
        }
    } else if (event.key.toUpperCase() === "C") {
        if (obj === src) {
            setCtrlObs();
        } else if (obj === obs) {
            setCtrlSrc();
        } else if (obj === null) {
            setCtrlSrc();
        }
    } else if (event.key.toUpperCase() === "T") {
        if (obj !== null) {
            if (obj.type === 0) {
                setTypeVel();
            } else if (obj.type === 1) {
                setTypeAcc();
            } else if (obj.type === 2) {
                setTypePos();
            }
        }
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setDirLeft();
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setDirRght();
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setDirUp();
    } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setDirDown();
    } else if (event.key === "0") {
        setDirZero();
    } else if (event.key === "1") {
        setMagLow();
    } else if (event.key === "2") {
        setMagMed();
    } else if (event.key === "3") {
        setMagHigh();
    }
}
