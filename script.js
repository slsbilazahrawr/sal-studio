const video = document.getElementById('webcam');
const canvas = document.getElementById('photo-canvas');
const frameOverlay = document.getElementById('frame-overlay');
const downloadBtn = document.getElementById('download-btn');
const captureBtn = document.getElementById('capture-btn');
const selectedFrameText = document.getElementById('selected-frame-name');
const countdownEl = document.getElementById('countdown');

let isCaptured = false;
let currentFrameName = 'Single Frame 1';
let capturedSlots = [];

const frameDatabase = {
  // --- SINGLE FRAMES (1 - 9) ---
  'Single Frame 1': { slots: [{ xPct: 0.12, yPct: 0.25, wPct: 0.50, hPct: 0.65 }] },
  'Single Frame 2': { slots: [{ xPct: 0.12, yPct: 0.20, wPct: 0.55, hPct: 0.73 }] },
  'Single Frame 3': { slots: [{ xPct: 0.12, yPct: 0.20, wPct: 0.55, hPct: 0.73 }] },
  'Single Frame 4': { slots: [{ xPct: 0.08, yPct: 0.30, wPct: 0.53, hPct: 0.53 }] },
  'Single Frame 5': { slots: [{ xPct: 0.14, yPct: 0.30, wPct: 0.53, hPct: 0.53 }] },
  'Single Frame 6': { slots: [{ xPct: 0.08, yPct: 0.30, wPct: 0.53, hPct: 0.55 }] },
  'Single Frame 7': { slots: [{ xPct: 0.08, yPct: 0.30, wPct: 0.53, hPct: 0.53 }] },
  'Single Frame 8': { slots: [{ xPct: 0.08, yPct: 0.30, wPct: 0.53, hPct: 0.42 }] },
  'Single Frame 9': { slots: [{ xPct: 0.08, yPct: 0.30, wPct: 0.53, hPct: 0.53 }] },

  // --- TEAM FRAMES (1 - 9) ---
  'Team Frame 1': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  },
  'Team Frame 2': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  },
  'Team Frame 3': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  },
  'Team Frame 4': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  },
  'Team Frame 5': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  },
  'Team Frame 6': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  },
  'Team Frame 7': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  },
  'Team Frame 8': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  },
  'Team Frame 9': {
    slots: [
      { xPct: 0.12, yPct: 0.10, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.35, wPct: 0.87, hPct: 0.23 },
      { xPct: 0.12, yPct: 0.56, wPct: 0.87, hPct: 0.23 }
    ]
  }
};

let currentConfig = frameDatabase['Team Frame 1'];

function startCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { 
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch(err => console.error("Kamera error:", err));
  }
}
startCamera();

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
  
  if (pageId === 'photo') {
    startCamera();
    if (selectedFrameText && selectedFrameText.innerText === 'Belum Memilih') {
      selectFrame('Team Frame 1', 'TeamFrame/tframe1_.png');
    }
  }
}

function setVideoToSlot(slotIndex) {
  if (!video || !frameOverlay) return;
  const slot = currentConfig.slots[slotIndex] || currentConfig.slots[0];

  const frameWidth = frameOverlay.clientWidth;
  const frameHeight = frameOverlay.clientHeight;
  const frameLeft = frameOverlay.offsetLeft;
  const frameTop = frameOverlay.offsetTop;

  const left = frameLeft + (slot.xPct * frameWidth);
  const top = frameTop + (slot.yPct * frameHeight);
  const width = slot.wPct * frameWidth;
  const height = slot.hPct * frameHeight;

  video.style.setProperty('position', 'absolute', 'important');
  video.style.setProperty('left', left + 'px', 'important');
  video.style.setProperty('top', top + 'px', 'important');
  video.style.setProperty('width', width + 'px', 'important');
  video.style.setProperty('height', height + 'px', 'important');
  
  // Mencegah gambar tertarik/peyot
  video.style.setProperty('object-fit', 'cover', 'important');
  video.style.setProperty('z-index', '1', 'important');
  video.style.setProperty('pointer-events', 'none', 'important');
}

async function capturePhoto() {
  if (isCaptured) {
    resetPhoto();
    return;
  }

  const slots = currentConfig.slots;
  capturedSlots = [];
  if (captureBtn) captureBtn.disabled = true;

  for (let i = 0; i < slots.length; i++) {
    setVideoToSlot(i);

    for (let count = 3; count > 0; count--) {
      if (countdownEl) countdownEl.innerText = count;
      await new Promise(r => setTimeout(r, 600));
    }
    if (countdownEl) countdownEl.innerText = "📸";

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(video, 0, 0);
    capturedSlots.push(tempCanvas);

    await new Promise(r => setTimeout(r, 300));
  }

  if (countdownEl) countdownEl.innerText = '';
  if (captureBtn) captureBtn.disabled = false;

  renderToCanvas();
}

