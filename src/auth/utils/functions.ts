import * as bcrypt from 'bcrypt';

export async function hashPasswordFunction(password: string): Promise<string> { 
  return await bcrypt.hash(password, 10);
}