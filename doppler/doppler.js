let run = true;
let time = 0;

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
};

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
};

const wavs = [];

window.requestAnimationFrame(step);

function step()
{
    if(src.dir !== -1)
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

    if(obs.dir !== -1)
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

        if(src.pwr === true && time % Math.floor(20 / src.freq) === 0)
        {
            wavs.push({
                time: 0,
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

        for(let w = 0; w < wavs.length; w++)
        {
            if(wavs[w].time >= 1000)
            {
                wavs.shift();
            }

            else
            {
                break;
            }
        }

        for(let w = 0; w < wavs.length; w++)
        {
            wavs[w].time += 1;
        }
        
        time += 1;
    }




    const ctxView = canvasView.getContext("2d");
    ctxView.save();
    ctxView.fillStyle = "#000000";
    ctxView.fillRect(0, 0, 800, 600);
    ctxView.translate(400, 300);
    ctxView.scale(100, -100);

    ctxView.beginPath();
    ctxView.arc(src.pos.x, src.pos.y, 0.3, 0, 2 * Math.PI);

    if(src.pwr === false)
    {
        ctxView.globalAlpha = 0.3;
    }

    ctxView.fillStyle = "#ff0000";
    ctxView.fill();
    
    if(obs.ctrl === false)
    {
        ctxView.lineWidth = 0.1;
        ctxView.strokeStyle = "#000000";
        ctxView.stroke();
        ctxView.lineWidth = 0.05;
        ctxView.strokeStyle = "#ff0000";
        ctxView.stroke();
    }

    else
    {
        ctxView.lineWidth = 0.02;
        ctxView.strokeStyle = "#000000";
        ctxView.stroke();
    }

    if(obs.pwr === false)
    {
        ctxView.globalAlpha = 0.3;
    }

    else
    {
        ctxView.globalAlpha = 1;
    }

    ctxView.beginPath();
    ctxView.arc(obs.pos.x, obs.pos.y, 0.3, 0, 2 * Math.PI);
    ctxView.fillStyle = "#0000ff";
    ctxView.fill();
    
    if(obs.ctrl === true)
    {
        ctxView.lineWidth = 0.1;
        ctxView.strokeStyle = "#000000";
        ctxView.stroke();
        ctxView.lineWidth = 0.05;
        ctxView.strokeStyle = "#0000ff";
        ctxView.stroke();
    }

    else
    {
        ctxView.lineWidth = 0.02;
        ctxView.strokeStyle = "#000000";
        ctxView.stroke();
    }

    for(let w = 0; w < wavs.length; w++)
    {
        ctxView.beginPath();
        ctxView.arc(wavs[w].pos.x, wavs[w].pos.y, 0.01 * wavs[w].time, 0, 2 * Math.PI);
        ctxView.globalAlpha = 1 - 0.001 * wavs[w].time;
        ctxView.lineWidth = 0.03;
        ctxView.strokeStyle = "#ffffff";
        ctxView.stroke();
        ctxView.globalAlpha = 1;
    }

    ctxView.restore();

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

    dirNone();
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

    dirNone();
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

    dirNone();
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

function dirNone()
{
    buttonDirLeft.disabled = false;
    buttonDirRght.disabled = false;
    buttonDirUp.disabled = false;
    buttonDirDown.disabled = false;
    buttonDirZero.disabled = false;

    if(obs.ctrl === false)
    {
        src.dir = -1;
    }

    else if(obs.ctrl === true)
    {
        obs.dir = -1;
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
