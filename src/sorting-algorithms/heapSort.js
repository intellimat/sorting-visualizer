const swap = require('../utils').swap;

function heapSort(array) {
    buildMaxHeap(array)
    let heap_size = array.length

    for (let i = 0; i < array.length-1; i++ ){
        swap(array, 0, heap_size - 1)
        heap_size--
        siftDown(array, heap_size, 0)
    }
}

function buildMaxHeap(array) {
    let heapSize = array.length
    let fromIndex = Math.floor((array.length - 1)/2) // last non-leaf node
    for (let i=fromIndex; i>=0; i--) 
        siftDown(array, heapSize, i)
}

function siftDown(array, heapSize, i) {
    let leftChildIndex = i*2 + 1
    let leftChild = array[leftChildIndex]

    let rightChildIndex = i*2 + 2
    let rightChild = array[rightChildIndex]

    let max = array[i]
    let maxIndex = i

    if (leftChildIndex < heapSize && array[leftChildIndex] > max) {
        max = leftChild
        maxIndex = leftChildIndex
    } 

    if (rightChildIndex < heapSize && array[rightChildIndex] > max) {
        max = rightChild
        maxIndex = rightChildIndex
    }

    if (maxIndex !== i) {
        swap(array, i, maxIndex)
        siftDown(array, heapSize, maxIndex)
    }
}

module.exports.heapSort = heapSort;