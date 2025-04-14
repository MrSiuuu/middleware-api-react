/**
 * Middleware qui enregistre les détails de la requête
 */

const logger = (req, res, next) => {
  console.log(`[Logger] Request to: ${req.url} at ${new Date().toISOString()}`);
  
  // Continue vers le prochain middleware
  next();
  
  // Log après la requête
  console.log(`[Logger] Response status: ${res.status || 'No status'}`);
};

export default logger; 