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

// export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
// export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`
// export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`
// export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`
// export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`

// export const CONTACTS_ROUTES = "api/contacts"
// export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`
