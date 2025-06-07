document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 150);
});

const drawButton = document.getElementById('drawButton');
const participantsField = document.getElementById('participantsField');
const winnersDiv = document.getElementById('winnersDiv');
const numberOfWinners = document.getElementById('numberOfWinners');

// Katılımcıları satırlardan al, boş satırları temizle
function getParticipants() {
  return participantsField.value
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

// Kazanan sayısı dropdown listesini güncelle
function updateWinnerOptions() {
  const participants = getParticipants();
  numberOfWinners.innerHTML = "";

  const maxWinners = participants.length <= 1 ? 1 : participants.length - 1;

  for (let i = 1; i <= maxWinners; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    numberOfWinners.appendChild(option);
  }
}

// Konfeti patlatma animasyonu ve ses efekti
function confettiExplosion() {
  const audio = new Audio('tada.mp3');
  audio.play();

  setTimeout(() => {
    confetti({
      particleCount: 200,
      spread: 200,
      origin: { y: 0.6 }
    });
  }, 3000);
}

// Kazanan seçimi animasyonu ve seçimi yapan fonksiyon
function makeDraw(excludedWinners = []) {
  return new Promise((resolve) => {
    let participants = getParticipants().filter(p => !excludedWinners.includes(p));
    const winnerLabel = document.createElement("label");

    winnerLabel.classList.add("mt-3", "fw-bold", "d-block");
    winnerLabel.style.fontSize = "1.2rem";
    winnersDiv.appendChild(winnerLabel);

    if (participants.length <= 1) {
      winnerLabel.style.color = 'red';
      winnerLabel.textContent = "⚠️ En az 2 katılımcı gerekli!";
      resolve(null);
      return;
    }

    winnerLabel.style.color = '#333';

    let count = 0;
    const maxCycles = 30;

    const intervalId = setInterval(() => {
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
      winnerLabel.textContent = `🎰 Kazanan: ${randomParticipant}`;
      count++;

      if (count >= maxCycles) {
        clearInterval(intervalId);
        const finalWinner = participants[Math.floor(Math.random() * participants.length)];
        winnerLabel.style.color = "green";
        winnerLabel.textContent = `🎉 Kazanan: ${finalWinner}`;
        resolve(finalWinner);
      }
    }, 100);
  });
}

// Çekilişi başlat ve kazananları seç
async function runDraws() {
  drawButton.disabled = true;

  // Önce önceki kazananları temizle
  winnersDiv.innerHTML = "";

  const winners = [];
  const totalWinners = Number(numberOfWinners.value);
  const participants = getParticipants();

  for (let i = 0; i < totalWinners; i++) {
    // Son kazanan seçileceği zaman konfeti patlat
    if (i === totalWinners - 1 && participants.length >= 2) {
      confettiExplosion();
    }
    const winner = await makeDraw(winners);
    if (winner) winners.push(winner);
  }

  drawButton.disabled = false;
}

// Event listener'lar
drawButton.addEventListener('click', runDraws);
participantsField.addEventListener('input', updateWinnerOptions);

// Sayfa yüklendiğinde kazanan sayısı güncelle
updateWinnerOptions();
