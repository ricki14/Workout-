const workouts = [
  {
    day: "GIORNO 1",
    exercises: [
      ["Panca inclinata 30 bilanciere", "4x8", "1’30’’/2’"],
      ["Military press bilanciere", "4x8", "1’30’’/2’"],
      ["Distensioni manubri panca piana", "4x10", "1’30’’"],
      ["Alzate laterali singole al cavo", "4x8", "1’30’’"],
      ["Chest press", "4x10", "1’30’’"],
      ["Shoulder press", "4x10", "1’30’’"],
      ["Croci ai cavi alti", "3xmax", "1’30’’"],
      ["Push up", "3x12", "1’30’’"]
    ]
  },
  {
    day: "GIORNO 2",
    exercises: [
      ["Lat machine", "4x10", "1’30’’"],
      ["Pulley barra larga", "3x8", "1’30’’"],
      ["Rowing machine braccio singolo", "3x8", "1’30’’"],
      ["Pulley triangolo", "3x10", "1’30’’"],
      ["Pull up", "4x4", "1’30’’"],
      ["Raise alla sbarra", "3x12", "1’"]
    ]
  },
  {
    day: "GIORNO 3",
    exercises: [
      ["Curl alternato in piedi", "4x8", "1’30’’"],
      ["French press seduto braccio singolo", "4x8", "1’"],
      ["Curl bicipiti cavo basso corda", "4x10", "1’30’’"],
      ["Push down barra dritta", "4x10/12", "1’30’’"],
      ["Panca scott", "4x10", "1’30’’"],
      ["Push down corda", "4x10", "1’/1’30’’"],
      ["Push up", "3x12", "1’30’’"]
    ]
  },
  {
    day: "GIORNO 4",
    exercises: [
      ["Alzate laterali", "4x10", "1’30’’"],
      ["Front lever tuck", "4x4’’", "1’30’’"],
      ["Croci ai cavi bassi", "3x12", "1’30’’"],
      ["Pull up", "4x4", "1’30’’"],
      ["Raise alla sbarra", "3x12", "1’"],
      ["Crunch", "3x20", "1’"]
    ]
  }
];

const defaultLinks = {"0-0":"https://vm.tiktok.com/ZGdQmw1Ex/","0-1":"https://vm.tiktok.com/ZGdQmve6p/","0-2":"https://vm.tiktok.com/ZGdQm3fWo/","0-3":"https://vm.tiktok.com/ZGdQm7xu2/","0-4":"https://vm.tiktok.com/ZGdQm7nSA/","0-5":"https://vm.tiktok.com/ZGdQmno3r/","0-6":"https://vm.tiktok.com/ZGdQmTXda/","0-7":"https://vm.tiktok.com/ZGdQms2sN/","1-0":"https://vm.tiktok.com/ZGdQmorHu/","1-1":"https://vm.tiktok.com/ZGdQm75H5/","1-2":"https://vm.tiktok.com/ZGdQm3ejY/","1-3":"https://vm.tiktok.com/ZGdQmthQd/","1-4":"https://vm.tiktok.com/ZGdQmTVXx/","1-5":"https://vm.tiktok.com/ZGdQmwXUq/","1-6":"https://vm.tiktok.com/ZGdQuet9w/","1-7":"https://vm.tiktok.com/ZGdQuNFuB/","2-0":"https://vm.tiktok.com/ZGdQu2UyY/","2-1":"https://vm.tiktok.com/ZGdQm3LN3/","2-2":"https://vm.tiktok.com/ZGdQu1Ryo/","2-3":"https://vm.tiktok.com/ZGdQmGL1Y/","2-4":"https://vm.tiktok.com/ZGdQudL9g/","2-5":"https://vm.tiktok.com/ZGdQuLxBD/","2-6":"https://vm.tiktok.com/ZGdQmshJQ/","2-7":"https://vm.tiktok.com/ZGdQu2dF4/","3-0":"https://vm.tiktok.com/ZGdQmEWjF/","3-1":"https://vm.tiktok.com/ZGdQu2uke/","3-2":"https://vm.tiktok.com/ZGdQmGRHk/"};
const links = JSON.parse(localStorage.getItem(storageKey) || "null") || defaultLinks;
if (!localStorage.getItem(storageKey)) localStorage.setItem(storageKey, JSON.stringify(links));

