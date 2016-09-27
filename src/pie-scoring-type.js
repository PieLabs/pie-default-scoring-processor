export default class PieScoringType {

  static get WEIGHTED(){
    return 'weighted'
  }

  static get ALL_OR_NOTHING(){
    return 'allOrNothing'
  }

  static isValidValue(value){
    return value === PieScoringType.WEIGHTED || value === PieScoringType.ALL_OR_NOTHING;
  }
}

