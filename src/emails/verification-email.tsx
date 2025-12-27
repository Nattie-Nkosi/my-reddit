import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
} from '@react-email/components'

interface VerificationEmailProps {
  verificationUrl: string
}

export default function VerificationEmail({ verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f4' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
              Welcome to MyReddit!
            </Text>
            <Text style={{ fontSize: '16px', marginBottom: '24px' }}>
              Click the button below to verify your email address and activate your account:
            </Text>
            <Button
              href={verificationUrl}
              style={{
                backgroundColor: '#0066ff',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '24px',
              }}
            >
              Verify Email
            </Button>
            <Text style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
              Or copy and paste this link into your browser:
            </Text>
            <Link href={verificationUrl} style={{ fontSize: '14px', color: '#0066ff', wordBreak: 'break-all' }}>
              {verificationUrl}
            </Link>
            <Text style={{ fontSize: '12px', color: '#999', marginTop: '32px' }}>
              This link expires in 24 hours. If you didn't create an account, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
