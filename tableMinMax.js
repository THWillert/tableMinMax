// (c) 2023 Thorsten Willert
// V3.0
// This code is licensed under MIT license

tableMinMax = function (oOptions) {
    /*
    	Sets css-classes to the min/max-values in a table, row or column.

    	V3.0
    	- removed dependency for color2k
    --------------------------------------------------------------------------------
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

    		threshold: (130)
    			about half of 256. Lower threshold equals more dark text on dark background

    	colorize [span]
    		cell: css added to the cell
    		span: css added to a span with the current value inside + id for the span

    	invert:
    		true: min / max classes are swaped

    	*/

    let settings = extend({
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
            threshold: 130,
            light: '#fff',
            dark: '#000'
        },
        colorize: 'span',
        mode: 'single',
        invert: false
    }, oOptions);

    // init ===================================================================
    let min = Number.MAX_VALUE,
        max = Number.MIN_VALUE,
        min_i = 0,
        max_i = 0,
        min_col = 0,
        max_col = 0,
        iCols = 0,
        iRows = 0,
        oTable = null,
        oTbody = null,
        min_c = null,
        max_c = null

    // 1. simple parameter-check ==============================================
    try {
        oTable = document.querySelector(settings.table)
        if (oTable === null) {
            console.log('tableMinMax: table not found: ' + settings.table + "\n" +
                "Function call after table init? (e.g. end of body)")
            return [-1, -1]
        }

        oTbody = document.querySelector(settings.table + ' tbody')
        iRows = oTbody.rows.length;

    }
    catch (e) {
        console.error(e);
        return [-1, -1]
    }

    // data ====================================================================

    if (oTable.hasAttribute("data-search-mode"))
        settings.search.mode = oTable.getAttribute("data-search-mode");

    if (oTable.hasAttribute("data-search-nr"))
        settings.search.nr = oTable.getAttribute("data-search-nr");

    /*
    if (oTable.hasAttribute("data-css-mode"))
        settings.css.mode = oTable.getAttribute("data-css-mode");
    */
    if (oTable.hasAttribute("data-autocontrast"))
        settings.text.autocontrast = (oTable.getAttribute("data-autocontrast") === "true");

    if (oTable.hasAttribute("data-css-min"))
        settings.css.min = oTable.getAttribute("data-css-min");

    settings.css.min = settings.css.min.trim().replace(/\s\s+/g, ' ')

    if (oTable.hasAttribute("data-css-max"))
        settings.css.max = oTable.getAttribute("data-css-max");

    settings.css.max = settings.css.max.trim().replace(/\s\s+/g, ' ')

    if (oTable.hasAttribute("data-colorize"))
        settings.css.max = oTable.getAttribute("data-colorize");


    // search min / max ========================================================
    let val;
    let length = settings.search.nr.length;

    switch (settings.search.mode.toString()) {
        // ---------------------------------------------------------------------
        case 'col':
            // search min / max values in column

            for (let j = 0; j < length; j++) {

            	// reset for new min/max
            	min = Number.MAX_VALUE
            	max = Number.MIN_VALUE

				for (let i = 0; i < iRows; i++) {

					val = parseFloat(oTbody.rows[i].cells[ settings.search.nr[j] ].innerText);

					if (val > max) {
						max = val;
						max_i = i;
					}
					if (val < min) {
						min = val;
						min_i = i;
					}
				}
				// cells
				min_c = oTbody.rows[min_i].cells[ settings.search.nr[j] ];
				max_c = oTbody.rows[max_i].cells[ settings.search.nr[j] ];
				mark(min_c,max_c,settings)
			}

            break;
            // ---------------------------------------------------------------------
        case 'row':
            // search min / max values in row

            for (let j = 0; j < length; j++) {

            	// reset for new min/max
            	min = Number.MAX_VALUE
            	max = Number.MIN_VALUE

				iCols = oTbody.rows[j].cells.length

				for (let i = 0; i < iCols; i++) {

					val = parseFloat(oTbody.rows[ settings.search.nr[j] ].cells[i].innerText);

					if (val > max) {
						max = val;
						max_i = i;
					}
					if (val < min) {
						min = val;
						min_i = i;
					}
				}

				// cells
				min_c = oTbody.rows[ settings.search.nr[j] ].cells[min_i];
				max_c = oTbody.rows[ settings.search.nr[j] ].cells[max_i];
				mark(min_c,max_c,settings)
			}

            break;
            // ---------------------------------------------------------------------

        default:
            // search min / max values in table

            for (let i = 0; i < iRows; i++) {
                iCols = oTbody.rows[i].cells.length
                for (let j = 0; j < iCols; j++) {

                    val = parseFloat(oTbody.rows[i].cells[j].innerText);
                    if (val > max) {
                        max = val;
                        max_i = i;
                        max_col = j;
                    }
                    if (val < min) {
                        min = val;
                        min_i = i;
                        min_col = j;
                    }
                }
            }
            min_c = oTbody.rows[min_i].cells[min_col];
            max_c = oTbody.rows[max_i].cells[max_col];
            mark(min_c,max_c,settings)
    }

    // -------------------------------------------------------------------------
    function mark(min_c,max_c,settings) {
    	// invert min / max colors
		if (settings.invert === true) {
			[min_c, max_c] = [max_c, min_c];
		}

		// set classes to cell / span
		if (settings.colorize === 'span') {

			min_c.innerHTML = '<span class="' + settings.css.min + '">' + min_c.innerHTML + '</span>';
			max_c.innerHTML = '<span class="' + settings.css.max + '">' + max_c.innerHTML + '</span>';

		}
		else {

			min_c.className += settings.css.min;
			max_c.className += settings.css.max;
		}

		//--------------------------------------------------------------------------
		if (settings.text.autocontrast === true) {
				setColor(min_c, settings.css.min, settings.text.threshold)
				setColor(max_c, settings.css.max, settings.text.threshold)
		}
	};

	function setColor(oObj, minMax, threshold) {
		color = window.getComputedStyle(document.querySelector(String2Classes(minMax))).getPropertyValue("background-color")

		oObj.style.color = getCorrectTextColor(color, threshold, settings.text.light, settings.text.dark )
	}

	function getCorrectTextColor(rgba,th=130,light,dark){
		aC =  rgba.match(/[0-9.]+/gi)
		if (aC.length < 3) return '#000'

		// https://www.w3.org/TR/AERT/#color-contrast
		cB = ((aC[0] * 299) + (aC[1] * 587) + (aC[2] * 114)) / 1000;
		return (cB > th ? dark : light)
	}

    // converts the css-classes from html to a selector for "querySelector"
    function String2Classes(string) {
		const classes = string.split(' ')
		return '.' + classes.join('.')
	}

	function extend(target, source) {
		target = target || {};
		for (var prop in source) {
			if (typeof source[prop] === 'object') {
				target[prop] = extend(target[prop], source[prop]);
			}
			else {
				target[prop] = source[prop];
			}
		}
		return target;
	}

    return [min, max]
};
