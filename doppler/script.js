const wspd = 0.1;
const wnum = 250;
const wskp = 10;
const mprd = 47;

let time = 0;
let view = 0;
let plot = 0;

let run = true;
let bufr = null;
let fmod = 0;
let snd = false;
let owav = false;
let obj = null;

let src = {
    wav: null,
    frq: 1,
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
    frq: null,
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

let frqh = {src: [], obs: []};
let amph = {src: [], obs: []};

for (let t = 0; t < wnum; t++) {
    wavs[t] = null;

    frqh.src[t] = null;
    frqh.obs[t] = null;
    amph.src[t] = null;
    amph.obs[t] = null;
}

let ctxSnd = null;
let oscl = null;
let gain = null;

window.setInterval(doLgc, 47);

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

    let ws = time % wnum;

    wavs[ws] = {
        time: time,
        frq: src.frq,
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

    frqh.src[ws] = src.frq;
    amph.src[ws] = src.amp;

    let diffs = [];

    for (let w = 0; w < wnum; w++) {
        if (wavs[w] !== null) {
            diffs[w] = wspd * (time - wavs[w].time) - Math.hypot(wavs[w].pos.x - obs.pos.x, wavs[w].pos.y - obs.pos.y);
        } else {
            diffs[w] = null;
        }
    }

    let wo = null;

    for (let w = 0; w < wnum; w++) {
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

        obs.frq = obs.wav.frq * (wspd - ovel) / (wspd + svel);

        if (isNaN(obs.frq)) {
            obs.frq = null;
        }

        obs.amp = obs.wav.amp;

        if (isNaN(obs.amp)) {
            obs.amp = null;
        }

    } else {
        obs.frq = null;
        obs.amp = null;
    }

    frqh.obs[ws] = obs.frq;
    amph.obs[ws] = obs.amp;

    time++;
}

const canvPos = document.getElementById("canvas-position");
const canvFrq = document.getElementById("canvas-frequency");
const canvAmp = document.getElementById("canvas-amplitude");

let ctxPos = canvPos.getContext("2d", {alpha: false});
let ctxFrq = canvFrq.getContext("2d", {alpha: false});
let ctxAmp = canvAmp.getContext("2d", {alpha: false});

window.requestAnimationFrame(doAnim);

function doAnim() {
    doView();

    if (view % 10 === 1) {
        doPlot();
    }

    window.requestAnimationFrame(doAnim);
}

function doView() {
    ctxPos.fillStyle = "#000";
    ctxPos.fillRect(0, 0, 800, 600);

    ctxPos.save();
    ctxPos.scale(100, 100);

    for (let b = 1; b < 12; b++)
    {
        ctxPos.fillStyle = "#444";
        ctxPos.fillRect(0, 6 * b / 12, 8, 0.02);
    }

    for (let b = 1; b < 16; b++)
    {
        ctxPos.fillStyle = "#444";
        ctxPos.fillRect(8 * b / 16, 0, 0.02, 6);
    }

    ctxPos.translate(4, 3);
    ctxPos.scale(1, -1);

    ctxPos.beginPath();
    ctxPos.arc(obs.pos.x, obs.pos.y, 0.2, 0, 2 * Math.PI);
    ctxPos.fillStyle = "#0f0";
    ctxPos.fill();

    if (Math.hypot(obs.vel.x, obs.vel.y) > 0.01 * wspd) {
        ctxPos.save();

        ctxPos.translate(obs.pos.x, obs.pos.y);
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0);
        ctxPos.translate(obs.vel.x / wspd, obs.vel.y / wspd);
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

    if (Math.hypot(src.vel.x, src.vel.y) > 0.01 * wspd) {
        ctxPos.save();

        ctxPos.translate(src.pos.x, src.pos.y);
        ctxPos.beginPath();
        ctxPos.lineTo(0, 0);
        ctxPos.translate(src.vel.x / wspd, src.vel.y / wspd);
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

    for (let w = 0; w < wnum; w += wskp) {
        if (wavs[w] !== null) {
            if (wspd * (time - wavs[w].time) < 4) {
                ctxPos.beginPath();
                ctxPos.arc(wavs[w].pos.x, wavs[w].pos.y, wspd * (time - wavs[w].time), 0, 2 * Math.PI);
                ctxPos.globalAlpha = Math.min(Math.max(1 - wspd * (time - wavs[w].time) / 4, 0), 1);
                ctxPos.lineWidth = 0.03;
                ctxPos.strokeStyle = "#fff";
                ctxPos.stroke();
            }
        }
    }

    ctxPos.restore();

    if (owav === true && obs.wav !== null) {
        ctxPos.beginPath();
        ctxPos.arc(obs.wav.pos.x, obs.wav.pos.y, Math.hypot(obs.wav.pos.x - obs.pos.x, obs.wav.pos.y - obs.pos.y), 0, 2 * Math.PI);
        ctxPos.lineWidth = 0.05;
        ctxPos.strokeStyle = "#ff0";
        ctxPos.stroke();

        ctxPos.beginPath();
        ctxPos.arc(obs.wav.pos.x, obs.wav.pos.y, 0.05, 0, 2 * Math.PI);
        ctxPos.fillStyle = "#ff0";
        ctxPos.fill();

        if (Math.hypot(obs.wav.vel.x, obs.wav.vel.y) > 0.01 * wspd) {
            ctxPos.save();

            ctxPos.translate(obs.wav.pos.x, obs.wav.pos.y);
            ctxPos.beginPath();
            ctxPos.lineTo(0, 0);
            ctxPos.translate(obs.wav.vel.x / wspd, obs.wav.vel.y / wspd);
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
    ctxFrq.fillStyle = "#000";
    ctxFrq.fillRect(0, 0, 800, 200);

    ctxFrq.save();
    ctxFrq.scale(100, 100);
    ctxFrq.translate(4, 1);
    ctxFrq.scale(-1, -1);
    ctxFrq.translate(-4, -1);

    for (let b = 1; b < 8; b++) {
        ctxFrq.fillStyle = "#444";
        ctxFrq.fillRect(0, 2 * b / 8, 8, 0.02);
    }

    for (let b = 1; b < 12; b++) {
        ctxFrq.fillStyle = "#444";
        ctxFrq.fillRect(8 * b / 12, 0, 0.02, 8);
    }

    ctxFrq.beginPath();

    for (let w = 0; w < wnum; w++) {
        let frq = frqh.src[((time - w - 1) + wnum) % wnum];

        if (frq === null) {
            frq = 0;
        }

        ctxFrq.lineTo(8 * w / (wnum - 1), Math.min(0.5 * Math.abs(frq), 2));
    }

    ctxFrq.lineTo(8, 0);
    ctxFrq.lineTo(0, 0);
    ctxFrq.closePath();
    ctxFrq.fillStyle = "#f00";
    ctxFrq.fill();

    ctxFrq.beginPath();

    for (let w = 0; w < wnum; w++) {
        let frq = frqh.obs[((time - w - 1) + wnum) % wnum];

        if (frq === null) {
            frq = 0;
        }

        ctxFrq.lineTo(8 * w / (wnum - 1), Math.min(0.5 * Math.abs(frq), 2));
    }

    ctxFrq.lineTo(8, 0);
    ctxFrq.lineTo(0, 0);
    ctxFrq.closePath();
    ctxFrq.fillStyle = "#0f0";
    ctxFrq.fill();

    ctxFrq.restore();

    ctxAmp.fillStyle = "#000";
    ctxAmp.fillRect(0, 0, 800, 200);

    ctxAmp.save();
    ctxAmp.scale(100, 100);
    ctxAmp.translate(4, 1);
    ctxAmp.scale(-1, -1);
    ctxAmp.translate(-4, -1);

    for (let b = 1; b < 8; b++) {
        ctxAmp.fillStyle = "#444";
        ctxAmp.fillRect(0, 2 * b / 8, 8, 0.02);
    }

    for (let b = 1; b < 12; b++) {
        ctxAmp.fillStyle = "#444";
        ctxAmp.fillRect(8 * b / 12, 0, 0.02, 8);
    }

    ctxAmp.beginPath();

    for (let w = 0; w < wnum; w++) {
        let amp = amph.src[((time - w - 1) + wnum) % wnum];

        if (amp === null) {
            amp = 0;
        }

        ctxAmp.lineTo(8 * w / (wnum - 1), 12 * amp / 8);
    }

    ctxAmp.lineTo(8, 0);
    ctxAmp.lineTo(0, 0);
    ctxAmp.closePath();
    ctxAmp.fillStyle = "#f00";
    ctxAmp.fill();

    ctxAmp.beginPath();

    for (let w = 0; w < wnum; w++) {
        let amp = amph.obs[((time - w - 1) + wnum) % wnum];

        if (amp === null) {
            amp = 0;
        }

        ctxAmp.lineTo(8 * w / (wnum - 1), 12 * amp / 8);
    }

    ctxAmp.lineTo(8, 0);
    ctxAmp.lineTo(0, 0);
    ctxAmp.closePath();
    ctxAmp.fillStyle = "#0f0";
    ctxAmp.fill();

    ctxAmp.restore();

    plot++;
}

const btnTimeStrt = document.getElementById("button-time-start");
const btnTimeStop = document.getElementById("button-time-stop");
const btnBufrSave = document.getElementById("button-buffer-save");
const btnBufrRstr = document.getElementById("button-buffer-restore");
const btnSndOn = document.getElementById("button-sound-on");
const btnSndOff = document.getElementById("button-sound-off");
const btnOwavShow = document.getElementById("button-owave-show");
const btnOwavHide = document.getElementById("button-owave-hide");
const btnFmodFlt = document.getElementById("button-fmod-flat");
const btnFmodSqr = document.getElementById("button-fmod-square");
const btnFmodSwp = document.getElementById("button-fmod-sweep");
const btnFmodTrg = document.getElementById("button-fmod-triangle");
const btnFmodSin = document.getElementById("button-fmod-sine");
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

btnTimeStrt.addEventListener("click", setTimeStrt);
btnTimeStop.addEventListener("click", setTimeStop);
btnBufrSave.addEventListener("click", doBufrSave);
btnBufrRstr.addEventListener("click", doBufrRstr);
btnSndOn.addEventListener("click", setSndOn);
btnSndOff.addEventListener("click", setSndOff);
btnOwavShow.addEventListener("click", setOwavShow);
btnOwavHide.addEventListener("click", setOwavHide);
btnFmodFlt.addEventListener("click", setFmodFlt);
btnFmodSqr.addEventListener("click", setFmodSqr);
btnFmodSwp.addEventListener("click", setFmodSwp);
btnFmodTrg.addEventListener("click", setFmodTrg);
btnFmodSin.addEventListener("click", setFmodSin);
btnCtrlSrc.addEventListener("click", setCtrlSrc);
btnCtrlObs.addEventListener("click", setCtrlObs);
btnTypePos.addEventListener("click", setTypePos);
btnTypeVel.addEventListener("click", setTypeVel);
btnTypeAcc.addEventListener("click", setTypeAcc);
btnDirLeft.addEventListener("click", setDirLeft);
btnDirRght.addEventListener("click", setDirRght);
btnDirUp.addEventListener("click", setDirUp);
btnDirDown.addEventListener("click", setDirDown);
btnDirZero.addEventListener("click", setDirZero);
btnMagLow.addEventListener("click", setMagLow);
btnMagMed.addEventListener("click", setMagMed);
btnMagHigh.addEventListener("click", setMagHigh);

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
        frq: src.frq,
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
        frq: obs.frq,
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

    for (let w = 0; w < wnum; w++) {
        if (wavs[w] !== null) {
            bufr.wavs[w] = {
                time: wavs[w].time,
                frq: wavs[w].frq,
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

    bufr.frqh = {src: [], obs: []};

    for (let w = 0; w < wnum; w++) {
        if (frqh.src[w] !== null) {
            bufr.frqh.src[w] = frqh.src[w];
        } else {
            bufr.frqh.src[w] = null;
        }

        if (frqh.obs[w] !== null) {
            bufr.frqh.obs[w] = frqh.obs[w];
        } else {
            bufr.frqh.obs[w] = null;
        }
    }

    bufr.amph = {src: [], obs: []};

    for (let w = 0; w < wnum; w++) {
        if (amph.src[w] !== null) {
            bufr.amph.src[w] = amph.src[w];
        } else {
            bufr.amph.src[w] = null;
        }

        if (amph.obs[w] !== null) {
            bufr.amph.obs[w] = amph.obs[w];
        } else {
            bufr.amph.obs[w] = null;
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

        src.frq = bufr.src.frq;
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

        obs.frq = bufr.obs.frq;
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

        for (let w = 0; w < wnum; w++) {
            if (bufr.wavs[w] !== null) {
                wavs[w].time = bufr.wavs[w].time;
                wavs[w].frq = bufr.wavs[w].frq;
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

        for (let w = 0; w < wnum; w++) {
            if (bufr.frqh.src[w] !== null) {
                frqh.src[w] = bufr.frqh.src[w];
            } else {
                frqh.src[w] = null;
            }

            if (bufr.frqh.obs[w] !== null) {
                frqh.obs[w] = bufr.frqh.obs[w];
            } else {
                frqh.obs[w] = null;
            }
        }

        for (let w = 0; w < wnum; w++) {
            if (bufr.amph.src[w] !== null) {
                amph.src[w] = bufr.amph.src[w];
            } else {
                amph.src[w] = null;
            }

            if (bufr.amph.obs[w] !== null) {
                amph.obs[w] = bufr.amph.obs[w];
            } else {
                amph.obs[w] = null;
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

function setSndOn() {
    let temp = snd;
    snd = true;
    fixSnd();

    if (temp === false) {
        ctxSnd = new window.AudioContext();
        oscl = ctxSnd.createOscillator();
        oscl.type = "square";
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
        if (run === true && obs.frq !== null && obs.amp !== null) {
            oscl.frequency.value = Math.min(Math.max(1000 * Math.abs(obs.frq), 50), 3000);
            gain.gain.value = 0.2 * obs.amp;
        } else {
            oscl.frequency.value = 0;
            gain.gain.value = 0;
        }
    }
}

function setOwavShow() {
    owav = true;
    fixOwav();
}

function setOwavHide() {
    owav = false;
    fixOwav();
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
    let phs = time % mprd;

    if (fmod === 0) {
        src.frq = 1;
    } else if (fmod === 1) {
        if (phs / mprd < 0.5) {
            src.frq = 0.5;
        } else {
            src.frq = 1.5;
        }
    } else if (fmod === 2) {
        src.frq = 0.5 + phs / mprd;
    } else if (fmod === 3) {
        src.frq = 0.5 + Math.abs(2 * phs / mprd - 1);
    } else if (fmod === 4) {
        src.frq = 1 + 0.5 * Math.sin(2 * Math.PI * phs / mprd);
    }
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
                    obj.vel.x = -0.4 * wspd * obj.mag;
                    obj.vel.y = 0;
                } else if (obj.dir === 2) {
                    obj.vel.x = 0.4 * wspd * obj.mag;
                    obj.vel.y = 0;
                } else if (obj.dir === 3) {
                    obj.vel.x = 0;
                    obj.vel.y = 0.4 * wspd * obj.mag;
                } else if (obj.dir === 4) {
                    obj.vel.x = 0;
                    obj.vel.y = -0.4 * wspd * obj.mag;
                }

                obj.acc.x = 0;
                obj.acc.y = 0;
            } else if (obj.type === 2) {
                if (obj.dir === 0) {
                    obj.acc.x = 0;
                    obj.acc.y = 0;
                } else if (obj.dir === 1) {
                    obj.acc.x = -0.5 * wspd * wspd * obj.mag;
                    obj.acc.y = 0;
                } else if (obj.dir === 2) {
                    obj.acc.x = 0.5 * wspd * wspd * obj.mag;
                    obj.acc.y = 0;
                } else if (obj.dir === 3) {
                    obj.acc.x = 0;
                    obj.acc.y = 0.5 * wspd * wspd * obj.mag;
                } else if (obj.dir === 4) {
                    obj.acc.x = 0;
                    obj.acc.y = -0.5 * wspd * wspd * obj.mag;
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
fixSnd();
fixOwav();
fixFmod();
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

function fixSnd() {
    btnSndOn.disabled = false;
    btnSndOff.disabled = false;

    if (snd === true) {
        btnSndOn.disabled = true;
    } else if (snd === false) {
        btnSndOff.disabled = true;
    }
}

function fixOwav() {
    btnOwavShow.disabled = false;
    btnOwavHide.disabled = false;

    if (owav === true) {
        btnOwavShow.disabled = true;
    } else if (owav === false) {
        btnOwavHide.disabled = true;
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

window.addEventListener("keydown", doKey);

function doKey(event) {
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
        if (owav === true) {
            setOwavHide();
        } else if (owav === false) {
            setOwavShow();
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
