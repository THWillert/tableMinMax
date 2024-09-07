/**
 * @license MIT
 * @author Thorsten Willert
 * @version 4.0
 * 2023-2024
 */


/**
 * Highlights minimum and maximum values in a table based on configuration.
 * Supports different search modes (row, column, all) and modes (single, multi).
 *
 * @param {Object} oOptions - Configuration options for the function.
 * @param {string} [oOptions.table='table'] - CSS selector for the table to be processed.
 * @param {Object} [oOptions.search] - Configuration for search modes and indices.
 * @param {string} [oOptions.search.mode='all'] - Search mode: 'all', 'row', or 'col'.
 * @param {number[]} [oOptions.search.nr=[1]] - Row or column indices to search; -1 to process all.
 * @param {boolean} [oOptions.search.grouped=false] - Whether to group rows/columns for min/max calculation.
 * @param {Object} [oOptions.css] - CSS classes for highlighting min and max values.
 * @param {string} [oOptions.css.mode='style'] - Mode for applying styles: 'style' or 'class'.
 * @param {string} [oOptions.css.max=''] - CSS class for maximum values.
 * @param {string} [oOptions.css.min=''] - CSS class for minimum values.
 * @param {Object} [oOptions.text] - Text color configuration for readability.
 * @param {boolean} [oOptions.text.autocontrast=true] - Whether to automatically adjust text color.
 * @param {number} [oOptions.text.threshold=130] - Brightness threshold for text color adjustment.
 * @param {string} [oOptions.text.light='#fff'] - Light text color.
 * @param {string} [oOptions.text.dark='#000'] - Dark text color.
 * @param {string} [oOptions.colorize='span'] - Method for applying color: 'span' or 'cell'.
 * @param {string} [oOptions.mode='single'] - Mode for highlighting: 'single' or 'multi'.
 * @param {boolean} [oOptions.invert=false] - Whether to invert the highlighting colors.
 * @returns {[number, number]} - An array containing the minimum and maximum values found.
 */
