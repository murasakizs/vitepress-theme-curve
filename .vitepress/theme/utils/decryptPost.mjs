// 客户端解密（WebCrypto），与 mdEncrypt.mjs 的构建期加密一一对应

const toBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const toB64 = (bytes) => btoa(String.fromCharCode(...bytes));

const concat = (a, b) => {
  const out = new Uint8Array(a.length + b.length);
  out.set(a);
  out.set(b, a.length);
  return out;
};

const deriveAesKey = async (password, enc, extractable) => {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(String(password)),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: toBytes(enc.salt), iterations: enc.iter, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    extractable,
    ["decrypt"],
  );
};

const decrypt = async (key, enc) => {
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toBytes(enc.iv) },
    key,
    concat(toBytes(enc.data), toBytes(enc.tag)),
  );
  return new TextDecoder().decode(plain);
};

/**
 * 用密码解锁正文
 * @param {string} password 用户输入的密码
 * @param {{salt:string, iv:string, tag:string, data:string, iter:number}} enc frontmatter 中的密文
 * @returns {Promise<{html:string, key:string}>} key 为 base64 原始密钥，可存入 localStorage 跳过下次 PBKDF2
 */
export const unlockPost = async (password, enc) => {
  const key = await deriveAesKey(password, enc, true);
  const html = await decrypt(key, enc);
  return { html, key: toB64(new Uint8Array(await crypto.subtle.exportKey("raw", key))) };
};

/**
 * 用本地保存的密钥直接解密（不走 PBKDF2，约 1ms）
 * @param {string} keyB64 unlockPost 返回的 key
 * @param {{salt:string, iv:string, tag:string, data:string, iter:number}} enc
 * @returns {Promise<string>} 解密后的正文 HTML
 */
export const decryptWithKey = async (keyB64, enc) => {
  const key = await crypto.subtle.importKey("raw", toBytes(keyB64), "AES-GCM", false, ["decrypt"]);
  return decrypt(key, enc);
};
