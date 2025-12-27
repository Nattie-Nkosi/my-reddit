// Test script to verify Resend API key
// Run with: node test-resend.js

const { Resend } = require('resend');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

console.log('🔍 Checking Resend configuration...\n');
console.log('API Key exists:', !!apiKey);
console.log('API Key starts with re_:', apiKey?.startsWith('re_'));
console.log('From Email:', fromEmail);
console.log('');

if (!apiKey || apiKey === 'dummy_key_for_build') {
  console.error('❌ RESEND_API_KEY not configured in .env.local');
  console.log('\nTo fix:');
  console.log('1. Sign up at https://resend.com');
  console.log('2. Get API key from https://resend.com/api-keys');
  console.log('3. Add to .env.local:\n');
  console.log('RESEND_API_KEY="re_your_key_here"');
  console.log('FROM_EMAIL="onboarding@resend.dev"');
  process.exit(1);
}

const resend = new Resend(apiKey);

// Test email send
async function testEmail() {
  try {
    console.log('📧 Sending test email...\n');

    const result = await resend.emails.send({
      from: fromEmail,
      to: 'delivered@resend.dev', // Resend's test address
      subject: 'Test Email from MyReddit',
      html: '<h1>Test</h1><p>If you receive this, Resend is working!</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', result.data?.id);
    console.log('\nYour Resend setup is working correctly! 🎉');
    console.log('\nNext steps:');
    console.log('1. Add these same variables to Vercel');
    console.log('2. Redeploy your app');

  } catch (error) {
    console.error('❌ Failed to send email');
    console.error('Error:', error.message);

    if (error.message.includes('API key')) {
      console.log('\n⚠️  Your API key might be invalid.');
      console.log('Generate a new one at: https://resend.com/api-keys');
    }
  }
}

testEmail();
