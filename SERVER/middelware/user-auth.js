import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  // Log token for debugging purposes (can remove in production)
  console.log("Token from cookies:", token);

  // If there's no token in the cookies
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Not Authorized. Login again" 
    });
  }

  try {
    // Verify the JWT token
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid but does not contain an id
    if (!tokenDecoded.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Not Authorized. Login again" 
      });
    }

    console.log(tokenDecoded.id);

    // Attach user information (id) to the request object for further use in the route
    req.user = { id: tokenDecoded.id };
    console.log(req.user)
    // Continue to the next middleware or route handler
    next();

  } catch (e) {
    console.error("JWT verification failed:", e);

    // If the token verification fails (e.g., expired, malformed)
    return res.status(401).json({ 
      success: false, 
      message: "Token expired or invalid. Please log in again." 
    });
  }
};
