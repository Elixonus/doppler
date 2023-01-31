let run = true;

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

const src = {
    pwr: true,
    freq: 1,
    amp: 1,
    type: 2,
    dir: 0,
    mag: 2,
    pos: {
        x: 0,
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
}

const obs = {
    ctrl: true,
    pwr: true,
    freq: 1,
    amp: 1,
    type: 2,
    dir: 0,
    mag: 2,
    pos: {
        x: 0,
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
}

window.requestAnimationFrame(step);

function step()
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

    let xo;
    let yo;

    if(obs.dir === 0)
    {
        xs = 0;
        ys = 0;
    }

    else if(obs.dir === 1)
    {
        xs = -obs.mag;
        ys = 0;
    }

    else if(obs.dir === 2)
    {
        xs = obs.mag;
        ys = 0;
    }

    else if(obs.dir === 3)
    {
        xs = 0;
        ys = obs.mag;
    }

    else if(obs.dir === 4)
    {
        xs = 0;
        ys = -obs.mag;
    }

    if(obs.type === 1)
    {
        obs.pos.x = xs;
        obs.pos.y = ys;
    }

    else if(obs.type === 2)
    {
        obs.vel.x = xs;
        obs.vel.y = ys;
    }

    else if(obs.type === 3)
    {
        obs.acc.x = xs;
        obs.acc.y = ys;
    }
    
    src.vel.x += 0.1 * src.acc.x;
    src.vel.y += 0.1 * src.acc.y;
    src.pos.x += 0.01 * src.vel.x;
    src.pos.y += 0.01 * src.vel.y;

    obs.vel.x += 0.1 * obs.acc.x;
    obs.vel.y += 0.1 * obs.acc.y;
    obs.pos.x += 0.01 * obs.vel.x;
    obs.pos.y += 0.01 * obs.vel.y;

    const ctxView = canvasView.getContext("2d");
    ctxView.save();
    ctxView.fillStyle = "#000000";
    ctxView.fillRect(0, 0, canvasView.width, canvasView.height);
    ctxView.translate(0.5 * canvasView.width, 0.5 * canvasView.height);
    ctxView.scale(100, -100);

    ctxView.beginPath();
    ctxView.arc(src.pos.x, src.pos.y, 0.3, 0, 2 * Math.PI);
    ctxView.fillStyle = "#ff0000";
    ctxView.fill();

    ctxView.beginPath();
    ctxView.arc(obs.pos.x, obs.pos.y, 0.3, 0, 2 * Math.PI);
    ctxView.fillStyle = "#0000ff";
    ctxView.fill();
    
    ctxView.restore();

    window.requestAnimationFrame(step);
}

timeStrt();
ctrlObs();

buttonTimeStrt.onclick = timeStrt;
buttonTimeStop.onclick = timeStop;
// buttonBufrSave.onclick = bufrSave();
// buttonBufrRstr.onclick = bufrRstr();
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
    buttonTimeStrt.disabled = true;
    buttonTimeStop.disabled = false;
    run = true;
}

function timeStop()
{
    buttonTimeStop.disabled = true;
    buttonTimeStrt.disabled = false;
    run = false;
}

