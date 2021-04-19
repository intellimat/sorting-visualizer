import { swap } from '../utils';
import { deepCopyArray } from '../utils';

function selectionSort(array) {
    let states = [];
    let animations = [];
    for (let i=0; i < array.length; i++){
        let animations_i = [];  // we save every currennt minIndex
        let minIndex = i;
        animations_i.push({index: minIndex, min: true});
        for (let j=i; j < array.length; j++){
            if (array[j] < array[minIndex]){
                minIndex = j;
                animations_i.push({index: minIndex, min: true});
             } else animations_i.push({index: j, min: false});
        }
        
        animations.push(animations_i);
        
        swap(array, i, minIndex);
        // new array state ready
        let state = deepCopyArray(array);
        states.push(state);
    }

    let history = {
        states: states,
        animations: animations
    };

    return history;
}




const _selectionSort = selectionSort;
export { _selectionSort as selectionSort };