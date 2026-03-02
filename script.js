document.documentElement.classList.add('js-ready');

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('mainNav');
const header = document.querySelector('.site-header');
const revealEls = document.querySelectorAll('.reveal');

menuBtn?.addEventListener('click', () => {
  nav.classList.toggle('open');
});

document.addEventListener('click', (event) => {
  if (!nav || !menuBtn) return;
  if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
    nav.classList.remove('open');
  }
});

window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

function renderGallery(container, images, altText) {
  if (!container) return;

  const validImages = (images || []).filter((img) => typeof img === 'string' && img.trim() !== '');
  if (!validImages.length) return;

  container.innerHTML = validImages
    .map((img) => `<img src="${img}" alt="${altText}" loading="lazy" />`)
    .join('');
}

function applyRoomContent() {
  if (typeof window.getSiteConfig !== 'function') return;

  const config = window.getSiteConfig();
  const rooms = config.rooms || [];

  rooms.forEach((room, index) => {
    const roomId = index + 1;

    const title = document.getElementById(`room${roomId}-title`);
    const cardDesc = document.getElementById(`room${roomId}-card-desc`);
    const note = document.getElementById(`room${roomId}-note`);
    const cardImage = document.getElementById(`room${roomId}-card-image`);
    const detailTitle = document.getElementById(`room${roomId}-detail-title`);
    const detailP1 = document.getElementById(`room${roomId}-detail-p1`);
    const detailP2 = document.getElementById(`room${roomId}-detail-p2`);
    const gallery = document.getElementById(`room${roomId}-gallery`);

    if (title) title.textContent = room.title || '';
    if (cardDesc) cardDesc.textContent = room.cardDesc || '';
    if (note) note.textContent = room.note || '';
    if (detailTitle) detailTitle.textContent = room.title || '';
    if (detailP1) detailP1.textContent = room.detailP1 || '';
    if (detailP2) detailP2.textContent = room.detailP2 || '';

    if (cardImage && room.cardImage) {
      cardImage.src = room.cardImage;
      cardImage.alt = room.title || cardImage.alt;
    }

    renderGallery(gallery, room.gallery, room.title || 'Habitación Casa Tunkul');
  });

  const common = config.commonAreas || {};
  const commonTitle = document.getElementById('common-title');
  const commonDesc1 = document.getElementById('common-desc-1');
  const commonDesc2 = document.getElementById('common-desc-2');
  const commonGallery = document.getElementById('common-gallery');

  if (commonTitle) commonTitle.textContent = common.title || '';
  if (commonDesc1) commonDesc1.textContent = common.desc1 || '';
  if (commonDesc2) commonDesc2.textContent = common.desc2 || '';
  renderGallery(commonGallery, common.gallery, 'Áreas comunes Casa Tunkul');
}

applyRoomContent();

