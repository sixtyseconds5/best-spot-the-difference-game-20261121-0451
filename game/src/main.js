// Bootstrap for Twin Lantern Hunt: wire the page elements to the game
// and support ?shot= states so screenshots show real gameplay moments.
import { SpotDifferenceGame } from "./game.js";

function collectElements() {
  const byId = (id) => document.getElementById(id);
  return {
    leftCanvas: byId("left-canvas"),
    rightCanvas: byId("right-canvas"),
    sceneTabs: byId("scene-tabs"),
    remainingCount: byId("remaining-count"),
    foundCount: byId("found-count"),
    scoreCount: byId("score-count"),
    timerCount: byId("timer-count"),
    mistakeCount: byId("mistake-count"),
    hintsLeft: byId("hints-left"),
    hintButton: byId("hint-button"),
    pauseButton: byId("pause-button"),
    restartButton: byId("restart-button"),
    nextButton: byId("next-button"),
    winNextButton: byId("win-next-button"),
    winReplayButton: byId("win-replay-button"),
    winOverlay: byId("win-overlay"),
    winStars: byId("win-stars"),
    winDetail: byId("win-detail"),
    pauseOverlay: byId("pause-overlay"),
    progressDots: byId("progress-dots"),
    message: byId("message"),
    status: byId("status"),
    leftCaption: byId("left-caption"),
    rightCaption: byId("right-caption"),
  };
}

function applyShotState(game, shot) {
  const backdate = { play: 47000, market: 73000, observatory: 96000, win: 84000 };
  if (backdate[shot]) game.startedAt = Date.now() - backdate[shot];
  if (shot === "play") {
    game.findDifferenceById("clock-hands");
    game.findDifferenceById("lamp-shade");
    game.findDifferenceById("teacup");
  } else if (shot === "market") {
    game.resetScene(1);
    game.startedAt = Date.now() - backdate.market;
    game.findDifferenceById("awning-stripe");
    game.findDifferenceById("orange-count");
    game.useHint();
  } else if (shot === "observatory") {
    game.resetScene(2);
    game.startedAt = Date.now() - backdate.observatory;
    game.findDifferenceById("owl-eyes");
    game.findDifferenceById("mushroom-spots");
    game.findDifferenceById("star-count");
    game.findDifferenceById("firefly");
  } else if (shot === "win") {
    game.resetScene(0);
    game.startedAt = Date.now() - backdate.win;
    for (const diff of [...game.scene.differences]) game.findDifferenceById(diff.id);
  }
}

const game = new SpotDifferenceGame(collectElements());
const shot = new URLSearchParams(window.location.search).get("shot");
if (shot) applyShotState(game, shot);
window.SpotGame = game;
