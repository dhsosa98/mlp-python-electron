


export const calculateDistortion = (
    matrix: number[][],
    actualMatrix: number[][],
  ) => {
    return matrix.reduce((acc1, row, rowIndex) => {
      return (
        acc1 +
        row.reduce((acc2, cell, cellIndex) => {
          if (cell !== actualMatrix[rowIndex][cellIndex]) {
            return acc2 + 1;
          }
          return acc2;
        }, 0)
      );
    }, 0);
  };