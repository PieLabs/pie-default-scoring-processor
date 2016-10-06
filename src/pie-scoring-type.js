export default class PieScoringType {

  static get ALL_OR_NOTHING(){
    return 'allOrNothing'
  }

  static get CUSTOM(){
    return 'custom'
  }

  static get WEIGHTED(){
    return 'weighted'
  }

  static isValidValue(value){
    return value === PieScoringType.WEIGHTED ||
      value === PieScoringType.ALL_OR_NOTHING ||
      value === PieScoringType.CUSTOM;
  }
}


