// Canvas painters for Twin Lantern Hunt. Every scene is drawn from code:
// paintScene(ctx, sceneId, changed) draws the original when changed is
// false and the altered twin when changed is true. Differences live at
// the centres listed in scenes.js.
import { CANVAS_W, CANVAS_H } from "./config.js";

function rect(ctx, x, y, w, h, colour) { ctx.fillStyle = colour; ctx.fillRect(x, y, w, h); }
function circle(ctx, x, y, r, colour) { ctx.fillStyle = colour; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
function ellipse(ctx, x, y, rx, ry, colour) { ctx.fillStyle = colour; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
function line(ctx, x1, y1, x2, y2, colour, width) {
  ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
function text(ctx, value, x, y, size, colour, align) {
  ctx.fillStyle = colour; ctx.font = `bold ${size}px Georgia, serif`;
  ctx.textAlign = align || "center"; ctx.fillText(value, x, y);
}
function skyGradient(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function paintLibrary(ctx, changed) {
  skyGradient(ctx, "#f6d9a8", "#e8b07a");
  rect(ctx, 0, 348, CANVAS_W, 72, "#8a5a33");
  rect(ctx, 0, 348, CANVAS_W, 8, "#6f4525");
  // Window with moon (difference: moon position)
  rect(ctx, 168, 36, 110, 108, "#31456e");
  rect(ctx, 168, 36, 110, 108, "rgba(255,255,255,0)");
  ctx.strokeStyle = "#6f4525"; ctx.lineWidth = 8; ctx.strokeRect(168, 36, 110, 108);
  line(ctx, 223, 36, 223, 144, "#6f4525", 5); line(ctx, 168, 90, 278, 90, "#6f4525", 5);
  circle(ctx, changed ? 246 : 200, 68, 17, "#ffe9a8");
  circle(ctx, changed ? 254 : 208, 63, 14, "#31456e");
  circle(ctx, 196, 116, 3, "#fff"); circle(ctx, 252, 122, 3, "#fff"); circle(ctx, 230, 52, 2, "#fff");
  // Bookshelves
  for (const sx of [18, 356]) {
    rect(ctx, sx, 170, 150, 178, "#6f4525");
    for (let shelf = 0; shelf < 3; shelf++) {
      const y = 182 + shelf * 56;
      const colours = ["#c94f4f", "#3f7fbf", "#3fbf72", "#e0a83c", "#8a5fc9", "#d97642"];
      for (let i = 0; i < 6; i++) rect(ctx, sx + 10 + i * 23, y, 17, 40, colours[(i + shelf) % colours.length]);
      rect(ctx, sx, y + 42, 150, 7, "#57361d");
    }
  }
  // Clock (difference: hands)
  circle(ctx, 452, 82, 42, "#fff7e6"); ctx.strokeStyle = "#6f4525"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(452, 82, 42, 0, Math.PI * 2); ctx.stroke();
  line(ctx, 452, 82, 452, 54, "#241b45", 5);
  line(ctx, 452, 82, changed ? 430 : 476, changed ? 98 : 94, "#241b45", 5);
  circle(ctx, 452, 82, 5, "#c94f4f");
  // Lamp (difference: shade colour)
  line(ctx, 76, 180, 76, 300, "#4a3f7a", 7); rect(ctx, 52, 298, 48, 10, "#4a3f7a");
  ctx.fillStyle = changed ? "#3fbf72" : "#ff7a59";
  ctx.beginPath(); ctx.moveTo(44, 150); ctx.lineTo(108, 150); ctx.lineTo(92, 104); ctx.lineTo(60, 104); ctx.closePath(); ctx.fill();
  circle(ctx, 76, 152, 9, "#ffe9a8");
  // Armchair + cat (difference: tail curl)
  rect(ctx, 176, 252, 130, 96, "#7a4a8c"); rect(ctx, 164, 226, 154, 52, "#8d5aa3");
  rect(ctx, 164, 252, 26, 96, "#6b3f7d"); rect(ctx, 292, 252, 26, 96, "#6b3f7d");
  ellipse(ctx, 118, 322, 34, 18, "#e08a3c"); circle(ctx, 92, 310, 15, "#e08a3c");
  ctx.fillStyle = "#e08a3c";
  ctx.beginPath(); ctx.moveTo(82, 300); ctx.lineTo(88, 286); ctx.lineTo(96, 300); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(96, 300); ctx.lineTo(102, 286); ctx.lineTo(110, 300); ctx.closePath(); ctx.fill();
  circle(ctx, 88, 310, 2.5, "#241b45"); circle(ctx, 98, 310, 2.5, "#241b45");
  ctx.strokeStyle = "#c96f24"; ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.beginPath();
  if (changed) { ctx.moveTo(148, 322); ctx.quadraticCurveTo(176, 300, 162, 282); }
  else { ctx.moveTo(148, 322); ctx.quadraticCurveTo(176, 336, 166, 352); }
  ctx.stroke();
  // Book stack (difference: one book missing)
  const stack = changed ? ["#3f7fbf", "#e0a83c"] : ["#3f7fbf", "#e0a83c", "#c94f4f"];
  stack.forEach((c, i) => rect(ctx, 268, 352 - i * 20, 64, 17, c));
  // Table + teacup (difference: steam)
  rect(ctx, 336, 316, 84, 10, "#6f4525"); rect(ctx, 346, 326, 8, 34, "#57361d"); rect(ctx, 402, 326, 8, 34, "#57361d");
  rect(ctx, 354, 292, 30, 20, "#fff"); ctx.strokeStyle = "#3f7fbf"; ctx.lineWidth = 3; ctx.strokeRect(354, 292, 30, 20);
  if (!changed) {
    ctx.strokeStyle = "#9fb6d9"; ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(362, 288); ctx.quadraticCurveTo(356, 276, 363, 264);
    ctx.moveTo(374, 288); ctx.quadraticCurveTo(368, 276, 375, 264); ctx.stroke();
  }
  // Globe (difference: stand stripe)
  circle(ctx, 498, 256, 34, "#7ec8e3");
  ellipse(ctx, 486, 246, 14, 9, "#3fbf72"); ellipse(ctx, 512, 268, 11, 8, "#3fbf72");
  rect(ctx, 488, 290, 20, 22, "#6f4525");
  if (!changed) rect(ctx, 488, 298, 20, 6, "#ffd75e");
  rect(ctx, 476, 312, 44, 8, "#57361d");
  text(ctx, "READ", 241, 208, 15, "#6f4525");
}

function paintMarket(ctx, changed) {
  skyGradient(ctx, "#8fd3f4", "#dff6ff");
  circle(ctx, 500, 44, 26, "#ffe27a");
  // Kite (difference: tail bows)
  ctx.fillStyle = "#ff7a59"; ctx.beginPath();
  ctx.moveTo(74, 30); ctx.lineTo(98, 58); ctx.lineTo(74, 88); ctx.lineTo(50, 58); ctx.closePath(); ctx.fill();
  line(ctx, 74, 88, 62, 140, "#241b45", 2);
  if (!changed) { circle(ctx, 68, 104, 5, "#ffd75e"); circle(ctx, 65, 122, 5, "#3fbf72"); }
  // Gulls (difference: one missing)
  const gulls = changed ? [[392, 60], [452, 84]] : [[392, 60], [430, 66], [452, 84]];
  for (const [gx, gy] of gulls) {
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath();
    ctx.moveTo(gx - 14, gy); ctx.quadraticCurveTo(gx - 5, gy - 9, gx, gy);
    ctx.quadraticCurveTo(gx + 5, gy - 9, gx + 14, gy); ctx.stroke();
  }
  // Sea + boat (difference: sail colour)
  rect(ctx, 0, 196, CANVAS_W, 56, "#3f9fd9");
  ctx.fillStyle = "#8a5a33"; ctx.beginPath();
  ctx.moveTo(430, 236); ctx.lineTo(528, 236); ctx.lineTo(510, 258); ctx.lineTo(446, 258); ctx.closePath(); ctx.fill();
  line(ctx, 479, 236, 479, 176, "#6f4525", 5);
  ctx.fillStyle = changed ? "#ffd75e" : "#ffffff"; ctx.beginPath();
  ctx.moveTo(482, 180); ctx.lineTo(482, 232); ctx.lineTo(516, 232); ctx.closePath(); ctx.fill();
  // Sand + stalls
  rect(ctx, 0, 252, CANVAS_W, 168, "#f2d492");
  for (const sx of [36, 268]) {
    rect(ctx, sx, 150, 228, 12, "#6f4525");
    rect(ctx, sx + 8, 162, 10, 110, "#6f4525"); rect(ctx, sx + 210, 162, 10, 110, "#6f4525");
    rect(ctx, sx, 262, 228, 16, "#8a5a33");
  }
  // Awning stripes (difference: one stripe colour)
  for (let i = 0; i < 6; i++) {
    const c = i === 2 && changed ? "#3f7fbf" : (i % 2 ? "#ffffff" : "#ff7a59");
    rect(ctx, 36 + i * 38, 96, 38, 54, c);
  }
  for (let i = 0; i < 6; i++) rect(ctx, 268 + i * 38, 96, 38, 54, i % 2 ? "#ffffff" : "#3fbf72");
  // Sign (difference: word)
  rect(ctx, 286, 112, 92, 40, "#fff7e6"); ctx.strokeStyle = "#6f4525"; ctx.lineWidth = 3; ctx.strokeRect(286, 112, 92, 40);
  text(ctx, changed ? "FISH" : "FRUIT", 332, 139, 20, "#c94f4f");
  // Oranges (difference: count)
  const oranges = changed ? [[96, 246], [124, 246], [110, 228]] : [[96, 246], [124, 246], [110, 228], [138, 228]];
  for (const [ox, oy] of oranges) { circle(ctx, ox, oy, 13, "#ff9f2e"); circle(ctx, ox + 3, oy - 11, 4, "#3fbf72"); }
  rect(ctx, 80, 258, 76, 10, "#8a5a33");
  // Bread + jars on right stall
  for (let i = 0; i < 3; i++) ellipse(ctx, 300 + i * 34, 246, 15, 10, "#d9a45b");
  for (let i = 0; i < 3; i++) { rect(ctx, 410 + i * 26, 226, 18, 30, ["#c94f4f", "#3f7fbf", "#8a5fc9"][i]); }
  // Bucket (difference: handle)
  ctx.fillStyle = "#3f7fbf"; ctx.beginPath();
  ctx.moveTo(228, 322); ctx.lineTo(272, 322); ctx.lineTo(266, 356); ctx.lineTo(234, 356); ctx.closePath(); ctx.fill();
  if (!changed) { ctx.strokeStyle = "#241b45"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(250, 322, 22, Math.PI, 0); ctx.stroke(); }
  // Bunting + crates
  line(ctx, 36, 290, 496, 290, "#c94f4f", 2);
  const flags = ["#ffd75e", "#3fbf72", "#ff7a59", "#3f7fbf"];
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = flags[i % 4]; ctx.beginPath();
    const fx = 60 + i * 44; ctx.moveTo(fx, 290); ctx.lineTo(fx + 20, 290); ctx.lineTo(fx + 10, 308); ctx.closePath(); ctx.fill();
  }
  rect(ctx, 356, 318, 52, 38, "#b07f45"); rect(ctx, 420, 318, 52, 38, "#9a6c38");
  text(ctx, "MARKET DAY", 280, 392, 20, "#8a5a33");
}

function paintObservatory(ctx, changed) {
  skyGradient(ctx, "#131a3a", "#2c3a6e");
  const stars = [[40, 40], [150, 30], [240, 56], [330, 36], [500, 40], [520, 110], [60, 120], [200, 110]];
  for (const [sx, sy] of stars) circle(ctx, sx, sy, 3, "#ffffff");
  // Bright star (difference: missing)
  if (!changed) {
    circle(ctx, 96, 62, 7, "#ffe27a");
    line(ctx, 82, 62, 110, 62, "#ffe27a", 3); line(ctx, 96, 48, 96, 76, "#ffe27a", 3);
  }
  circle(ctx, 492, 66, 22, "#f4f1de"); circle(ctx, 484, 60, 18, "#131a3a");
  // Dome (difference: window shape)
  ctx.fillStyle = "#5b6fa6"; ctx.beginPath(); ctx.arc(392, 196, 92, Math.PI, 0); ctx.fill();
  rect(ctx, 300, 196, 184, 96, "#46588c");
  if (changed) { rect(ctx, 374, 76, 36, 32, "#ffe27a"); }
  else { circle(ctx, 392, 92, 17, "#ffe27a"); }
  rect(ctx, 376, 232, 32, 60, "#2c3a6e"); circle(ctx, 400, 264, 4, "#ffd75e");
  // Telescope (difference: angle)
  ctx.save(); ctx.translate(392, 190); ctx.rotate(changed ? -0.18 : -0.62);
  rect(ctx, -70, -12, 140, 24, "#d9d9d9"); rect(ctx, 56, -8, 22, 16, "#8a8a8a"); rect(ctx, -84, -6, 16, 12, "#4a4a4a");
  ctx.restore();
  line(ctx, 392, 196, 364, 262, "#2c2c2c", 7); line(ctx, 392, 196, 420, 262, "#2c2c2c", 7);
  // Tree + owl (difference: eyes)
  rect(ctx, 132, 220, 16, 120, "#4a3520");
  circle(ctx, 140, 180, 58, "#2e6b46"); circle(ctx, 104, 202, 38, "#357a50"); circle(ctx, 176, 202, 38, "#357a50");
  ellipse(ctx, 140, 196, 17, 22, "#8a6a42"); circle(ctx, 140, 178, 14, "#a3804f");
  if (changed) { circle(ctx, 134, 178, 4, "#ffd75e"); circle(ctx, 146, 178, 4, "#ffd75e"); }
  else { line(ctx, 129, 178, 139, 178, "#241b45", 3); line(ctx, 141, 178, 151, 178, "#241b45", 3); }
  // Ground, path, lanterns (difference: one lantern out)
  rect(ctx, 0, 330, CANVAS_W, 90, "#1e3a2a");
  ctx.fillStyle = "#6b5a44"; ctx.beginPath();
  ctx.moveTo(220, 420); ctx.lineTo(286, 420); ctx.lineTo(262, 330); ctx.lineTo(238, 330); ctx.closePath(); ctx.fill();
  for (const [lx, ly, lit] of [[210, 352, !changed], [296, 372, true], [186, 392, true]]) {
    rect(ctx, lx - 4, ly, 8, 26, "#2c2c2c");
    circle(ctx, lx, ly - 8, 10, lit ? "#ffd75e" : "#5a5a5a");
    if (lit) circle(ctx, lx, ly - 8, 16, "rgba(255,215,94,.25)");
  }
  // Bushes + firefly (difference: position)
  circle(ctx, 300, 318, 34, "#2e6b46"); circle(ctx, 336, 326, 26, "#357a50");
  circle(ctx, 452, 322, 30, "#2e6b46"); circle(ctx, 76, 330, 30, "#357a50");
  circle(ctx, changed ? 452 : 300, 300, 6, "#e8ff8a");
  circle(ctx, changed ? 452 : 300, 300, 12, "rgba(232,255,138,.3)");
  circle(ctx, 110, 300, 4, "#e8ff8a"); circle(ctx, 500, 296, 4, "#e8ff8a");
  // Mushroom (difference: spot)
  rect(ctx, 452, 340, 16, 22, "#f4f1de");
  ctx.fillStyle = "#c94f4f"; ctx.beginPath(); ctx.arc(460, 342, 24, Math.PI, 0); ctx.fill();
  circle(ctx, 448, 332, 5, "#fff"); circle(ctx, 470, 328, 4, "#fff");
  if (!changed) circle(ctx, 460, 338, 4, "#fff");
  text(ctx, "OBSERVATORY", 392, 316, 15, "#ffe9a8");
}

const PAINTERS = { library: paintLibrary, market: paintMarket, observatory: paintObservatory };

export function paintScene(ctx, sceneId, changed) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  PAINTERS[sceneId](ctx, changed);
}
