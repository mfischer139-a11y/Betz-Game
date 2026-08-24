const game = document.getElementById("game");
const lucy = document.getElementById("lucy");
const lina = document.getElementById("lina");
const actionButton = document.getElementById("actionButton");
const quest = document.getElementById("quest");
const speech = document.getElementById("speech");

let riding = false;

let lucyX = window.innerWidth * 0.12;
let lucyY = window.innerHeight * 0.16;

let linaX = window.innerWidth * 0.72;
let linaY = window.innerHeight * 0.17;

// Fortschritt der Wald-Aufgabe
let rideSteps = 0;
let birdsHeard = false;
let birdsFound = false;

function updatePositions() {
  if (!riding) {
    lucy.style.left = lucyX + "px";
    lucy.style.bottom = lucyY + "px";
  }

  lina.style.left = linaX + "px";
  lina.style.bottom = linaY + "px";
  lina.style.right = "auto";
}

function move(direction) {
  const step = riding ? 26 : 18;

  let targetX = riding ? linaX : lucyX;
  let targetY = riding ? linaY : lucyY;

  if (direction === "left") targetX -= step;
  if (direction === "right") targetX += step;
  if (direction === "up") targetY += step;
  if (direction === "down") targetY -= step;

  const maxX = window.innerWidth - 110;
  const maxY = window.innerHeight * 0.42;
  const minY = 40;

  targetX = Math.max(0, Math.min(maxX, targetX));
  targetY = Math.max(minY, Math.min(maxY, targetY));

  if (riding) {
    linaX = targetX;
    linaY = targetY;

    // Jeder Reitschritt zählt für die Wald-Mission
    if (!birdsFound) {
      rideSteps++;
      checkForestMission();
    }
  } else {
    lucyX = targetX;
    lucyY = targetY;
  }

  updatePositions();
  checkNearLina();
}

function checkNearLina() {
  if (riding) {
    actionButton.style.display = "block";
    return;
  }

  const dx = lucyX - linaX;
  const dy = lucyY - linaY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 145) {
    actionButton.style.display = "block";
    speech.classList.remove("hidden");

    speech.innerHTML =
      "Da ist Lina! 🦄<br>Du kannst jetzt aufsteigen.";

    quest.innerHTML =
      "Aufgabe geschafft: Lina gefunden ✨";
  } else {
    actionButton.style.display = "none";
  }
}

function toggleRide() {
  riding = !riding;

  game.classList.toggle("riding", riding);

  if (riding) {
    linaX = lucyX;
    linaY = lucyY;

    updatePositions();

    actionButton.innerHTML = "Absteigen 👧🏼";

    if (!birdsFound) {
      quest.innerHTML =
        "Neue Aufgabe: Reite durch den Wald 🌲";

      speech.innerHTML =
        "Juhu! Lucy reitet jetzt auf Lina! 🦄✨<br><br>Mal sehen, was wir im Wald entdecken.";
    }

  } else {
    lucyX = linaX - 65;
    lucyY = linaY;

    updatePositions();

    actionButton.innerHTML = "Aufsteigen 🦄";

    if (!birdsFound) {
      speech.innerHTML = "Lucy ist abgestiegen.";
    }

    checkNearLina();
  }
}

function checkForestMission() {

  // Nach einigen Reitschritten hört Lucy etwas
  if (rideSteps >= 6 && !birdsHeard) {
    birdsHeard = true;

    quest.innerHTML =
      "Hör genau hin... 🐦";

    speech.innerHTML =
      "Piep! Piep! 🐦<br><br>Lucy hört Vögel irgendwo im Wald!";
  }

  // Wenig später findet sie die Vögel
  if (rideSteps >= 11 && !birdsFound) {
    birdsFound = true;

    quest.innerHTML =
      "Vögel gefunden! 🐦✨";

    speech.innerHTML =
      "Da sind sie! 🐦🐤🐦🐤<br><br>Oh je... die Vögel sind völlig durcheinander!";

    showBirdButton();
  }
}

function showBirdButton() {
  actionButton.style.display = "block";
  actionButton.innerHTML = "Zu den Vögeln 🐦";

  // Der Button startet jetzt die nächste Mission
  actionButton.onclick = startBirdMission;
}

function startBirdMission() {

  quest.innerHTML =
    "Neue Aufgabe: Hilf den Vögeln 🐦";

  speech.innerHTML =
    "Die verschiedenen Vögel müssen wieder zu ihren Freunden auf den richtigen Ast.<br><br>✨ Als Nächstes bauen wir hier das Sortierspiel!";

  actionButton.style.display = "none";
}

updatePositions();
checkNearLina();
