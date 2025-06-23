const aqiValue = document.getElementById("aqiValue");
const aqiStatus = document.getElementById("aqiStatus");
const lastUpdate = document.getElementById("lastUpdate");
const locationElement = document.getElementById("location");
const body = document.body;

const API_KEY = "b5ff0398-6674-41f5-bcc1-b3ad6322dcc1";
const API_URL = "https://api.airvisual.com/v2/nearest_city";

const colorScheme = {
  good: {
    key: "good",
    bg: "#E6F4D7",
    text: "#4CAF50",
    status: "Good",
  },
  moderate: {
    key: "moderate",
    bg: "#FFF3C4",
    text: "#FFC107",
    status: "Moderate",
  },
  unhealthy1: {
    key: "unhealthy1",
    bg: "#FFE0B2",
    text: "#FF9800",
    status: "Unhealthy (SG)",
  },
  unhealthy2: {
    key: "unhealthy2",
    bg: "#FFCDD2",
    text: "#F44336",
    status: "Unhealthy",
  },
  veryUnhealthy: {
    key: "veryUnhealthy",
    bg: "#E1BEE7",
    text: "#9C27B0",
    status: "Very Unhealthy",
  },
  hazardous: {
    key: "hazardous",
    bg: "#D7CCC8",
    text: "#795548",
    status: "Hazardous",
  },
};

let coords;

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation tidak didukung browser Anda");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          coords = position.coords;
          resolve(coords);
        },
        (error) => reject(error)
      );
    }
  });
}

