/*
let scr = document.createElement("script");
scr.type = "text/javascript";
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

const canvPrs = document.createElement("canvas");
canvPrs.width = 800;
canvPrs.height = 200;
canvPrs.classList.add("canvas");
const contPrs = document.createElement("div");
contPrs.classList.add("content");
contPrs.appendChild(canvPrs);
const labPrs = document.createElement("h3");
labPrs.innerText = "PRESSURE vs DISTANCE";
labPrs.classList.add("label");
const panPrs = document.createElement("div");
panPrs.classList.add("panel");
panPrs.appendChild(labPrs);
panPrs.appendChild(contPrs);
document.getElementsByClassName("section")[0].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.getElementsByClassName("group")[0].appendChild(panPrs);

let ctxGeo = canvGeo.getContext("2d", {alpha: false});
let ctxPrs = canvPrs.getContext("2d", {alpha: false});

let view2 = 0;
window.requestAnimationFrame(doAnim2);

function doAnim2() {
    doViewGeo();

    if (view2 % 2 === 0) {
        doPlotPrs();
    }

    view2++;
    window.requestAnimationFrame(doAnim2);
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

    let dist;
    let svel;
    let ovel;

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

        dist = Math.hypot(obs.wav.pos.x - obs.pos.x, obs.wav.pos.y - obs.pos.y);
        svel = (obs.wav.vel.x * (obs.wav.pos.x - obs.pos.x) + obs.wav.vel.y * (obs.wav.pos.y - obs.pos.y)) / dist;
        svel = {
            x: svel * (obs.wav.pos.x - obs.pos.x) / dist,
            y: svel * (obs.wav.pos.y - obs.pos.y) / dist
        };
        ovel = (obs.vel.x * (obs.pos.x - obs.wav.pos.x) + obs.vel.y * (obs.pos.y - obs.wav.pos.y)) / dist;
        ovel = {
            x: ovel * (obs.pos.x - obs.wav.pos.x) / dist,
            y: ovel * (obs.pos.y - obs.wav.pos.y) / dist
        };

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

    if (obs.wav !== null) {
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
        if (Math.hypot(ovel.x, ovel.y) > 0.01 * wspd) {
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

    ctxGeo.restore();
}

function doPlotPrs() {
    ctxPrs.fillStyle = "#000";
    ctxPrs.fillRect(0, 0, 800, 200);

    ctxPrs.save();
    ctxPrs.scale(100, 100);
    ctxPrs.translate(4, 1);
    ctxPrs.scale(-1, -1);
    ctxPrs.translate(-4, 0);

    for (let b = 1; b < 12; b++) {
        ctxPrs.fillStyle = "#444";
        ctxPrs.fillRect(8 * b / 12 - 0.01, -1, 0.02, 8);
    }

    for (let b = 1; b < 8; b++) {
        ctxPrs.fillStyle = "#444";
        ctxPrs.fillRect(0, 2 * b / 8 - 1 - 0.01, 8, 0.02);
    }

    ctxPrs.beginPath();

    for (let w = 0; w < 250; w++) {
        let frq = src.frq;

        if (frq === null) {
            frq = 0;
        }

        let amp = src.amp;

        if (amp === null) {
            amp = 0;
        }

        let prs = amp * Math.cos(2 * Math.PI * 15 * frq * (w / (250 - 1) - 0.5));
        ctxPrs.lineTo(8 * w / (250 - 1), Math.min(Math.max(prs / 2, -1), 1));
    }

    ctxPrs.lineTo(8, 0);
    ctxPrs.lineTo(0, 0);
    ctxPrs.closePath();
    ctxPrs.fillStyle = "#f00";
    ctxPrs.fill();

    ctxPrs.beginPath();

    for (let w = 0; w < 250; w++) {
        let frq = obs.frq;

        if (frq === null) {
            frq = 0;
        }

        let amp = obs.amp;

        if (amp === null) {
            amp = 0;
        }

        let prs = amp * Math.cos(2 * Math.PI * 15 * frq * (w / (250 - 1) - 0.5));
        ctxPrs.lineTo(8 * w / (250 - 1), Math.min(Math.max(prs / 2, -1), 1));
    }

    ctxPrs.lineTo(8, 0);
    ctxPrs.lineTo(0, 0);
    ctxPrs.closePath();
    ctxPrs.fillStyle = "#0f0";
    ctxPrs.fill();

    ctxPrs.restore();
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
const grpOut = document.createElement("div");
grpOut.classList.add("group");
grpOut.appendChild(panDmp);
const hdgOut = document.createElement("h2");
hdgOut.innerText = "Output";
hdgOut.classList.add("heading");
const secOut = document.createElement("div");
secOut.classList.add("section");
secOut.appendChild(hdgOut);
secOut.appendChild(grpOut);
const btnUpd = document.createElement("button");
btnUpd.innerText = "UPDATE";
btnUpd.addEventListener("click", doInf);
btnUpd.type = "button";
btnUpd.classList.add("button");
const contUpd = document.createElement("div");
contUpd.classList.add("content");
contUpd.appendChild(btnUpd);
const labUpd = document.createElement("h3");
labUpd.innerText = "Output";
labUpd.classList.add("label");
const panUpd = document.createElement("div");
panUpd.classList.add("panel");
panUpd.appendChild(labUpd);
panUpd.appendChild(contUpd);
const grpInf = document.createElement("div");
grpInf.classList.add("group");
grpInf.appendChild(panUpd);
grpInf.appendChild(secOut);
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
        html += "r_s-&gt; = (" + obs.wav.pos.x.toFixed(3) + ", " + obs.wav.pos.y.toFixed(3) + ") m<br>";
        html += "r_o-&gt; = (" + obs.pos.x.toFixed(3) + ", " + obs.pos.y.toFixed(3) + ") m<br>";
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
        html += "v_s = (<" + obs.wav.vel.x.toFixed(3) + ", " + obs.wav.vel.y.toFixed(3) + "> * (" + obs.wav.pos.x.toFixed(3) + " - " + obs.pos.x.toFixed(3) + ", " + obs.wav.pos.y.toFixed(3) + " - " + obs.pos.y.toFixed(3) + ")) / " + d_so.toFixed(3) + "<br>";
        let v_s = (obs.wav.vel.x * (obs.wav.pos.x - obs.pos.x) + obs.wav.vel.y * (obs.wav.pos.y - obs.pos.y)) / d_so;
        html += "v_s = " + v_s.toFixed(3) + " m/s<br>";
        html += "v_o = (v_o-&gt; * (r_o-&gt; - r_s-&gt;)) / d_so<br>";
        html += "v_o = (<" + obs.vel.x.toFixed(3) + ", " + obs.vel.y.toFixed(3) + "> * (" + obs.pos.x.toFixed(3) + " - " + obs.wav.pos.x.toFixed(3) + ", " + obs.pos.y.toFixed(3) + " - " + obs.wav.pos.y.toFixed(3) + ")) / " + d_so.toFixed(3) + "<br>";
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
labSndHjk.innerText = "SOUND HIJACK (H)";
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
    src.amp = 1;
}

function setSndHjkHpy() {
    hjk = 1;
    fixSndHjk();
}


let hpyBdySong = [
    1, 0, 0,
    1, 0,
    1.125, 1.125, 1.125, 1.125, 0,
    1, 1, 1, 1, 0,
    1.333, 1.333, 1.333, 1.333, 0,
    1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 0, 0,
    1, 0, 0,
    1, 0,
    1.125, 1.125, 1.125, 1.125, 0,
    1, 1, 1, 1, 0,
    1.5, 1.5, 1.5, 1.5, 0,
    1.333, 1.333, 1.333, 1.333, 1.333, 1.333, 1.333, 1.333, 0, 0,
    1, 0, 0,
    1, 0,
    2, 2, 2, 2, 0,
    1.667, 1.667, 1.667, 1.667, 0,
    1.333, 1.333, 0,
    1.333, 0,
    1.25, 1.25, 1.25, 1.25, 0,
    1.125, 1.125, 1.125, 1.125, 1.125, 1.125, 1.125, 1.125, 0, 0,
    1.765, 0, 0,
    1.765, 0,
    1.667, 1.667, 1.667, 1.667, 0,
    1.333, 1.333, 1.333, 1.333, 0,
    1.5, 1.5, 1.5, 1.5, 0,
    1.333, 1.333, 1.333, 1.333, 1.333, 1.333, 1.333, 1.333, 0, 0, 0, 0, 0, 0, 0, 0,
];

window.setInterval(setSndHjk, 30);

function setSndHjk() {
    let phs = time % mprd;

    if (hjk === 0) {
    } else {
        fmod = -1;
        if (hjk === 1) {
            setSong(hpyBdySong, 25 * mprd)
        }
    }
}

function setSong(song, dur) {
    let ntim = (time % dur) / dur;
    src.frq = song[Math.max(Math.round((song.length - 1) * ntim) % song.length, 0)];
    if (src.frq === 0) {
        src.amp = 0;
    } else {
        src.amp = 1;
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

window.addEventListener("keydown", doKey2);

function doKey2(event) {
    if (event.key.toUpperCase() === "H") {
        if (hjk === 0) {
            setSndHjkHpy();
        } else if (hjk === 1) {
            setSndHjkNon();
        }
    }
}
