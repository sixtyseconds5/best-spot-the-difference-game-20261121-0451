// Game state and rules for Twin Lantern Hunt: which differences are
// found, score, timer, hints, markers and the win state. Rendering of
// the pictures lives in paint.js; this file draws markers on top.
import { CANVAS_W, CANVAS_H, POINTS_PER_FIND, WRONG_CLICK_PENALTY, HINT_COST, HINTS_PER_SCENE, HINT_PULSE_MS, MARKER_RADIUS, TIME_BONUS_PER_SECOND_LEFT, PAR_SECONDS } from "./config.js";
import { SCENES, getScene } from "./scenes.js";
import { paintScene } from "./paint.js";
import { playFoundSound, playWrongSound, playHintSound, playWinSound } from "./audio.js";

export class SpotDifferenceGame {
  constructor(elements) {
    this.el = elements;
    this.sceneIndex = 0;
    this.score = 0;
    this.totalFound = 0;
    this.crosshair = { panel: "right", x: CANVAS_W / 2, y: CANVAS_H / 2 };
    this.resetScene(0);
    this.bindControls();
    this.timerId = setInterval(() => this.tickTimer(), 500);
  }

  resetScene(index) {
    this.sceneIndex = ((index % SCENES.length) + SCENES.length) % SCENES.length;
    this.scene = getScene(this.sceneIndex);
    this.found = new Set();
    this.mistakes = 0;
    this.hintsLeft = HINTS_PER_SCENE;
    this.hintId = null;
    this.hintUntil = 0;
    this.wrongMarks = [];
    this.startedAt = Date.now();
    this.elapsedMs = 0;
    this.paused = false;
    this.finished = false;
    this.el.winOverlay.hidden = true;
    this.el.pauseOverlay.hidden = true;
    this.buildSceneTabs();
    this.setMessage(`Find all ${this.scene.differences.length} differences in ${this.scene.name}. Click either picture where something changed.`, "");
    this.render();
  }

  buildSceneTabs() {
    this.el.sceneTabs.innerHTML = "";
    SCENES.forEach((scene, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "scene-tab" + (i === this.sceneIndex ? " active" : "");
      button.innerHTML = `${i + 1}. ${scene.name} <span class="tab-meta">${scene.difficulty} · ${scene.differences.length} differences</span>`;
      button.addEventListener("click", () => this.resetScene(i));
      this.el.sceneTabs.appendChild(button);
    });
  }

  bindControls() {
    for (const [panel, canvas] of [["left", this.el.leftCanvas], ["right", this.el.rightCanvas]]) {
      canvas.addEventListener("click", (event) => {
        const point = this.eventToPicture(canvas, event);
        this.crosshair = { panel, x: point.x, y: point.y };
        this.tryMark(point.x, point.y);
      });
      canvas.addEventListener("keydown", (event) => this.handleCanvasKey(panel, event));
    }
    this.el.hintButton.addEventListener("click", () => this.useHint());
    this.el.pauseButton.addEventListener("click", () => this.togglePause());
    this.el.restartButton.addEventListener("click", () => this.resetScene(this.sceneIndex));
    this.el.nextButton.addEventListener("click", () => this.resetScene(this.sceneIndex + 1));
    this.el.winNextButton.addEventListener("click", () => this.resetScene(this.sceneIndex + 1));
    this.el.winReplayButton.addEventListener("click", () => this.resetScene(this.sceneIndex));
    document.addEventListener("keydown", (event) => this.handleGlobalKey(event));
  }

