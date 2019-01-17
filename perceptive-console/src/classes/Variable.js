/* enumeration */
const VariableTypes = {
  INPUT_VARIABLE: 'inputVariable',
  AVERAGE_VARIABLE: 'avgVariable',
  WEIGHTEDSUM_VARIABLE: 'weightedSumVariable',
  OPERATION_VARIABLE: 'operVariable',
  THRESHOLD_VARIABLE: 'thresholdVariable',
  SUMMARY_VARIABLE: 'summaryVariable',
  CONSTANT: 'constant'
}

class Variable {
  constructor(name, type, hidden) {
    this.name = name;
    this.type = type;
    this.hidden = hidden;
  }
}


class Constant extends Variable {
  constructor(name, value, hidden) {
    super(name, VariableTypes.CONSTANT, hidden);
    this.value = value;
  }
}

class InputVariable extends Variable {
  constructor(name, value) {
    super(name, VariableTypes.INPUT_VARIABLE, false);
    this.value = 0;
  }
}

class AverageVariable extends Variable {
  constructor(name, values, hidden) {
    super(name, VariableTypes.AVERAGE_VARIABLE, hidden);
    this.values = values;
  }
}

class WeightedSumVariable extends Variable {
  constructor(name, operator, values, hidden) {
    super(name, VariableTypes.WEIGHTEDSUM_VARIABLE, hidden);
    this.operator = operator;
    this.values = values;
  }
}

class OperationVariable extends Variable {
  constructor(name, operator, values, hidden) {
    super(name, VariableTypes.OPERATION_VARIABLE, hidden);
    this.operator = operator;
    this.values = values;
  }
}

class ThresholdVariable extends Variable {
  constructor(name, source, ttype, value, hidden) {
    super(name, VariableTypes.THRESHOLD_VARIABLE, hidden);
    this.source = source;
    this.ttype = ttype;
    this.value = value;
  }
}

class SummaryVariable extends Variable {
  constructor(name, stype, source, hidden) {
    super(name, VariableTypes.SUMMARY_VARIABLE, hidden);
    this.stype = stype;
    this.source = source;
  }
}


/*Gives Evaluation String for the Variable by Type*/
var evaluate = (type, values) => {
  var evalString = "";
  switch (type) {
    case VariableTypes.INPUT_VARIABLE:
      evalString = values[0].toString();
      break;

    case VariableTypes.AVERAGE_VARIABLE:
      evalString = "(";
      values.forEach(element => {
        evalString += element.toString() + "+";
      });
      evalString = evalString.slice(0, -1);
      evalString += ")";
      evalString += ")" + "/";
      evalString += values.length.toString();
      break;

    case VariableTypes.CONSTANT:
      break;

    default:
      evalString += "INVALID"
      break;

  }

  console.log(evalString);
  return evalString;
}


const variable_exports = {
  Constant,
  InputVariable,
  AverageVariable,
  OperationVariable,
  SummaryVariable,
  ThresholdVariable,
  WeightedSumVariable,
  VariableTypes,
  evaluate
}

export default variable_exports;
