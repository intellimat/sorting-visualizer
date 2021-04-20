import { swap, newFrame, newAnimationsArray } from '../utils';

const TYPE = {
    CHECKED: 'brown',
    TARGET: 'brown',
    SELECTED: 'darkyellow',
    MIN: '#006699', //blueish
    FINAL: 'rgba(28, 129, 21, 0.678)',
};


function selectionSort(array) {
    let history = [];
    let animations;
    let finals = [];

    for (let i=0; i < array.length; i++){
        let minIndex = i;

        for (let j=i; j < array.length; j++){
            animations = newAnimationsArray([{index: minIndex, type: TYPE.MIN}, {index: j, type: TYPE.TARGET}], array.length, finals);
            history.push(newFrame(array,animations));

            if (array[j] < array[minIndex]){
                minIndex = j;
            } 

            animations = newAnimationsArray([{index: minIndex, type: TYPE.MIN}], array.length, finals);
            history.push(newFrame(array, animations));
        }
        
        swap(array, i, minIndex);
        
        let newFinal = {
            index: i,
            type: TYPE.FINAL
        };

        finals.push(newFinal);
        animations = newAnimationsArray([{index: i, type: TYPE.FINAL}], array.length, finals);
        history.push(newFrame(array, animations));
    }

    return history;
}


export { selectionSort };