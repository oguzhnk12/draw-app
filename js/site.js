
const cekilisButonu = document.getElementById('cekilisButonu');
const katilimciAlani = document.getElementById('katilimciAlani');
const kazananLabeli = document.getElementById('kazananLabeli');

function konfetiPatlat() {
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });
}

function cekilisYap() {
    let katilimcilar = katilimciAlani.value
        .split('\n')
        .map(satir => satir.trim())
        .filter(satir => satir.length > 0);

    if (katilimcilar.length <= 1) {
        kazananLabeli.style.visibility = 'visible';
        kazananLabeli.style.color = 'red';
        kazananLabeli.textContent = "⚠️ En az 2 katılımcı gerekli!";
        return;
    }

    kazananLabeli.style.visibility = 'visible';
    kazananLabeli.style.color = '#333';
    kazananLabeli.textContent = "Çekiliş yapılıyor... 🎲";

    let interval;
    let sayac = 0;
    const maxSayi = 30;
    interval = setInterval(() => {
        const rastgele = katilimcilar[Math.floor(Math.random() * katilimcilar.length)];
        kazananLabeli.textContent = "🎰 " + rastgele;
        sayac++;

        if (sayac >= maxSayi) {
            clearInterval(interval);
            const kazanan = katilimcilar[Math.floor(Math.random() * katilimcilar.length)];
            kazananLabeli.textContent = "🎉 Kazanan: " + kazanan;
            kazananLabeli.style.color = "green";
            konfetiPatlat();
        }
    }, 50); 
}
cekilisButonu.addEventListener('click', cekilisYap);
