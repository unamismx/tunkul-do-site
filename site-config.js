const SITE_CONFIG_KEY = 'tunkul_site_config_v3';
const BOOKING_REVIEWS_KEY = 'tunkul_booking_reviews_v1';
const ROOM_GALLERY_LIMIT = 6;
const COMMON_GALLERY_LIMIT = 12;

const DEFAULT_SITE_CONFIG = {
  rooms: [
    {
      title: 'Habitación king con tina',
      cardDesc:
        'Nuestra suite más exclusiva: cama king size de lujo, tina independiente, baño amplio, cocineta de diseño y vista doble a la calle y al jardín central.',
      note: 'Ideal para quienes buscan una experiencia de descanso superior con privacidad y elegancia.',
      detailP1:
        'Sumérgete en una experiencia de descanso superior en nuestra suite más exclusiva, diseñada para quienes valoran el confort y la elegancia. La habitación ofrece cama king size de lujo, aire acondicionado, ventilador de techo, pantalla LCD de 55” y un amplio baño privado con ducha independiente y tina, ideal para relajarte después de explorar Mérida.',
      detailP2:
        'La cocineta de diseño está equipada para una estancia sin compromisos: estufa de inducción, frigobar, cafetera Nespresso, tetera eléctrica, máquina para hacer hielo, espumador de leche, tostadora, sartenes, ollas, platos, vasos, copas, sacacorchos y cubiertos. Con vista doble a la calle y al jardín central, combina privacidad, luz natural y un ambiente acogedor.',
      cardImage: './assets/images/room-1.jpg',
      gallery: [
        './assets/images/room-1.jpg',
        './assets/images/room-4.jpg',
        '',
        '',
        '',
        ''
      ]
    },
    {
      title: 'Habitación queen cálida',
      cardDesc:
        'Una suite íntima y acogedora con cama queen size, baño privado amplio, cocineta completa y vista al jardín central para una estancia relajante.',
      note: 'Perfecta para descansar con comodidad y ambiente sereno durante tu visita a Mérida.',
      detailP1:
        'Pensada para quienes buscan un ambiente íntimo y cálido, esta suite ofrece cama queen size, aire acondicionado, ventilador de techo y pantalla LCD de 50” para descansar después de recorrer la ciudad. El baño privado cuenta con ducha amplia para mayor comodidad y privacidad.',
      detailP2:
        'La cocineta totalmente equipada incluye estufa de inducción, frigobar, cafetera Nespresso, tetera eléctrica, máquina para hacer hielo, espumador de leche, tostadora, sartenes, ollas, platos, vasos, copas, sacacorchos y cubiertos. Con vista al jardín central, brinda un entorno relajante que conecta con la esencia de Casa Tunkul.',
      cardImage: './assets/images/room-2.jpg',
      gallery: [
        './assets/images/room-2.jpg',
        '',
        '',
        '',
        '',
        ''
      ]
    },
    {
      title: 'Suite armónica king',
      cardDesc:
        'Nuestra suite más espaciosa y tranquila, con cama king size, baño con luz natural cenital, cocineta completa y vista a la piscina.',
      note: 'Ideal para combinar amplitud, privacidad y un toque de exclusividad en Mérida.',
      detailP1:
        'Nuestra suite más espaciosa y tranquila está diseñada para quienes buscan un ambiente relajante con todo el confort. Cuenta con cama king size, pantalla LCD de 55”, aire acondicionado y ventilador de techo para asegurar una estancia fresca y cómoda en cualquier momento del día.',
      detailP2:
        'El baño privado ofrece una ducha amplia con luz natural gracias a un elegante cubo de iluminación cenital que conecta con el cielo y llena el espacio de claridad. La cocineta incluye estufa de inducción, frigobar, cafetera Nespresso, tetera eléctrica, máquina para hacer hielo, espumador de leche, tostadora, sartenes, ollas, platos, vasos, copas, sacacorchos y cubiertos. Su vista a la piscina completa una experiencia serena y exclusiva.',
      cardImage: './assets/images/room-3.jpg',
      gallery: [
        './assets/images/room-3.jpg',
        './assets/images/room-4.jpg',
        '',
        '',
        '',
        ''
      ]
    }
  ],
  commonAreas: {
    title: 'Áreas comunes en Casa Tunkul',
    desc1:
      'El patio central, la piscina y el rooftop están diseñados para que vivas una estancia relajada en un ambiente íntimo y armonioso.',
    desc2:
      'Cada espacio conserva la esencia arquitectónica de Casa Tunkul y está pensado para disfrutar Mérida con calma, comodidad y estilo.',
    gallery: [
      './assets/images/lounge.jpg',
      './assets/images/patio.jpg',
      './assets/images/courtyard.jpg',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ]
  }
};

