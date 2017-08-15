// Source: https://www.cs.uri.edu/cryptography/publickeykidkrypto.htm
 
const limitMod = 512;
 
export function getKeysFromBitmap(bitmap) {
  // Get 4 values
  let a = 0;
  let b = 0;
  let a1 = 0;
  let b1 = (bitmap.width + bitmap.height) % limitMod;
  const area = bitmap.width * bitmap.height;
  for (let idx = 0; idx < area; idx += 4) {
    const red = bitmap.data[ idx + 0 ];
    const green = bitmap.data[ idx + 1 ];
    const blue = bitmap.data[ idx + 2 ];
    a = (a + red) % limitMod;
    b = (b + green) % limitMod;
    a1 = (a1 + blue) % limitMod;
  }
  const M = a * b - 1;
  const e = a1 * M + a;
  const d = b1 * M + b;
  // Now Alice Public key (n, e) and her private key is d.
  return {
    M,
    e,
    d,
    n: ((e * d) - 1) / M,
  };
}
      
// To send Alice a plaintext P, one uses the function  C =  e * P ( mod n).
export function encrypt(plaintext, { e, n }) {
  return plaintext
    .split('')
    .map(c => c.charCodeAt())
    .map(P => e * P % n)
    .map(C => C.toString(36))
    .join(' ');
}

// Then Alice can decipher the ciphertext by using the function P = C * d ( mod n).
export function decrypt(ciphertext, { d, n }) {
  return ciphertext
    .split(' ')
    .map(m => parseInt(m, 36))
    .map(C => C * d % n)
    .map(P => String.fromCharCode(P))
    .join('');
}
