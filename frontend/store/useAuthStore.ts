import { create } from 'zustand';
import { supabase } from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  fetchSession: () => void;
  signOut: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,

  fetchSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
      });
    });

    return () => {
      authListener?.unsubscribe();
    };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));

export default useAuthStore;
