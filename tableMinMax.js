// (c) 2020 Thorsten Willert
// V1.1
// This code is licensed under MIT license

tableMinMax = function(oOptions) {
/*
	Sets css-classes to the min/max-values in a table, row or column.
--------------------------------------------------------------------------------

	V1.1
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
		nr:
			row / col number: 0-x

	(mode - ToDo
		single: minimum / maxium values are marked
		multi: all values with the same min / max are marked)

	css
		max: class(es) for maximum value  (data-min-css)
		min: class(es) for minimum value  (data-max-css)

	colorize [span]
		cell: css added to the cell
		span: css added to a span with the current value inside + id for the span

	invert:
		true: min / max classes are swaped

	*/

	let settings = extend({
        table: 'table',
        search: {
            mode: 'col',
            nr: 1
        },
        css: {
            max: '',
            min: ''
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
        max_c = null,
	val = 0

     // simple parameter-check =================================================
    try{
    	settings.search.nr = settings.search.nr - 1;

    	oTable = document.querySelector(settings.table)
    	if (oTable === null) {
    		console.log( 'tableMinMax: table not found: ' +  settings.table)
    		return [-1,-1]
    	}

    	oTbody = document.querySelector(settings.table + ' tbody')
    	iRows = oTbody.rows.length;

    } catch (e) {
    	console.error(e);
    	return [-1,-1]
    }

    // data ====================================================================

    if (oTable.hasAttribute("data-search-mode"))
        settings.search.mode = oTable.getAttribute("data-search-mode");
    if (oTable.hasAttribute("data-search-nr"))
        settings.search.nr = oTable.getAttribute("data-search-nr");
    if (oTable.hasAttribute("data-css-min"))
        settings.css.min = oTable.getAttribute("data-css-min");
    if (oTable.hasAttribute("data-css-max"))
        settings.css.max = oTable.getAttribute("data-css-max");
    if (oTable.hasAttribute("data-colorize"))
        settings.css.max = oTable.getAttribute("data-colorize");

    // search min / max ========================================================
    switch (settings.search.mode.toString()) {
        // ---------------------------------------------------------------------
        case 'col':

            // search min / max values in column
            for (let i = 0; i < iRows; i++) {

                val = parseFloat(oTbody.rows[i].cells[settings.search.nr].innerText);

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
            min_c = oTbody.rows[min_i].cells[settings.search.nr];
            max_c = oTbody.rows[max_i].cells[settings.search.nr];

            break;
            // ---------------------------------------------------------------------
        case 'row':
            iCols = oTbody.rows[settings.search.nr].cells.length

            // search min / max values in row
            for (let i = 0; i < iCols; i++) {

                val = parseFloat(oTbody.rows[settings.search.nr].cells[i].innerText);

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
            min_c = oTbody.rows[settings.search.nr].cells[min_i];
            max_c = oTbody.rows[settings.search.nr].cells[max_i];

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
    }

    // -------------------------------------------------------------------------
    // invert min / max colors
    if (settings.invert === true) {
        [min_c, max_c] = [max_c, min_c];
    }

    // set classes to cell / span
    if (settings.colorize === 'cell') {

    	min_c.className += settings.css.min;
        max_c.className += settings.css.max;

    } else {

        min_c.innerHTML = '<span class="' + settings.css.min + '">' + min_c.innerHTML + '</span>';
        max_c.innerHTML = '<span class="' + settings.css.max + '">' + max_c.innerHTML + '</span>';
    }
    //--------------------------------------------------------------------------

    return [min, max]
};

//##############################################################################
function extend(target, source) {
    target = target || {};
    for (var prop in source) {
        if (typeof source[prop] === 'object') {
            target[prop] = extend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
}
