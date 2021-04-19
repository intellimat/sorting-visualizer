import React                from "react";
import { heapSort }         from "../sorting-algorithms/heapSort";
import { getRandomInteger, deepCopyArray, sleep, colorNodes, colorPastBars } from "../utils";
import { mergeSort }        from "../sorting-algorithms/mergeSort";
import { quickSort }        from "../sorting-algorithms/quickSort";
import { selectionSort }    from "../sorting-algorithms/selectionSort";

const SPEED_CONSTANT = 100;     // lower is faster

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
            arraySize: 30,
            usedSortingAlgorithm: null,
            updateTime: 0     // every updateTime ms we render the new array state
        };
    }

    componentDidMount = () => {
        this.resetArray();
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

                await sleep(this.state.updateTime);     // wait for updateTime milliseconds

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
                    await sleep(this.state.updateTime); // slow down to see the last bar colored
            }

            //await sleep(parseInt(this.state.updateTime*3));

            this.setState({array: history.states[index]});  // then update array
        }

        // array sorted shown
        this.setState({usedSortingAlgorithm: 'selectionsort'});
        colorNodes('.array-bar', colors.SORTED_COLOR);  // color again
    }

    // show mergesort animations
    showMergeSort = async (states, updateTime=150) => {
        // array sorted shown
        this.setState({usedSortingAlgorithm: 'selectionsort'});
        colorNodes('.array-bar', colors.SORTED_COLOR);
    }

    // show heapsort animations
    showHeapSort = async (states, updateTime=150) => {
        // array sorted shown
        this.setState({usedSortingAlgorithm: 'selectionsort'});
        colorNodes('.array-bar', colors.SORTED_COLOR);
    }

    // show quicksort animations
    showQuickSort = async (states, updateTime=150) => {
        // array sorted shown
        this.setState({usedSortingAlgorithm: 'selectionsort'});
        colorNodes('.array-bar', colors.SORTED_COLOR);
    }

    // create a new random array
    resetArray = () => {
        let newArraySize = this.state.arraySize;
        let newArray = [];
        for (let i=0; i < newArraySize; i++) {
            let value = getRandomInteger(5, 150);
            newArray.push(value);
        }

        this.computeUpdateTime();

        this.setState({array: newArray, arraySize: newArray.length, usedSortingAlgorithm: null});
    }

    computeUpdateTime = () => {
        let arraySize = this.state.arraySize;
        //let updateTime = parseInt(1600 / arraySize);
        let updateTime = parseInt(SPEED_CONSTANT / arraySize);
        this.setState({updateTime: updateTime});
    }

    // sort the current array (stored in the state) by using the algorithm passed by parameter
    sort = async (algorithm) => {
        // disable all the sort buttons
        algorithm = algorithm.trim().toLowerCase();

        this.setState({usedSortingAlgorithm: null});

        let viewers = {
            mergesort: this.showMergeSort,
            quicksort: this.showQuickSort,
            heapsort: this.showHeapSort,
            selectionsort: this.showSelectionSort
        };

        let array = deepCopyArray(this.state.array);

        let states;

        if (algorithm in algorithms){
            states = algorithms[algorithm](array);
            viewers[algorithm](states);
        } else alert(`The selected algorithm '${algorithm}' does not exists.`);
    }

    handleRangeChange = (event) => {
        let newArraySize = parseInt(event.target.value)
        this.setState({arraySize: newArraySize}, this.resetArray() );
    }

    render = () => {
        let Header = () => {
            return (
                <div id='header'>
                <h3 id='headline'> Sorting Visualizer </h3>
                <div id='buttons-container'>
                <button className='custom-button sort-button'  onClick={() => this.sort('selectionsort')}> Selection Sort </button>
                <button className='custom-button sort-button'  onClick={() => this.sort('quicksort')}> Quick Sort </button>
                <button className='custom-button sort-button'  onClick={() => this.sort('mergesort')}> Merge Sort </button>
                <button className='custom-button sort-button'  onClick={() => this.sort('heapsort')}> Heap Sort </button>
                <button className='custom-button reset-button' onClick={() => this.resetArray()}> Generate New Array </button>
                </div>
                </div>
            );
        }

        let VisualizerContainer = () => {
            let arrayBars = this.state.array.map((value, index) => {
                return (
                    <div className='array-bar' id={`array-bar-${index}`} key={index}
                    style={{height:`${value*3}px`}}
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