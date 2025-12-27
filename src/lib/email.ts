import { Resend } from 'resend'
import VerificationEmail from '@/emails/verification-email'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build')
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`

  if (process.env.NODE_ENV === 'development') {
    console.log('\n=== EMAIL VERIFICATION ===')
    console.log('To:', email)
    console.log('Verification URL:', verificationUrl)
    console.log('From:', FROM_EMAIL)
    console.log('API Key configured:', !!process.env.RESEND_API_KEY)
    console.log('==========================\n')
  }

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy_key_for_build') {
    console.error('RESEND_API_KEY not configured!')
    throw new Error('Email service not configured. Please set RESEND_API_KEY environment variable.')
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your MyReddit account',
      react: VerificationEmail({ verificationUrl }),
    })

    console.log('Email sent successfully:', { id: result.data?.id, to: email })
  } catch (error) {
    console.error('Failed to send verification email:', {
      error,
      to: email,
      from: FROM_EMAIL,
      hasApiKey: !!process.env.RESEND_API_KEY,
    })
    throw new Error('Failed to send verification email. Please try again later.')
  }
}
