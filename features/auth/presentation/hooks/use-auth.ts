import { useAuthStore } from '@/features/auth/presentation/store/auth-store';

export const useAuth = () => useAuthStore((state) => state);