  eventToPicture(canvas, event) {
    const box = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - box.left) * (CANVAS_W / box.width),
      y: (event.clientY - box.top) * (CANVAS_H / box.height),
    };
  }

  handleCanvasKey(panel, event) {
    const step = event.shiftKey ? 24 : 8;
    let used = true;
    if (event.key === "ArrowLeft") this.crosshair.x -= step;
    else if (event.key === "ArrowRight") this.crosshair.x += step;
    else if (event.key === "ArrowUp") this.crosshair.y -= step;
    else if (event.key === "ArrowDown") this.crosshair.y += step;
    else if (event.key === "Enter" || event.key === " ") this.tryMark(this.crosshair.x, this.crosshair.y);
    else used = false;
    if (used) {
      event.preventDefault();
      this.crosshair.panel = panel;
      this.crosshair.x = Math.max(0, Math.min(CANVAS_W, this.crosshair.x));
      this.crosshair.y = Math.max(0, Math.min(CANVAS_H, this.crosshair.y));
      this.render();
    }
  }

  handleGlobalKey(event) {
    if (event.key === "h" || event.key === "H") this.useHint();
    else if (event.key === "p" || event.key === "P") this.togglePause();
    else if (event.key === "r" || event.key === "R") this.resetScene(this.sceneIndex);
    else if (event.key === "n" || event.key === "N") this.resetScene(this.sceneIndex + 1);
    else if (["1", "2", "3"].includes(event.key)) this.resetScene(Number(event.key) - 1);
  }

  tryMark(x, y) {
    if (this.paused || this.finished) return;
    const hit = this.scene.differences.find((d) => !this.found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r);
    if (hit) {
      this.found.add(hit.id);
      this.totalFound += 1;
      this.score += POINTS_PER_FIND;
      if (this.hintId === hit.id) this.hintId = null;
      playFoundSound();
      const left = this.scene.differences.length - this.found.size;
      this.setMessage(left === 0 ? "That was the last one!" : `Found it — ${hit.label}. ${left} to go!`, "good");
      this.render();
      if (left === 0) this.finishScene();
    } else {
      this.mistakes += 1;
      this.score = Math.max(0, this.score - WRONG_CLICK_PENALTY);
      this.wrongMarks.push({ x, y, until: Date.now() + 900 });
      playWrongSound();
      this.setMessage("No difference there — keep looking.", "bad");
      document.body.classList.remove("shake");
      void document.body.offsetWidth;
      document.body.classList.add("shake");
      this.render();
    }
  }

  useHint() {
    if (this.paused || this.finished) return;
    if (this.hintsLeft <= 0) { this.setMessage("No hints left in this scene.", "bad"); return; }
    const remaining = this.scene.differences.filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_COST);
    this.hintId = pick.id;
    this.hintUntil = Date.now() + HINT_PULSE_MS;
    playHintSound();
    this.setMessage(`Hint: look for ${pick.label} — watch the pulsing ring.`, "");
    this.render();
    setTimeout(() => this.render(), HINT_PULSE_MS + 60);
  }

  togglePause() {
    if (this.finished) return;
    this.paused = !this.paused;
    this.el.pauseOverlay.hidden = !this.paused;
    if (this.paused) this.elapsedMs += Date.now() - this.startedAt;
    else this.startedAt = Date.now();
    this.render();
  }

  finishScene() {
    const seconds = Math.floor(this.currentElapsedMs() / 1000);
    this.elapsedMs = seconds * 1000;
    this.finished = true;
    const bonus = Math.max(0, PAR_SECONDS - seconds) * TIME_BONUS_PER_SECOND_LEFT;
    this.score += bonus;
    const stars = this.mistakes === 0 && seconds <= PAR_SECONDS ? 3 : this.mistakes <= 3 ? 2 : 1;
    this.el.winStars.textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
    this.el.winDetail.textContent =
      `All ${this.scene.differences.length} differences in ${this.scene.name} found in ${this.formatTime(seconds)} ` +
      `with ${this.mistakes} mistake${this.mistakes === 1 ? "" : "s"}. Time bonus +${bonus}. Score ${this.score}.`;
    this.el.winOverlay.hidden = false;
    playWinSound();
    this.render();
  }

  currentElapsedMs() {
    return this.paused || this.finished ? this.elapsedMs : this.elapsedMs + (Date.now() - this.startedAt);
  }

  formatTime(totalSeconds) {
    return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
  }

  tickTimer() {
    if (!this.paused && !this.finished) {
      this.el.timerCount.textContent = this.formatTime(Math.floor(this.currentElapsedMs() / 1000));
    }
    if (this.hintId && Date.now() < this.hintUntil) this.render();
  }

  setMessage(text, kind) {
    this.el.message.textContent = text;
    this.el.message.className = kind || "";
    this.el.status.textContent = text;
  }

  drawMarkers(ctx) {
    const now = Date.now();
    for (const diff of this.scene.differences) {
      if (!this.found.has(diff.id)) continue;
      ctx.strokeStyle = "#1fa855"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(diff.x, diff.y, MARKER_RADIUS, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#1fa855";
      ctx.beginPath(); ctx.arc(diff.x + MARKER_RADIUS - 4, diff.y - MARKER_RADIUS + 4, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 13px Georgia, serif"; ctx.textAlign = "center";
      ctx.fillText("✓", diff.x + MARKER_RADIUS - 4, diff.y - MARKER_RADIUS + 9);
    }
    if (this.hintId && now < this.hintUntil) {
      const diff = this.scene.differences.find((d) => d.id === this.hintId);
      if (diff) {
        const pulse = MARKER_RADIUS + 8 + Math.sin(now / 140) * 6;
        ctx.strokeStyle = "#ffb400"; ctx.lineWidth = 5; ctx.setLineDash([10, 7]);
        ctx.beginPath(); ctx.arc(diff.x, diff.y, pulse, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    this.wrongMarks = this.wrongMarks.filter((m) => m.until > now);
    for (const mark of this.wrongMarks) {
      ctx.strokeStyle = "#e23b3b"; ctx.lineWidth = 5; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(mark.x - 12, mark.y - 12); ctx.lineTo(mark.x + 12, mark.y + 12);
      ctx.moveTo(mark.x + 12, mark.y - 12); ctx.lineTo(mark.x - 12, mark.y + 12);
      ctx.stroke();
    }
  }

  drawCrosshair(ctx, panel) {
    if (this.crosshair.panel !== panel) return;
    const { x, y } = this.crosshair;
    ctx.strokeStyle = "#241b45"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 20, y); ctx.lineTo(x - 6, y); ctx.moveTo(x + 6, y); ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20); ctx.lineTo(x, y - 6); ctx.moveTo(x, y + 6); ctx.lineTo(x, y + 20);
    ctx.stroke();
  }

  render() {
    const leftCtx = this.el.leftCanvas.getContext("2d");
    const rightCtx = this.el.rightCanvas.getContext("2d");
    paintScene(leftCtx, this.scene.id, false);
    paintScene(rightCtx, this.scene.id, true);
    this.drawMarkers(leftCtx); this.drawMarkers(rightCtx);
    this.drawCrosshair(leftCtx, "left"); this.drawCrosshair(rightCtx, "right");
    const total = this.scene.differences.length;
    const remaining = total - this.found.size;
    this.el.remainingCount.textContent = String(remaining);
    this.el.foundCount.textContent = `${this.found.size} / ${total}`;
    this.el.scoreCount.textContent = String(this.score);
    this.el.mistakeCount.textContent = String(this.mistakes);
    this.el.hintsLeft.textContent = `${this.hintsLeft} left`;
    this.el.leftCaption.textContent = this.scene.name;
    this.el.rightCaption.textContent = this.scene.name;
    this.el.timerCount.textContent = this.formatTime(Math.floor(this.currentElapsedMs() / 1000));
    this.el.progressDots.innerHTML = "";
    this.scene.differences.forEach((diff) => {
      const dot = document.createElement("span");
      dot.className = "dot" + (this.found.has(diff.id) ? " found" : "");
      dot.textContent = "✓";
      dot.title = this.found.has(diff.id) ? diff.label : "still hidden";
      this.el.progressDots.appendChild(dot);
    });
  }

  // Helpers used by the screenshot script and by curious players in devtools.
  findDifferenceById(id) {
    const diff = this.scene.differences.find((d) => d.id === id);
    if (diff) this.tryMark(diff.x, diff.y);
  }
  state() {
    return { scene: this.scene.id, found: [...this.found], remaining: this.scene.differences.length - this.found.size, score: this.score, mistakes: this.mistakes, hintsLeft: this.hintsLeft, finished: this.finished };
  }
}
