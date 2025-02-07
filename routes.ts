/**
 * Lista de rotas públicas, as quais não requerem autenticação.
 * @type {string[]} Lista de rotas públicas.
 */
export const publicRoutes: string[] = [
  "/",
  "/auth/verify-email",
  "/api/inngest",
  "/api/uploadthing",
  "/api/webhook/stripe",
]

/**
 * Lista de rotas utilizadas para autenticação.
 * @type {string[]} Lista de rotas utilizadas para autenticação.
 */
export const authRoutes: string[] = [
  "/login",
  "/register",
  "/auth/error",
]

/**
 * Prefixo para API de rotas de autenticação.
 * @type {string} Prefixo para rotas de API.
 */
export const apiAuthPrefix: string = "/api/auth"

/**
 * Rota de redirecionamento padrão após login.
 * @type {string} Rota de redirecionamento padrão.
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/"
