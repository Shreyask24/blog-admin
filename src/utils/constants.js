export const HOST = import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTES = "api/web/auth"

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/register`
export const SIGNIN_ROUTE = `${AUTH_ROUTES}/login`
export const FORGOTPASSWORD_ROUTE = `${AUTH_ROUTES}/forgotPassword`
export const VERIFYOTP_ROUTE = `${AUTH_ROUTES}/verifyOtp`
export const RESETPASSWORD_ROUTE = `${AUTH_ROUTES}/resetPassword`
export const PROFILE_ROUTE = `${AUTH_ROUTES}/profile`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/profile`
export const POST_ROUTE = `api/web/posts`
export const GET_ROUTE = `api/web/myposts`
export const UPDATE_POST_ROUTE = `api/web/posts`
export const DELETE_POST_ROUTE = `api/web/posts`

