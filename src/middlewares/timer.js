/**
 * Middleware qui ajoute un délai d'une seconde
 */

const timer = (req, res, next) => {
  console.log('[Timer] Waiting for 1 second...');
  
  setTimeout(() => {
    console.log('[Timer] Continuing after delay');
    next();
  }, 1000);
};

export default timer; 