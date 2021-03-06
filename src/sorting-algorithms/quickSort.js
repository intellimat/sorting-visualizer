import { swap, newFrame, newAnimationsArray } from '../utils';

const TYPE = {
    CHECKED: 'brown',
    TARGET: 'brown',
    SELECTED: 'darkyellow',
    AVG: 'brown',
    FINAL: 'rgba(28, 129, 21, 0.678)',
    PIVOT: '#006699'
};

export function quickSort(array) {
    let history = [];
    let finals = [];

    if (Array.isArray(array))
        quickSort_recursive(array, 0, array.length-1, history, finals);
    
    return history;
}

function quickSort_recursive(array, left, right, history, finals) {
    if ( left < right ) {
        randomizePivot(array, left, right, history, finals);

        let indeces = partition(array, left, right, history, finals);
        let m1 = indeces.m1;
        let m2 = indeces.m2;

        quickSort_recursive(array, left, m1, history, finals);
        quickSort_recursive(array, m2, right, history, finals);
    } else if (left === right){ // array already sorted, add new elements in their final position
        let newFinal = {
            index: left,
            type: TYPE.FINAL
        };
        finals.push(newFinal);
        let animations = newAnimationsArray([],array.length, finals);
        history.push(newFrame(array,animations));    
    }
}

function partition(array, left, right, history, finals) {
    let pivot = array[right];

    // show the pivot
    let animations = newAnimationsArray([{index: right, type: TYPE.PIVOT}], array.length, finals);
    history.push(newFrame(array, animations));

    let i = left;
    let k = right;
    let j = left;

    while (j <= k) {
        // show the current element that is being compared to the pivot
        animations = newAnimationsArray([{index: j, type: TYPE.CHECKED}], array.length, finals);
        history.push(newFrame(array, animations));

        if (array[j] < pivot){
            swap(array, i, j);
            i++;
            j++;
        } else if (array[j] > pivot) {
            swap(array, j, k);
            k--;
        } else {
            j++;
        }

        // show the new array state after comparing the element in index j with the pivot
        animations = newAnimationsArray([],array.length, finals);
        history.push(newFrame(array, animations));
    }

    // update the list of the elements in their final positions (i.e. the pivot and all the element equal to the pivot)
    for (let index=i; index <= k; index++){
        let newFinal = {
            index: index,
            type: TYPE.FINAL
        };
        finals.push(newFinal);
    }

    // show the new array state (with the new elements in their final position)
    animations = newAnimationsArray([],array.length, finals);
    history.push(newFrame(array,animations));    

    let indeces = {
        m1: i-1,
        m2: k+1
    };

    return indeces;
}

function randomizePivot(array, left, right, history, finals) {
    let mid = Math.floor((left + right) / 2);

    let first = array[left];
    let median = array[mid];
    let last = array[right];

    let swapping_index = mid;

    if ((first > median && first < last) || (first < median && first > last))
        swapping_index = left;
    else if ((last < median && last > first) || (last > median && last < first))
        swapping_index = right;
    else if ((median < first && median > last) || (median > first && median < last))
        swapping_index = mid;
    else if (median === first)
        swapping_index = right;
    else if (median === last)
        swapping_index = left;

    let animatedElements = [{index: left, type: TYPE.CHECKED}, {index: mid, type: TYPE.CHECKED}, {index: right, type: TYPE.CHECKED}];
    let animations = newAnimationsArray(animatedElements, array.length, finals);
    history.push(newFrame(array, animations));
    
    swap(array, swapping_index, right);
    history.push(newFrame(array, newAnimationsArray([{index: right, type: TYPE.AVG}], array.length, finals)));
}
