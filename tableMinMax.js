// (c) 2021 Thorsten Willert
// V2.1
// This code is licensed under MIT license
tableMinMax = function(oOptions) {
    /*
    Sets css-classes to the min/max-values in a table, row or column.
    --------------------------------------------------------------------------------
    V2.1
    - Optimized code

    V2.0
    - Options search col / row: "nr" now as array of numbers

    V1.43
    - fixed warning: var declaration
    - fixed error with data-autocontrast

    V1.42
    - fixed: error with automatic contrast mode and multiple, trailing and
    leading spaces in class options

    V1.41
    - fixed: automatic contrast mode

    V1.4
    - added automatic contrast mode for the text.
        color2k.js must be loaded (2.8k)
        https://color2k.com/
        https://www.jsdelivr.com/package/npm/color2k

    V1.3
    - fixed error in default value: search.nr = 1 instead of 0
    - fixed error with multiple calls on the same table
    - optimized some code
    - removed parameter "id"

    --------------------------------------------------------------------------------

    Returns:
        array [min, max]
        on error [-1,-1}

    --------------------------------------------------------------------------------

    Options:
        [default]
        (data-attribute) overrides options

    table [table]
        table objekt, name, class, id ...

    search (data-search-mode)
        mode [all]
            all: the complete table
            row: single-row number
            col: single-column number
        nr [1]
            row / col number: array of cols / rows

    ToDo mode
        single: minimum / maxium values are marked
        multi: all values with the same min / max are marked)

    css
        ToDo mode: {style} style | class
        max: class(es) or style for maximum value  (data-min-css)
        min: class(es) or style for minimum value  (data-max-css)

    text
        autocontrast: {true}
            sets the text color (black/white) depending on the color-contrast backround
            works only of color2k is loaded https://color2k.com/
            <script
                src="https://cdn.jsdelivr.net/npm/color2k@1.1.0/index.js"
                integrity="sha256-yCiK7OHQWsGGc5O9R0OJxGfpLHSqYGq3J2ptgI+Ngqk="
                crossorigin="anonymous">
            </script>

        standard: [readable]
            Mode for autocontrast
            'decorative' | 'readable' | 'aa' | 'aaa' = 'aa'
            Look at: https://color2k.com/#has-bad-contrast

    colorize [span]
        cell: css added to the cell
        span: css added to a span with the current value inside + id for the span

    invert:
        true: min / max classes are swaped

    */
    const settings = extend({
        table: 'table',
        search: {
            mode: 'all',
            nr: [1]
        },
        limit: {
            min: 'min',
            max: 'max'
        },
        css: {
            mode: 'style',
            max: '',
            min: ''
        },
        text: {
            autocontrast: true,
            standard: 'readable',
            min: '#fff',
            max: '#000'
        },
        colorize: 'span',
        mode: 'single',
        invert: false
    }, oOptions)
    // init ===================================================================
    let min = Number.MAX_VALUE
    let max = Number.MIN_VALUE
    let min_i = 0
    let max_i = 0
    let min_col = 0
    let max_col = 0
    let iCols = 0
    let iRows = 0
    let oTable = null
    let oTbody = null
    let min_c = null
    let max_c = null

    // 1. simple parameter-check ==============================================
    try {
        oTable = document.querySelector(settings.table)
        if (oTable === null) {
            console.log(`tableMinMax: table not found: ${settings.table} \n Function call after table init? (e.g. end of body)`)
            return [-1, -1]
        }
        oTbody = document.querySelector(settings.table + ' tbody')
        iRows = oTbody.rows.length
    } catch (e) {
        console.error(e)
        return [-1, -1]
    }

    // data ====================================================================
    if (oTable.hasAttribute('data-search-mode')) {
        settings.search.mode = oTable.getAttribute('data-search-mode')
    }
    if (oTable.hasAttribute('data-search-nr')) {
        settings.search.nr = oTable.getAttribute('data-search-nr')
    }
    /*
      if (oTable.hasAttribute("data-css-mode"))
          settings.css.mode = oTable.getAttribute("data-css-mode");
      */
    if (oTable.hasAttribute('data-autocontrast')) {
        settings.text.autocontrast = (oTable.getAttribute('data-autocontrast') === 'true')
    }
    if (oTable.hasAttribute('data-css-min')) {
        settings.css.min = oTable.getAttribute('data-css-min')
    }
    settings.css.min = settings.css.min.trim().replace(/\s\s+/g, ' ')

    if (oTable.hasAttribute('data-css-max')) {
        settings.css.max = oTable.getAttribute('data-css-max')
    }
    settings.css.max = settings.css.max.trim().replace(/\s\s+/g, ' ')
    if (oTable.hasAttribute('data-colorize')) {
        settings.css.max = oTable.getAttribute('data-colorize')
    }
    // search min / max ========================================================
    let val
    const length = settings.search.nr.length
    let oNr

    switch (settings.search.mode.toString()) {
        // ---------------------------------------------------------------------
        case 'col':
            // search min / max values in column
            for (let j = 0; j < length; j++) {
                // reset for new min/max
                min = Number.MAX_VALUE
                max = Number.MIN_VALUE

                for (let i = 0; i < iRows; i++) {
                    oNr = settings.search.nr[j]
                    val = parseFloat(oTbody.rows[i].cells[oNr.innerText])
                    if (val > max) {
                        max = val
                        max_i = i
                        continue
                    }
                    if (val < min) {
                        min = val
                        min_i = i
                    }
                }
                // cells
                min_c = oTbody.rows[min_i].cells[oNr]
                max_c = oTbody.rows[max_i].cells[oNr]
                mark(min_c, max_c, settings)
            }
            break
            // ---------------------------------------------------------------------
        case 'row':
            // search min / max values in row
            for (let j = 0; j < length; j++) {
                // reset for new min/max
                min = Number.MAX_VALUE
                max = Number.MIN_VALUE
                oNr = settings.search.nr[j]
                iCols = oTbody.rows[j].cells.length

                for (let i = 0; i < iCols; i++) {
                    val = parseFloat(oTbody.rows[oNr].cells[i].innerText)
                    if (val > max) {
                        max = val
                        max_i = i
                        continue
                    }
                    if (val < min) {
                        min = val
                        min_i = i
                    }
                }
                // cells
                min_c = oTbody.rows[oNr].cells[min_i]
                max_c = oTbody.rows[oNr].cells[max_i]
                mark(min_c, max_c, settings)
            }
            break
            // ---------------------------------------------------------------------
        default:
            // search min / max values in table
            for (let i = 0; i < iRows; i++) {
                iCols = oTbody.rows[i].cells.length

                for (let j = 0; j < iCols; j++) {
                    val = parseFloat(oTbody.rows[i].cells[j].innerText)
                    if (val > max) {
                        max = val
                        max_i = i
                        max_col = j
                        continue
                    }
                    if (val < min) {
                        min = val
                        min_i = i
                        min_col = j
                    }
                }
            }
            min_c = oTbody.rows[min_i].cells[min_col]
            max_c = oTbody.rows[max_i].cells[max_col]
            mark(min_c, max_c, settings)
    }
    // -------------------------------------------------------------------------
    function mark(min_c, max_c, settings) {
        // invert min / max colors
        if (settings.invert === true) {
			[min_c, max_c] = [max_c, min_c]
        }
        // set classes to cell / span
        if (settings.colorize === 'span') {
            min_c.innerHTML = `<span class="${settings.css.min}">${min_c.innerHTML}</span>`
            max_c.innerHTML = `<span class="${settings.css.max}">${max_c.innerHTML}</span>`
        } else {
            min_c.className += settings.css.min
            max_c.className += settings.css.max
        }
        // --------------------------------------------------------------------------
        // if color2k.js is loaded
        try {
            if (typeof color2k.hasBadContrast === 'function') {
                console.log('color2k loaded')
                if (settings.text.autocontrast === true) {
                    setColor(min_c, settings.css.min, settings.text.standard)
                    setColor(max_c, settings.css.max, settings.text.standard)
                }
            } else {
                console.log('color2k not loaded')
            }
        } catch (e) {
            console.log(e)
        };
    };

    function setColor(oObj, minMax, standard) {
        const color = window.getComputedStyle(document.querySelector(String2Classes(minMax))).getPropertyValue('background-color')
        if (color2k.hasBadContrast(color, standard) === false) {
            oObj.style.color = '#fff'
        } else {
            oObj.style.color = '#000'
        }
    }
    // converts the css-classes from html to a selector for "querySelector"
    function String2Classes(string) {
        const classes = string.split(' ')
        return '.' + classes.join('.')
    }

    function extend(target, source) {
        target = target || {}
        for (var prop in source) {
            if (typeof source[prop] === 'object') {
                target[prop] = extend(target[prop], source[prop])
            } else {
                target[prop] = source[prop]
            }
        }
        return target
    }
    return [min, max]
}
