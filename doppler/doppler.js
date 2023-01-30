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
        src.vel.vel = false;
        src.acc.acc = false;
        src.pos.pos = true;
    }

    if(obs.ctrl)
    {
        obs.vel.vel = false;
        obs.acc.acc = false;
        obs.pos.pos = true;
    }
}

function typeVel()
{
    if(src.ctrl)
    {
        src.pos.pos = false;
        src.acc.acc = false;
        src.vel.vel = true;
    }

    if(obs.ctrl)
    {
        obs.pos.pos = false;
        obs.acc.acc = false;
        obs.vel.vel = true;
    }
}

function typeAcc()
{
    if(src.ctrl)
    {
        src.pos.pos = false;
        src.vel.vel = false;
        src.acc.acc = true;
    }

    if(obs.ctrl)
    {
        obs.pos.pos = false;
        obs.vel.vel = false;
        obs.acc.acc = true;
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
        pos: false,
        x: 0,
        y: 0
    },
    vel: {
        vel: true,
        x: 0,
        y: 0
    },
    acc: {
        acc: false,
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
        pos: false,
        x: 0,
        y: 0
    },
    vel: {
        vel: true,
        x: 0,
        y: 0
    },
    acc: {
        acc: false,
        x: 0,
        y: 0
    }
}
