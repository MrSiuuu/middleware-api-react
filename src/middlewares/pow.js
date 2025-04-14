/**
 * Middleware qui génère une preuve de travail simple
 */

const pow = (req, res, next) => {
  console.log('[PoW] Generating proof of work...');
  
  // Fonction pour générer un hash simple
  const generateHash = (input) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertit en entier 32 bits
    }
    return Math.abs(hash).toString(16);
  };
  
  // Génère un nonce jusqu'à ce qu'on trouve un hash avec un préfixe spécifique
  const findProofOfWork = () => {
    const target = '0'; // On cherche un hash qui commence par 0
    let nonce = 0;
    let hash;
    
    do {
      nonce++;
      const data = `${req.url}-${nonce}`;
      hash = generateHash(data);
    } while (!hash.startsWith(target) && nonce < 10000); // Limite pour éviter une boucle infinie
    
    return { nonce, hash };
  };
  
  const { nonce, hash } = findProofOfWork();
  console.log(`[PoW] Found proof of work: nonce=${nonce}, hash=${hash}`);
  
  // Ajoute la preuve de travail à la requête
  req.pow = { nonce, hash };
  
  // Continue vers le prochain middleware
  next();
};

export default pow; 