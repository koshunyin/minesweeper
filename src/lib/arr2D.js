// Create 2D array with prefilled values
export function create(rows, cols, prefill_val) {
  let arr = Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = Array(cols).fill(prefill_val);;
  }

  return arr;
}

// Assign val to {n} cells
export function populate(arr, val, n) {
  let rows = arr.length;
  let cols = arr[0].length;
  let i = n;

  while (i !== 0) {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * cols);
    if (arr[row][col] !== val) {
      arr[row][col] = val;
      i--;
    }
  }

  return arr;
}

// Fill array with adjacent count of val
export function fillAdjCount(arr, val) {
  for (let row = 0; row < arr.length; row++) {
    for (let col = 0; col < arr[0].length; col++) {
      if (arr[row][col] === val) {
        this.callFnOnAdj(arr, row, col, (i, j) => {
          if (arr[i][j] !== val) {
            arr[i][j]++;
          }
        });
      }
    }
  }

  return arr;
}

// Get adjacent count of val for arr[row][col]
export function getAdjCount(arr, row, col, val) {
  let count = 0;
  this.callFnOnAdj(arr, row, col, (i, j) => {
    if (arr[i][j] === val) {
      count++;
    }
  });

  return count;
}

// Execute function on arr[row][col] and its adjacent cells
export function callFnOnAdj(arr, row, col, fn) {
  let rows = arr.length;
  let cols = arr[0].length;

  let row_min = Math.max(row - 1, 0);
  let row_max = Math.min(row + 1, rows - 1);
  let col_min = Math.max(col - 1, 0);
  let col_max = Math.min(col + 1, cols - 1);

  for (let i = row_min; i <= row_max; i++) {
    for (let j = col_min; j <= col_max; j++) {
      fn(i, j);
    }
  }
}

// Update arr[row][col] with val
export function update(arr, row, col, val) {
  arr[row][col] = val;
  return arr;
}

// Get count of val in arr
export function getCount(arr, val) {
  let count = 0;

  arr.forEach((row) => {row.forEach((cell) => {
    count += (cell === val ? 1 : 0);
  })})

  return count;  
}

// Toggle boolean value on arr[row][col]
export function toggle(arr, row, col){
  arr[row][col] = !arr[row][col];
  return arr;
}

// Call function on each cell in 2D array
export function map(arr, fn){
  let rows = arr.length;
  let cols = arr[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      fn(arr, i, j);
    }
  }

  return arr;
}