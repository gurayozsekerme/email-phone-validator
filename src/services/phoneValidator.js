// src/services/phoneValidator.js
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export default function phoneValidator(phone) {
  try {
    const phoneNumber = parsePhoneNumber(phone);

    if (!isValidPhoneNumber(phone)) {
      return { valid: false, error: 'Invalid phone number format' };
    }

    return {
      valid: true,
      phone: phoneNumber.number,          
      country: phoneNumber.country,        
      nationalNumber: phoneNumber.nationalNumber
    };
  } catch (err) {
    return { valid: false, error: 'Unable to parse phone number' };
  }
}