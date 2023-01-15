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
  wavelength: 550,
  position:
  {
    x: 0,
    y: 0
  }
};
const observer =
{
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

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 500, 500);
  
  ctx.translate(250, 250);
  
  let hue = 280 * ((300 - (source.wavelength - 400)) / (700 - 400));
  ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
  ctx.beginPath();
  ctx.arc(source.position.x, source.position.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillText("SRC", source.position.x - 4, source.position.y + 30);
  
  if(observer.timeDifference !== undefined)
  {
    let newWavelength = Math.max(Math.min(source.wavelength * observer.timeDifference / 10, 700), 400);
    let newHue = 280 * ((300 - (newWavelength - 400)) / (700 - 400));
    ctx.fillStyle = "hsl(" + newHue + ", 100%, 50%)";
  }
  
  else
  {
    ctx.fillStyle = "gray";
  }

  ctx.beginPath();
  ctx.arc(observer.position.x, observer.position.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillText("OBS", observer.position.x - 4, observer.position.y + 30);
  
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  
  for(let n = 0; n < waves.length; n++)
  {
    const wave = waves[n];
    ctx.beginPath();
    ctx.arc(wave.position.x, wave.position.y, wave.time, 0, 2 * Math.PI);
    ctx.stroke();
    wave.time += 1;
    
    if(wave.time > 500)
    {
      waves.splice(waves.indexOf(wave), 1);
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
