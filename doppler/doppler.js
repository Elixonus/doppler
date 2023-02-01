const buttonTimeStrt = document.getElementById("button-time-strt");
const buttonTimeStop = document.getElementById("button-time-stop");
const buttonBufrSave = document.getElementById("button-bufr-save");
const buttonBufrRstr = document.getElementById("button-bufr-rstr");
const buttonCtrlSrc = document.getElementById("button-ctrl-src");
const buttonCtrlObs = document.getElementById("button-ctrl-obs");
const buttonPwrOn = document.getElementById("button-pwr-on");
const buttonPwrOff = document.getElementById("button-pwr-off");
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
    pwr: true,
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
    pwr: true,
    freq: 1,
    amp: 1,
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

fixTime();
fixBufr();
fixCtrl();
fixPwr();
fixType();
fixDir();
fixMag();

window.requestAnimationFrame(step);

function step()
{
    if(src.dir !== null)
    {
        let xs;
        let ys;
    
        if(src.dir === 0)
        {
            xs = 0;
            ys = 0;
        }
    
        else if(src.dir === 1)
        {
            xs = -src.mag;
            ys = 0;
        }
    
        else if(src.dir === 2)
        {
            xs = src.mag;
            ys = 0;
        }
    
        else if(src.dir === 3)
        {
            xs = 0;
            ys = src.mag;
        }
    
        else if(src.dir === 4)
        {
            xs = 0;
            ys = -src.mag;
        }
    
        if(src.type === 1)
        {
            src.pos.x = xs;
            src.pos.y = ys;
        }
    
        else if(src.type === 2)
        {
            src.vel.x = xs;
            src.vel.y = ys;
        }
    
        else if(src.type === 3)
        {
            src.acc.x = xs;
            src.acc.y = ys;
        }
    }

    if(obs.dir !== null)
    {
        let xo;
        let yo;
    
        if(obs.dir === 0)
        {
            xo = 0;
            yo = 0;
        }
    
        else if(obs.dir === 1)
        {
            xo = -obs.mag;
            yo = 0;
        }
    
        else if(obs.dir === 2)
        {
            xo = obs.mag;
            yo = 0;
        }
    
        else if(obs.dir === 3)
        {
            xo = 0;
            yo = obs.mag;
        }
    
        else if(obs.dir === 4)
        {
            xo = 0;
            yo = -obs.mag;
        }
    
        if(obs.type === 1)
        {
            obs.pos.x = xo;
            obs.pos.y = yo;
        }
    
        else if(obs.type === 2)
        {
            obs.vel.x = xo;
            obs.vel.y = yo;
        }
    
        else if(obs.type === 3)
        {
            obs.acc.x = xo;
            obs.acc.y = yo;
        }
    }

    if(run === true)
    {
        src.vel.x += 0.05 * src.acc.x;
        src.vel.y += 0.05 * src.acc.y;
        src.pos.x += 0.005 * src.vel.x;
        src.pos.y += 0.005 * src.vel.y;
    
        obs.vel.x += 0.05 * obs.acc.x;
        obs.vel.y += 0.05 * obs.acc.y;
        obs.pos.x += 0.005 * obs.vel.x;
        obs.pos.y += 0.005 * obs.vel.y;

        for(let w = 0; w < wavs.length; w++)
        {
            wavs[w].amp = 1
            wavs[w].rad = 0.01 * (time - wavs[w].time);
        }

        if(src.pwr === true)
        {
            wavs.push({
                time: Math.floor(time),
                freq: src.freq,
                amp: src.amp,
                rad: 0,
                pos: {
                    x: src.pos.x,
                    y: src.pos.y
                },
                vel: {
                    x: src.vel.x,
                    y: src.vel.y
                }
            });
        }

        if(time - wavs[0].time >= 1000)
        {
            wavs.shift();
        }
        
        time += 1;
    }

    const ctxView = canvasView.getContext("2d");
    ctxView.save();
    ctxView.fillStyle = "#000000";
    ctxView.fillRect(0, 0, 800, 600);
    ctxView.translate(400, 300);
    ctxView.scale(100, -100);

    if(obj === src)
    {
        ctxView.beginPath();
        ctxView.arc(src.pos.x, src.pos.y, 0.29, 0, 2 * Math.PI);
        ctxView.fillStyle = "#ff0000";
        ctxView.fill();
        ctxView.beginPath();
        ctxView.arc(src.pos.x, src.pos.y, 0.23, 0, 2 * Math.PI);
        ctxView.fillStyle = "#000000";
        ctxView.fill();
    }
    
    ctxView.beginPath();
    ctxView.arc(src.pos.x, src.pos.y, 0.2, 0, 2 * Math.PI);
    ctxView.fillStyle = "#ff0000";
    ctxView.fill();

    if(obj === obs)
    {
        ctxView.beginPath();
        ctxView.arc(obs.pos.x, obs.pos.y, 0.29, 0, 2 * Math.PI);
        ctxView.fillStyle = "#0000ff";
        ctxView.fill();
        ctxView.beginPath();
        ctxView.arc(obs.pos.x, obs.pos.y, 0.23, 0, 2 * Math.PI);
        ctxView.fillStyle = "#000000";
        ctxView.fill();
    }
    
    ctxView.beginPath();
    ctxView.arc(obs.pos.x, obs.pos.y, 0.2, 0, 2 * Math.PI);
    ctxView.fillStyle = "#0000ff";
    ctxView.fill();
    ctxView.save();

    for(let w = wavs.length - 1 - (time % 20); w > 0; w -= 20)
    {
        ctxView.beginPath();
        ctxView.arc(wavs[w].pos.x, wavs[w].pos.y, wavs[w].rad, 0, 2 * Math.PI);
        ctxView.globalAlpha = 1 - (time - wavs[w].time) / 1000;
        ctxView.lineWidth = 0.03;
        ctxView.strokeStyle = "#ffffff";
        ctxView.stroke();
    }

    ctxView.restore();
    ctxView.restore();

    window.requestAnimationFrame(step);
}

