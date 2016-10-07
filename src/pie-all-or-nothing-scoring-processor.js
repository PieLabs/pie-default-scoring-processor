export default class PieAllOrNothingScoringProcessor {

  constructor(config){
    this._config = config;
  }

  /**
   * Calculate the allOrNothing score
   * @param sessions [{id: '1', ...}, {id: '2', ...}]
   * @param outcomes [{id: '1', score: 1}, {id: '2', score: 2}]
   * @returns {{summary: ({maxPoints, points, percentage}|*), components: *}}
   */
  score(pies, sessions, outcomes) {
    const scoreableComponents = this._getScoreableComponents(pies, sessions, outcomes);
    const componentScores = this._getComponentScores(scoreableComponents, outcomes);
    const maxPoints = this._numberOfScoreableComponents(scoreableComponents);
    const points = this._numberOfCorrectAnswers(componentScores);
    const summary = this._makeSummary(maxPoints, points);
    return {
      summary,
      "components": componentScores
    }
  }

  _isComponentScoreable(compJson, compSession, compOutcome) {
    return compOutcome && compOutcome.hasOwnProperty('score');
  }

  _getScoreableComponents(pies, sessions, outcomes) {
    const results = {};
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

  _getComponentScores(scoreableComponents, outcomes) {
    const results = [];
    for (let id in scoreableComponents) {
      const score = this._findById(outcomes, id, {score:{}}).score.scaled || 0;
      results.push({
        id,
        score
      });
    }
    return results;
  }

  _numberOfScoreableComponents(scoreableComponents){
    let result = 0;
    for (let id in scoreableComponents) {
      result++;
    }
    return result;
  }

  _numberOfCorrectAnswers(componentScores){
    let result = 0;
    for (let id in componentScores) {
      result += componentScores[id].score === 1 ? 1 : 0;
    }
    return result;
  }

  _makeSummary(maxPoints, points){
    let percentage;
    if(points < maxPoints) {
      points = 0;
      percentage = 0;
    } else {
      points = maxPoints;
      percentage = 100.0;
    }
    return {
      maxPoints,
      points,
      percentage
    };
  }

  _findById(col, id, defaultValue = null){
    for(let i=0; i<col.length; i++){
      if(col[i].id === id){
        return col[i];
      }
    }
    return defaultValue;
  }
}