const allExercises = () => workouts.flatMap(w => w.exercises.map(e => ({day:w.day, name:e[0], sets:e[1], rest:e[2]})));

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = workouts.map((w, wi) => `
    <section class="day">
      <div class="day-title">
        <h2>${w.day}</h2>
        <div class="day-sub">RECUPERO INDICATO DAL PT</div>
      </div>
      ${w.exercises.map((e, ei) => {
        const key = `${wi}-${ei}`;
        const has = !!links[key];
        return `
          <article class="exercise">
            <div>
              <div class="name">${escapeHtml(e[0])}</div>
              <div class="meta">${escapeHtml(e[1])} · recupero ${escapeHtml(e[2])}</div>
            </div>
            <button class="video-btn ${has ? "" : "empty"}" data-key="${key}" data-day="${w.day}" data-name="${escapeHtml(e[0])}">
              🎥 Video
            </button>
          </article>`;
      }).join("")}
    </section>
  `).join("");

  document.querySelectorAll(".video-btn").forEach(btn => {
    btn.addEventListener("click", () => openVideo(btn.dataset.key, btn.dataset.day, btn.dataset.name));
  });
}

function tiktokId(url) {
  const m = url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}

function openVideo(key, day, name) {
  const modal = document.getElementById("modal");
  const wrap = document.getElementById("videoWrap");
  const open = document.getElementById("openTikTok");
  document.getElementById("modalDay").textContent = day;
  document.getElementById("modalTitle").textContent = name;

  const url = links[key];
  wrap.innerHTML = "";
  open.classList.add("hidden");

  if (!url) {
    wrap.innerHTML = `<div class="video-placeholder">Per questo esercizio non hai ancora inserito un video.<br><br>Premi “Modifica video” e incolla il link TikTok.</div>`;
  } else {
    const id = tiktokId(url);
    if (id) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.tiktok.com/player/v1/${id}?description=1&music_info=1`;
      iframe.allow = "fullscreen";
      iframe.allowFullscreen = true;
      wrap.appendChild(iframe);
    } else {
      wrap.innerHTML = `<div class="video-placeholder">Link TikTok salvato.<br><br>Usa il pulsante qui sotto per aprirlo.</div>`;
    }
    open.href = url;
    open.classList.remove("hidden");
  }
  modal.classList.remove("hidden");
}

function openEditor() {
  const list = document.getElementById("editorList");
  list.innerHTML = allExercises().map((e, i) => {
    const originalIndex = (() => {
      let n = 0;
      for (let wi=0; wi<workouts.length; wi++) {
        for (let ei=0; ei<workouts[wi].exercises.length; ei++) {
          if (n === i) return `${wi}-${ei}`;
          n++;
        }
      }
    })();
    return `
      <div class="edit-row">
        <strong>${escapeHtml(e.name)}</strong>
        <small>${e.day} · ${e.sets} · recupero ${e.rest}</small>
        <input data-key="${originalIndex}" value="${escapeHtml(links[originalIndex] || "")}" placeholder="https://www.tiktok.com/@.../video/...">
      </div>`;
  }).join("");
  document.getElementById("editor").classList.remove("hidden");
}

function closeEditor() { document.getElementById("editor").classList.add("hidden"); }
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("videoWrap").innerHTML = "";
}

document.getElementById("editBtn").addEventListener("click", openEditor);
document.getElementById("closeEditor").addEventListener("click", closeEditor);
document.getElementById("saveBtn").addEventListener("click", () => {
  document.querySelectorAll("#editorList input").forEach(input => {
    const value = input.value.trim();
    if (value) links[input.dataset.key] = value;
    else delete links[input.dataset.key];
  });
  localStorage.setItem(storageKey, JSON.stringify(links));
  closeEditor();
  render();
});
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);

render();
