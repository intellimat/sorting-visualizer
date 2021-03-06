import React                          from "react";
import { 
    getRandomInteger, 
    deepCopyArray, 
    sleep, 
    colorNodes, 
    colorBars,
    addAdditionalBarsHoverEffects,
    setDisableProperty}               from "../utils";
import { heapSort }                   from "../sorting-algorithms/heapSort";
import { mergeSort }                  from "../sorting-algorithms/mergeSort";
import { quickSort }                  from "../sorting-algorithms/quickSort";
import { selectionSort }              from "../sorting-algorithms/selectionSort";

const SPEED_CONSTANT = 1000;     // lower means faster animations
const MAX_ARRAY_SIZE = 170;
const MIN_ARRAY_SIZE = 5;
const SIZE_INCREMENT = 15;
const MAX_INTEGER    = 160;
const MIN_INTEGER    = 5;

const colors = {
    SORTED_COLOR:     'rgba(28, 129, 21, 0.678)',
    DEFAULT_UNSORTED: 'rgba(185, 127, 80, 0.568)',
    ACTIVE_COLOR:     'rgb(179, 86, 11)',
    MIN_INDEX_COLOR:  'rgb(235, 204, 9, 0.82)'
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
            arraySize: 60,
            usedSortingAlgorithm: null
        };
    }

    componentDidMount = () => { this.resetArray(() => addAdditionalBarsHoverEffects()); }

    componentDidUpdate = () => { addAdditionalBarsHoverEffects(); }

    // create a new random array
    resetArray = (callback) => {
        let newArraySize = this.state.arraySize;
        let newArray = [];
        
        for (let i=0; i < newArraySize; i++) {
            let value = getRandomInteger(MIN_INTEGER, MAX_INTEGER);
            newArray.push(value);
        }

        if (callback)
            this.setState({array: newArray, arraySize: newArray.length, usedSortingAlgorithm: null}, callback);
        else this.setState({array: newArray, arraySize: newArray.length, usedSortingAlgorithm: null});
    }

    // sort the current array (stored in the state) by using the algorithm passed by parameter
    sort = (algorithm) => {
        this.setState({usedSortingAlgorithm: null}, () => setDisableProperty('.sort-button, .reset-button, .size-button'));

        algorithm = algorithm.trim().toLowerCase();

        let array = deepCopyArray(this.state.array);

        if (algorithm in algorithms){
            let history = algorithms[algorithm](array);
            this.showSorting(history, algorithm);
        } else alert(`The selected algorithm '${algorithm}' does not exists.`);
    }

    // show sorting animations
    showSorting = async (history, algorithm) => {
        for (const frame of history){
            await sleep(SPEED_CONSTANT/this.state.arraySize); // slow down the animations
            this.setState({array: frame.values}, () => {
                colorBars(frame.animations); 
                setDisableProperty('button');
            });
        }    

        // array sorted shown
        this.setState({usedSortingAlgorithm: algorithm}, () => colorNodes('.array-bar', colors.SORTED_COLOR));
    }

    handleSizeChange = (event) => {
        let currentArraySize = this.state.arraySize;
        let newArraySize;

        // Compute new size
        if (event.target.name === 'minus-button')
            newArraySize = Math.max(MIN_ARRAY_SIZE, currentArraySize - SIZE_INCREMENT);
        else if (event.target.name === 'plus-button')
            newArraySize = Math.min(MAX_ARRAY_SIZE, currentArraySize + SIZE_INCREMENT);

        if (newArraySize === MAX_ARRAY_SIZE){
            this.setState({arraySize: newArraySize}, () => {
                this.resetArray(() => setDisableProperty('button.plus-size-button'));
            });
            
        } else if (newArraySize === MIN_ARRAY_SIZE){
            this.setState({arraySize: newArraySize}, () => {
                this.resetArray(() => setDisableProperty('button.minus-size-button'));
            });
            
        } else this.setState({arraySize: newArraySize}, () => this.resetArray());

    }

    render = () => {
        let Header = () => {
            return (<>
                <h1 id='headline'> Sorting Visualizer </h1>

                <div id='wrapper'>
                <div id='sort-buttons-container'>
                <button className='custom-button sort-button'    onClick={() => this.sort('selectionsort')}> SelectionSort </button>
                <button className='custom-button sort-button'    onClick={() => this.sort('quicksort')}> QuickSort </button>
                <button className='custom-button sort-button'    onClick={() => this.sort('mergesort')}> MergeSort </button>
                <button className='custom-button sort-button'    onClick={() => this.sort('heapsort')}> HeapSort </button>
                </div>


                <div id='array-changer-container'>
                <div id='size-changer-container'>              
                <button className='custom-button size-button minus-size-button' name='minus-button' onClick={this.handleSizeChange}> - </button>
                <label htmlFor="array-size" id="array-size">Array size</label>
                <button className='custom-button size-button plus-size-button' name='plus-button' onClick={this.handleSizeChange}> + </button>
                </div>
                <button className='custom-button reset-button'   onClick={() => this.resetArray()}> Generate New Array </button>
                </div>
                </div>
                </>
            );
        }

        let VisualizerContainer = () => {
            let arrayBars = this.state.array.map((value, index) => {
                return (
                    <div className='array-bar array-bar-hover-effect' id={`array-bar-${index}`} key={index}
                    style={{height:`${(value/MAX_INTEGER)*60}vh`}}>
                    <div className='number'> {value} </div>
                    </div>
                );
            }); 

            let sortingInfo = (this.state.usedSortingAlgorithm != null ) ? `Array sorted by ${this.state.usedSortingAlgorithm} algorithm!` : '';

            return (
                <>
                <div id='sorting-info'> {sortingInfo} </div>
                <div id='visualizer-container'> {arrayBars} </div>
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