import Variable from './Variable';

export const computeGraphData = (variable, frames, graphType) => {
    let gdata = [];

    switch(variable.type){
        case Variable.VariableTypes.INPUT_VARIABLE:
            gdata = frames.map((frame, index)=>{
                return [index.toString(), frame.au_intensity[variable.name]];
            })
        break;

        case Variable.VariableTypes.AVERAGE_VARIABLE:
        break;

        case Variable.VariableTypes.THRESHOLD_VARIABLE:
            gdata = frames.map((frame, index)=>{
                if(frame.au_intensity[variable.source.name] > variable.value){
                    return [index.toString(), 1];
                } else {
                    return [index.toString(), 0];
                }   
            })
        break;
    }

    return gdata;
}