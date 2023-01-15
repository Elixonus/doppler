let up = false;
let down = false;
let left = false;
let right = false;

function goUp()
{
  goStop();
  up = true;
}

function goDown()
{
  goStop();
  down = true;
}

function goLeft()
{
  goStop();
  left = true;
}

function goRight()
{
  goStop();
  right = true;
}

function goStop()
{
  up = false;
  down = false;
  left = false;
  right = false;
}

function goCenter()
{
  source.position.x = 0
  source.position.y = 0
}

let time = 0;
const source =
{
  wavelength: 510,
  position:
  {
    x: 0,
    y: 0
  }
};
const observer =
{
  wavelength: 510,
  lastWaveTime: 0,
  position:
  {
    x: 0,
    y: 150
  }
};
const waves = [];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.font = "15px Arial";

function render()
{
  let speed = Number(document.getElementById("speed-input").value);
  document.getElementById("speed-value").innerHTML = "Speed of the source is: " + speed + " time(s) the speed of sound";

  if(up)
  {
    source.position.y -= speed;
  }
  
  if(down)
  {
    source.position.y += speed;
  }
  
  if(left)
  {
    source.position.x -= speed;
  }
  
  if(right)
  {
    source.position.x += speed;
  }

  if(time % 10 === 0)
  {
    waves.push(
    {
      time: 0,
      seen: false,
      position:
      {
        x: source.position.x,
        y: source.position.y
      }
    });
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 500, 500);
  
  ctx.translate(250, 250);
  
  ctx.fillStyle = wavelengthToColor(source.wavelength)[0];
  ctx.beginPath();
  ctx.arc(source.position.x, source.position.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(source.position.x, source.position.y, 3, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillText("SRC", source.position.x - 13, source.position.y + 35);
  
  if(observer.timeDifference !== undefined)
  {
    let newWavelength = Math.max(Math.min(source.wavelength * observer.timeDifference / 10, 700), 410);
    observer.wavelength = 0.9 * observer.wavelength + 0.1 * newWavelength;
    ctx.fillStyle = wavelengthToColor(observer.wavelength)[0];
  }
  
  else
  {
    ctx.fillStyle = "#808080";
  }

  ctx.beginPath();
  ctx.arc(observer.position.x, observer.position.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(observer.position.x, observer.position.y, 3, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillText("OBS", observer.position.x - 13, observer.position.y + 35);
  
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  
  for(let n = 0; n < waves.length; n++)
  {
    const wave = waves[n];

    if(wave.time > 350)
    {
      ctx.globalAlpha = (400 - wave.time) / 50;
    }

    ctx.beginPath();
    ctx.arc(wave.position.x, wave.position.y, wave.time, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 1;

    wave.time += 1;
    
    if(wave.time > 400)
    {
      waves.splice(n, 1);
      n--;
      continue;
    }
    
    if(wave.time >= Math.hypot(wave.position.x - observer.position.x, wave.position.y - observer.position.y) && !wave.seen)
    {
      wave.seen = true;
      observer.timeDifference = time - observer.lastWaveTime;
      observer.lastWaveTime = time;
    }
  }
  
  time += 1;
  
  ctx.resetTransform();
  window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);

// function made by ams from Science Primer
function wavelengthToColor(wavelength)
{
  let r, g, b, alpha, colorSpace, wl = wavelength, gamma = 1;
  if(wl >= 380 && wl < 440)
  {
    r = -1 * (wl - 440) / (440 - 380);
    g = 0;
    b = 1;
  }
  else if(wl >= 440 && wl < 490)
  {
    r = 0;
    g = (wl - 440) / (490 - 440);
    b = 1;  
  }
  else if(wl >= 490 && wl < 510)
  {
    r = 0;
    g = 1;
    b = -1 * (wl - 510) / (510 - 490);
  }
  else if(wl >= 510 && wl < 580)
  {
    r = (wl - 510) / (580 - 510);
    g = 1;
    b = 0;
  }
  else if(wl >= 580 && wl < 645)
  {
    r = 1;
    g = -1 * (wl - 645) / (645 - 580);
    b = 0.0;
  }
  else if(wl >= 645 && wl <= 780)
  {
    r = 1;
    g = 0;
    b = 0;
  }
  else
  {
    r = 0;
    g = 0;
    b = 0;
  }
  if(wl > 780 || wl < 380)
  {
    alpha = 0;
  }
  else if(wl > 700)
  {
    alpha = (780 - wl) / (780 - 700);
  }
  else if(wl < 420)
  {
    alpha = (wl - 380) / (420 - 380);
  }
  else
  {
    alpha = 1;
  }
  colorSpace = ["rgba(" + (r * 100) + "%," + (g * 100) + "%," + (b * 100) + "%, " + alpha + ")", r, g, b, alpha]
  return colorSpace;
}
