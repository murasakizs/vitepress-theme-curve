import { createCipheriv, createHash, pbkdf2Sync, randomBytes } from "node:crypto";

// PBKDF2 迭代次数：客户端解锁约 100ms，同时抬高离线爆破成本
const ITERATIONS = 100000;

/**
 * 构建期加密文章正文（Node 侧，同步，仅对带 password 的文章调用）
 * @param {string} html 渲染后的正文 HTML
 * @param {string} password 明文密码
 * @returns {{v:number, iter:number, salt:string, iv:string, tag:string, data:string}}
 */
export const encryptPostHtml = (html, password) => {
  // 确定性 salt：内容与密码不变时跨构建稳定，本地保存的解锁密钥才不会因重新部署失效
  const salt = createHash("sha256")
    .update(password)
    .update("|salt|")
    .update(html)
    .digest()
    .subarray(0, 16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(html, "utf8"), cipher.final()]);
  return {
    v: 1,
    iter: ITERATIONS,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: encrypted.toString("base64"),
  };
};
