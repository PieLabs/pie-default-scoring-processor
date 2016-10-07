export default class PieWeightedScoringProcessor {

  constructor(config){
    this._config = config;
  }

  /**
   * Calculate the weighted score
   * @param sessions [{id: '1', ...}, {id: '2', ...}]
   * @param outcomes [{id: '1', score: 1}, {id: '2', score: 2}]
   * @returns {{summary: ({maxPoints, points, percentage}|*), components: *}}
   */
  score(sessions, outcomes) {
    const scoreableComponents = this._getScoreableComponents(sessions, outcomes);
    const weights = this._getWeights(scoreableComponents);
    const componentScores = this._getComponentScores(scoreableComponents, weights, outcomes);
    const maxPoints = this._sumOfWeights(weights);
    const points = this._sumOfWeightedScores(componentScores);
    const summary = this._makeSummary(maxPoints, points);
    return {
      summary,
      "components": componentScores
    }
  }

  _isComponentScoreable(compJson, compSession, compOutcome) {
    return compOutcome && compOutcome.hasOwnProperty('score');
  }

  _getScoreableComponents(sessions, outcomes) {
    const results = {};
    const pies = this._config.pies;
    for (let i = 0; i < pies.length; i++) {
      const compJson = pies[i];
      const compId = compJson.id;
      const compSession = this._findById(sessions, compId, {});
      const compOutcome = this._findById(outcomes, compId, {});
      if (this._isComponentScoreable(compJson, compSession, compOutcome)) {
        results[compId] = compJson;
      }
    }
    return results;
  }

  _getWeights(scoreableComponents) {
    const results = {};
    const weights = this._config.weights || [];
    for (let id in scoreableComponents) {
      results[id] = this._findById(weights, id, {}).weight || 1;
    }
    return results;
  }

  _getComponentScores(scoreableComponents, weights, outcomes) {
    const results = [];
    for (let id in scoreableComponents) {
      const weight = weights[id];
      const score = this._findById(outcomes, id, {}).score.scaled || 0;
      const weightedScore = weight * score;
      results.push({
        id,
        weight,
        score,
        weightedScore
      });
    }
    return results;
  }

  _sumOfWeights(weights){
    let result = 0;
    for (let id in weights) {
      result += weights[id];
    }
    return result;
  }

  _sumOfWeightedScores(componentScores){
    let result = 0;
    for (let id in componentScores) {
      result += componentScores[id].weightedScore;
    }
    return result;
  }

  _findById(col, id, defaultValue = null){
    for(let i=0; i<col.length; i++){
      if(col[i].id === id){
        return col[i];
      }
    }
    return defaultValue;
  }

  _makeSummary(maxPoints, points){
    return {
      maxPoints,
      points,
      percentage: Math.round(points * 1000 / maxPoints) / 10
    }
  }
}