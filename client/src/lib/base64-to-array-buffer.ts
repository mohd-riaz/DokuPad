export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64); // decode base64 to binary string
  const len = binaryString.length;
  const buffer = new ArrayBuffer(len);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return buffer;
}