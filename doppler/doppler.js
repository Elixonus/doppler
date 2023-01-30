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
    pwr: true,
    freq: 1,
    amp: 1,
    type: 2,
    pos: {
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    },
    vel: {
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    },
    acc: {
        dir: 0,
        mag: 2,
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
    pos: {
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    },
    vel: {
        dir: 0,
        mag: 2,
        x: 0,
        y: 0
    },
    acc: {
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

//ctrlObs();

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

    if(src.type === 0)
    {
        typePos();
    }

    else if(src.type === 1)
    {
        typeVel();
    }

    else if(src.type === 2)
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
    
    if(obs.type === 0)
    {
        typePos();
    }

    else if(obs.type === 1)
    {
        typeVel();
    }

    else if(obs.type === 2)
    {
        typeAcc();
    }
}

function pwrOn()
{
    buttonPwrOn.disabled = true;
    buttonPwrOff.disabled = false;

    if(!obs.ctrl)
    {
        src.pwr = true;
    }

    else
    {
        obs.pwr = true;
    }
}

function pwrOff()
{
    buttonPwrOff.disabled = true;
    buttonPwrOn.disabled = false;

    if(!obs.ctrl)
    {
        src.pwr = false;
    }

    else
    {
        obs.pwr = false;
    }
}

function typePos()
{
    buttonTypePos.disabled = true;
    buttonTypeVel.disabled = false;
    buttonTypeAcc.disabled = false;

    if(!obs.ctrl)
    {
        src.vel.type = false;
        src.acc.type = false;
        src.pos.type = true;

        if(src.pos.dir === 0)
        {
            dirZero();
        }

        else if(src.pos.dir === 1)
        {
            dirLeft();
        }

        else if(src.pos.dir === 2)
        {
            dirRght();
        }

        else if(src.pos.dir === 3)
        {
            dirUp();
        }

        else if(src.pos.dir === 4)
        {
            dirDown();
        }

        if(src.pos.mag === 1)
        {
            magLow();
        }

        else if(src.pos.mag === 2)
        {
            magMed();
        }

        else if(src.pos.mag === 3)
        {
            magHigh();
        }
    }

    else
    {
        obs.vel.type = false;
        obs.acc.type = false;
        obs.pos.type = true;

        if(obs.pos.dir === 0)
        {
            dirZero();
        }

        else if(obs.pos.dir === 1)
        {
            dirLeft();
        }

        else if(obs.pos.dir === 2)
        {
            dirRght();
        }

        else if(obs.pos.dir === 3)
        {
            dirUp();
        }

        else if(obs.pos.dir === 4)
        {
            dirDown();
        }

        if(obs.pos.mag === 1)
        {
            magLow();
        }

        else if(obs.pos.mag === 2)
        {
            magMed();
        }

        else if(obs.pos.mag === 3)
        {
            magHigh();
        }
    }
}

function typeVel()
{
    buttonTypeVel.disabled = true;
    buttonTypePos.disabled = false;
    buttonTypeAcc.disabled = false;

    if(!obs.ctrl)
    {
        src.pos.type = false;
        src.acc.type = false;
        src.vel.type = true;

        if(src.vel.dir === 0)
        {
            dirZero();
        }

        else if(src.vel.dir === 1)
        {
            dirLeft();
        }

        else if(src.vel.dir === 2)
        {
            dirRght();
        }

        else if(src.vel.dir === 3)
        {
            dirUp();
        }

        else if(src.vel.dir === 4)
        {
            dirDown();
        }

        if(src.vel.mag === 1)
        {
            magLow();
        }

        else if(src.vel.mag === 2)
        {
            magMed();
        }

        else if(src.vel.mag === 3)
        {
            magHigh();
        }
    }

    else
    {
        obs.pos.type = false;
        obs.acc.type = false;
        obs.vel.type = true;

        if(obs.vel.dir === 0)
        {
            dirZero();
        }

        else if(obs.vel.dir === 1)
        {
            dirLeft();
        }

        else if(obs.vel.dir === 2)
        {
            dirRght();
        }

        else if(obs.vel.dir === 3)
        {
            dirUp();
        }

        else if(obs.vel.dir === 4)
        {
            dirDown();
        }

        if(obs.vel.mag === 1)
        {
            magLow();
        }

        else if(obs.vel.mag === 2)
        {
            magMed();
        }

        else if(obs.vel.mag === 3)
        {
            magHigh();
        }
    }
}

function typeAcc()
{
    buttonTypeAcc.disabled = true;
    buttonTypePos.disabled = false;
    buttonTypeVel.disabled = false;

    if(!obs.ctrl)
    {
        src.pos.type = false;
        src.vel.type = false;
        src.acc.type = true;

        if(src.acc.dir === 0)
        {
            dirZero();
        }

        else if(src.acc.dir === 1)
        {
            dirLeft();
        }

        else if(src.acc.dir === 2)
        {
            dirRght();
        }

        else if(src.acc.dir === 3)
        {
            dirUp();
        }

        else if(src.acc.dir === 4)
        {
            dirDown();
        }

        if(src.acc.mag === 1)
        {
            magLow();
        }

        else if(src.acc.mag === 2)
        {
            magMed();
        }

        else if(src.acc.mag === 3)
        {
            magHigh();
        }
    }

    else
    {
        obs.pos.type = false;
        obs.vel.type = false;
        obs.acc.type = true;

        if(obs.acc.dir === 0)
        {
            dirZero();
        }

        else if(obs.acc.dir === 1)
        {
            dirLeft();
        }

        else if(obs.acc.dir === 2)
        {
            dirRght();
        }

        else if(obs.acc.dir === 3)
        {
            dirUp();
        }

        else if(obs.acc.dir === 4)
        {
            dirDown();
        }

        if(src.acc.mag === 1)
        {
            magLow();
        }

        else if(src.acc.mag === 2)
        {
            magMed();
        }

        else if(src.acc.mag === 3)
        {
            magHigh();
        }
    }
}

function dirLeft()
{
    buttonDirLeft.disabled = true;
    buttonDirRght.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirDown.disabled = false;
    buttonDirZero.disabled = false;

    if(!obs.ctrl)
    {
        if(src.type === 0)
        {
            src.pos.dir = 1;
        }

        else if(src.type === 1)
        {
            src.vel.dir = 1;
        }

        else if(src.type === 2)
        {
            src.acc.dir = 1;
        }
    }

    else
    {
        if(obs.type === 0)
        {
            obs.pos.dir = 1;
        }

        else if(obs.type === 1)
        {
            obs.vel.dir = 1;
        }

        else if(obs.type === 2)
        {
            obs.acc.dir = 1;
        }
    }
}

function dirRght()
{
    buttonDirRght.disabled = true;
    buttonDirLeft.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirDown.disabled = false;
    buttonDirZero.disabled = false;

    if(!obs.ctrl)
    {
        if(src.type === 0)
        {
            src.pos.dir = 2;
        }

        else if(src.type === 1)
        {
            src.vel.dir = 2;
        }

        else if(src.type === 2)
        {
            src.acc.dir = 2;
        }
    }

    else
    {
        if(obs.type === 0)
        {
            obs.pos.dir = 2;
        }

        else if(obs.type === 1)
        {
            obs.vel.dir = 2;
        }

        else if(obs.type === 2)
        {
            obs.acc.dir = 2;
        }
    }
}

function dirUp()
{
    buttonDirUp.disabled = true;
    buttonDirLeft.disabled = false;
    buttonDirRght.disabled = false;
    buttonDirDown.disabled = false;
    buttonDirZero.disabled = false;

    if(!obs.ctrl)
    {
        if(src.type === 0)
        {
            src.pos.dir = 3;
        }

        else if(src.type === 1)
        {
            src.vel.dir = 3;
        }

        else if(src.type === 2)
        {
            src.acc.dir = 3;
        }
    }

    else
    {
        if(obs.type === 0)
        {
            obs.pos.dir = 3;
        }

        else if(obs.type === 1)
        {
            obs.vel.dir = 3;
        }

        else if(obs.type === 2)
        {
            obs.acc.dir = 3;
        }
    }
}

function dirDown()
{
    buttonDirDown.disabled = true;
    buttonDirLeft.disabled = false;
    buttonDirRght.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirZero.disabled = false;

    if(!obs.ctrl)
    {
        if(src.type === 0)
        {
            src.pos.dir = 4;
        }

        else if(src.type === 1)
        {
            src.vel.dir = 4;
        }

        else if(src.type === 2)
        {
            src.acc.dir = 4;
        }
    }

    else
    {
        if(obs.type === 0)
        {
            obs.pos.dir = 4;
        }

        else if(obs.type === 1)
        {
            obs.vel.dir = 4;
        }

        else if(obs.type === 2)
        {
            obs.acc.dir = 4;
        }
    }
}

function dirZero()
{
    buttonDirZero.disabled = true;
    buttonDirLeft.disabled = false;
    buttonDirRght.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirDown.disabled = false;

    if(!obs.ctrl)
    {
        if(src.type === 0)
        {
            src.pos.dir = 0;
        }

        else if(src.type === 1)
        {
            src.vel.dir = 0;
        }

        else if(src.type === 2)
        {
            src.acc.dir = 0;
        }
    }

    else
    {
        if(obs.type === 0)
        {
            obs.pos.dir = 0;
        }

        else if(obs.type === 1)
        {
            obs.vel.dir = 0;
        }

        else if(obs.type === 2)
        {
            obs.acc.dir = 0;
        }
    }
}

function magLow()
{
    buttonMagLow.disabled = true;
    buttonMagMed.disabled = false;
    buttonMagHigh.disabled = false;

    if(!obs.ctrl)
    {
        if(src.type === 0)
        {
            src.pos.mag = 1;
        }

        else if(src.type === 1)
        {
            src.vel.mag = 1;
        }

        else if(src.type === 2)
        {
            src.acc.mag = 1;
        }
    }

    else
    {
        if(obs.type === 0)
        {
            obs.pos.mag = 1;
        }

        else if(obs.type === 1)
        {
            obs.vel.mag = 1;
        }

        else if(obs.type === 2)
        {
            obs.acc.mag = 1;
        }
    }
}

function magMed()
{
    buttonMagMed.disabled = true;
    buttonMagLow.disabled = false;
    buttonMagHigh.disabled = false;

    if(!obs.ctrl)
    {
        if(src.type === 0)
        {
            src.pos.mag = 2;
        }

        else if(src.type === 1)
        {
            src.vel.mag = 2;
        }

        else if(src.type === 2)
        {
            src.acc.mag = 2;
        }
    }

    else
    {
        if(obs.type === 0)
        {
            obs.pos.mag = 2;
        }

        else if(obs.type === 1)
        {
            obs.vel.mag = 2;
        }

        else if(obs.type === 2)
        {
            obs.acc.mag = 2;
        }
    }
}

function magHigh()
{
    buttonMagHigh.disabled = true;
    buttonMagLow.disabled = false;
    buttonMagMed.disabled = false;

    if(!obs.ctrl)
    {
        if(src.type === 0)
        {
            src.pos.mag = 3;
        }

        else if(src.type === 1)
        {
            src.vel.mag = 3;
        }

        else if(src.type === 2)
        {
            src.acc.mag = 3;
        }
    }

    else
    {
        if(obs.type === 0)
        {
            obs.pos.mag = 3;
        }

        else if(obs.type === 1)
        {
            obs.vel.mag = 3;
        }

        else if(obs.type === 2)
        {
            obs.acc.mag = 3;
        }
    }
}
