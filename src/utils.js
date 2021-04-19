
function swap(array, i, j){
    if (i >= 0 && j >= 0 && i < array.length && j < array.length){
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    } else console.log('\nCannot swap, indeces out of range.\n');
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function deepCopyArray(array) {
    let newArray = [];
    for (const value of array)
        newArray.push(value);
    return newArray;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



// Animations functions 
function colorNodes(selector, color){
    document.querySelectorAll(selector)
    .forEach((node) => node.style.backgroundColor = color);
}

function colorPastBars(toIndex, color){
    for (let i=0; i <= toIndex; i++)
        colorNodes(`#array-bar-${i}`, color);
}

module.exports.getRandomInteger = getRandomInteger;
module.exports.swap = swap;
module.exports.deepCopyArray = deepCopyArray;
module.exports.sleep = sleep;
module.exports.colorNodes = colorNodes;
module.exports.colorPastBars = colorPastBars;