// Scene catalogue for Twin Lantern Hunt.
// Each difference has a centre (x, y) in the 560x420 picture and a hit
// radius r. paint.js draws the original at that spot on the left picture
// and the changed version on the right picture.
export const SCENES = [
  {
    id: "library",
    name: "Cozy Library",
    difficulty: "Easy",
    blurb: "A reading nook with a cat, a clock and tall shelves.",
    differences: [
      { id: "clock-hands", x: 452, y: 82, r: 34, label: "the clock shows a different time" },
      { id: "cat-tail", x: 118, y: 318, r: 32, label: "the cat's tail curls the other way" },
      { id: "lamp-shade", x: 76, y: 150, r: 34, label: "the lamp shade changed colour" },
      { id: "book-stack", x: 300, y: 336, r: 34, label: "a book is missing from the stack" },
      { id: "window-moon", x: 210, y: 86, r: 32, label: "the moon moved in the window" },
      { id: "teacup", x: 368, y: 300, r: 30, label: "steam is missing from the teacup" },
      { id: "globe", x: 498, y: 268, r: 34, label: "the globe lost its stand stripe" },
    ],
  },
  {
    id: "market",
    name: "Seaside Market",
    difficulty: "Medium",
    blurb: "Stalls, gulls and a striped awning by the harbour.",
    differences: [
      { id: "awning-stripe", x: 150, y: 96, r: 36, label: "an awning stripe changed colour" },
      { id: "gull-count", x: 430, y: 66, r: 34, label: "one gull is missing" },
      { id: "orange-count", x: 112, y: 250, r: 34, label: "the orange pile lost one orange" },
      { id: "sign-word", x: 330, y: 132, r: 38, label: "the stall sign says something else" },
      { id: "boat-sail", x: 478, y: 210, r: 34, label: "the boat sail changed colour" },
      { id: "bucket", x: 250, y: 330, r: 32, label: "the bucket handle vanished" },
      { id: "kite", x: 74, y: 58, r: 32, label: "the kite tail lost its bows" },
    ],
  },
  {
    id: "observatory",
    name: "Night Observatory",
    difficulty: "Hard",
    blurb: "A telescope dome, fireflies and a garden under the stars.",
    differences: [
      { id: "star-count", x: 96, y: 62, r: 34, label: "a bright star is missing" },
      { id: "telescope-angle", x: 392, y: 168, r: 38, label: "the telescope points another way" },
      { id: "owl-eyes", x: 140, y: 190, r: 32, label: "the owl opened its eyes" },
      { id: "firefly", x: 300, y: 300, r: 32, label: "a firefly moved to the other bush" },
      { id: "mushroom-spots", x: 460, y: 338, r: 32, label: "the mushroom lost a spot" },
      { id: "path-lantern", x: 210, y: 352, r: 32, label: "a path lantern went out" },
      { id: "dome-window", x: 392, y: 92, r: 32, label: "the dome window changed shape" },
    ],
  },
];

export function getScene(index) {
  return SCENES[((index % SCENES.length) + SCENES.length) % SCENES.length];
}
