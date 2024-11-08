'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

import styles from './SortingVisualizer.module.css';

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [originalValues, setOriginalValues] = useState<number[]>([]);
  const [sorting, setSorting] = useState<boolean>(false);
  const [algorithm, setAlgorithm] = useState<string>('bubble');
  const [speed, setSpeed] = useState<number>(70);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [compareIdx, setCompareIdx] = useState<number>(-1);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);

    // Algorithm complexity information
    const algorithmInfo = {
      bubble: {
        name: 'Bubble Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        best: 'O(n)',
        worst: 'O(n²)',
        stable: true,
        description: 'Simple but inefficient for large datasets. Good for small arrays or nearly sorted data.'
      },
      selection: {
        name: 'Selection Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        best: 'O(n²)',
        worst: 'O(n²)',
        stable: false,
        description: 'Simple and performs well on small arrays. Uses minimal memory.'
      },
      insertion: {
        name: 'Insertion Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        best: 'O(n)',
        worst: 'O(n²)',
        stable: true,
        description: 'Efficient for small data sets and nearly sorted arrays.'
      },
      quick: {
        name: 'Quick Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        best: 'O(n log n)',
        worst: 'O(n²)',
        stable: false,
        description: 'Generally the fastest in practice. Excellent for large datasets.'
      },
      merge: {
        name: 'Merge Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        best: 'O(n log n)',
        worst: 'O(n log n)',
        stable: true,
        description: 'Consistent performance and stable sorting. Good for linked lists.'
      }
    };
  
    // Function to determine best algorithm based on array size and characteristics
    const getBestAlgorithm = (arraySize) => {
      if (arraySize <= 10) {
        return "Insertion Sort - Best for very small arrays (n ≤ 10)";
      } else if (arraySize <= 50) {
        return "Quick Sort - Best for small to medium arrays (10 < n ≤ 50)";
      } else {
        return "Merge Sort - Best for large arrays (n > 50) and when stability is important";
      }
    };
  

  // Generate new random array
  const generateArray = () => {
    const newArray: number[] = Array.from({ length: 15 }, () => 
      Math.floor(Math.random() * 100)
    );
    setOriginalValues(newArray);
    const scaledArray: number[] = newArray.map(num => (num / Math.max(...newArray)) * 80 + 10);
    setArray(scaledArray);
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setError('');
    setInputValue('');
  };

  useEffect(() => {
    generateArray();
  }, []);

  // Handle custom array input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  const validateAndSetArray = () => {
    try {
      // Remove extra spaces and split by commas
      const inputArray: number[] = inputValue
        .trim()
        .split(/[,\s]+/)
        .filter(item => item !== '')
        .map(num => {
          const parsed = parseFloat(num);
          if (isNaN(parsed)) {
            throw new Error('Invalid number found');
          }
          return parsed;
        });

      if (inputArray.length === 0) {
        setError('Please enter at least one number');
        return;
      }

      if (inputArray.length > 30) {
        setError('Maximum 30 numbers allowed');
        return;
      }

      setOriginalValues(inputArray);
      // Scale the numbers to fit the visualization
      const maxNum = Math.max(...inputArray);
      const scaledArray: number[] = inputArray.map(num => (num / maxNum) * 80 + 10);
      
      setArray(scaledArray);
      setCurrentIdx(-1);
      setCompareIdx(-1);
      setError('');
    } catch (err) {
      setError('Please enter valid numbers separated by commas');
    }
  };

  // Helper function for delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Updated sorting algorithms to maintain originalValues order
  const bubbleSort = async () => {
    setSorting(true);
    const arr: number[] = [...array];
    const orig: number[] = [...originalValues];
    const n = arr.length;
    let tempComparisons = 0;
    let tempSwaps = 0;


    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIdx(j);
        setCompareIdx(j + 1);
        tempComparisons++;
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          [orig[j], orig[j + 1]] = [orig[j + 1], orig[j]];
          setArray([...arr]);
          setOriginalValues([...orig]);
          tempSwaps++;
          await delay(speed);
        }
      }
    }
    setComparisons(tempComparisons);
    setSwaps(tempSwaps);
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setSorting(false);
  };

  const selectionSort = async () => {
    setSorting(true);
    const arr: number[] = [...array];
    const orig: number[] = [...originalValues];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setCurrentIdx(i);
      
      for (let j = i + 1; j < n; j++) {
        setCompareIdx(j);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
        await delay(speed);
      }
      
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        [orig[i], orig[minIdx]] = [orig[minIdx], orig[i]];
        setArray([...arr]);
        setOriginalValues([...orig]);
      }
    }
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setSorting(false);
  };

  const insertionSort = async () => {
    setSorting(true);
    const arr: number[] = [...array];
    const orig: number[] = [...originalValues];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      setCurrentIdx(i);
      let key = arr[i];
      let origKey = orig[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        setCompareIdx(j);
        arr[j + 1] = arr[j];
        orig[j + 1] = orig[j];
        j--;
        setArray([...arr]);
        setOriginalValues([...orig]);
        await delay(speed);
      }
      arr[j + 1] = key;
      orig[j + 1] = origKey;
      setArray([...arr]);
      setOriginalValues([...orig]);
    }
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setSorting(false);
  };

  const partition = async (arr: number[], orig: number[], low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      setCurrentIdx(j);
      setCompareIdx(high);
      await delay(speed);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        [orig[i], orig[j]] = [orig[j], orig[i]];
        setArray([...arr]);
        setOriginalValues([...orig]);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    [orig[i + 1], orig[high]] = [orig[high], orig[i + 1]];
    setArray([...arr]);
    setOriginalValues([...orig]);
    return i + 1;
  };

  const quickSortHelper = async (arr: number[], orig: number[], low: number, high: number) => {
    if (low < high) {
      const pi = await partition(arr, orig, low, high);
      await quickSortHelper(arr, orig, low, pi - 1);
      await quickSortHelper(arr, orig, pi + 1, high);
    }
  };

  const quickSort = async () => {
    setSorting(true);
    const arr: number[] = [...array];
    const orig: number[] = [...originalValues];
    await quickSortHelper(arr, orig, 0, arr.length - 1);
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setSorting(false);
  };

  const merge = async (arr: number[], orig: number[], left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L: number[] = arr.slice(left, mid + 1);
    const R: number[] = arr.slice(mid + 1, right + 1);
    const origL: number[] = orig.slice(left, mid + 1);
    const origR: number[] = orig.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
      setCurrentIdx(k);
      setCompareIdx(mid + j + 1);
      await delay(speed);
      
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        orig[k] = origL[i];
        i++;
      } else {
        arr[k] = R[j];
        orig[k] = origR[j];
        j++;
      }
      k++;
      setArray([...arr]);
      setOriginalValues([...orig]);
    }
    
    while (i < n1) {
      arr[k] = L[i];
      orig[k] = origL[i];
      i++;
      k++;
      setArray([...arr]);
      setOriginalValues([...orig]);
      await delay(speed);
    }
    
    while (j < n2) {
      arr[k] = R[j];
      orig[k] = origR[j];
      j++;
      k++;
      setArray([...arr]);
      setOriginalValues([...orig]);
      await delay(speed);
    }
  };

  const mergeSortHelper = async (arr: number[], orig: number[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSortHelper(arr, orig, left, mid);
      await mergeSortHelper(arr, orig, mid + 1, right);
      await merge(arr, orig, left, mid, right);
    }
  };

  const mergeSort = async () => {
    setSorting(true);
    const arr: number[] = [...array];
    const orig: number[] = [...originalValues];
    await mergeSortHelper(arr, orig, 0, arr.length - 1);
    setCurrentIdx(-1);
    setCompareIdx(-1);
    setSorting(false);
  };

  const handleSort = () => {
    switch (algorithm) {
      case 'bubble':
        bubbleSort();
        break;
      case 'selection':
        selectionSort();
        break;
      case 'insertion':
        insertionSort();
        break;
      case 'quick':
        quickSort();
        break;
      case 'merge':
        mergeSort();
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.row}>
          <Button 
            onClick={generateArray} 
            disabled={sorting}
            className={styles.button}
          >
            Generate Random Array
          </Button>
          
          <Select 
            value={algorithm} 
            onValueChange={setAlgorithm}
            disabled={sorting}
            className={styles.select}
          >
            <SelectTrigger className={styles.select}>
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="selection">Selection Sort</SelectItem>
              <SelectItem value="insertion">Insertion Sort</SelectItem>
              <SelectItem value="quick">Quick Sort</SelectItem>
              <SelectItem value="merge">Merge Sort</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleSort} 
            disabled={sorting}
            className={styles.startButton}
          >
            Start Sorting
          </Button>
        </div>

        {/* <div className={styles.speedRow}>
          <span className={styles.speedLabel}>Speed:</span>
          <Slider
            defaultValue={[speed]}
            max={500}
            min={1}
            step={10}
            onValueChange={([value]) => setSpeed(500 - value)}
            disabled={sorting}
            className="w-48"
          />
        </div> */}

        <div className={styles.customInputRow}>
          <Input
            placeholder="Enter numbers separated by commas (e.g., 5, 2, 8, 1, 9)"
            value={inputValue}
            onChange={handleInputChange}
            disabled={sorting}
            className={styles.customInput}
          />
          <Button 
            onClick={validateAndSetArray}
            disabled={sorting}
            className={styles.customButton}
          >
            Set Custom Array
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className={styles.alert}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className={styles.visualizer}>
        <div className={styles.visualizerContainer}>
          {array.map((value, idx) => (
            <div
              key={idx}
              style={{
                height: `${value}%`,
                width: `${Math.max(20, Math.min(40, 600 / array.length))}px`
              }}
              className={`${styles.bar} ${
                idx === currentIdx 
                  ? styles.currentBar
                  : idx === compareIdx 
                    ? styles.compareBar
                    : styles.defaultBar
              }`}
            />
          ))}
        </div>
        
        <div className={styles.valueContainer}>
          {originalValues.map((value, idx) => (
            <div
              key={idx}
              className={`${styles.value} ${
                idx === currentIdx 
                  ? styles.currentValue
                  : idx === compareIdx 
                    ? styles.compareValue
                    : styles.defaultValue
              }`}
              style={{
                width: `${Math.max(20, Math.min(40, 600 / array.length))}px`,
                textAlign: 'center'
              }}
            >
              {value}
            </div>
          ))}
        </div>
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Current Algorithm Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> {algorithmInfo[algorithm].name}</p>
                  <p><span className="font-medium">Time Complexity:</span> {algorithmInfo[algorithm].timeComplexity}</p>
                  <p><span className="font-medium">Space Complexity:</span> {algorithmInfo[algorithm].spaceComplexity}</p>
                  <p><span className="font-medium">Stable:</span> {algorithmInfo[algorithm].stable ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Performance Metrics</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Comparisons:</span> {comparisons}</p>
                  <p><span className="font-medium">Swaps:</span> {swaps}</p>
                  <p><span className="font-medium">Execution Time:</span> {executionTime.toFixed(2)}ms</p>
                  <p className="text-green-600 font-medium mt-2">
                    Recommendation: {getBestAlgorithm(array.length)}
                  </p>
                </div>
              </div>
              </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Algorithm Description</h3>
              <p className="text-sm text-gray-600">{algorithmInfo[algorithm].description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SortingVisualizer;
