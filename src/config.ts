/**
 * JWT config.
 */
export const jwt_config = {
  // algorithms: ['HS256'],
  TOKEN_SECRET: "mycode",
};

export const config_not_token = {
  TOKEN_SECRET: "mycode",
  // algorithms: ['HS256'],
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring(req: any) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
};
