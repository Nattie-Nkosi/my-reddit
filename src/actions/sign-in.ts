'use server'
import * as auth from '@/auth';

export async function signInWithGitHub() {
  return await auth.signIn('github')
}