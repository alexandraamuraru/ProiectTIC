import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { requireAuth, requireAdmin, requireLibrarian } from '../stores/guards';

const routes = [
  {
    path: '/login',
    component: () => import('../components/LoginForm.vue'),
  },
  {
    path: '/register',
    component: () => import('../components/RegisterForm.vue'),
  },
  {
    path: '/unauthorized',
    component: () => import('../views/auth/UnauthorizedView.vue'),
  },
  {
    path: '/books',
    component: () => import('../views/staff/BooksDashboard.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/loans',
    component: () => import('../views/staff/LoansDashboard.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/librarians',
    component: () => import('../views/admin/LibrarianManagement.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminDashboard.vue'),
    beforeEnter: requireAdmin,
  },
  {
    path: '/librarian',
    component: () => import('../views/librarian/LibrarianDashboard.vue'),
    beforeEnter: requireLibrarian,
  },
  {
    path: '/member',
    component: () => import('../views/member/MemberDashboard.vue'),
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { user, userDetails } = authStore;

  if (user && !userDetails) {
    await authStore.logout(); 
    return next('/login');
  }

  if (to.path === '/') return next('/login');

  if (to.path === '/login' && authStore.userDetails) {
    if (authStore.userDetails.role === 'admin') {
      return next('/admin');
    } else if (authStore.userDetails.role === 'librarian') {
      return next('/librarian');
    } else {
      return next('/member');
    }
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !user) {
    return next('/login');
  } else if (requiresGuest && user) {
    return next('/');
  } else {
    return next();
  }
});

export default router;
