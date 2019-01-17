import Variable from './Variable';
import FrameInfo from './FrameInfo';

export class Configuration {


  constructor(name, phaseType = "interval", phaseDuration = 5, variables = [], performance = "") {
    this.name = name;
    this.phaseType = phaseType;
    this.phaseDuration = phaseDuration;
    this.variables = variables;
    this.performance = performance;
    this.initVariables = this.initVariables.bind(this);
    this.calibrate = this.calibrate.bind(this);

   

    this.initVariables();

  }

  /*Initialize with the default Variables*/
  initVariables() {

    this.defaultVariables = [
      new Variable.InputVariable('AU01'),
      new Variable.InputVariable('AU02'),
      new Variable.InputVariable('AU04'),
      new Variable.InputVariable('AU05'),
      new Variable.InputVariable('AU06'),
      new Variable.InputVariable('AU07'),
      new Variable.InputVariable('AU09'),
      new Variable.InputVariable('AU10'),
      new Variable.InputVariable('AU12'),
      new Variable.InputVariable('AU14'),
      new Variable.InputVariable('AU15'),
      new Variable.InputVariable('AU17'),
      new Variable.InputVariable('AU20'),
      new Variable.InputVariable('AU23'),
      new Variable.InputVariable('AU25'),
      new Variable.InputVariable('AU26'),
      new Variable.InputVariable('AU45')
    ]

  }

  /* Requires FrameInfo Object! */
  calibrate(frame_info, expression) {
    switch (expression) {
      case ExpressionTypes.HAPPY:
        this.variables.push(new Variable.ThresholdVariable('AU06',
          this.defaultVariables.AU06,
          0,
          frame_info.au_intensity.AU06,
          false));

        this.variables.push(new Variable.ThresholdVariable('AU12',
          this.defaultVariables.AU12,
          0,
          frame_info.au_intensity.AU12,
          false));
        break;

      case ExpressionTypes.REST:    
        for(let i=0; i<Object.keys(frame_info.au_intensity).length; i++){
          this.variables.push(new Variable.ThresholdVariable(Object.keys(frame_info.au_intensity)[i],
          this.defaultVariables[Object.keys(frame_info.au_intensity)[i]],
          0,
          frame_info.au_intensity[Object.keys(frame_info.au_intensity)[i]],
          false));
        }
        console.log(this.variables);
        console.log(this.defaultVariables);
        break;

      case ExpressionTypes.ANGER:
        break;

      case ExpressionTypes.SAD:
        break;
    }
  }

}

export const ExpressionTypes = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANGER: 'anger',
  SURPRISE: 'surprise',
  DISGUST: 'disgust',
  FEAR: 'fear',
  REST: 'rest'
};




