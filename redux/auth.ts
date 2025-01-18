import { AuthResponse, Session, User } from '@supabase/supabase-js';
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { SignInUser, SignUpUser } from '@/types/user';
import { signInFromSupabase, signUpFromSupabase } from '@/api/auth';

type AuthSliceInitialState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  session: Session | null;
};

const initialState: AuthSliceInitialState = {
  user: null,
  isLoading: false,
  error: null,
  session: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.session = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(signIn, signUp), (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        isFulfilled(signIn, signUp),
        (state, action: PayloadAction<AuthResponse['data']>) => {
          state.isLoading = false;
          state.error = null;
          state.session = action.payload.session;
          state.user = action.payload.user;
        }
      )
      .addMatcher(
        isRejected(signIn, signUp),
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || null;
        }
      );
  },
  selectors: {
    selectAuthState: (state) => state,
  },
});

export const signIn = createAsyncThunk<
  AuthResponse['data'],
  SignInUser,
  { rejectValue: string }
>('auth/signIn', async (user: SignInUser, { rejectWithValue }) => {
  try {
    return await signInFromSupabase(user);
  } catch (error: any) {
    return rejectWithValue(error.message as string);
  }
});

export const signUp = createAsyncThunk<
  AuthResponse['data'],
  SignUpUser,
  { rejectValue: string }
>('auth/signUp', async (user: SignUpUser, { rejectWithValue }) => {
  try {
    return await signUpFromSupabase(user);
  } catch (error: any) {
    return rejectWithValue(error.message as string);
  }
});

export default authSlice;

export const { setAuthError, signOut } = authSlice.actions;
export const { selectAuthState } = authSlice.selectors;
