// (c) 2020 Thorsten Willert
// V0.8
// This code is licensed under MIT license

tableMinMax = function(oOptions) {

    /*
	 Options:
	 [default]
	 (data-attribute) overrides options

	 -------------------------

	id [table]
		id for the created spans
		id e.g. = "ID-" + id + "-max" + cell-number;

	table [table]
		table objekt, name, class, id ...

	search (data-search-mode)
		mode [all]
			all: the complete table
			row: single-row number
			col: single-column number
		nr:
			row / col number: 0-x

	mode - not working now
		single: minimum / maxium values are marked
		multi: all values with the same min / max are marked

	css
		max: class(es) for maximum value  (data-min-css)
		min: class(es) for minimum value  (data-max-css)

	colorize [span]
		cell: css added to the cell
		span: css added to a span with the current value inside + id for span are added

	invert:
		true: min / max classes are swaped

	*/

    var settings = $.extend({
        parse: function(e) {
            return parseFloat(e.html());
        },
        id: 'table',
        table: 'table',
        search: {
            mode: 'column',
            nr: 0
        },
        css: {
            max: 'table_max',
            min: 'table_min'
        },
        colorize: 'span',
        mode: 'single',
        invert: false
    }, oOptions);

    let oBTable = document.querySelector(settings.table)
    // data
    if (oBTable.hasAttribute("data-search-mode"))
        settings.search.mode = document.querySelector(settings.table).getAttribute("data-search-mode");
    if (oBTable.hasAttribute("data-min-css"))
        settings.css.min = document.querySelector(settings.table).getAttribute("data-min-css");
    if (oBTable.hasAttribute("data-max-css"))
        settings.css.max = document.querySelector(settings.table).getAttribute("data-max-css");

    // -------------------------------------------------------------------------
    let min = Number.MAX_VALUE,
        max = Number.MIN_VALUE,
        min_i = 0,
        max_i = 0,
        min_col = 0,
        max_col = 0

    let oTable = document.querySelector(settings.table + ' tbody')

    switch (settings.search.mode.toString()) {
        // ---------------------------------------------------------------------
        case 'col':
            // search min / max values in column
            $(settings.table).find('td:nth-child(' + settings.search.nr + ')').each(function(index, td) {

                let val = parseFloat($(td).text());

                if (val > max) {
                    max = val;
                    max_i = index;
                }
                if (val < min) {
                    min = val;
                    min_i = index;
                }
            });

            // cells
            min_c = oTable.rows[min_i].cells[settings.search.nr - 1];
            max_c = oTable.rows[max_i].cells[settings.search.nr - 1];

            break;
            // ---------------------------------------------------------------------
        case 'row':
            // search min / max values in row
            $(settings.table + ` tbody tr:nth-child( ${settings.search.nr} )`).each(function() {
                $(this).find('td').each(function(index, td) {

                    let val = parseFloat($(td).text());

                    if (val > max) {
                        max = val;
                        max_i = index;
                    }
                    if (val < min) {
                        min = val;
                        min_i = index;
                    }
                });
            });

            // cells
            min_c = oTable.rows[settings.search.nr - 1].cells[min_i];
            max_c = oTable.rows[settings.search.nr - 1].cells[max_i];

            break;
            // ---------------------------------------------------------------------
        default:
            // search min / max values in table
            let rows = oTable.rows.length
            let cols = 0;

            for (let i = 0; i < rows; i++) {
                cols = oTable.rows[i].cells.length
                for (let j = 0; j < cols; j++) {

                    val = parseFloat(oTable.rows[i].cells[j].innerHTML);
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
            min_c = oTable.rows[min_i].cells[min_col];
            max_c = oTable.rows[max_i].cells[max_col];
    }

    // -------------------------------------------------------------------------
    if (settings.invert === true) {
        [min_c, max_c] = [max_c, min_c];
    }

    // set classes to cell / span
    if (settings.colorize === 'cell') {
        min_c.className += settings.css.min;
        max_c.className += settings.css.max;
    } else {
        let id = 'ID-' + settings.id + '-min' + min_i;
        min_c.innerHTML = `<span id="${id}">` + min_c.innerHTML + '</span>'
        document.getElementById(id).className += settings.css.min;

        id = 'ID-' + settings.id + '-max' + max_i;
        max_c.innerHTML = `<span id="${id}">` + max_c.innerHTML + '</span>'
        document.getElementById(id).className += settings.css.max;
    }
};