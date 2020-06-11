import { createHmac } from 'crypto';

const SIGNATURE_LENGTH = 128;

export const getDeliverySignature = (
  secret: string,
  body: Buffer | string | unknown,
): string => {
  if (typeof body !== 'string' && !Buffer.isBuffer(body)) {
    return getDeliverySignature(JSON.stringify(body), secret);
  }

  return createHmac('sha512', secret).update(body).digest('hex');
};

export const verifyDeliverySignature = (
  secret: string,
  body: Buffer | string | unknown,
  signature: string,
): void => {
  if (signature.length !== 128) {
    throw new Error(
      `Invalid signature length ${signature.length}. Expected ${SIGNATURE_LENGTH}`,
    );
  }

  const actualSignature = getDeliverySignature(secret, body);

  if (actualSignature !== signature) {
    throw new Error(`Incorrect signature`);
  }
};
