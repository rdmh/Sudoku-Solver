class SudokuSolver {
  /**
   * Validates the format of a given string to be used in the sudoku puzzle
   * @param {string} puzzleString - string to be validated
   * @returns {boolean | object.<string>} - true if no errors, false if errors
   */
  validate(puzzleString) {
    let validChars = /^[0-9.]*$/;
    if (!validChars.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    return true;
  }

  /**
   * Function to check if a value is already placed in a row
   * @param {string} puzzleString - The string representing the puzzle
   * @param {string} row - the row of the coordinate (valid if A through I)
   * @param {string} column - the column of the coordinate
   * @param {string} value - the value to check
   * @returns {object.boolean | object.<string>} - true if the value isn't already placed in the row, else false, error if coordinate is invalid
   */
  checkRowPlacement(puzzleString, row, column, value) {
    let validRow = /^[A-I]$/;
    if (!validRow.test(row)) {
      return { error: "Invalid coordinate" };
    }
    if (value == undefined) {
      return { error: "Required field(s) missing" };
    }
    let rowValues = this.determineRowValues(puzzleString, row);
    if (rowValues.includes(value)) {
      return { valid: false };
    } else {
      return { valid: true };
    }
  }

  /**
   * Function to check if a value is already placed in a column
   * @param {string} puzzleString - The string representing the puzzle
   * @param {string} row - the row of the coordinate
   * @param {string} column - the column of the coordinate (validate if 1 through 9)
   * @param {string} value - the value to check
   * @returns {object.boolean | object.<string>} - true if the value isn't already placed in the column, else false, error if coordinate is invalid
   */
  checkColPlacement(puzzleString, row, column, value) {
    let validCol = /^[1-9]$/;
    if (!validCol.test(column)) {
      return { error: "Invalid coordinate" };
    }

    let colValues = this.determineColumnValues(puzzleString, column);

    if (colValues.includes(value)) {
      return { valid: false };
    } else {
      return { valid: true };
    }
  }
  /**
   * Function to check if a value is already placed in a region
   * @param {string} puzzleString - The string representing the puzzle
   * @param {string} row - the row of the coordinate
   * @param {string} column - the column of the coordinate
   * @param {string} value - the value to check  (valid 1 through 9)
   * @returns {object.boolean | object.<string>} - true if the value isn't already placed in the region, else false, error if coordinate is invalid
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    let validValue = /^[1-9]$/;
    if (!validValue.test(value)) {
      return { error: "Invalid value" };
    }
    let grid = this.determineGrid(puzzleString, row, column);
    if (grid.indexOf(value) == -1) {
      return { valid: true };
    } else {
      return { valid: false };
    }
  }

  /**
   * Function to determine the available values for a coordinate
   * @param {string} puzzleString - The string representing the puzzle
   * @param {string} row - the row of the coordinate
   * @param {string} column - the column of the coordinate
   * @returns {Array.<number>} - array of available values for the coordinate
   */
  determineAvailableValues(puzzleString, row, column) {
    let grid = this.determineGrid(puzzleString, row, column);
    let rowValues = this.determineRowValues(puzzleString, row);
    let colValues = this.determineColumnValues(puzzleString, column);
    let allValues = grid.concat(colValues, rowValues);
    let availableValues = [];
    for (let i = 1; i <= 9; i++) {
      if (allValues.indexOf(i) == -1) {
        availableValues.push(i);
      }
    }
    return availableValues;
  }
  /**
   * Function to determine the column values for a coordinate
   * @param {string} puzzleString - The string representing the puzzle
   * @param {string} column - the column of the coordinate (validate if 1 through 9)
   * @returns {string} - string of column values for the coordinate
   */
  determineColumnValues(puzzleString, column) {
    let colIndex = column - 1;
    let colValues = "";

    let len = puzzleString.length < 81 ? puzzleString.length : 81;
    for (let i = colIndex; i < len; i += 9) {
      colValues = colValues + puzzleString.charAt(i);
    }
    return colValues;
  }
  /**
   * Function to determine the coordinate from a numerical position of the puzzle
   * @param {number} position - the numerical position of a character in the puzzle string
   * @returns {string} - the coordinate of the puzzle
   */
  determineCoordinate(position) {
    let rowLetter = String.fromCharCode(
      "A".charCodeAt(0) + Math.floor(position / 9),
    );
    let col = (position % 9) + 1;
    return rowLetter + col;
  }
  /**
   * Function to determine the region values for a coordinate
   * @param {string} puzzleString - The string representing the puzzle
   * @param {string} row - the row of the coordinate
   * @param {string} column - the column of the coordinate
   * @returns {string} - string of region values for the coordinate
   */
  determineGrid(puzzleString, row, column) {
    let rowIndex = row.charCodeAt(0) - 65;
    let multiplier = rowIndex < 3 ? 0 : rowIndex < 6 ? 3 : 6;
    let colIndex = column <= 3 ? 0 : column <= 6 ? 3 : 6;
    let pos = multiplier == 0 ? colIndex : colIndex + multiplier * 9;
    let max = pos + 27;
    let grid = "";
    let temp = "";
    for (let i = pos; i < max; i += 9) {
      temp = puzzleString.slice(i, i + 3);
      grid = grid + temp;
    }
    return grid;
  }
  /**
   * Function to determine the row values for a coordinate
   * @param {string} row - the row of the coordinate
   * @returns {string} - string of row values for a coordinate
   */
  determineRowValues(puzzleString, row) {
    let rowIndex = row.charCodeAt(0) - 65;
    let rowValues = puzzleString.slice(rowIndex * 9, rowIndex * 9 + 9);
    return rowValues;
  }
  /**
   * Function to determine the coordinate from a numerical position of the puzzle
   * @param {number} position - the numerical position of a character in the puzzle string
   * @returns {number} - the position of the coordinate for a given puzzle
   */
  determineStringPosition(row, column) {
    let rowNumber = row.charCodeAt(0) - "A".charCodeAt(0);
    let columnNumber = (column - 1) % 9;
    return rowNumber > 0
      ? rowNumber * 9 + columnNumber
      : rowNumber + columnNumber;
  }
  /**
   * Function to determine if a given value and coordiante is valid
   * @param {string} puzzleString - The string representing the puzzle
   * @param {string} row - the row of the coordinate
   * @param {string} column - the column of the coordinate
   * @param {string} value - the value to be checked
   * @returns {object.boolean | object.boolean: error.Array.<string>} - valid is true if the value is valid, else false with an arry of conflicts
   */
  check(puzzleString, row, column, value) {
    try {
      let conflict = [];
      let isValid = this.validate(puzzleString);
      if (isValid === true) {
        let strPos = this.determineStringPosition(row, column);
        if (
          puzzleString.charAt(strPos) != "." &&
          puzzleString.charAt(strPos) == value
        ) {
          puzzleString = this.getPuzzleString(puzzleString, strPos, ".");
        }
        let rowValid = this.checkRowPlacement(puzzleString, row, column, value);
        if (rowValid.error) {
          return rowValid;
        }
        let colValid = this.checkColPlacement(puzzleString, row, column, value);
        if (colValid.error) {
          return colValid;
        }
        let regValid = this.checkRegionPlacement(
          puzzleString,
          row,
          column,
          value,
        );
        if (regValid.error) {
          return regValid;
        }
        if (!rowValid.valid) {
          conflict.push("row");
        }
        if (!colValid.valid) {
          conflict.push("column");
        }
        if (!regValid.valid) {
          conflict.push("region");
        }
        if (conflict.length == 0) {
          return { valid: true };
        } else {
          return { valid: false, conflict: conflict };
        }
      } else {
        return isValid;
      }
    } catch (err) {
      return { error: err.message };
    }
  }
  /**
   * Function to update puzzleString with a value
   * @param {string} puzzleString - The string representing the puzzle
   * @param {number} position - the position of the value to be updated
   * @param {string} newValue - the value to be updated
   * @returns {string} - puzzleString with the updated value
   */
  getPuzzleString(puzzleString, position, newValue) {
    if (position != 0) {
      return (
        puzzleString.substring(0, position) +
        newValue +
        puzzleString.substring(position + 1)
      );
    } else {
      return newValue + puzzleString.substring(position + 1);
    }
  }
  /**
   * Function to check if all numbers puzzle string are valid
   * @param {object.boolean} puzzleString - The string representing the puzzle
   */
  preCheck(puzzleString) {
    let puzzleLength = puzzleString.length;
    let isValid = true;
    for (let i = 0; i < puzzleLength && isValid !== false; i++) {
      if (puzzleString.charAt(i) !== ".") {
        let coordinate = this.determineCoordinate(i);
        let row = coordinate.charAt(0);
        let column = coordinate.charAt(1);
        let validRow = this.determineRowValues(puzzleString, row).replaceAll(
          ".",
          "",
        );
        let validColumn = this.determineColumnValues(
          puzzleString,
          column,
        ).replaceAll(".", "");
        let validRegion = this.determineGrid(
          puzzleString,
          row,
          column,
        ).replaceAll(".", "");
        for (let j = 0; j < validRow.length; j++) {
          if (validRow.lastIndexOf(validRow[j]) !== j) {
            isValid = false;
            break;
          }
        }
        for (let j = 0; j < validColumn.length; j++) {
          if (validColumn.lastIndexOf(validColumn[j]) !== j) {
            isValid = false;
            break;
          }
        }
        for (let j = 0; j < validRegion.length; j++) {
          if (validRegion.lastIndexOf(validRegion[j]) !== j) {
            isValid = false;
            break;
          }
        }
      }
    }
    return { valid: isValid };
  }

  /**
   * Function to determine and set the relplacment value of each '.' in a puzzlString
   * @param {string} puzzleString - The string representing the puzzle
   *
   */
  setValues(puzzleString) {
    let solvedPuzzle = puzzleString;
    let puzzleLength = solvedPuzzle.length;
    let coordinate, row, column, availableValues;
    for (let i = 0; i < puzzleLength; i++) {
      if (solvedPuzzle.charAt(i) === ".") {
        coordinate = this.determineCoordinate(i);
        row = coordinate.charAt(0);
        column = coordinate.charAt(1);
        availableValues = this.determineAvailableValues(
          solvedPuzzle,
          row,
          column,
        );
        if (availableValues.length === 1) {
          solvedPuzzle = this.getPuzzleString(
            solvedPuzzle,
            i,
            availableValues[0],
          );
        }
      }
    }
    return solvedPuzzle;
  }

  /**
   * Function to solve the puzzle
   * @param {string} puzzleString - The string representing the puzzle
   * @returns {object.string} - The string representing the solved puzzle
   */
  solve(puzzleString) {
    let isValid = this.validate(puzzleString);
    if (isValid !== true) {
      return isValid;
    }
    let validValues = this.preCheck(puzzleString);

    if (validValues.valid === false) {
      return { error: "Puzzle cannot be solved" };
    }

    let solvedPuzzle = puzzleString;
    do {
      solvedPuzzle = this.setValues(solvedPuzzle);
    } while (solvedPuzzle.indexOf(".") !== -1);

    return { solution: solvedPuzzle };
  }
}

module.exports = SudokuSolver;
