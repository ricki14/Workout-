const workouts = [
  {
    day: 'GIORNO 1',
    exercises: [
      { name: 'Panca inclinata 30 bilanciere', sets: '4x8', rest: '1’30’’/2’', video: 'https://vm.tiktok.com/ZGdQmw1Ex/' },
      { name: 'Military press bilanciere', sets: '4x8', rest: '1’30’’/2’', video: 'https://vm.tiktok.com/ZGdQmve6p/' },
      { name: 'Distensioni manubri panca piana', sets: '4x10', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQm3fWo/' },
      { name: 'Alzate laterali singole al cavo', sets: '4x8', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQm7xu2/' },
      { name: 'Chest press', sets: '4x10', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQm7nSA/' },
      { name: 'Shoulder press', sets: '4x10', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQmno3r/' },
      { name: 'Croci ai cavi alti', sets: '3xmax', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQmTXda/' },
      { name: 'Push up', sets: '3x12', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQms2sN/' },
    ]
  },
  {
    day: 'GIORNO 2',
    exercises: [
      { name: 'Lat machine', sets: '4x10', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQmorHu/' },
      { name: 'Pulley barra larga', sets: '3x8', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQm75H5/' },
      { name: 'Rowing machine braccio singolo', sets: '3x8', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQm3ejY/' },
      { name: 'Pulley triangolo', sets: '3x10', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQmthQd/' },
      { name: 'Pull up', sets: '4x4', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQmTVXx/' },
      { name: 'Raise alla sbarra', sets: '3x12', rest: '1’', video: 'https://vm.tiktok.com/ZGdQmwXUq/' },
    ]
  },
  {
    day: 'GIORNO 3',
    exercises: [
      { name: 'Curl alternato in piedi', sets: '4x8', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQuet9w/' },
      { name: 'French press seduto braccio singolo', sets: '4x8', rest: '1’', video: 'https://vm.tiktok.com/ZGdQuNFuB/' },
      { name: 'Curl bicipiti cavo basso corda', sets: '4x10', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQu2UyY/' },
      { name: 'Push down barra dritta', sets: '4x10/12', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQm3LN3/' },
      { name: 'Panca scott', sets: '4x10', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQu1Ryo/' },
      { name: 'Push down corda', sets: '4x10', rest: '1’/1’30’’', video: 'https://vm.tiktok.com/ZGdQmGL1Y/' },
      { name: 'Push up', sets: '3x12', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQudL9g/' },
    ]
  },
  {
    day: 'GIORNO 4',
    exercises: [
      { name: 'Alzate laterali', sets: '4x10', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQuLxBD/' },
      { name: 'Front lever tuck', sets: '4x4’’', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQmshJQ/' },
      { name: 'Croci ai cavi bassi', sets: '3x12', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQu2dF4/' },
      { name: 'Pull up', sets: '4x4', rest: '1’30’’', video: 'https://vm.tiktok.com/ZGdQmEWjF/' },
      { name: 'Raise alla sbarra', sets: '3x12', rest: '1’', video: 'https://vm.tiktok.com/ZGdQu2uke/' },
      { name: 'Crunch', sets: '3x20', rest: '1’', video: 'https://vm.tiktok.com/ZGdQmGRHk/' },
    ]
  },
];

const daySelect = document.getElementById("daySelect");
const panel = document.getElementById("workoutPanel");
const modal = document.getElementById("modal");
const videoWrap = document.getElementById("videoWrap");
const openTikTok = document.getElementById("openTikTok");

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function renderDay(index) {
  const workout = workouts[index];
  if (!workout) {
    panel.classList.add("hidden");
    panel.innerHTML = "";
    return;
  }
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <div class="workout-head">
      <h2>${workout.day}</h2>
      <span>${workout.exercises.length} esercizi</span>
    </div>
    <div class="table">
      <div class="table-head">
        <div>ESERCIZIO</div><div>SERIE × REP</div><div>RECUPERO</div><div>VIDEO</div>
      </div>
      ${workout.exercises.map((e, i) => `
        <div class="exercise">
          <div class="exercise-name">${escapeHtml(e.name)}</div>
          <div class="cell">${escapeHtml(e.sets)}</div>
          <div class="cell">${escapeHtml(e.rest)}</div>
          <div><button class="video-btn" data-index="${i}">🎥 Video</button></div>
        </div>
      `).join("")}
    </div>
    <div class="note">Tra un esercizio e l’altro: recupero generale indicato dal PT 3’.</div>
  `;
  panel.querySelectorAll(".video-btn").forEach(btn => {
    btn.addEventListener("click", () => openVideo(index, Number(btn.dataset.index)));
  });
}

function tiktokId(url) {
  const m = url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}

function openVideo(dayIndex, exerciseIndex) {
  const e = workouts[dayIndex].exercises[exerciseIndex];
  document.getElementById("modalDay").textContent = workouts[dayIndex].day;
  document.getElementById("modalTitle").textContent = e.name;
  videoWrap.innerHTML = "";
  const id = tiktokId(e.video);
  if (id) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.tiktok.com/player/v1/${id}?description=1&music_info=1`;
    iframe.allow = "fullscreen";
    iframe.allowFullscreen = true;
    videoWrap.appendChild(iframe);
  } else {
    videoWrap.innerHTML = `<div class="video-placeholder">Video disponibile su TikTok.</div>`;
  }
  openTikTok.href = e.video;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  videoWrap.innerHTML = "";
}

daySelect.addEventListener("change", e => renderDay(Number(e.target.value)));
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);
