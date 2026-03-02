const roomsContainer = document.getElementById('roomsContainer');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const logoutBtn = document.getElementById('logoutBtn');
const statusEl = document.getElementById('status');

const loginGate = document.getElementById('loginGate');
const adminApp = document.getElementById('adminApp');
const loginForm = document.getElementById('loginForm');
const adminUserInput = document.getElementById('adminUser');
const adminPassInput = document.getElementById('adminPass');
const loginStatus = document.getElementById('loginStatus');

const ADMIN_SESSION_KEY = 'tunkul_admin_session_v1';
const ADMIN_USER = 'tunkuladmin';
const ADMIN_PASS = 'Tunkul2026!';

const ADMIN_ROOM_GALLERY_LIMIT = window.ROOM_GALLERY_LIMIT || 6;
const ADMIN_COMMON_GALLERY_LIMIT = window.COMMON_GALLERY_LIMIT || 12;

function setStatus(message) {
  if (statusEl) statusEl.textContent = message;
}

function setLoginStatus(message) {
  if (loginStatus) loginStatus.textContent = message;
}

function isAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'ok';
}

function showAdmin() {
  loginGate?.classList.add('hidden');
  adminApp?.classList.remove('hidden');
}

function showLogin() {
  adminApp?.classList.add('hidden');
  loginGate?.classList.remove('hidden');
}

function textField(name, label, value, multiline = false, full = false) {
  return `
    <label class="${full ? 'full' : ''}">
      ${label}
      ${multiline ? `<textarea name="${name}">${value || ''}</textarea>` : `<input name="${name}" value="${value || ''}" />`}
    </label>
  `;
}

function imageField(name, label, value) {
  return `
    <label class="full image-field">
      ${label}
      <div class="image-row">
        <input name="${name}" value="${value || ''}" placeholder="Ruta local (./assets/images/...) o URL" />
        <button type="button" class="btn btn-upload" data-upload-for="${name}">Subir imagen</button>
        <input type="file" accept="image/*" class="file-input" data-file-for="${name}" />
      </div>
      <img class="preview" data-preview-for="${name}" ${value ? `src="${value}"` : ''} alt="Preview" />
    </label>
  `;
}

function roomForm(room, idx) {
  let galleryFields = '';
  for (let i = 0; i < ADMIN_ROOM_GALLERY_LIMIT; i += 1) {
    galleryFields += imageField(`room${idx}-gallery-${i}`, `Galería ${i + 1}`, room.gallery?.[i] || '');
  }

  return `
    <article class="room-form">
      <h2>Habitación ${idx + 1}</h2>
      <div class="grid">
        ${textField(`room${idx}-title`, 'Título', room.title, false, true)}
        ${textField(`room${idx}-cardDesc`, 'Descripción corta (tarjeta)', room.cardDesc, true, true)}
        ${textField(`room${idx}-note`, 'Nota', room.note, true, true)}
        ${textField(`room${idx}-detailP1`, 'Detalle párrafo 1', room.detailP1, true, true)}
        ${textField(`room${idx}-detailP2`, 'Detalle párrafo 2', room.detailP2, true, true)}
        ${imageField(`room${idx}-cardImage`, 'Imagen principal (tarjeta)', room.cardImage)}
        <p class="full form-note">Límite de galería por habitación: ${ADMIN_ROOM_GALLERY_LIMIT} fotos.</p>
        ${galleryFields}
      </div>
    </article>
  `;
}

function commonForm(common) {
  let commonGalleryFields = '';
  for (let i = 0; i < ADMIN_COMMON_GALLERY_LIMIT; i += 1) {
    commonGalleryFields += imageField(`common-gallery-${i}`, `Área común ${i + 1}`, common.gallery?.[i] || '');
  }

  return `
    <article class="room-form">
      <h2>Áreas comunes</h2>
      <div class="grid">
        ${textField('common-title', 'Título', common.title, false, true)}
        ${textField('common-desc1', 'Descripción 1', common.desc1, true, true)}
        ${textField('common-desc2', 'Descripción 2', common.desc2, true, true)}
        <p class="full form-note">Límite de galería en áreas comunes: ${ADMIN_COMMON_GALLERY_LIMIT} fotos.</p>
        ${commonGalleryFields}
      </div>
    </article>
  `;
}

function render() {
  const config = window.getSiteConfig();
  const roomForms = config.rooms.map((room, idx) => roomForm(room, idx)).join('');
  const commonAreasForm = commonForm(config.commonAreas || {});
  roomsContainer.innerHTML = roomForms + commonAreasForm;
}