const BOOKING_REVIEWS = [
  {
    score: '10/10',
    date: '2024-11',
    guest: 'Karla',
    text: 'La atención del anfitrión fue muy cálida y servicial. La casa es muy bonita, con cama súper cómoda y todo lo necesario para una estancia placentera.'
  },
  {
    score: '10/10',
    date: '2024-11',
    guest: 'Sam',
    text: 'Great place to stay, the host was amazing.'
  },
  {
    score: '10/10',
    date: '2024-11',
    guest: 'Avanzi',
    text: 'La cura del dettaglio, la pulizia e l’accoglienza.'
  },
  {
    score: '10/10',
    date: '2024-11',
    guest: 'Joseph',
    text: 'El diseño del lugar es precioso, cada espacio está muy bien resuelto y el anfitrión fue súper atento y amable.'
  },
  {
    score: '10/10',
    date: '2024-12',
    guest: 'Joris',
    text: 'Beautiful, freshly renovated boutique-style place. Close to great restaurants but away from downtown noise.'
  },
  {
    score: '10/10',
    date: '2025-01',
    guest: 'Lisa',
    text: 'Amazing architecture, super comfy beds, warm welcome and big showers. Felt better than home.'
  },
  {
    score: '10/10',
    date: '2025-02',
    guest: 'Sonia',
    text: 'The studio apartment was excellent. Everything needed was there, great location, and a very kind host.'
  },
  {
    score: '10/10',
    date: '2025-03',
    guest: 'Sol',
    text: 'La habitación es muy bella, el baño enorme y la ubicación ideal para caminar a mercados, tiendas y cafeterías.'
  },
  {
    score: '10/10',
    date: '2025-03',
    guest: 'Alejandra',
    text: 'El anfitrión fue muy atento, la cocineta sorprendió para preparar comidas y la ubicación fue perfecta para recorrer el Centro.'
  },
  {
    score: '9/10',
    date: '2025-01',
    guest: 'Laketha',
    text: 'El anfitrión was a great host. We were greeted with warmth and kindness.'
  },
  {
    score: '9/10',
    date: '2025-01',
    guest: 'Irina',
    text: 'Muy limpio, el anfitrión fue muy atento.'
  },
  {
    score: '9/10',
    date: '2025-02',
    guest: 'Geraldo',
    text: 'Boa localização, ambiente tranquilo e central ao mesmo tempo. El anfitrión fue super solícito y gentil.'
  },
  {
    score: '9/10',
    date: '2025-04',
    guest: 'Adalberto',
    text: 'La habitación es amplia y luminosa, con tina, cocineta y decoración de gran gusto; todo se siente nuevo y funcional.'
  },
  {
    score: '9/10',
    date: '2025-12',
    guest: 'Barbara',
    text: 'Really cozy room, very friendly and responsive host, large comfortable bed and a quiet safe neighborhood near downtown.'
  },
  {
    score: '9/10',
    date: '2026-01',
    guest: 'Olivia',
    text: 'La casa es muy linda, habitaciones y baño amplios y cómodos, con atención siempre amable del anfitrión.'
  }
];

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function initBookingReviewsCarousel() {
  const track = document.getElementById('bookingReviewCards');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  if (!track) return;

  const activeReviews = BOOKING_REVIEWS;
  track.classList.add('is-carousel');

  track.innerHTML = activeReviews.map((review) => {
    return `
      <article class="review-card">
        <span class="review-score">${escapeHtml(review.score)}</span>
        <p>${escapeHtml(review.text)}</p>
        <div class="review-meta">
          ${escapeHtml(review.guest || 'Huésped')} • Booking • ${escapeHtml(review.date)}
        </div>
      </article>
    `;
  }).join('');

  const cards = () => Array.from(track.querySelectorAll('.review-card'));
  const shouldCarousel = cards().length > 3;
  if (!shouldCarousel) {
    track.classList.remove('is-carousel');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  function updateButtons() {
    if (!prevBtn || !nextBtn) return;
    const firstCard = cards()[0];
    if (!firstCard) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    const atStart = track.scrollLeft <= 4;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
  }

  function scrollByCard(direction) {
    const firstCard = cards()[0];
    if (!firstCard) return;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.columnGap || style.gap || '12', 10);
    const step = firstCard.getBoundingClientRect().width + gap;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  }

  prevBtn?.addEventListener('click', () => scrollByCard(-1));
  nextBtn?.addEventListener('click', () => scrollByCard(1));
  track.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();

  let autoTimer = null;
  function startAutoScroll() {
    if (window.innerWidth <= 720) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCard(1);
      }
    }, 4500);
  }

  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', startAutoScroll);
  startAutoScroll();
}

initBookingReviewsCarousel();

function initNearbyExplorer() {
  const filters = document.querySelectorAll('.nearby-filter');
  const searchInput = document.getElementById('nearbySearch');
  const cards = document.querySelectorAll('#nearbyGrid .nearby-card');
  const items = document.querySelectorAll('#nearbyGrid .place-item');

  if (!filters.length || !cards.length || !items.length) return;

  let activeFilter = 'all';

  function applyNearbyFilter() {
    const query = (searchInput?.value || '').trim().toLowerCase();

    items.forEach((item) => {
      const cats = (item.dataset.cats || '').split(' ');
      const text = item.textContent.toLowerCase();
      const matchesCategory = activeFilter === 'all' || cats.includes(activeFilter);
      const matchesQuery = !query || text.includes(query);
      item.style.display = matchesCategory && matchesQuery ? 'block' : 'none';
    });

    cards.forEach((card) => {
      const visible = card.querySelectorAll('.place-item[style="display: block;"]').length;
      card.style.display = visible > 0 ? 'block' : 'none';
    });
  }

  filters.forEach((filterBtn) => {
    filterBtn.addEventListener('click', () => {
      activeFilter = filterBtn.dataset.filter || 'all';
      filters.forEach((btn) => btn.classList.remove('active'));
      filterBtn.classList.add('active');
      applyNearbyFilter();
    });
  });

  searchInput?.addEventListener('input', applyNearbyFilter);
  applyNearbyFilter();
}

initNearbyExplorer();
