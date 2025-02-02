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
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    beforeEnter: requireAdmin,
    children: [
      {
        path: '',
        component: () => import('../views/admin/AdminDashboard.vue')
      },
      {
        path: 'users',
        component: () => import('../views/admin/UsersManagement.vue'),
      },
      {
        path: 'librarians',
        component: () => import('../views/admin/LibrarianManagement.vue'),
      },
      {
        path: 'loans',
        component: () => import('../views/staff/LoansDashboard.vue'),
      },
    ],
  },
  {
    path: '/librarian',
    component: () => import('../views/librarian/LibrarianDashboard.vue'),
    beforeEnter: requireLibrarian,
    children: [
      {
        path: 'books',
        component: () => import('../views/staff/BooksDashboard.vue'),
      },
      {
        path: 'loans',
        component: () => import('../views/staff/LoansDashboard.vue'),
      },
    ],
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

  if (!userDetails && user) {
    try {
      await authStore.fetchUserDetails();
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }

  if (user && !authStore.userDetails) {
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

  if (to.path === '/' && authStore.userDetails) {
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
