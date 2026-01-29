const Home = {
  text: 'Home',
  link: '/home',
  icon: 'fas fa-home',
  show_flag: true,
  id: 1,
};

const headingMain = {
  text: 'Main Navigation',
  heading: true,
  show_flag: true,
  id: 2,
};

const Settings = {
  text: 'Settings',
  link: '/settings',
  icon: 'fas fa-cogs',
  show_flag: true,
  id: 3,
};

const Clients = {
  text: 'Clients',
  link: '/client/summary',
  icon: 'fas fa-users',
  show_flag: true,
  id: 4,
};

export const menu = [headingMain, Home, Clients, Settings];
