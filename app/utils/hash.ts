import bcrypt from "bcryptjs"

/**
 * Gera um hash seguro da senha.
 * @param {string} password - A senha a ser hashada.
 * @returns {string} - Hash da senha geradoo.
 */
export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 10)
  return hash
}

/**
 * Verifica se a senha corresponde ao hash armazenado.
 * @param {string} password - A senha inserida pelo usuário.
 * @param {string} storedHash - O Hash salvo no banco de dados.
 * @returns {boolean} - Retorna `true` se a senha estiver correta, caso contrário `false`.
 */
export const verifyPassword = async(password: string, storedHash: string) => {
  const verified = await bcrypt.compare(password, storedHash)
  return verified
}
