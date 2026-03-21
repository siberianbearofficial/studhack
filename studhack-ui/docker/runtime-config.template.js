window.__STUDHACK_RUNTIME_CONFIG__ = {
  issuer: '${STUDHACK_AUTH_ISSUER}',
  clientId: '${STUDHACK_AUTH_CLIENT_ID}',
  clientSecret: '${STUDHACK_AUTH_CLIENT_SECRET}',
  apiBaseUrl: '${STUDHACK_API_BASE_URL}',
  redirectUri: '${STUDHACK_AUTH_REDIRECT_URI}' || undefined,
  postLogoutRedirectUri: '${STUDHACK_AUTH_POST_LOGOUT_REDIRECT_URI}' || undefined,
  disableNonceCheck: '${STUDHACK_AUTH_DISABLE_NONCE_CHECK}' === 'true',
  disableOAuth2StateCheck: '${STUDHACK_AUTH_DISABLE_OAUTH2_STATE_CHECK}' === 'true',
};
