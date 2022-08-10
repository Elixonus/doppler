var up = false;
var down = false;
var left = false;
var right = false;

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

var time = 0;
var lightbulb =
{
  wavelength: 550,
  position:
  {
    x: -250,
    y: 0
  }
};
var observer =
{
  lastWaveTime: 0,
  position:
  {
    x: 0,
    y: 150
  }
};
var waves = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function render()
{
  var speed = Number(document.getElementById("speed-input").value);
  document.getElementById("speed-value").innerHTML = "Speed of the source is: " + speed + " time(s) the speed of sound";

  if(up)
  {
    lightbulb.position.y -= speed;
  }
  
  else if(down)
  {
    lightbulb.position.y += speed;
  }
  
  else if(left)
  {
    lightbulb.position.x -= speed;
  }
  
  else if(right)
  {
    lightbulb.position.x += speed;
  }

    if(time % 10 === 0)
  {
    waves.push(
    {
      time: 0,
      seen: false,
      position:
      {
        x: lightbulb.position.x,
        y: lightbulb.position.y
      }
    });
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 500, 500);
  
  ctx.translate(250, 250);
  
  var hue = 280 * ((300 - (lightbulb.wavelength - 400)) / (700 - 400));
  ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
  ctx.beginPath();
  ctx.arc(lightbulb.position.x, lightbulb.position.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillText("S", lightbulb.position.x - 4, lightbulb.position.y + 30);
  
  if(observer.timeDifference !== undefined)
  {
    var newWavelength = Math.max(Math.min(lightbulb.wavelength * observer.timeDifference / 10, 700), 400);
    var newHue = 280 * ((300 - (newWavelength - 400)) / (700 - 400));
    ctx.fillStyle = "hsl(" + newHue + ", 100%, 50%)";
  }
  
  else
  {
    ctx.fillStyle = "gray";
  }

  ctx.beginPath();
  ctx.arc(observer.position.x, observer.position.y, 20, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillText("O", observer.position.x - 4, observer.position.y + 30);
  
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  
  for(var n = 0; n < waves.length; n++)
  {
    var wave = waves[n];
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