buttonTimeStrt.onclick = timeStrt;
buttonTimeStop.onclick = timeStop;
buttonBufrSave.onclick = bufrSave;
buttonBufrRstr.onclick = bufrRstr;
buttonCtrlSrc.onclick = ctrlSrc;
buttonCtrlObs.onclick = ctrlObs;
buttonPwrOn.onclick = pwrOn;
buttonPwrOff.onclick = pwrOff;
buttonTypePos.onclick = typePos;
buttonTypeVel.onclick = typeVel;
buttonTypeAcc.onclick = typeAcc;
buttonDirLeft.onclick = dirLeft;
buttonDirRght.onclick = dirRght;
buttonDirUp.onclick = dirUp;
buttonDirDown.onclick = dirDown;
buttonDirZero.onclick = dirZero;
buttonMagLow.onclick = magLow;
buttonMagMed.onclick = magMed;
buttonMagHigh.onclick = magHigh;

function timeStrt()
{
    run = true;
    fixTime();
}

function timeStop()
{
    run = false;
    fixTime();
}

function bufrSave()
{
    bufr = {
        run: run,
        time: time,
        obj: null,
        src: {
            pwr: src.pwr,
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
            pwr: obs.pwr,
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
        }
    };

    fixBufr();
}

function bufrRstr()
{
    run = bufr.run;
    time = bufr.time;
    obj = null;
    src.pwr = bufr.src.pwr;
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
    obs.pwr = bufr.obs.pwr;
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
    wavs = [];
    fixTime();
    fixCtrl();
    fixPwr();
    fixType();
    fixDir();
    fixMag();
}

function ctrlSrc()
{
    obj = src;
    fixCtrl();

    if(src.pwr)
    {
        pwrOn();
    }

    else
    {
        pwrOff();
    }

    if(src.type === 1)
    {
        typePos();
    }

    else if(src.type === 2)
    {
        typeVel();
    }

    else if(src.type === 3)
    {
        typeAcc();
    }
}

function ctrlObs()
{
    obj = obs;
    fixCtrl();

    if(obs.pwr)
    {
        pwrOn();
    }

    else
    {
        pwrOff();
    }
    
    if(obs.type === 1)
    {
        typePos();
    }

    else if(obs.type === 2)
    {
        typeVel();
    }

    else if(obs.type === 3)
    {
        typeAcc();
    }
}

function isObj()
{
    return (obj === src || obj === obs);
}

function pwrOn()
{
    if(isObj() === true)
    {
        obj.pwr = true;
    }

    fixPwr();
}

function pwrOff()
{
    if(isObj() === true)
    {
        obj.pwr = false;
    }

    fixPwr();
}

function typePos()
{
    if(isObj() === true)
    {
        obj.type = 1;
        obj.vel.x = 0;
        obj.vel.y = 0;
        obj.acc.x = 0;
        obj.acc.y = 0;
    }

    fixType();
    dirNone();
    magMed();
}

function typeVel()
{
    if(isObj() === true)
    {
        obj.type = 2;
        obj.acc.x = 0;
        obj.acc.y = 0;
    }

    fixType();
    dirNone();
    magMed();
}

function typeAcc()
{
    if(isObj() === true)
    {
        obj.type = 3;
    }

    fixType();
    dirNone();
    magMed();
}

function dirLeft()
{
    if(isObj() === true)
    {
        obj.dir = 1;
    }

    fixDir();
}

function dirRght()
{
    if(isObj() === true)
    {
        obj.dir = 2;
    }

    fixDir();
}

function dirUp()
{
    if(isObj() === true)
    {
        obj.dir = 3;
    }

    fixDir();
}

function dirDown()
{
    if(isObj() === true)
    {
        obj.dir = 4;
    }

    fixDir();
}

function dirZero()
{
    if(isObj() === true)
    {
        obj.dir = 0;
    }

    fixDir();
}

function dirNone()
{
    if(isObj() === true)
    {
        obj.dir = null;
    }

    fixDir();
}

function magLow()
{
    if(isObj() === true)
    {
        obj.mag = 1;
    }

    fixMag();
}

function magMed()
{
    if(isObj() === true)
    {
        obj.mag = 2;
    }

    fixMag();
}

function magHigh()
{
    if(isObj() === true)
    {
        obj.mag = 3;
    }

    fixMag();
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

function fixPwr()
{
    buttonPwrOn.disabled = false;
    buttonPwrOff.disabled = false;

    if(isObj())
    {
        if(obj.pwr === true)
        {
            buttonPwrOn.disabled = true;
        }
    
        else if(obj.pwr === false)
        {
            buttonPwrOff.disabled = true;
        }
    }

    else
    {
        buttonPwrOn.disabled = true;
        buttonPwrOff.disabled = true;
    }
}

function fixType()
{
    buttonTypePos.disabled = false;
    buttonTypeVel.disabled = false;
    buttonTypeAcc.disabled = false;

    if(isObj())
    {
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
    buttonDirLeft.disabled = false;
    buttonDirRght.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirDown.disabled = false;
    buttonDirZero.disabled = false;

    if(isObj())
    {
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
    buttonMagLow.disabled = false;
    buttonMagMed.disabled = false;
    buttonMagHigh.disabled = false;

    if(isObj())
    {
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
