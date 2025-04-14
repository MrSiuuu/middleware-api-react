/**
 * Calcule les statistiques à partir des résultats des requêtes
 */

export const calculateStats = (results) => {
  const totalRequests = results.length;
  
  // Compteurs pour les différents types de résultats
  let successCount = 0;
  let clientErrorCount = 0;
  let serverErrorCount = 0;
  let networkErrorCount = 0;
  
  // Statistiques de temps
  let minTime = Infinity;
  let maxTime = 0;
  let totalTime = 0;
  
  // Analyse chaque résultat
  results.forEach(result => {
    const { response } = result;
    
    // Compte les erreurs réseau
    if (response.error) {
      networkErrorCount++;
      return;
    }
    
    // Compte les statuts HTTP
    const status = response.status;
    if (status >= 200 && status < 300) {
      successCount++;
    } else if (status >= 400 && status < 500) {
      clientErrorCount++;
    } else if (status >= 500) {
      serverErrorCount++;
    }
    
    // Calcule les statistiques de temps
    const time = result.duration || 0;
    if (time > 0) {
      minTime = Math.min(minTime, time);
      maxTime = Math.max(maxTime, time);
      totalTime += time;
    }
  });
  
  // Calcule le temps moyen
  const avgTime = totalRequests > 0 ? totalTime / totalRequests : 0;
  
  // Calcule le taux de réussite
  const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0;
  
  // Si aucune requête n'a réussi, minTime sera toujours Infinity
  if (minTime === Infinity) {
    minTime = 0;
  }
  
  return {
    totalRequests,
    successCount,
    clientErrorCount,
    serverErrorCount,
    networkErrorCount,
    minTime,
    maxTime,
    avgTime,
    successRate
  };
}; 