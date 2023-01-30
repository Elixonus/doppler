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

const src = {
    ctrl: true,
    pwr: true,
    freq: 1,
    amp: 1,
    pos: {
        type: false,
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    },
    vel: {
        type: true,
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    },
    acc: {
        type: false,
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    }
}

const obs = {
    ctrl: false,
    pwr: true,
    freq: 1,
    amp: 1,
    pos: {
        type: false,
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    },
    vel: {
        type: true,
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    },
    acc: {
        type: false,
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    }
}

window.requestAnimationFrame(step);

function step()
{
    // render code and logic as well

    window.requestAnimationFrame(step);
}


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
    run = true;
    buttonTimeStrt.disabled = true;
    buttonTimeStop.disabled = false;
}

function timeStop()
{
    run = false;
    buttonTimeStop.disabled = true;
    buttonTimeStrt.disabled = false;
}

function ctrlSrc()
{
    obs.ctrl = false;
    src.ctrl = true;
}

function ctrlObs()
{
    src.ctrl = false;
    obs.ctrl = true;
}

function pwrOn()
{
    if(src.ctrl)
    {
        src.pwr = true;
    }

    if(obs.ctrl)
    {
        obs.pwr = true;
    }
}

function pwrOff()
{
    if(src.ctrl)
    {
        src.pwr = false;
    }

    if(obs.ctrl)
    {
        obs.pwr = false;
    }
}

function typePos()
{
    if(src.ctrl)
    {
        src.vel.type = false;
        src.acc.type = false;
        src.pos.type = true;
    }

    if(obs.ctrl)
    {
        obs.vel.type = false;
        obs.acc.type = false;
        obs.pos.type = true;
    }
}

function typeVel()
{
    if(src.ctrl)
    {
        src.pos.type = false;
        src.acc.type = false;
        src.vel.type = true;
    }

    if(obs.ctrl)
    {
        obs.pos.type = false;
        obs.acc.type = false;
        obs.vel.type = true;
    }
}

function typeAcc()
{
    if(src.ctrl)
    {
        src.pos.type = false;
        src.vel.type = false;
        src.acc.type = true;
    }

    if(obs.ctrl)
    {
        obs.pos.type = false;
        obs.vel.type = false;
        obs.acc.type = true;
    }
}

function dirLeft()
{
    if(src.ctrl)
    {
        if(src.pos.type)
        {
            src.pos.dir = 1;
        }

        if(src.vel.type)
        {
            src.vel.dir = 1;
        }

        if(src.acc.type)
        {
            src.acc.dir = 1;
        }
    }

    if(obs.ctrl)
    {
        if(obs.pos.type)
        {
            obs.pos.dir = 1;
        }

        if(obs.vel.type)
        {
            obs.vel.dir = 1;
        }

        if(obs.acc.type)
        {
            obs.acc.dir = 1;
        }
    }
}

function dirRght()
{
    if(src.ctrl)
    {
        if(src.pos.type)
        {
            src.pos.dir = 2;
        }

        if(src.vel.type)
        {
            src.vel.dir = 2;
        }

        if(src.acc.type)
        {
            src.acc.dir = 2;
        }
    }

    if(obs.ctrl)
    {
        if(obs.pos.type)
        {
            obs.pos.dir = 2;
        }

        if(obs.vel.type)
        {
            obs.vel.dir = 2;
        }

        if(obs.acc.type)
        {
            obs.acc.dir = 2;
        }
    }
}

function dirUp()
{
    if(src.ctrl)
    {
        if(src.pos.type)
        {
            src.pos.dir = 3;
        }

        if(src.vel.type)
        {
            src.vel.dir = 3;
        }

        if(src.acc.type)
        {
            src.acc.dir = 3;
        }
    }

    if(obs.ctrl)
    {
        if(obs.pos.type)
        {
            obs.pos.dir = 3;
        }

        if(obs.vel.type)
        {
            obs.vel.dir = 3;
        }

        if(obs.acc.type)
        {
            obs.acc.dir = 3;
        }
    }
}

function dirDown()
{
    if(src.ctrl)
    {
        if(src.pos.type)
        {
            src.pos.dir = 4;
        }

        if(src.vel.type)
        {
            src.vel.dir = 4;
        }

        if(src.acc.type)
        {
            src.acc.dir = 4;
        }
    }

    if(obs.ctrl)
    {
        if(obs.pos.type)
        {
            obs.pos.dir = 4;
        }

        if(obs.vel.type)
        {
            obs.vel.dir = 4;
        }

        if(obs.acc.type)
        {
            obs.acc.dir = 4;
        }
    }
}

function dirZero()
{
    if(src.ctrl)
    {
        if(src.pos.type)
        {
            src.pos.dir = 0;
        }

        if(src.vel.type)
        {
            src.vel.dir = 0;
        }

        if(src.acc.type)
        {
            src.acc.dir = 0;
        }
    }

    if(obs.ctrl)
    {
        if(obs.pos.type)
        {
            obs.pos.dir = 0;
        }

        if(obs.vel.type)
        {
            obs.vel.dir = 0;
        }

        if(obs.acc.type)
        {
            obs.acc.dir = 0;
        }
    }
}

function magLow()
{
    if(src.ctrl)
    {
        if(src.pos.type)
        {
            src.pos.mag = 1;
        }

        if(src.vel.type)
        {
            src.vel.mag = 1;
        }

        if(src.acc.type)
        {
            src.acc.mag = 1;
        }
    }

    if(obs.ctrl)
    {
        if(obs.pos.type)
        {
            obs.pos.mag = 1;
        }

        if(obs.vel.type)
        {
            obs.vel.mag = 1;
        }

        if(obs.acc.type)
        {
            obs.acc.mag = 1;
        }
    }
}

function magMed()
{
    if(src.ctrl)
    {
        if(src.pos.type)
        {
            src.pos.mag = 2;
        }

        if(src.vel.type)
        {
            src.vel.mag = 2;
        }

        if(src.acc.type)
        {
            src.acc.mag = 2;
        }
    }

    if(obs.ctrl)
    {
        if(obs.pos.type)
        {
            obs.pos.mag = 2;
        }

        if(obs.vel.type)
        {
            obs.vel.mag = 2;
        }

        if(obs.acc.type)
        {
            obs.acc.mag = 2;
        }
    }
}

function magHigh()
{
    if(src.ctrl)
    {
        if(src.pos.type)
        {
            src.pos.mag = 3;
        }

        if(src.vel.type)
        {
            src.vel.mag = 3;
        }

        if(src.acc.type)
        {
            src.acc.mag = 3;
        }
    }

    if(obs.ctrl)
    {
        if(obs.pos.type)
        {
            obs.pos.mag = 3;
        }

        if(obs.vel.type)
        {
            obs.vel.mag = 3;
        }

        if(obs.acc.type)
        {
            obs.acc.mag = 3;
        }
    }
}