async function fetchAQI(coords) {
  const url = `${API_URL}?lat=${coords.latitude}&lon=${coords.longitude}&key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      return {
        aqi: data.data?.current?.pollution?.aqius || 0,
        city: data.data?.city || "Tidak Dikenali",
        temperature: data.data?.current?.weather?.tp || "N/A",
        humidity: data.data?.current?.weather?.hu || "N/A",
        windSpeed: data.data?.current?.weather?.ws || 0,
        windDirection: data.data?.current?.weather?.wd || 0,
      };
    }
    throw new Error(data.data?.message || "Gagal memuat data");
  } catch (error) {
    throw new Error("Gagal mengambil data: " + error.message);
  }
}

function getWindDirection(degrees) {
  const directions = [
    "U",
    "U-TL",
    "TL",
    "TL-T",
    "T",
    "T-SL",
    "SL",
    "SL-S",
    "S",
    "S-BD",
    "BD",
    "BD-B",
    "B",
    "B-BL",
    "BL",
    "BL-U",
  ];
  return directions[Math.round(degrees / 22.5) % 16] || "-";
}

function updateDisplay(data) {
  const now = new Date();

  aqiValue.textContent = data.aqi.toString().padStart(3, "0");
  locationElement.textContent = data.city;
  lastUpdate.textContent = now.toLocaleTimeString("id-ID");

  document.getElementById("temperature").textContent = data.temperature;
  document.getElementById("humidity").textContent = data.humidity;
  document.getElementById("windSpeed").textContent = (
    data.windSpeed * 3.6
  ).toFixed(1);
  document.getElementById("windDirection").textContent = getWindDirection(
    data.windDirection
  );

  document.getElementById(
    "windIcon"
  ).style.transform = `rotate(${data.windDirection}deg)`;

  updateColorsBasedOnAQI(data.aqi);
  updateAqiBadge();
}

function updateColorsBasedOnAQI(aqi) {
  let scheme;
  if (aqi <= 50) scheme = colorScheme.good;
  else if (aqi <= 100) scheme = colorScheme.moderate;
  else if (aqi <= 150) scheme = colorScheme.unhealthy1;
  else if (aqi <= 200) scheme = colorScheme.unhealthy2;
  else if (aqi <= 300) scheme = colorScheme.veryUnhealthy;
  else scheme = colorScheme.hazardous;

  applyColors(scheme);
}

function applyColors(scheme) {
  body.style.backgroundColor = scheme.bg;
  aqiValue.style.color = scheme.text;
  aqiStatus.textContent = `${scheme.status} | ${getHealthAdvice(scheme.key)}`;
  aqiStatus.style.color = scheme.text;
}

function getHealthAdvice(key) {
  const advice = {
    good: "Aman beraktivitas di luar",
    moderate: "Kelompok sensitif perlu hati-hati",
    unhealthy1: "Kurangi aktivitas luar ruangan",
    unhealthy2: "Gunakan masker jika keluar rumah",
    veryUnhealthy: "Hindari aktivitas di luar",
    hazardous: "Jangan keluar rumah!",
  };
  return advice[key] || "";
}

async function updateAQI() {
  try {
    const coordinates = await getLocation();
    const aqiData = await fetchAQI(coordinates);
    updateDisplay(aqiData);
  } catch (error) {
    aqiStatus.textContent = "Error: " + error.message;
    aqiStatus.style.color = "#F44336";
    console.error("Error:", error);

    document.querySelectorAll(".weather-item span").forEach((el) => {
      el.textContent = "-";
    });
  }
}

// Tambahkan object deskripsi lengkap
const aqiDescriptions = {
  good: {
    range: "0 - 50",
    title: "Good",
    color: "#4CAF50",
    rgb: "76, 175, 80",
    desc: "Kualitas udara sangat baik dan ideal untuk semua aktivitas luar ruangan. Tidak ada risiko kesehatan yang signifikan.",
    recommendations: [
      "Nikmati aktivitas luar ruangan seperti biasa",
      "Pertahankan ventilasi alami di rumah",
      "Ideal untuk olahraga outdoor",
    ],
    affectedGroups: "Tidak ada kelompok yang berisiko",
    icon: "fa-face-smile",
  },
  moderate: {
    range: "51 - 100",
    title: "Moderate",
    color: "#FFC107",
    rgb: "255, 193, 7",
    desc: "Kualitas udara masih dalam batas wajar namun mungkin berpengaruh pada individu yang sangat sensitif.",
    recommendations: [
      "Kelompok sensitif sebaiknya mengurangi aktivitas berat di luar ruangan",
      "Pantau gejala iritasi pernapasan",
      "Tutup jendela jika menggunakan AC",
    ],
    affectedGroups: "Penderita asma, lansia, dan anak-anak",
    icon: "fa-face-meh",
  },
  unhealthy1: {
    range: "101 - 150",
    title: "Unhealthy for Sensitive Groups",
    color: "#FF9800",
    rgb: "255, 152, 0",
    desc: "Kualitas udara mulai membahayakan bagi kelompok sensitif. Masyarakat umum mungkin mengalami iritasi ringan.",
    recommendations: [
      "Kelompok sensitif hindari aktivitas luar ruangan berkepanjangan",
      "Gunakan masker jika harus keluar rumah",
      "Pasang pembersih udara dalam ruangan",
    ],
    affectedGroups:
      "Penderita penyakit pernapasan, jantung, anak-anak, dan lansia",
    icon: "fa-mask-face",
  },
  unhealthy2: {
    range: "151 - 200",
    title: "Unhealthy",
    color: "#F44336",
    rgb: "244, 67, 54",
    desc: "Seluruh populasi mulai merasakan efek kesehatan. Kelompok sensitif berisiko mengalami komplikasi serius.",
    recommendations: [
      "Hindari aktivitas luar ruangan yang tidak perlu",
      "Gunakan masker N95 saat harus keluar",
      "Gunakan air purifier dengan filter HEPA",
    ],
    affectedGroups: "Semua populasi, terutama kelompok sensitif",
    icon: "fa-ban",
  },
  veryUnhealthy: {
    range: "201 - 300",
    title: "Very Unhealthy",
    color: "#9C27B0",
    rgb: "156, 39, 176",
    desc: "Kondisi darurat kesehatan. Peningkatan signifikan dalam efek kesehatan serius bagi seluruh populasi.",
    recommendations: [
      "Hindari semua aktivitas luar ruangan",
      "Tutup semua jendela dan pintu",
      "Segera cari tempat dengan udara bersih",
    ],
    affectedGroups: "Seluruh populasi tanpa terkecuali",
    icon: "fa-triangle-exclamation",
  },
  hazardous: {
    range: "300+",
    title: "Hazardous",
    color: "#795548",
    rgb: "121, 85, 72",
    desc: "Kondisi berbahaya yang mengancam jiwa. Segera ambil tindakan perlindungan ekstra.",
    recommendations: [
      "Tetap di dalam ruangan dengan sistem filtrasi udara",
      "Gunakan oksigen tambahan jika diperlukan",
      "Evakuasi ke area dengan udara bersih jika memungkinkan",
    ],
    affectedGroups: "Semua makhluk hidup di area terdampak",
    icon: "fa-skull-crossbones",
  },
};

// Fungsi untuk menangani modal
function setupModal() {
  const modal = document.getElementById("aqiModal");
  const span = document.getElementsByClassName("close")[0];

  // Buka modal saat scale item diklik
  document.querySelectorAll(".scale-item").forEach((item) => {
    item.addEventListener("click", () => {
      const level = item.dataset.aqiLevel;
      showModal(level);
    });
  });

  // Tutup modal
  span.onclick = () => (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
}

function showModal(level) {
  const modal = document.getElementById("aqiModal");
  const desc = aqiDescriptions[level];

  // Set konten modal
  document.getElementById("modalTitle").textContent = desc.title;
  document.getElementById("modalDesc").textContent = desc.desc;

  modalIcon.innerHTML = `<i class="fas ${desc.icon}"></i>`;
  modalIcon.style.backgroundColor = `rgba(${desc.rgb}, 0.2)`;
  modalIcon.style.color = desc.color;

  // Set rekomendasi
  const recommendationsList = desc.recommendations
    .map((rec) => `<li>${rec}</li>`)
    .join("");
  document.getElementById("modalRecommendations").innerHTML =
    recommendationsList;

  // Set kelompok terdampak
  document.getElementById(
    "modalAffected"
  ).innerHTML = `🏥 Kelompok Terdampak: ${desc.affectedGroups}`;

  modal.style.display = "flex";
}

// Panggil setupModal di akhir script.js
setupModal();

// Update setiap 10 menit
setInterval(updateAQI, 600000);
updateAQI();

function updateAqiBadge() {
  const aqiValue = document.getElementById('aqiValue');
  const aqiBadge = document.getElementById('aqiBadge');
  let val = parseInt(aqiValue.textContent, 10);
  let badge = aqiBadge;
  if (val <= 50) {
    badge.textContent = 'Good';
    badge.className = 'inline-block rounded-full px-3 py-1 text-xs font-bold text-white bg-green-400 shadow-md transition-colors duration-300';
    aqiValue.className = 'text-6xl font-extrabold transition-colors duration-300 text-green-500 drop-shadow-lg';
  } else if (val <= 100) {
    badge.textContent = 'Moderate';
    badge.className = 'inline-block rounded-full px-3 py-1 text-xs font-bold text-white bg-yellow-400 shadow-md transition-colors duration-300';
    aqiValue.className = 'text-6xl font-extrabold transition-colors duration-300 text-yellow-400 drop-shadow-lg';
  } else if (val <= 150) {
    badge.textContent = 'Unhealthy (SG)';
    badge.className = 'inline-block rounded-full px-3 py-1 text-xs font-bold text-white bg-orange-400 shadow-md transition-colors duration-300';
    aqiValue.className = 'text-6xl font-extrabold transition-colors duration-300 text-orange-400 drop-shadow-lg';
  } else if (val <= 200) {
    badge.textContent = 'Unhealthy';
    badge.className = 'inline-block rounded-full px-3 py-1 text-xs font-bold text-white bg-red-400 shadow-md transition-colors duration-300';
    aqiValue.className = 'text-6xl font-extrabold transition-colors duration-300 text-red-400 drop-shadow-lg';
  } else if (val <= 300) {
    badge.textContent = 'Very Unhealthy';
    badge.className = 'inline-block rounded-full px-3 py-1 text-xs font-bold text-white bg-purple-500 shadow-md transition-colors duration-300';
    aqiValue.className = 'text-6xl font-extrabold transition-colors duration-300 text-purple-500 drop-shadow-lg';
  } else {
    badge.textContent = 'Hazardous';
    badge.className = 'inline-block rounded-full px-3 py-1 text-xs font-bold text-white bg-amber-900 shadow-md transition-colors duration-300';
    aqiValue.className = 'text-6xl font-extrabold transition-colors duration-300 text-amber-900 drop-shadow-lg';
  }
}
