/*
let scr = document.createElement("script");
scr.src = "../acoustics/script.js";
document.body.appendChild(scr);
*/

const lgo = document.createElement("img");
lgo.src = "../acoustics/logo.gif";
lgo.alt = "ACOUSTICS logo";
lgo.style.marginLeft = "10px";
lgo.style.verticalAlign = "middle";
document.getElementById("title").appendChild(lgo);

const canvGeo = document.createElement("canvas");
canvGeo.width = 800;
canvGeo.height = 600;
canvGeo.classList.add("canvas");
const contGeo = document.createElement("div");
contGeo.classList.add("content");
contGeo.appendChild(canvGeo);
const labGeo = document.createElement("h3");
labGeo.innerText = "GEOMETRY of TIME";
labGeo.classList.add("label");
const panGeo = document.createElement("div");
panGeo.classList.add("panel");
panGeo.appendChild(labGeo);
panGeo.appendChild(contGeo);
document.getElementsByClassName("group")[5].appendChild(panGeo);

let ctxGeo = canvGeo.getContext("2d", {alpha: false});
window.requestAnimationFrame(doAnimGeo);

function doAnimGeo() {
    doViewGeo();
    window.requestAnimationFrame(doAnimGeo);
}

function doViewGeo() {
    ctxGeo.fillStyle = "#000";
    ctxGeo.fillRect(0, 0, 800, 600);

    ctxGeo.save();
    ctxGeo.scale(100, 100);
    ctxGeo.translate(4, 3);
    ctxGeo.scale(1, -1);

    ctxGeo.beginPath();
    ctxGeo.arc(obs.pos.x, obs.pos.y, 0.2, 0, 2 * Math.PI);
    ctxGeo.fillStyle = "#0f0";
    ctxGeo.fill();

    ctxGeo.beginPath();
    ctxGeo.arc(src.pos.x, src.pos.y, 0.2, 0, 2 * Math.PI);
    ctxGeo.fillStyle = "#f00";
    ctxGeo.fill();

    if (obs.wav !== null) {
        ctxGeo.beginPath();
        ctxGeo.arc(obs.wav.pos.x, obs.wav.pos.y, 0.05, 0, 2 * Math.PI);
        ctxGeo.fillStyle = "#ff0";
        ctxGeo.fill();
    
        ctxGeo.beginPath();
        ctxGeo.lineTo(obs.wav.pos.x, obs.wav.pos.y);
        ctxGeo.lineTo(obs.pos.x, obs.pos.y);
        ctxGeo.lineWidth = 0.03;
        ctxGeo.strokeStyle = "#fff";
        ctxGeo.stroke();

        if (Math.hypot(obs.wav.vel.x, obs.wav.vel.y) > 0.01 * wspd) {
            ctxGeo.save();
            ctxGeo.translate(obs.wav.pos.x, obs.wav.pos.y);
            ctxGeo.beginPath();
            ctxGeo.lineTo(0, 0);
            ctxGeo.translate(obs.wav.vel.x / wspd, obs.wav.vel.y / wspd);
            ctxGeo.rotate(Math.atan2(obs.wav.vel.y, obs.wav.vel.x));
            ctxGeo.lineTo(0, 0);
            ctxGeo.lineWidth = 0.02;
            ctxGeo.strokeStyle = "#ff0";
            ctxGeo.stroke();
            ctxGeo.beginPath();
            ctxGeo.lineTo(-0.1, 0.1);
            ctxGeo.lineTo(-0.1, -0.1);
            ctxGeo.lineTo(0, 0);
            ctxGeo.closePath(); 
            ctxGeo.stroke();
            ctxGeo.restore();
        }
    }

    if (obs.wav !== null) {
        let dist = Math.hypot(obs.wav.pos.x - obs.pos.x, obs.wav.pos.y - obs.pos.y);
        let svel = (obs.wav.vel.x * (obs.wav.pos.x - obs.pos.x) + obs.wav.vel.y * (obs.wav.pos.y - obs.pos.y)) / dist;
        svel = {
            x: svel * (obs.wav.pos.x - obs.pos.x) / dist,
            y: svel * (obs.wav.pos.y - obs.pos.y) / dist
        };
        let ovel = (obs.vel.x * (obs.pos.x - obs.wav.pos.x) + obs.vel.y * (obs.pos.y - obs.wav.pos.y)) / dist;
        ovel = {
            x: ovel * (obs.pos.x - obs.wav.pos.x) / dist,
            y: ovel * (obs.pos.y - obs.wav.pos.y) / dist
        };
    
        if (Math.hypot(svel.x, svel.y) > 0.01 * wspd) {
            ctxGeo.save();
            ctxGeo.translate(obs.wav.pos.x, obs.wav.pos.y);
            ctxGeo.beginPath();
            ctxGeo.lineTo(0, 0);
            ctxGeo.translate(svel.x / wspd, svel.y / wspd);
            ctxGeo.rotate(Math.atan2(svel.y, svel.x));
            ctxGeo.lineTo(0, 0);
            ctxGeo.lineWidth = 0.02;
            ctxGeo.strokeStyle = "#880";
            ctxGeo.stroke();
            ctxGeo.beginPath();
            ctxGeo.lineTo(-0.1, 0.1);
            ctxGeo.lineTo(-0.1, -0.1);
            ctxGeo.lineTo(0, 0);
            ctxGeo.closePath(); 
            ctxGeo.stroke();
            ctxGeo.restore();
        }

        if (Math.hypot(ovel.x, ovel.y) > 0.01 * wspd) {
            ctxGeo.save();
            ctxGeo.beginPath();
            ctxGeo.lineTo(obs.pos.x + ovel.x / wspd, obs.pos.y + ovel.y / wspd);
            ctxGeo.lineTo(obs.pos.x + obs.vel.x / wspd, obs.pos.y + obs.vel.y / wspd);
            ctxGeo.lineWidth = 0.02;
            ctxGeo.setLineDash([0.07, 0.04]);
            ctxGeo.strokeStyle = "#fff";
            ctxGeo.stroke();
            ctxGeo.restore();
    
            ctxGeo.save();
            ctxGeo.translate(obs.pos.x + ovel.x / wspd, obs.pos.y + ovel.y / wspd);
            ctxGeo.rotate(Math.atan2(ovel.y / wspd, ovel.x / wspd));
            if ((((Math.atan2(obs.vel.y, obs.vel.x) - Math.atan2(ovel.y, ovel.x)) + Math.PI) % (2 * Math.PI)) - Math.PI < 0) {
                ctxGeo.scale(1, -1);
            }
            ctxGeo.beginPath();
            ctxGeo.lineTo(0, 0);
            ctxGeo.lineTo(0, 0.15);
            ctxGeo.lineTo(-0.15, 0.15);
            ctxGeo.lineTo(-0.15, 0);
            ctxGeo.closePath();
            ctxGeo.lineWidth = 0.02;
            ctxGeo.strokeStyle = "#fff";
            ctxGeo.stroke();
            ctxGeo.restore();

            ctxGeo.save();
            ctxGeo.translate(obs.pos.x, obs.pos.y);
            ctxGeo.beginPath();
            ctxGeo.lineTo(0, 0);
            ctxGeo.translate(ovel.x / wspd, ovel.y / wspd);
            ctxGeo.rotate(Math.atan2(ovel.y, ovel.x));
            ctxGeo.lineTo(0, 0);
            ctxGeo.lineWidth = 0.02;
            ctxGeo.strokeStyle = "#080";
            ctxGeo.stroke();
            ctxGeo.beginPath();
            ctxGeo.lineTo(-0.1, 0.1);
            ctxGeo.lineTo(-0.1, -0.1);
            ctxGeo.lineTo(0, 0);
            ctxGeo.closePath(); 
            ctxGeo.stroke();
            ctxGeo.restore();
        }

        if (Math.hypot(svel.x, svel.y) > 0.01 * wspd) {
            ctxGeo.save();
            ctxGeo.beginPath();
            ctxGeo.lineTo(obs.wav.pos.x + svel.x / wspd, obs.wav.pos.y + svel.y / wspd);
            ctxGeo.lineTo(obs.wav.pos.x + obs.wav.vel.x / wspd, obs.wav.pos.y + obs.wav.vel.y / wspd);
            ctxGeo.lineWidth = 0.02;
            ctxGeo.setLineDash([0.07, 0.04]);
            ctxGeo.strokeStyle = "#fff";
            ctxGeo.stroke();
            ctxGeo.restore();
    
            ctxGeo.save();
            ctxGeo.translate(obs.wav.pos.x + svel.x / wspd, obs.wav.pos.y + svel.y / wspd);
            ctxGeo.rotate(Math.atan2(svel.y / wspd, svel.x / wspd));
            if ((((Math.atan2(obs.wav.vel.y, obs.wav.vel.x) - Math.atan2(svel.y, svel.x)) + Math.PI) % (2 * Math.PI)) - Math.PI < 0) {
                ctxGeo.scale(1, -1);
            }
            ctxGeo.beginPath();
            ctxGeo.lineTo(0, 0);
            ctxGeo.lineTo(0, 0.15);
            ctxGeo.lineTo(-0.15, 0.15);
            ctxGeo.lineTo(-0.15, 0);
            ctxGeo.closePath();
            ctxGeo.lineWidth = 0.02;
            ctxGeo.strokeStyle = "#fff";
            ctxGeo.stroke();
            ctxGeo.restore();

            ctxGeo.save();
            ctxGeo.translate(obs.wav.pos.x, obs.wav.pos.y);
            ctxGeo.beginPath();
            ctxGeo.lineTo(0, 0);
            ctxGeo.translate(svel.x / wspd, svel.y / wspd);
            ctxGeo.rotate(Math.atan2(svel.y, svel.x));
            ctxGeo.lineTo(0, 0);
            ctxGeo.lineWidth = 0.02;
            ctxGeo.strokeStyle = "#880";
            ctxGeo.stroke();
            ctxGeo.beginPath();
            ctxGeo.lineTo(-0.1, 0.1);
            ctxGeo.lineTo(-0.1, -0.1);
            ctxGeo.lineTo(0, 0);
            ctxGeo.closePath(); 
            ctxGeo.stroke();
            ctxGeo.restore();
        }
    }

    if (Math.hypot(obs.vel.x, obs.vel.y) > 0.01 * wspd) {
        ctxGeo.save();
        ctxGeo.translate(obs.pos.x, obs.pos.y);
        ctxGeo.beginPath();
        ctxGeo.lineTo(0, 0);
        ctxGeo.translate(obs.vel.x / wspd, obs.vel.y / wspd);
        ctxGeo.rotate(Math.atan2(obs.vel.y, obs.vel.x));
        ctxGeo.lineTo(0, 0);
        ctxGeo.lineWidth = 0.02;
        ctxGeo.strokeStyle = "#0f0";
        ctxGeo.stroke();
        ctxGeo.beginPath();
        ctxGeo.lineTo(-0.1, 0.1);
        ctxGeo.lineTo(-0.1, -0.1);
        ctxGeo.lineTo(0, 0);
        ctxGeo.closePath(); 
        ctxGeo.stroke();
        ctxGeo.restore();
    }


    ctxGeo.restore();
}