const tableMinMax = (oOptions) => {
    const settings = {
        table: 'table',
        search: {
            mode: 'all',
            nr: [1],
            grouped: false
        },
        css: {
            mode: 'style',
            max: '',
            min: ''
        },
        text: {
            autocontrast: true,
            threshold: 130,
            light: '#fff',
            dark: '#000'
        },
        valueRange: {
            min: null,   // Minimaler Wert für die Markierung
            max: null    // Maximaler Wert für die Markierung
        },
        operation: 'default',
        colorize: 'span',
        mode: 'single',
        invert: false,
        ...oOptions
    };

    const oTable = document.querySelector(settings.table);
    if (!oTable) {
        console.log(`tableMinMax: table not found: ${settings.table}\nFunction call after table init? (e.g., end of body)`);
        return [-1, -1];
    }

    const oTbody = oTable.querySelector('tbody');

    // Check and set options from data attributes
    if (oTable.hasAttribute("data-search-mode")) {
        const searchMode = oTable.getAttribute("data-search-mode");
        if (['all', 'row', 'col'].includes(searchMode)) {
            settings.search.mode = searchMode;
        } else {
            console.warn(`Invalid data-search-mode value: ${searchMode}. Using default 'all'.`);
        }
    }

    if (oTable.hasAttribute("data-search-nr")) {
        settings.search.nr = oTable.getAttribute("data-search-nr").split(',').map(Number);
    }

    if (oTable.hasAttribute("data-grouped")) {
        const grouped = oTable.getAttribute("data-grouped");
        settings.search.grouped = grouped === "true";
    }

    if (oTable.hasAttribute("data-autocontrast")) {
        settings.text.autocontrast = oTable.getAttribute("data-autocontrast") === "true";
    }

    if (oTable.hasAttribute("data-css-min")) {
        settings.css.min = oTable.getAttribute("data-css-min").trim().replace(/\s\s+/g, ' ');
    }

    if (oTable.hasAttribute("data-css-max")) {
        settings.css.max = oTable.getAttribute("data-css-max").trim().replace(/\s\s+/g, ' ');
    }

    if (oTable.hasAttribute("data-colorize")) {
        const colorize = oTable.getAttribute("data-colorize");
        if (['span', 'cell'].includes(colorize)) {
            settings.colorize = colorize;
        } else {
            console.warn(`Invalid data-colorize value: ${colorize}. Using default 'span'.`);
        }
    }

    if (oTable.hasAttribute("data-mode")) {
        const mode = oTable.getAttribute("data-mode");
        if (['single', 'multi'].includes(mode)) {
            settings.mode = mode;
        } else {
            console.warn(`Invalid data-mode value: ${mode}. Using default 'single'.`);
        }
    }

    if (oTable.hasAttribute("data-invert")) {
        settings.invert = oTable.getAttribute("data-invert") === "true";
    }

    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    let minCells = [];
    let maxCells = [];
    let allCells = [];

    /**
     * Processes the given cells to find minimum and maximum values.
     *
     * @param {HTMLElement[]} cells - Array of cell elements to process.
     */
    const processCells = (cells) => {
        cells.forEach(cell => {
            const val = parseFloat(cell.innerText);
            if (!isNaN(val)) {
                switch (settings.operation) {
                    case 'above':

                        if (val > settings.valueRange.min) {
                             console.log(val)
                            maxCells.push(cell);
                        }
                        break;
                    case 'below':
                        if (val < settings.valueRange.max) {
                            minCells.push(cell);
                        }
                        break;
                    case 'aboveBelow':
                        if (val > settings.valueRange.min) {
                            maxCells.push(cell);
                        }
                        if (val < settings.valueRange.max) {
                            minCells.push(cell);
                        }
                        break;
                    case 'between':
                        if (val > settings.valueRange.min && val < settings.valueRange.max) {
                            maxCells.push(cell);
                        }
                        break;
                    default: // 'default' Modus für min/max Ermittlung
                        //console.log(val)
                        if (val < min) {
                            min = val;
                            minCells = [cell];
                        } else if (val === min) {
                            minCells.push(cell);
                        }
                        if (val > max) {
                            max = val;
                            maxCells = [cell];
                        } else if (val === max) {
                            maxCells.push(cell);
                        }
                        break;
                }
            }
        });
    };


    /**
     * Searches for minimum and maximum values in specified rows or columns.
     * If grouped is true, all specified rows or columns are aggregated.
     *
     * @param {number[]} indices - Indices of rows or columns to search.
     * @param {boolean} searchInRows - Whether to search in rows (true) or columns (false).
     */
    const searchInRowOrCol = (indices, searchInRows) => {
        if (settings.search.grouped) {
            indices.forEach(index => {
                let cells;
                if (searchInRows) {
                    cells = Array.from(oTbody.rows[index].cells);
                } else {
                    cells = Array.from(oTbody.rows).map(row => row.cells[index]);
                }
                allCells.push(...cells);
            });

            // Aggregating min/max values
            min = Number.MAX_VALUE;
            max = Number.MIN_VALUE;
            minCells = [];
            maxCells = [];

            processCells(allCells);

            mark(minCells, maxCells);
        } else {
            indices.forEach(index => {
                min = Number.MAX_VALUE;
                max = Number.MIN_VALUE;
                minCells = [];
                maxCells = [];

                let cells;
                if (searchInRows) {
                    cells = Array.from(oTbody.rows[index].cells);
                } else {
                    cells = Array.from(oTbody.rows).map(row => row.cells[index]);
                }

                processCells(cells);
                mark(minCells, maxCells);
            });
        }
    };

    /**
     * Highlights the given cells based on min and max values using the specified CSS classes.
     *
     * @param {HTMLElement[]} minCells - Array of cells with minimum values.
     * @param {HTMLElement[]} maxCells - Array of cells with maximum values.
     */
    const mark = (minCells, maxCells) => {
        if (settings.invert) {
            [minCells, maxCells] = [maxCells, minCells];
        }

        const markCells = (cells, cssClass) => {
            cells.forEach(cell => {
                if (settings.colorize === 'span') {
                    cell.innerHTML = `<span class="${cssClass}">${cell.innerHTML}</span>`;
                } else {
                    cell.classList.add(...cssClass.split(' '));
                }
                if (settings.text.autocontrast) {
                    setColor(cell, cssClass);
                }
            });
        };

        //console.log(maxCells)

        if (['default', 'above', 'aboveBelow', 'between'].includes(settings.operation)) {
            markCells(maxCells, settings.css.max);
        }
        if (['default', 'below', 'aboveBelow'].includes(settings.operation)) {
            markCells(minCells, settings.css.min);
        }
    };

    /**
     * Sets the text color of the given cell based on the background color for readability.
     *
     * @param {HTMLElement} oObj - The cell element whose text color needs to be set.
     * @param {string} minMax - CSS class used to determine background color.
     */
    const setColor = (oObj, minMax) => {
        if (settings.text.autocontrast) {
            const colorElement = document.querySelector(String2Classes(minMax));
            if (colorElement) {
                const color = window.getComputedStyle(colorElement).backgroundColor;
                const textColor = getCorrectTextColor(color, settings.text.threshold, settings.text.light, settings.text.dark);
                oObj.style.color = textColor;
            }
        }
    };

    /**
     * Determines the correct text color based on the background color for readability.
     *
     * @param {string} rgba - Background color in RGBA format.
     * @param {number} th - Brightness threshold for text color adjustment.
     * @param {string} light - Light text color.
     * @param {string} dark - Dark text color.
     * @returns {string} - The selected text color.
     */
    const getCorrectTextColor = (rgba, th, light, dark) => {
        const [r, g, b] = rgba.match(/\d+/g).map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > th ? dark : light;
    };

    /**
     * Converts a string to a class selector.
     *
     * @param {string} string - The string to convert.
     * @returns {string} - The class selector.
     */
    const String2Classes = (string) => `.${string.split(' ').join('.')}`;

    // Handle search modes combined with single/multi modes
    if (settings.search.mode === 'row') {
        if (settings.search.nr.includes(-1) || settings.search.grouped ) {
            // Process all rows individually
            searchInRowOrCol(Array.from(oTbody.rows).map((_, i) => i), true);
        } else {
            if (settings.mode === 'single') {
                settings.search.nr.forEach(num => {
                    const cells = Array.from(oTbody.rows[num].cells);
                    processCells(cells);
                    mark(minCells.slice(0, 1), maxCells.slice(0, 1)); // Only mark one min and one max per row
                });
            } else {
                settings.search.nr.forEach(num => {
                    const cells = Array.from(oTbody.rows[num].cells);
                    processCells(cells);
                    mark(minCells, maxCells); // Mark all min and max values in row
                });
            }
            min = Number.MAX_VALUE;
            max = Number.MIN_VALUE;
            minCells = [];
            maxCells = [];
        }
    } else if (settings.search.mode === 'col') {
        if (settings.search.nr.includes(-1) || settings.search.grouped ) {
            // Process all columns individually
            searchInRowOrCol(Array.from(oTbody.rows[0].cells).map((_, i) => i), false);
        } else {
            if (settings.mode === 'single') {
                settings.search.nr.forEach(num => {
                    const cells = Array.from(oTbody.rows).map(row => row.cells[num]);
                    processCells(cells);
                    mark(minCells.slice(0, 1), maxCells.slice(0, 1)); // Only mark one min and one max per column
                });
            } else {
                settings.search.nr.forEach(num => {
                    const cells = Array.from(oTbody.rows).map(row => row.cells[num]);
                    processCells(cells);
                    mark(minCells, maxCells); // Mark all min and max values in column
                });
            }
            min = Number.MAX_VALUE;
            max = Number.MIN_VALUE;
            minCells = [];
            maxCells = [];
        }
    } else if (settings.search.mode === 'all') {
        allCells = Array.from(oTbody.querySelectorAll('tr td'));
        processCells(allCells);

        if (settings.mode === 'single') {
            mark(minCells.slice(0, 1), maxCells.slice(0, 1)); // Only mark one min and one max
        } else {
            mark(minCells, maxCells); // Mark all min and max values found
        }
    }

    //console.log(min + " " + max)
    return [min, max];
};
