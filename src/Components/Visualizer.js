import React                from "react";
import { heapSort }         from "../sorting-algorithms/heapSort";
import { getRandomInteger, deepCopyArray, sleep, colorNodes, colorPastBars, colorBars } from "../utils";
import { mergeSort }        from "../sorting-algorithms/mergeSort";
import { quickSort }        from "../sorting-algorithms/quickSort";
import { selectionSort }    from "../sorting-algorithms/selectionSort";

const SPEED_CONSTANT = 3000;     // lower is faster

const colors = {
    SORTED_COLOR: 'rgba(28, 129, 21, 0.678)',
    DEFAULT_UNSORTED: 'rgba(185, 127, 80, 0.568)',
    ACTIVE_COLOR: 'rgb(179, 86, 11)',
    MIN_INDEX_COLOR: 'rgb(235, 204, 9, 0.82)'
};

const algorithms = {
    mergesort: mergeSort,
    heapsort: heapSort,
    quicksort: quickSort,
    selectionsort: selectionSort
};


class Visualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            array: [],
            arraySize: 80,
            usedSortingAlgorithm: null
        };
    }

    componentDidMount = () => {
        this.resetArray();

        let inputSizeElement = document.getElementById('array-size');
        inputSizeElement.addEventListener('change', (event) => {
            let newArraySize = event.target.value;
            console.log('new array size: ' + newArraySize);
            this.setState({arraySize: newArraySize}, () => this.resetArray());
        });
    }

    // show selectionsort animations
    showSelectionSort = async (history) => {
        for (const [index, animations_i] of history.animations.entries()) {
            let lastMinIndex = null;
            if (index > 0)
                colorPastBars(index-1, colors.SORTED_COLOR);

            for (const [j, barToColor] of animations_i.entries()) {
                if (lastMinIndex != null)
                    colorNodes(`#array-bar-${lastMinIndex}`, colors.MIN_INDEX_COLOR);

                await sleep(SPEED_CONSTANT/this.state.arraySize);

                if ( j > 0 && barToColor.index !== lastMinIndex )
                    colorNodes(`#array-bar-${animations_i[j-1].index}`, colors.DEFAULT_UNSORTED); // uncolor the previous one

                colorNodes(`#array-bar-${barToColor.index}`, colors.ACTIVE_COLOR);
                
                if (barToColor.min && lastMinIndex != null) {
                    colorNodes(`#array-bar-${lastMinIndex}`, colors.DEFAULT_UNSORTED);     // uncolor the previous one
                    colorNodes(`#array-bar-${barToColor.index}`, colors.MIN_INDEX_COLOR);
                    lastMinIndex = barToColor.index;

                } else if (barToColor.min && lastMinIndex == null){
                    colorNodes(`#array-bar-${barToColor.index}`, colors.MIN_INDEX_COLOR);
                    lastMinIndex = barToColor.index;
                }

                if (barToColor.index === this.state.arraySize - 1)
                    await sleep(SPEED_CONSTANT/this.state.arraySize); // slow down to see the last bar colored
            }

            this.setState({array: history.states[index]}, () => this.disableButtons());  // then update array
        }

        // array sorted shown
        this.setState({usedSortingAlgorithm: 'selectionsort'});
        colorNodes('.array-bar', colors.SORTED_COLOR);  // color again
    }

    // show mergesort animations
    showMergeSort = async (history) => {
        for (const frame of history){
            await sleep(SPEED_CONSTANT/this.state.arraySize);
            this.setState({array: frame.values}, () => {colorBars(frame.animations); this.disableButtons();});
        }
            
        // array sorted shown
        this.setState({usedSortingAlgorithm: 'mergesort'});
        colorNodes('.array-bar', colors.SORTED_COLOR);
    }

    // show heapsort animations
    showHeapSort = async (history) => {
        for (const frame of history){
            await sleep(SPEED_CONSTANT/this.state.arraySize);
            this.setState({array: frame.values}, () => {colorBars(frame.animations); this.disableButtons();});
        }

        // array sorted shown
        this.setState({usedSortingAlgorithm: 'heapsort'});
        colorNodes('.array-bar', colors.SORTED_COLOR);
    }

    // show quicksort animations
    showQuickSort = async (history) => {
        for (const frame of history){
            await sleep(SPEED_CONSTANT/this.state.arraySize);
            this.setState({array: frame.values}, () => {colorBars(frame.animations); this.disableButtons();});
        }    

        // array sorted shown
        this.setState({usedSortingAlgorithm: 'quicksort'});
        colorNodes('.array-bar', colors.SORTED_COLOR);
    }

    // create a new random array
    resetArray = () => {
        let newArraySize = this.state.arraySize;
        let newArray = [];
        for (let i=0; i < newArraySize; i++) {
            let value = getRandomInteger(5, 200);
            newArray.push(value);
        }

        this.setState({array: newArray, arraySize: newArray.length, usedSortingAlgorithm: null});
    }

    disableButtons = () => {
        let buttons = document.querySelectorAll('.sort-button, .reset-button');
        for (const button of buttons) 
            button.setAttribute('disabled', true);
    }

    // sort the current array (stored in the state) by using the algorithm passed by parameter
    sort = (algorithm) => {
        this.setState({usedSortingAlgorithm: null}, () => this.disableButtons());

        algorithm = algorithm.trim().toLowerCase();

        let viewers = {
            mergesort: this.showMergeSort,
            quicksort: this.showQuickSort,
            heapsort: this.showHeapSort,
            selectionsort: this.showSelectionSort
        };

        let array = deepCopyArray(this.state.array);

        let history;

        if (algorithm in algorithms){
            history = algorithms[algorithm](array);
            viewers[algorithm](history);
        } else alert(`The selected algorithm '${algorithm}' does not exists.`);
    }

    handleSizeChange = (event) => {
        let newArraySize = parseInt(event.target.value);
        this.setState({arraySize: newArraySize}, this.resetArray());
    }

    render = () => {
        let Header = () => {
            return (
                <div id='header'>
                <h3 id='headline'> Sorting Visualizer </h3>
                <div id='buttons-container'>
                <button className='custom-button sort-button'    onClick={() => this.sort('selectionsort')}> Selection Sort </button>
                <button className='custom-button sort-button'    onClick={() => this.sort('quicksort')}> Quick Sort </button>
                <button className='custom-button sort-button'    onClick={() => this.sort('mergesort')}> Merge Sort </button>
                <button className='custom-button sort-button'    onClick={() => this.sort('heapsort')}> Heap Sort </button>
                <button className='custom-button reset-button'   onClick={() => this.resetArray()}> Generate New Array </button>
                <div>
                <label htmlFor="array-size">Array size (5-200):</label>
                <input type="range" id="array-size" min="5" max="200" name="array-size"></input>
                </div>
                </div>
                </div>
            );
        }

        let VisualizerContainer = () => {
            let arrayBars = this.state.array.map((value, index) => {
                return (
                    <div className='array-bar' id={`array-bar-${index}`} key={index}
                    style={{height:`${value*2}px`}}
                    ></div>
                );
            });

            let sortingInfo = (this.state.usedSortingAlgorithm != null ) ? `Array sorted by ${this.state.usedSortingAlgorithm} algorithm!` : '';

            return (
                <>
                <div id='sorting-info'> {sortingInfo} </div>
                <div id='visualizer-container'>
                {arrayBars}
                </div>
                </>
            );
        }


        return (
            <>
            <Header/>
            <VisualizerContainer/>
            </>
        )
    }
}

export default Visualizer;