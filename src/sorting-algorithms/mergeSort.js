import { newFrame, newAnimationsArray } from '../utils';

const TYPE = {
    CHECKED: 'brown',
    TARGET: 'brown',
    SELECTED: 'darkyellow',
    AVG: 'brown',
    FINAL: 'rgba(28, 129, 21, 0.678)',
    P_SORTED: 'rgba(28, 129, 21, 0.678)' // partially sorted
};

export function mergeSort(array) {
    let history = [];
    let finals = [];
    if (Array.isArray(array))
        mergeSort_recursive(array, 0, array.length-1, history, finals);
    return history;
}

function mergeSort_recursive(array, left, right, history, finals) {
    if (left < right){
        let mid = Math.floor((left + right) / 2);

        mergeSort_recursive(array, left, mid, history, finals);
        mergeSort_recursive(array, mid + 1, right, history, finals);

        merge(array, left, mid, right, history, finals);
    } else if (left === right){
        let newFinal = {
            index: left,
            type: TYPE.FINAL
        };
        finals.push(newFinal);
        let animations = newAnimationsArray([], array.length, finals);
        history.push(newFrame(array, animations));    
    }
}


function merge(array, l, mid, r, history, finals) {
    let A = [];
    let B = [];

    for ( let i=l; i <= mid; i++ )
        A.push(array[i]);

    for ( let j=mid+1; j <= r; j++ )
        B.push(array[j]);

    let i = 0;     // i points to the first element of the left side array
    let j = 0;     // j points to the first element of the right side array
    let k;

    let animatedElements; let animations;

    for ( k=l; i < A.length && j < B.length; k++ ) {
        animatedElements = [{index: i, type: TYPE.CHECKED}, {index: j, type: TYPE.TARGET}];
        animations = newAnimationsArray(animatedElements, array.length, finals);
        history.push(newFrame(array, animations));

        if (A[i] <= B[j]){
            animatedElements = [{index: i, type: TYPE.SELECTED}, {index: j, type: TYPE.TARGET}];
            array[k] = A[i];
            i++;
        } else {
            animatedElements = [{index: i, type: TYPE.CHECKED}, {index: j, type: TYPE.SELECTED}];
            array[k] = B[j];
            j++;
        }

        animations = newAnimationsArray(animatedElements, array.length, finals);
        history.push(newFrame(array, animations));

    }

    // writing the remaining elements if the two arrays have different size
    while (k <= r && i < A.length) {
        array[k] = A[i];

        animatedElements = [{index: k, type: TYPE.P_SORTED}];
        animations = newAnimationsArray(animatedElements, array.length, finals);
        history.push(newFrame(array, animations));

        i++;
        k++;
    }

    // writing the remaining elements if the two arrays have different size
    while (k <= r && j < B.length) {
        array[k] = B[j];

        animatedElements = [{index: k, type: TYPE.P_SORTED}];
        animations = newAnimationsArray(animatedElements, array.length, finals);
        history.push(newFrame(array, animations));

        j++;
        k++;
    }
}