function normalizeGallery(gallery, limit) {
  const base = Array.isArray(gallery) ? gallery.slice(0, limit) : [];
  while (base.length < limit) base.push('');
  return base;
}

function isLocalAsset(path) {
  return typeof path === 'string' && path.startsWith('./assets/images/');
}

function isCommonAsset(path) {
  return isLocalAsset(path) && /(courtyard|patio|lounge|hero)\.jpg$/i.test(path);
}

function isRoomAsset(path) {
  return isLocalAsset(path) && /room-\d+\.jpg$/i.test(path);
}

function normalizeConfig(config) {
  const merged = {
    rooms: DEFAULT_SITE_CONFIG.rooms.map((room, idx) => {
      const current = config?.rooms?.[idx] || {};
      return {
        ...room,
        ...current,
        gallery: normalizeGallery(current.gallery || room.gallery, ROOM_GALLERY_LIMIT)
      };
    }),
    commonAreas: {
      ...DEFAULT_SITE_CONFIG.commonAreas,
      ...(config?.commonAreas || {}),
      gallery: normalizeGallery(config?.commonAreas?.gallery || DEFAULT_SITE_CONFIG.commonAreas.gallery, COMMON_GALLERY_LIMIT)
    }
  };

  // Prevent accidental mixing between room photos and common-area photos
  merged.rooms = merged.rooms.map((room) => ({
    ...room,
    gallery: normalizeGallery(
      (room.gallery || []).map((img) => (isCommonAsset(img) ? '' : img)),
      ROOM_GALLERY_LIMIT
    )
  }));

  merged.commonAreas = {
    ...merged.commonAreas,
    gallery: normalizeGallery(
      (merged.commonAreas.gallery || []).map((img) => (isRoomAsset(img) ? '' : img)),
      COMMON_GALLERY_LIMIT
    )
  };

  return merged;
}

function getSiteConfig() {
  try {
    const raw = localStorage.getItem(SITE_CONFIG_KEY);
    if (!raw) return DEFAULT_SITE_CONFIG;
    const parsed = JSON.parse(raw);
    return normalizeConfig(parsed);
  } catch (error) {
    console.error('No se pudo cargar config, se usara default.', error);
    return DEFAULT_SITE_CONFIG;
  }
}

function saveSiteConfig(config) {
  const normalized = normalizeConfig(config);
  localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(normalized));
}

function resetSiteConfig() {
  localStorage.removeItem(SITE_CONFIG_KEY);
}

window.SITE_CONFIG_KEY = SITE_CONFIG_KEY;
window.BOOKING_REVIEWS_KEY = BOOKING_REVIEWS_KEY;
window.DEFAULT_SITE_CONFIG = DEFAULT_SITE_CONFIG;
window.ROOM_GALLERY_LIMIT = ROOM_GALLERY_LIMIT;
window.COMMON_GALLERY_LIMIT = COMMON_GALLERY_LIMIT;
window.getSiteConfig = getSiteConfig;
window.saveSiteConfig = saveSiteConfig;
window.resetSiteConfig = resetSiteConfig;
window.normalizeConfig = normalizeConfig;
