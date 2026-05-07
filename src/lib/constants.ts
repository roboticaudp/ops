/**
 * Constantes globales de la aplicación
 */

export const AUTH_CONFIG = {
  ALLOWED_DOMAINS: ['@mail.udp.cl', '@udp.cl', '@org.estudiantilesudp.cl'],
  DEFAULT_REDIRECT: '/',
  LOGIN_ROUTE: '/login',
};

export const UI_CONFIG = {
  DICEBEAR_API: 'https://api.dicebear.com/7.x/initials/svg',
  AVATAR_FALLBACK_SIZE: 40,
};

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SETTINGS: {
    USERS: '/settings/users',
    COMPETITIONS: '/settings/competitions',
  },
  TEAMS: '/teams',
  TUTORS: '/tutors',
};