function renderToCanvas() {
  if (!canvas || !video) return;
  const ctx = canvas.getContext('2d');

  const frameImg = new Image();
  frameImg.crossOrigin = "anonymous";
  frameImg.src = frameOverlay.src;

  frameImg.onload = () => {
    const realW = frameImg.naturalWidth;
    const realH = frameImg.naturalHeight;

    canvas.style.pointerEvents = 'none';
    canvas.width = realW;
    canvas.height = realH;
    ctx.clearRect(0, 0, realW, realH);

    // 1. Gambar foto webcam TERLEBIH DAHULU (di layer paling bawah)
    currentConfig.slots.forEach((slot, index) => {
      const photo = capturedSlots[index];
      if (!photo) return;

      const x = slot.xPct * realW;
      const y = slot.yPct * realH;
      const w = slot.wPct * realW;
      const h = slot.hPct * realH;

      ctx.save();
      const videoAspect = photo.width / photo.height;
      const targetAspect = w / h;
      let sx, sy, sw, sh;

      if (videoAspect > targetAspect) {
        sh = photo.height;
        sw = sh * targetAspect;
        sx = (photo.width - sw) / 2;
        sy = 0;
      } else {
        sw = photo.width;
        sh = sw / targetAspect;
        sx = 0;
        sy = (photo.height - sh) / 2;
      }

      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(photo, sx, sy, sw, sh, 0, 0, w, h);
      ctx.restore();
    });

    // 2. Gambar Frame PNG DI ATAS FOTO (sehingga pinggiran foto tertutup rapi oleh frame)
    ctx.drawImage(frameImg, 0, 0, realW, realH);

    canvas.classList.remove('hidden');
    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.left = frameOverlay.offsetLeft + 'px';
    canvas.style.top = frameOverlay.offsetTop + 'px';
    canvas.style.width = frameOverlay.clientWidth + 'px';
    canvas.style.height = frameOverlay.clientHeight + 'px';
    canvas.style.zIndex = '3';

    video.style.visibility = 'hidden';
    isCaptured = true;

    if (captureBtn) captureBtn.innerText = "Foto Ulang 🔄";
    
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.style.opacity = "1";
      downloadBtn.style.cursor = "pointer";
    }
  };
}

function downloadPhoto() {
  if (!canvas) return;
  
  // Menggunakan toBlob agar kompatibel dengan sistem browser saat ini
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'sal-studio-photo.png';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function resetPhoto() {
  if (canvas) {
    canvas.classList.add('hidden');
    canvas.style.display = 'none';
  }
  if (video) {
    video.style.visibility = 'visible';
    video.play();
  }
  isCaptured = false;
  if (captureBtn) captureBtn.innerText = "Ambil Foto 📷";
  if (downloadBtn) {
    downloadBtn.disabled = true;
    downloadBtn.style.opacity = "0.5";
  }
  if (currentConfig.slots.length > 0) {
    setVideoToSlot(0);
  }
}

window.addEventListener('resize', () => {
  if (!isCaptured && currentConfig.slots.length > 0) {
    setVideoToSlot(0);
  }
});

function selectFrame(frameKey, imagePath) {
  // 1. Cek & set config frame yang dipilih
  if (frameDatabase[frameKey]) {
    currentConfig = frameDatabase[frameKey];
    currentFrameName = frameKey;
  } else {
    // Jika tidak ada di database, buat config default 1 slot
    currentConfig = { slots: [{ xPct: 0.10, yPct: 0.15, wPct: 0.80, hPct: 0.70 }] };
  }

  // 2. Update teks nama frame
  if (selectedFrameText) {
    selectedFrameText.innerText = frameKey;
  }

  // 3. Update gambar overlay frame
  if (frameOverlay) {
    frameOverlay.src = imagePath;
  }

  // 4. Pindah otomatis ke Halaman Photo (sesuai sistem navbar kamu)
  showPage('photo');

  // 5. Reset foto & Posisikan webcam
  resetPhoto();
  setTimeout(() => {
    setVideoToSlot(0);
  }, 100);
}

function sendToWhatsApp(event) {
  event.preventDefault(); // Mencegah reload halaman

  // GANTI DENGAN NOMOR WA KAMU (Gunakan kode negara 62, contoh: 6281234567890)
  const phoneNumber = "6285643906220"; 

  const nama = document.getElementById('nama').value;
  const ulasan = document.getElementById('ulasan').value;

  // Format pesan rapi untuk WhatsApp
  const message = `Halo Salsa! %0A%0AAku *${nama}* baru saja mencoba foto di *Sal Studio*! %0A%0A*Ulasan / Pesan:*%0A"${ulasan}"`;

  // Buka aplikasi WhatsApp
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(waUrl, '_blank');
}