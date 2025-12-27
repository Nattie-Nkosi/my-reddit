import { Resend } from 'resend'
import VerificationEmail from '@/emails/verification-email'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build')
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@myreddit.com'

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`

  if (process.env.NODE_ENV === 'development') {
    console.log('\n=== EMAIL VERIFICATION ===')
    console.log('To:', email)
    console.log('Verification URL:', verificationUrl)
    console.log('==========================\n')
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your MyReddit account',
      react: VerificationEmail({ verificationUrl }),
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}
