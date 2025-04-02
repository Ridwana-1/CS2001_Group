// Список доступных аватаров
export const AVATARS = [
  '/avatars/avatar1.png', // Кот
  '/avatars/avatar2.png', // Собака
  '/avatars/avatar3.png', // Заяц
  '/avatars/avatar4.png', // Лиса
  '/avatars/avatar5.png', // Медведь
  '/avatars/avatar6.png', // Панда
  '/avatars/avatar7.png', // Пингвин
  '/avatars/avatar8.png', // Сова
  '/avatars/avatar9.png', // Енот
  '/avatars/avatar10.png', // Волк
  '/avatars/avatar11.png', // Лев
];

// Функция для получения случайного аватара
export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex];
};

// Функция для получения аватара по индексу (для консистентности)
export const getAvatarByIndex = (index: number): string => {
  return AVATARS[index % AVATARS.length];
};

/**
 * Generate a deterministic avatar URL from an email address
 * using a placeholder avatar service
 */
export const getAvatarByEmail = (email: string) => {
  // Use DiceBear avatars as a reliable fallback
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`;
};