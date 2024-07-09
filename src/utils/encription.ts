import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = '66666666666666666666666666666666'; // 密钥必须是32个字符长（256位）

// 生成静态的初始化向量（IV）
const iv = Buffer.from('88888888888888888888888888888888', 'hex');

export function encrypt(userPassword: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(userPassword, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export function decrypt(encryptedData: string): string {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
