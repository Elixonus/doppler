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
lgo.style.backgroundColor = "#000";
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
document.getElementsByClassName("section")[0].nextElementSibling.nextElementSibling.nextElementSibling.getElementsByClassName("group")[0].appendChild(panGeo);

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

    for (let b = 1; b < 16; b++) {
        ctxGeo.fillStyle = "#444";
        ctxGeo.fillRect(8 * b / 16 - 0.01, 0, 0.02, 6);
    }

    for (let b = 1; b < 12; b++) {
        ctxGeo.fillStyle = "#444";
        ctxGeo.fillRect(0, 6 * b / 12 - 0.01, 8, 0.02);
    }

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
            ctxGeo.translate(obs.pos.x + ovel.x / wspd, obs.pos.y + ovel.y / wspd);
            ctxGeo.rotate(Math.atan2(ovel.y / wspd, ovel.x / wspd));
            if (Math.atan2(obs.vel.x * ovel.y - obs.vel.y * ovel.x, obs.vel.x * ovel.x + obs.vel.y * ovel.y) > 0) {
                ctxGeo.scale(1, -1);
            }
            let len = 5 * Math.min(Math.hypot(ovel.x, ovel.y), Math.hypot(obs.vel.x - ovel.x, obs.vel.y - ovel.y));
            ctxGeo.beginPath();
            ctxGeo.lineTo(0, 0);
            ctxGeo.lineTo(0, len);
            ctxGeo.lineTo(-len, len);
            ctxGeo.lineTo(-len, 0);
            ctxGeo.closePath();
            ctxGeo.lineWidth = 0.02;
            ctxGeo.strokeStyle = "#fff";
            ctxGeo.stroke();
            ctxGeo.restore();

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
            ctxGeo.translate(obs.wav.pos.x + svel.x / wspd, obs.wav.pos.y + svel.y / wspd);
            ctxGeo.rotate(Math.atan2(svel.y / wspd, svel.x / wspd));
            if (Math.atan2(obs.wav.vel.x * svel.y - obs.wav.vel.y * svel.x, obs.wav.vel.x * svel.x + obs.wav.vel.y * svel.y) > 0) {
                ctxGeo.scale(1, -1);
            }
            let len = 5 * Math.min(Math.hypot(svel.x, svel.y), Math.hypot(obs.wav.vel.x - svel.x, obs.wav.vel.y - svel.y));
            ctxGeo.beginPath();
            ctxGeo.lineTo(0, 0);
            ctxGeo.lineTo(0, len);
            ctxGeo.lineTo(-len, len);
            ctxGeo.lineTo(-len, 0);
            ctxGeo.closePath();
            ctxGeo.lineWidth = 0.02;
            ctxGeo.strokeStyle = "#fff";
            ctxGeo.stroke();
            ctxGeo.restore();

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

const preDmp = document.createElement("pre");
preDmp.style.textAlign = "left";
const contDmp = document.createElement("div");
contDmp.classList.add("content");
contDmp.appendChild(preDmp);
const labDmp = document.createElement("h3");
labDmp.innerText = "Dump";
labDmp.classList.add("label");
const panDmp = document.createElement("div");
panDmp.classList.add("panel");
panDmp.appendChild(labDmp);
panDmp.appendChild(contDmp);
const btnUpd = document.createElement("button");
btnUpd.innerText = "UPDATE";
btnUpd.addEventListener("click", doInf);
btnUpd.type = "button";
btnUpd.classList.add("button");
const contUpd = document.createElement("div");
contUpd.classList.add("content");
contUpd.appendChild(btnUpd);
const labUpd = document.createElement("h3");
labUpd.innerText = "Update";
labUpd.classList.add("label");
const panUpd = document.createElement("div");
panUpd.classList.add("panel");
panUpd.appendChild(labUpd);
panUpd.appendChild(contUpd);
const grpInf = document.createElement("div");
grpInf.classList.add("group");
grpInf.appendChild(panUpd);
grpInf.appendChild(panDmp);
const hdgInf = document.createElement("h2");
hdgInf.innerText = "Info";
hdgInf.classList.add("heading");
const secInf = document.createElement("div");
secInf.classList.add("section");
secInf.appendChild(hdgInf);
secInf.appendChild(grpInf);
document.getElementById("main").appendChild(secInf);

function doInf() {
    doDmp();
}

