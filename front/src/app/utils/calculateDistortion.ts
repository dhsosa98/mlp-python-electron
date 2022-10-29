

import { defaultMatrixes } from "../constants/matrixes";

export const calculateDistortion = (
    matrix: number[][],
    actualMatrixKey: keyof typeof defaultMatrixes
  ) => {
    if (typeof actualMatrixKey !== "string") {
      return 0;
    }
    if (actualMatrixKey === "_") {
      return 0;
    }
    const actualMatrix = defaultMatrixes[actualMatrixKey];
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