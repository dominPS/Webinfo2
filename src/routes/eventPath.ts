export const eventPath = {
  home: {
    path: '/',
    getHref: (redirectTo?: string | null | undefined) =>
      `/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  },
  login: {
    path: '/login',
    getHref: (redirectTo?: string | null | undefined) =>
      `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  },
  user: {
    path: '/Account/Me',
    getHref: (redirectTo?: string | null | undefined) =>
      `/Account/Me${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  },
  worker: {
    path: '/Worker/WorkerJson',
    getHref: (redirectTo?: string | null | undefined) =>
      `/Worker/WorkerJson${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
  },
  mobile: {
    path: '/mobile',
    getHref: () => '/mobile',
  },
  kzp: {
    path: '/kzp',
    getHref: () => '/kzp',
  },
  mapregistration: {
    path: '/mapregistration',
    getHref: () => '/mapregistration',
  },
  attendancelist: {
    path: '/attendancelist',
    getHref: () => '/attendancelist',
  },
  attendanceaccschedulelist: {
    path: '/attendanceaccschedulelist',
    getHref: () => '/attendanceaccschedulelist',
  },
  worktime: {
    path: '/worktime',
    getHref: () => '/worktime',
  },
  workeractivityprogress: {
    path: '/workeractivityprogress',
    getHref: () => '/workeractivityprogress',
  },
  ordersmanage: {
    path: '/ordersmanage',
    getHref: () => '/ordersmanage',
  },
  guestauthorization: {
    path: '/guestauthorization',
    getHref: () => '/guestauthorization',
  },
  shipmentauthorization: {
    path: '/shipmentauthorization',
    getHref: () => '/shipmentauthorization',
  },
  vehiclerent: {
    path: '/vehiclerent',
    getHref: () => '/vehiclerent',
  },
  doorcontrol: {
    path: '/doorcontrol',
    getHref: () => '/doorcontrol',
  },
  canteen: {
    path: '/canteen',
    getHref: () => '/canteen',
  },
  canteenmealorder: {
    path: '/canteenmealorder',
    getHref: () => '/canteenmealorder',
  },
  vacancyplan: {
    path: '/vacancyplan',
    getHref: () => '/vacancyplan',
  },
  workdeclaration: {
    path: '/workdeclaration',
    getHref: () => '/workdeclaration',
  },
  requests: {
    path: '/requests',
    getHref: () => '/requests',
  },
  requestdelegationsettlement: {
    path: '/requestdelegationsettlement',
    getHref: () => '/requestdelegationsettlement',
  },
  vacancy: {
    path: '/vacancy',
    getHref: () => '/vacancy',
  },
  summary: {
    path: '/summary',
    getHref: () => '/summary',
  },
  medical: {
    path: '/medical',
    getHref: () => '/medical',
  },
  disagreements: {
    path: '/disagreements',
    getHref: () => '/disagreements',
  },
  settlement2: {
    path: '/settlement2',
    getHref: () => '/settlement2',
  },
  payroll: {
    path: '/payroll',
    getHref: () => '/payroll',
  },
  reports: {
    path: '/reports',
    getHref: () => '/reports',
  },
  scheduleplan: {
    path: '/scheduleplan',
    getHref: () => '/scheduleplan',
  },
  absenceplan: {
    path: '/absenceplan',
    getHref: () => '/absenceplan',
  },
  monthabsenceplan: {
    path: '/monthabsenceplan',
    getHref: () => '/monthabsenceplan',
  },
  schedule2: {
    path: '/schedule2',
    getHref: () => '/schedule2',
  },
  specialdays: {
    path: '/specialdays',
    getHref: () => '/specialdays',
  },
  workschedule: {
    path: '/workschedule',
    getHref: () => '/workschedule',
  },
  workerzone: {
    path: '/workerzone',
    getHref: () => '/workerzone',
  },
  zones: {
    path: '/zones',
    getHref: () => '/zones',
  },
  orderreport: {
    path: '/orderreport',
    getHref: () => '/orderreport',
  },
  workeroverview: {
    path: '/workeroverview',
    getHref: () => '/workeroverview',
  },
  message: {
    path: '/message',
    getHref: () => '/message',
  },
  benefit: {
    path: '/benefit',
    getHref: () => '/benefit',
  },
};