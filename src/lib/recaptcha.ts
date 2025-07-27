export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("reCAPTCHA secret key is not set in environment variables.");

    return process.env.NODE_ENV !== 'production';
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(verificationUrl, { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      console.log("reCAPTCHA verification successful:", data);
      return true;
    } else {
      console.warn("reCAPTCHA verification failed:", data['error-codes']);
      return false;
    }
  } catch (error) {
    console.error("Error during reCAPTCHA verification request:", error);
    return false;
  }
}
