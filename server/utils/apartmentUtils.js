// server/utils/apartmentUtils.js
// server/utils/apartmentUtils.js
const getApartmentArea = (apartmentNumber) => {
  const floorPosition = (apartmentNumber - 1) % 6 + 1; // Позиція на поверсі (1-6)

  if (floorPosition === 1 || floorPosition === 2) {
    return 88; // Трикімнатна
  } else if (floorPosition === 3 || floorPosition === 4) {
    return 66; // Двокімнатна
  } else if (floorPosition === 5 || floorPosition === 6) {
    return 48; // Однокімнатна
  }

  return 0; // Невірний номер квартири
};

exports.getApartmentArea = getApartmentArea;
