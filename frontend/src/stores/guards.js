import { useAuthStore } from '../stores/auth';

export const requireAuth = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
};

export const requireAdmin = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next('/login');
  } else if (!authStore.isAdmin) {
    next('/unauthorized');
  } else {
    next();
  }
};

export const requireLibrarian = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next('/login');
  } else if (!authStore.isStaff) {
    next('/unauthorized');
  } else {
    next();
  }
};