function getValue(name) {
  return document.querySelector(`[name="${name}"]`)?.value?.trim() || '';
}

function readForm() {
  const base = window.getSiteConfig();

  const rooms = base.rooms.map((room, idx) => {
    const gallery = [];
    for (let i = 0; i < ADMIN_ROOM_GALLERY_LIMIT; i += 1) {
      gallery.push(getValue(`room${idx}-gallery-${i}`));
    }

    return {
      ...room,
      title: getValue(`room${idx}-title`),
      cardDesc: getValue(`room${idx}-cardDesc`),
      note: getValue(`room${idx}-note`),
      detailP1: getValue(`room${idx}-detailP1`),
      detailP2: getValue(`room${idx}-detailP2`),
      cardImage: getValue(`room${idx}-cardImage`),
      gallery
    };
  });

  const commonGallery = [];
  for (let i = 0; i < ADMIN_COMMON_GALLERY_LIMIT; i += 1) {
    commonGallery.push(getValue(`common-gallery-${i}`));
  }

  return {
    rooms,
    commonAreas: {
      title: getValue('common-title'),
      desc1: getValue('common-desc1'),
      desc2: getValue('common-desc2'),
      gallery: commonGallery
    }
  };
}

function updatePreview(inputName, value) {
  const preview = document.querySelector(`[data-preview-for="${inputName}"]`);
  if (preview) {
    preview.src = value;
    preview.style.display = value ? 'block' : 'none';
  }
}

function dataUrlFromImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1600;
        const ratio = maxW / img.width;
        const width = img.width > maxW ? Math.round(img.width * ratio) : img.width;
        const height = img.width > maxW ? Math.round(img.height * ratio) : img.height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('No se pudo cargar el archivo.'));
    reader.readAsDataURL(file);
  });
}

roomsContainer?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-upload-for]');
  if (!button) return;

  const name = button.getAttribute('data-upload-for');
  const fileInput = document.querySelector(`[data-file-for="${name}"]`);
  fileInput?.click();
});

roomsContainer?.addEventListener('change', async (event) => {
  const input = event.target.closest('.file-input');
  if (!input) return;

  const name = input.getAttribute('data-file-for');
  const textInput = document.querySelector(`[name="${name}"]`);
  const file = input.files?.[0];
  if (!file || !textInput) return;

  try {
    setStatus('Procesando imagen...');
    const dataUrl = await dataUrlFromImage(file);
    textInput.value = dataUrl;
    updatePreview(name, dataUrl);
    setStatus('Imagen cargada. Presiona "Guardar cambios" para aplicar.');
  } catch (error) {
    setStatus(error.message);
  }
});

roomsContainer?.addEventListener('input', (event) => {
  const input = event.target.closest('input[name]');
  if (!input) return;
  if (!input.name.includes('gallery') && !input.name.includes('cardImage')) return;
  updatePreview(input.name, input.value.trim());
});

saveBtn?.addEventListener('click', () => {
  try {
    const nextConfig = readForm();
    window.saveSiteConfig(nextConfig);
    setStatus('Cambios guardados. Recarga la home para verlos.');
  } catch (error) {
    setStatus('No se pudo guardar. Reduce cantidad/tamaño de imágenes y vuelve a intentar.');
  }
});

resetBtn?.addEventListener('click', () => {
  window.resetSiteConfig();
  render();
  setStatus('Configuración restaurada a valores default.');
});

exportBtn?.addEventListener('click', () => {
  const config = readForm();
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tunkul-config.json';
  a.click();
  URL.revokeObjectURL(url);
  setStatus('JSON exportado.');
});

logoutBtn?.addEventListener('click', () => {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  showLogin();
  setLoginStatus('Sesión cerrada.');
  loginForm?.reset();
});

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = (adminUserInput?.value || '').trim();
  const pass = adminPassInput?.value || '';

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'ok');
    setLoginStatus('');
    showAdmin();
    render();
    setStatus(`Listo. Límite actual: ${ADMIN_ROOM_GALLERY_LIMIT} fotos por habitación y ${ADMIN_COMMON_GALLERY_LIMIT} en áreas comunes.`);
    return;
  }

  setLoginStatus('Usuario o contraseña incorrectos.');
});

if (isAuthenticated()) {
  showAdmin();
  render();
  setStatus(`Listo. Límite actual: ${ADMIN_ROOM_GALLERY_LIMIT} fotos por habitación y ${ADMIN_COMMON_GALLERY_LIMIT} en áreas comunes.`);
} else {
  showLogin();
  setLoginStatus('Credenciales requeridas.');
}
