import { swap, newFrame, newAnimationsArray } from '../utils';

const TYPE = {
    CHECKED: 'brown',
    TARGET: 'brown',
    SELECTED: 'darkyellow',
    AVG: 'brown',
    FINAL: 'rgba(28, 129, 21, 0.678)'
};

export function heapSort(array) {
    let history = [];
    let finals = [];

    buildMaxHeap(array, history, finals);
    let heap_size = array.length;

    for (let i = 0; i < array.length-1; i++ ){
        let animatedElements = [{index: 0, type: TYPE.CHECKED}];
        let animations = newAnimationsArray(animatedElements, array.length, finals);
        history.push(newFrame(array, animations));

        swap(array, 0, heap_size - 1);

        let newFinal = {
            index: heap_size - 1,
            type: TYPE.FINAL
        };

        finals.push(newFinal);

        animations = newAnimationsArray([], array.length, finals);
        history.push(newFrame(array, animations));

        heap_size--;
        siftDown(array, heap_size, 0, history, finals);
    }

    return history;
}

function buildMaxHeap(array, history, finals) {
    let heapSize = array.length;
    let fromIndex = Math.floor((array.length - 1)/2); // last non-leaf node
    for (let i=fromIndex; i>=0; i--) 
        siftDown(array, heapSize, i, history, finals);
}

function siftDown(array, heapSize, i, history, finals) {
    let leftChildIndex = i*2 + 1;
    let leftChild = array[leftChildIndex];

    let rightChildIndex = i*2 + 2;
    let rightChild = array[rightChildIndex];

    let max = array[i];
    let maxIndex = i;

    let animatedElements;
    let animations;

    if (leftChildIndex < heapSize && array[leftChildIndex] > max) {
        animatedElements = [{index: leftChildIndex, type: TYPE.CHECKED}, {index: maxIndex, type: TYPE.TARGET}];
        animations = newAnimationsArray(animatedElements, array.length, finals);
        history.push(newFrame(array, animations));

        max = leftChild;
        maxIndex = leftChildIndex;
    } 

    if (rightChildIndex < heapSize && array[rightChildIndex] > max) {
        animatedElements = [{index: rightChildIndex, type: TYPE.CHECKED}, {index: maxIndex, type: TYPE.TARGET}];
        animations = newAnimationsArray(animatedElements, array.length, finals);
        history.push(newFrame(array, animations));

        max = rightChild;
        maxIndex = rightChildIndex;
    }

    if (maxIndex !== i) {
        swap(array, i, maxIndex);

        animations = newAnimationsArray([], array.length, finals);
        history.push(newFrame(array, animations));

        siftDown(array, heapSize, maxIndex, history, finals);
    }
}
