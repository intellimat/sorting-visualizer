
export function swap(array, i, j){
    if (i >= 0 && j >= 0 && i < array.length && j < array.length){
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    } else console.log('\nCannot swap, indeces out of range.\n');
}

export function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function deepCopyArray(array) {
    let newArray = [];
    for (const value of array)
        newArray.push(value);
    return newArray;
}

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// Animations functions 
export function colorNodes(selector, color){
    document.querySelectorAll(selector)
    .forEach((node) => node.style.backgroundColor = color);
}

export function colorBars(array) {  // array[i] tells the color if the ith bar
    for (let i=0; i< array.length; i++)
        colorNodes(`#array-bar-${i}`, array[i]);
}

export function newFrame(values, animations) {
    let newFrame = {
        values: deepCopyArray(values),
        animations: animations
    };

    return newFrame;
}

export function newAnimationsArray(elements, size, finals) {
    let animArray = [];
    for(let i=0; i< size; i++)
        animArray.push(null);

    for(const element of elements)
        animArray[element.index] = element.type;

    for(const finalElement of finals)
        animArray[finalElement.index] = finalElement.type;

    return animArray;
}