function ctrlSrc()
{
    buttonCtrlSrc.disabled = true;
    buttonCtrlObs.disabled = false;
    obs.ctrl = false;

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
    buttonCtrlObs.disabled = true;
    buttonCtrlSrc.disabled = false;
    obs.ctrl = true;

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

function pwrOn()
{
    buttonPwrOn.disabled = true;
    buttonPwrOff.disabled = false;

    if(obs.ctrl === false)
    {
        src.pwr = true;
    }

    else if(obs.ctrl === true)
    {
        obs.pwr = true;
    }
}

function pwrOff()
{
    buttonPwrOff.disabled = true;
    buttonPwrOn.disabled = false;

    if(obs.ctrl === false)
    {
        src.pwr = false;
    }

    else if(obs.ctrl === true)
    {
        obs.pwr = false;
    }
}

function typePos()
{
    buttonTypePos.disabled = true;
    buttonTypeVel.disabled = false;
    buttonTypeAcc.disabled = false;

    if(obs.ctrl === false)
    {
        src.vel.x = 0;
        src.vel.y = 0;
        src.acc.x = 0;
        src.acc.y = 0;
        src.type = 1;
    }

    else if(obs.ctrl === true)
    {
        obs.vel.x = 0;
        obs.vel.y = 0;
        obs.acc.x = 0;
        obs.acc.y = 0;
        obs.type = 1;
    }

    dirZero();
    magMed();
}

function typeVel()
{
    buttonTypeVel.disabled = true;
    buttonTypePos.disabled = false;
    buttonTypeAcc.disabled = false;

    if(obs.ctrl === false)
    {
        src.acc.x = 0;
        src.acc.y = 0;
        src.type = 2;
    }

    else if(obs.ctrl === true)
    {
        obs.acc.x = 0;
        obs.acc.y = 0;
        obs.type = 2;
    }

    dirZero();
    magMed();
}

function typeAcc()
{
    buttonTypeAcc.disabled = true;
    buttonTypePos.disabled = false;
    buttonTypeVel.disabled = false;

    if(obs.ctrl === false)
    {
        src.type = 3;
    }

    else if(obs.ctrl === true)
    {
        obs.type = 3;
    }

    dirZero();
    magMed();
}

function dirLeft()
{
    buttonDirLeft.disabled = true;
    buttonDirRght.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirDown.disabled = false;
    buttonDirZero.disabled = false;

    if(obs.ctrl === false)
    {
        src.dir = 1;
    }

    else if(obs.ctrl === true)
    {
        obs.dir = 1;
    }
}

function dirRght()
{
    buttonDirRght.disabled = true;
    buttonDirLeft.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirDown.disabled = false;
    buttonDirZero.disabled = false;

    if(obs.ctrl === false)
    {
        src.dir = 2;
    }

    else if(obs.ctrl === true)
    {
        obs.dir = 2;
    }
}

function dirUp()
{
    buttonDirUp.disabled = true;
    buttonDirLeft.disabled = false;
    buttonDirRght.disabled = false;
    buttonDirDown.disabled = false;
    buttonDirZero.disabled = false;

    if(obs.ctrl === false)
    {
        src.dir = 3;
    }

    else if(obs.ctrl === true)
    {
        obs.dir = 3;
    }
}

function dirDown()
{
    buttonDirDown.disabled = true;
    buttonDirLeft.disabled = false;
    buttonDirRght.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirZero.disabled = false;

    if(obs.ctrl === false)
    {
        src.dir = 4;
    }

    else if(obs.ctrl === true)
    {
        obs.dir = 4;
    }
}

function dirZero()
{
    buttonDirZero.disabled = true;
    buttonDirLeft.disabled = false;
    buttonDirRght.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirDown.disabled = false;

    if(obs.ctrl === false)
    {
        src.dir = 0;
    }

    else if(obs.ctrl === true)
    {
        obs.dir = 0;
    }
}

function magLow()
{
    buttonMagLow.disabled = true;
    buttonMagMed.disabled = false;
    buttonMagHigh.disabled = false;

    if(obs.ctrl === false)
    {
        src.mag = 1;
    }

    else if(obs.ctrl === true)
    {
        obs.mag = 1;
    }
}

function magMed()
{
    buttonMagMed.disabled = true;
    buttonMagLow.disabled = false;
    buttonMagHigh.disabled = false;

    if(obs.ctrl === false)
    {
        src.mag = 2;
    }

    else if(obs.ctrl === true)
    {
        obs.mag = 2;
    }
}

function magHigh()
{
    buttonMagHigh.disabled = true;
    buttonMagLow.disabled = false;
    buttonMagMed.disabled = false;

    if(obs.ctrl === false)
    {
        src.mag = 3;
    }

    else if(obs.ctrl === true)
    {
        obs.mag = 3;
    }
}
