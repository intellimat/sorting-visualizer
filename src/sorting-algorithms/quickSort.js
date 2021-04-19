const swap = require('../utils').swap;

function quickSort(array) {
    if (Array.isArray(array))
        quickSort_recursive(array, 0, array.length-1)
}

function quickSort_recursive(array, left, right) {
    if ( left < right ) {
        randomizePivot(array, left, right)

        let indeces = partition(array, left, right)
        let m1 = indeces.m1
        let m2 = indeces.m2

        quickSort_recursive(array, left, m1)
        quickSort_recursive(array, m2, right)
    }
}

function partition(array, left, right) {
    let pivot = array[right]

    let i = left
    let k = right
    let j = left

    while (j <= k) {
        if (array[j] < pivot){
            swap(array, i, j)
            i++
            j++
        } else if (array[j] > pivot) {
            swap(array, j, k)
            k--
        } else j++
    }

    let indeces = {
        m1: i-1,
        m2: k+1
    }

    return indeces
}

function randomizePivot(array, left, right) {
    let mid = Math.floor((left + right) / 2)

    let first = array[left]
    let last = array[right]
    let median = array[mid]

    let swapping_index = mid

    if ((first > median && first < last) || (first < median && first > last))
        swapping_index = left
    else if ((last < median && last > first) || (last > median && last < first))
        swapping_index = right
    else if ((median < first && median > last) || (median > first && median < last))
        swapping_index = mid
    else if (median === first)
        swapping_index = right
    else if (median === last)
        swapping_index = left
    
    swap(array, swapping_index, right)

}

module.exports.quickSort = quickSort;