function timeStrt()
{
    run = true;
}

function timeStop()
{
    run = false;
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

document.getElementById("time-strt").onclick = timeStrt();
document.getElementById("time-stop").onclick = timeStop();
document.getElementById("bufr-save").onclick = bufrSave();
document.getElementById("bufr-rstr").onclick = bufrRstr();
document.getElementById("ctrl-src").onclick = ctrlSrc();
document.getElementById("ctrl-obs").onclick = ctrlObs();
document.getElementById("pwr-on").onclick = pwrOn();
document.getElementById("pwr-off").onclick = pwrOff();
document.getElementById("type-pos").onclick = typePos();
document.getElementById("type-vel").onclick = typeVel();
document.getElementById("type-acc").onclick = typeAcc();
document.getElementById("dir-left").onclick = dirLeft();
document.getElementById("dir-rght").onclick = dirRght();
document.getElementById("dir-up").onclick = dirUp();
document.getElementById("dir-down").onclick = dirDown();
document.getElementById("dir-zero").onclick = dirZero();
document.getElementById("mag-low").onclick = magLow();
document.getElementById("mag-med").onclick = magMed();
document.getElementById("mag-high").onclick = magHigh();

let run = true;

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
