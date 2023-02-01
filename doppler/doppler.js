const buttonTimeStrt = document.getElementById("button-time-strt");
const buttonTimeStop = document.getElementById("button-time-stop");
const buttonBufrSave = document.getElementById("button-bufr-save");
const buttonBufrRstr = document.getElementById("button-bufr-rstr");
const buttonCtrlSrc = document.getElementById("button-ctrl-src");
const buttonCtrlObs = document.getElementById("button-ctrl-obs");
const buttonTypePos = document.getElementById("button-type-pos");
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

let run = true;
let time = 0;
let bufr = null;
let obj = null;

let src = {
    time: 0,
    freq: 1,
    amp: 1,
    type: 2,
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
    type: 2,
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

for(let w = 0; w < 1000; w++)
{
    doStep();
}

fixTime();
fixBufr();
fixCtrl();
fixType();
fixDir();
fixMag();

window.requestAnimationFrame(doFrame);

function doStep()
{
    if(src.dir !== null)
    {
        let vec = {};

        if(src.dir === 0)
        {
            vec.x = 0;
            vec.y = 0;
        }

        else if(src.dir === 1)
        {
            vec.x = -src.mag;
            vec.y = 0;
        }
    
        else if(src.dir === 2)
        {
            vec.x = src.mag;
            vec.y = 0;
        }
    
        else if(src.dir === 3)
        {
            vec.x = 0;
            vec.y = src.mag;
        }
    
        else if(src.dir === 4)
        {
            vec.x = 0;
            vec.y = -src.mag;
        }

        if(src.type === 1)
        {
            src.pos.x = vec.x;
            src.pos.y = vec.y;
            src.vel.x = 0;
            src.vel.y = 0;
            src.acc.x = 0;
            src.acc.y = 0;
        }
    
        else if(src.type === 2)
        {
            src.vel.x = vec.x;
            src.vel.y = vec.y;
            src.acc.x = 0;
            src.acc.y = 0;
        }
    
        else if(src.type === 3)
        {
            src.acc.x = vec.x;
            src.acc.y = vec.y;
        }
    }

    if(obs.dir !== null)
    {
        let vec = {};
    
        if(obs.dir === 0)
        {
            vec.x = 0;
            vec.y = 0;
        }
    
        else if(obs.dir === 1)
        {
            vec.x = -obs.mag;
            vec.y = 0;
        }
    
        else if(obs.dir === 2)
        {
            vec.x = obs.mag;
            vec.y = 0;
        }
    
        else if(obs.dir === 3)
        {
            vec.x = 0;
            vec.y = obs.mag;
        }
    
        else if(obs.dir === 4)
        {
            vec.x = 0;
            vec.y = -obs.mag;
        }
    
        if(obs.type === 1)
        {
            obs.pos.x = vec.x;
            obs.pos.y = vec.y;
            obs.vel.x = 0;
            obs.vel.y = 0;
            obs.acc.x = 0;
            obs.acc.y = 0;
        }
    
        else if(obs.type === 2)
        {
            obs.vel.x = vec.x;
            obs.vel.y = vec.y;
            obs.acc.x = 0;
            obs.acc.y = 0;
        }
    
        else if(obs.type === 3)
        {
            obs.acc.x = vec.x;
            obs.acc.y = vec.y;
        }
    }

    src.vel.x += 0.05 * src.acc.x;
    src.vel.y += 0.05 * src.acc.y;
    src.pos.x += 0.005 * src.vel.x;
    src.pos.y += 0.005 * src.vel.y;

    obs.vel.x += 0.05 * obs.acc.x;
    obs.vel.y += 0.05 * obs.acc.y;
    obs.pos.x += 0.005 * obs.vel.x;
    obs.pos.y += 0.005 * obs.vel.y;

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

    time += 1;
}

function doFrame()
{
    const ctxView = canvasView.getContext("2d");
    ctxView.save();
    ctxView.fillStyle = "#000000";
    ctxView.fillRect(0, 0, 800, 600);
    ctxView.translate(400, 300);
    ctxView.scale(100, -100);
    ctxView.beginPath();
    ctxView.arc(src.pos.x, src.pos.y, 0.2, 0, 2 * Math.PI);
    ctxView.fillStyle = "#ff0000";
    ctxView.fill();    
    ctxView.beginPath();
    ctxView.arc(obs.pos.x, obs.pos.y, 0.2, 0, 2 * Math.PI);
    ctxView.fillStyle = "#0000ff";
    ctxView.fill();
    ctxView.save();

    for(let w = 0; w < wavs.length - 1; w += 20)
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
buttonCtrlSrc.onclick = setCtrlSrc;
buttonCtrlObs.onclick = setCtrlObs;
buttonTypePos.onclick = setTypePos;
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
    bufr = {
        run: run,
        time: time,
        obj: null,
        src: {
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
        },
        obs: {
            freq: null,
            amp: null,
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
        },
        wavs: []
    };

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

    fixBufr();
}

function doBufrRstr()
{
    run = bufr.run;
    time = bufr.time;
    obj = null;

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

    for(let w = 0; w < wavs.length; w++)
    {
        wavs[w].time = bufr.wavs[w].time;
        wavs[w].freq = bufr.wavs[w].freq;
        wavs[w].amp = bufr.wavs[w].amp;
        wavs[w].pos.x = bufr.wavs[w].pos.x;
        wavs[w].pos.y = bufr.wavs[w].pos.y;
        wavs[w].vel.x = bufr.wavs[w].vel.x;
        wavs[w].vel.y = bufr.wavs[w].vel.y;
    }

    fixTime();
    fixCtrl();
    fixType();
    fixDir();
    fixMag();
}

function setCtrlSrc()
{
    obj = src;
    fixCtrl();

    if(src.type === 1)
    {
        setTypePos();
    }

    else if(src.type === 2)
    {
        setTypeVel();
    }

    else if(src.type === 3)
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
        setTypePos();
    }

    else if(obs.type === 2)
    {
        setTypeVel();
    }

    else if(obs.type === 3)
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

function setTypePos()
{
    if(isCtrl() === true)
    {
        obj.type = 1;
        fixType();
    }
}

function setTypeVel()
{
    if(isCtrl() === true)
    {
        obj.type = 2;
        fixType();
    }
}

function setTypeAcc()
{
    if(isCtrl() === true)
    {
        obj.type = 3;
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
        buttonTypePos.disabled = false;
        buttonTypeVel.disabled = false;
        buttonTypeAcc.disabled = false;

        if(obj.type === 1)
        {
            buttonTypePos.disabled = true;
        }
    
        else if(obj.type === 2)
        {
            buttonTypeVel.disabled = true;
        }
    
        else if(obj.type === 3)
        {
            buttonTypeAcc.disabled = true;
        }
    }

    else
    {
        buttonTypePos.disabled = true;
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
