/**
 * Gère l'exécution des requêtes avec middlewares
 */

// Fonction pour charger un middleware dynamiquement
const loadMiddleware = async (middlewareName) => {
  try {
    const module = await import(`../middlewares/${middlewareName}.js`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load middleware: ${middlewareName}`, error);
    // Retourne un middleware par défaut qui ne fait que passer au suivant
    return (req, res, next) => next();
  }
};

// Fonction pour exécuter une requête avec la chaîne de middlewares
const executeRequestWithMiddlewares = async (url, middlewares, addLog) => {
  const startTime = performance.now();
  
  // Prépare l'objet de requête
  const req = {
    url,
    method: 'GET',
    headers: {},
    startTime
  };
  
  // Prépare l'objet de réponse
  const res = {
    data: null,
    status: null,
    headers: {},
    error: null
  };
  
  // Fonction pour exécuter la requête après les middlewares
  const executeRequest = async () => {
    try {
      const response = await fetch(url);
      res.status = response.status;
      
      // Log détaillé du statut
      addLog(`Response status: ${response.status} (${response.statusText})`);
      
      // Convertir les headers en objet
      response.headers.forEach((value, key) => {
        res.headers[key] = value;
      });
      
      // Essayer de parser le corps en JSON
      try {
        res.data = await response.json();
      } catch (e) {
        res.data = await response.text();
      }
      
    } catch (error) {
      res.error = error;
      addLog(`Network error: ${error.message}`);
    } finally {
      // Assurez-vous que ces valeurs sont toujours définies
      res.endTime = performance.now();
      res.duration = res.endTime - (req.startTime || res.endTime);
    }
  };
  
  // Crée la chaîne de middlewares
  let middlewareIndex = 0;
  
  const next = async () => {
    if (middlewareIndex < middlewares.length) {
      const middleware = middlewares[middlewareIndex++];
      await middleware(req, res, next);
    } else {
      await executeRequest();
    }
  };
  
  // Démarre la chaîne de middlewares
  await next();
  
  return {
    request: req,
    response: res,
    duration: res.duration
  };
};

// Fonction principale pour exécuter toutes les requêtes
export const runRequests = async (url, numRequests, middlewareNames, addLog) => {
  // Charge tous les middlewares
  const middlewarePromises = middlewareNames.map(name => loadMiddleware(name));
  const middlewares = await Promise.all(middlewarePromises);
  
  addLog(`Loaded ${middlewares.length} middlewares`);
  
  // Exécute les requêtes en série
  const results = [];
  
  for (let i = 0; i < numRequests; i++) {
    addLog(`Executing request ${i + 1}/${numRequests}`);
    const result = await executeRequestWithMiddlewares(url, middlewares, addLog);
    results.push(result);
    
    // Log du résultat
    if (result.response.error) {
      addLog(`Request ${i + 1} failed with network error`);
    } else {
      const duration = result.duration || 0;
      addLog(`Request ${i + 1} completed with status ${result.response.status} in ${duration.toFixed(2)}ms`);
    }
  }
  
  return results;
};
