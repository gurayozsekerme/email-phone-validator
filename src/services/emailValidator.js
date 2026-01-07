// src/services/emailValidator.js
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// Bilinen geçici (disposable) email sağlayıcıları – kısaltılmış örnek
const disposableDomains = new Set([
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'yopmail.com',
  'getnada.com',
  'sharklasers.com',
  'trashmail.com',
  'dispostable.com'
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function emailValidator(email) {
  // 1. Format kontrolü
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  const domain = email.split('@')[1].toLowerCase();

  // 2. Disposable email kontrolü
  if (disposableDomains.has(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }

  // 3. MX record kontrolü
  try {
    const mxRecords = await resolveMx(domain);
    if (mxRecords.length === 0) {
      return { valid: false, error: 'No MX record found for domain' };
    }
  } catch (err) {
    return { valid: false, error: 'Failed to verify MX record' };
  }

  return { valid: true, email, domain };
}