function doDmp() {
    let html = "";
    if (obs.wav !== null) {
        html += "parameters<br>"
        html += "r_s-&gt; = &lt;" + obs.wav.pos.x.toFixed(3) + ", " + obs.wav.pos.y.toFixed(3) + "&gt; m<br>";
        html += "r_o-&gt; = &lt;" + obs.pos.x.toFixed(3) + ", " + obs.pos.y.toFixed(3) + "&gt; m<br>";
        html += "v = " + wspd.toFixed(3) + " m/s<br>";
        html += "v_s-&gt; = &lt;" + obs.wav.vel.x.toFixed(3) + ", " + obs.wav.vel.y.toFixed(3) + "&gt; m/s<br>";
        html += "v_o-&gt; = &lt;" + obs.vel.x.toFixed(3) + ", " + obs.vel.y.toFixed(3) + "&gt; m/s<br>";
        html += "f_s = " + obs.wav.frq.toFixed(3) + " Hz<br>";
        html += "pythagorean theorem<br>";
        html += "d_so = sqrt((r_sx - r_ox)^2 + (r_sy - r_oy)^2)<br>";
        html += "d_so = sqrt((" + obs.wav.pos.x.toFixed(3) + " - " + obs.pos.x.toFixed(3) + ")^2 + (" + obs.wav.pos.y.toFixed(3) + " - " + obs.pos.y.toFixed(3) + ")^2)<br>";
        let d_so = Math.hypot(obs.wav.pos.x - obs.pos.x, obs.wav.pos.y - obs.pos.y);
        html += "d_so = " + d_so.toFixed(3) + " m<br>";
        html += "component of projection<br>";
        html += "v_s = (v_s-&gt; * (r_s-&gt; - r_o-&gt;)) / d_so<br>";
        html += "v_s = (<" + obs.wav.vel.x.toFixed(3) + ", " + obs.wav.vel.y.toFixed(3) + "> * <" + obs.wav.pos.x.toFixed(3) + " - " + obs.pos.x.toFixed(3) + ", " + obs.wav.pos.y.toFixed(3) + " - " + obs.pos.y.toFixed(3) + ">) / " + d_so.toFixed(3) + "<br>";
        let v_s = (obs.wav.vel.x * (obs.wav.pos.x - obs.pos.x) + obs.wav.vel.y * (obs.wav.pos.y - obs.pos.y)) / d_so;
        html += "v_s = " + v_s.toFixed(3) + " m/s<br>";
        html += "v_o = (v_o-&gt; * (r_o-&gt; - r_s-&gt;)) / d_so<br>";
        html += "v_o = (<" + obs.vel.x.toFixed(3) + ", " + obs.vel.y.toFixed(3) + "> * <" + obs.pos.x.toFixed(3) + " - " + obs.wav.pos.x.toFixed(3) + ", " + obs.pos.y.toFixed(3) + " - " + obs.wav.pos.y.toFixed(3) + ">) / " + d_so.toFixed(3) + "<br>";
        let v_o = (obs.vel.x * (obs.pos.x - obs.wav.pos.x) + obs.vel.y * (obs.pos.y - obs.wav.pos.y)) / d_so;
        html += "v_o = " + v_o.toFixed(3) + " m/s<br>";
        html += "doppler equation<br>";
        html += "f_o = f_s * (v - v_o) / (v + v_s)<br>";
        html += "f_o = " + obs.wav.frq.toFixed(3) + " * (" + wspd.toFixed(3) + " - " + v_o.toFixed(3) + ") / (" + wspd.toFixed(3) + " + " + v_s.toFixed(3) + ")<br>";
        let f_o = obs.wav.frq * (wspd - v_o) / (wspd + v_s);
        html += "f_o = " + f_o.toFixed(3) + " Hz<br>";
    }
    preDmp.innerHTML = html;
}

const btnSndHjkNon = document.createElement("button");
btnSndHjkNon.innerText = "NONE";
btnSndHjkNon.type = "button";
btnSndHjkNon.classList.add("button");
const btnSndHjkHpy = document.createElement("button");
btnSndHjkHpy.innerText = "HAPPY BIRTHDAY!";
btnSndHjkHpy.type = "button";
btnSndHjkHpy.classList.add("button");
const contSndHjk = document.createElement("div");
contSndHjk.classList.add("content");
contSndHjk.appendChild(btnSndHjkNon);
contSndHjk.appendChild(btnSndHjkHpy);
const labSndHjk = document.createElement("h3");
labSndHjk.innerText = "SOUND HIJACK";
labSndHjk.classList.add("label");
const panSndHjk = document.createElement("div");
panSndHjk.classList.add("panel");
panSndHjk.appendChild(labSndHjk);
panSndHjk.appendChild(contSndHjk);
document.getElementsByClassName("section")[0].nextElementSibling.getElementsByClassName("group")[0].appendChild(panSndHjk);

let hjk = 0;

btnSndHjkNon.addEventListener("click", setSndHjkNon);
btnSndHjkHpy.addEventListener("click", setSndHjkHpy);

function setSndHjkNon() {
    hjk = 0;
    fixSndHjk();
    setFmodFlt();
}

function setSndHjkHpy() {
    hjk = 1;
    fixSndHjk();
}

window.setInterval(setSndHjk, 30);

function setSndHjk() {
    let phs = time % mprd;

    if (hjk === 0) {
    } else {
        fmod = -1;
        if (hjk === 1) {
            if (phs / mprd < 0.333) {
                src.frq = 0.5;
            } else if (phs / mprd < 0.667) {
                src.frq = 1;
            } else {
                src.frq = 1.5;
            }
        }
    }
}

fixSndHjk();

function fixSndHjk() {
    btnSndHjkNon.disabled = false;
    btnSndHjkHpy.disabled = false;

    if (hjk === 0) {
        btnSndHjkNon.disabled = true;
    } else if (hjk === 1) {
        btnSndHjkHpy.disabled = true;
    }

}