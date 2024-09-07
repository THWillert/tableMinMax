# tableMinMax

## Deutsch

Die Funktion `tableMinMax` ermöglicht das Markieren von Zellen mit den minimalen und maximalen Werten in einer Tabelle. Sie können die Darstellung und das Verhalten der Markierung über verschiedene Parameter konfigurieren.

____

![Ergebnis](https://www.thorsten-willert.de/images/Software/JavaScript/Thorsten_H_Willert_-_JavaScript_tableMinMax_Beispiel-Tabelle.png)

### Features

- Werte in einzelner Spalte markieren
- Werte in einzelne Reihe markieren
- Werte der gesamten Tabelle markieren
- Mehrere Spalten oder Zeilen gleichzeitig markieren
- Zelle komplett oder SPAN (mit Werten)  markieren
- Übergabe von CSS-Klassen
- Übergabe der Parameter (teilweise) per DATA-Attribut.
- Rückgabe der Min/Max Werte als Array.
- Die Text-Farbe (schwarz/weis) wird automatisch an die Hintergrund-Farbe angepaßt.

___

## Voraussetzungen

Das Script muss am Ende der Seite aufgerufen werden, oder z. B. bei Verwendung von **jQuery** innerhalb von
``` JavaScript
$(document).ready(function() {
});
```

Wird die Tabelle per Script aufgebaut, muß diese vollständig sein, bevor die Funktion gestartet wird.

Z. B. Aufruf in **Datatables** im Callback "initComplete".

## Beispiele

CSS:
``` CSS
.mSpan { display: inline-block; padding: .1em; min-width: 4em; border-radius: .3em; }
.min { background-color: #DF0101; color: white; }
.max { background-color: #01DFA4; color: black; }
```

Aufruf per DATA-
``` html
 <table id="example1"
    data-search-mode="all"
    data-css-min="min mSpan"
    data-css-max="max mSpan">
        <thead>
            <tr>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>3435</td>
                <td>234</td>
                <td>567</td>
                <td>87</td>
                <td>234</td>
                <td>432</td>
            </tr>
...
```
``` JavaScript
tableMinMax({
  "table": "#example1"
});
```
____

Aufruf über Optionen:
``` html
<table id="example2">
        <thead>
            <tr>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>35</td>
                <td>234</td>
                <td>567</td>
                <td>87</td>
                <td>234</td>
                <td>432</td>
            </tr>
...
```
``` JavaScript
tableMinMax({
  "table": "#example2",
    "css": {
      "min": "minT",
      "max": "maxT"
    },
  "colorize": "cell"
});
```
> 
> Optionen über Data-Attribut überschreiben die Parameter beim Funktionsaufruf.

### Parameter

- **`table`**: CSS-Selektor für die Ziel-Tabelle. Standardmäßig `'table'`.
- **`search.mode`**: Modus der Suche, entweder `'all'` (alle Zellen in der Tabelle), `'row'` (nur Zeilen) oder `'col'` (nur Spalten). Standardmäßig `'all'`.
- **`search.nr`**: Array von Zeilen- oder Spaltennummern, die durchsucht werden sollen. Standardmäßig `[1]`.
- **`search.grouped`**: Ob Min/Max-Werte über alle ausgewählten Zeilen/Spalten aggregiert werden sollen. Standardmäßig `false`.
- **`css.mode`**: Modus zum Anwenden von CSS, entweder `'style'` oder `'class'`. Standardmäßig `'style'`.
- **`css.max`**: CSS-Klasse oder Stil für das maximale Element. Standardmäßig leer.
- **`css.min`**: CSS-Klasse oder Stil für das minimale Element. Standardmäßig leer.
- **`text.autocontrast`**: Ob die Textfarbe automatisch an den Hintergrund angepasst werden soll. Standardmäßig `true`.
- **`text.threshold`**: Kontrastschwelle für die Textfarbe. Standardmäßig `130`.
- **`text.light`**: Helle Textfarbe. Standardmäßig `'#fff'`.
- **`text.dark`**: Dunkle Textfarbe. Standardmäßig `'#000'`.
- **`colorize`**: Wie CSS angewendet wird, entweder `'span'` (über span-Elemente) oder `'cell'` (direkt auf die Zellen). Standardmäßig `'span'`.
- **`mode`**: Modus zum Markieren von Min/Max, entweder `'single'` (einzelne Markierung) oder `'multi'` (mehrere Markierungen). Standardmäßig `'single'`.
- **`invert`**: Ob Min- und Max-Klassen vertauscht werden sollen. Standardmäßig `false`.

### Beispiel

```javascript
tableMinMax({
    table: '#myTable',
    search: {
        mode: 'col',
        nr: [0, 1],
        grouped: true
    },
    css: {
        mode: 'class',
        max: 'highlight-max',
        min: 'highlight-min'
    },
    text: {
        autocontrast: true,
        threshold: 140,
        light: '#fff',
        dark: '#000'
    },
    colorize: 'cell',
    mode: 'multi',
    invert: false
});
```
___

## tableMinMax Guide

The `tableMinMax` function allows you to highlight cells with minimum and maximum values in a table. You can configure the appearance and behavior of the highlighting through various parameters.

### Parameters

- **`table`**: CSS selector for the target table. Default is `'table'`.
- **`search.mode`**: Search mode, either `'all'` (all cells in the table), `'row'` (only rows), or `'col'` (only columns). Default is `'all'`.
- **`search.nr`**: Array of row or column numbers to search in. Default is `[1]`.
- **`search.grouped`**: Whether to aggregate min/max values across all selected rows/columns. Default is `false`.
- **`css.mode`**: Mode of applying CSS, either `'style'` or `'class'`. Default is `'style'`.
- **`css.max`**: CSS class or style for the maximum value. Default is empty.
- **`css.min`**: CSS class or style for the minimum value. Default is empty.
- **`text.autocontrast`**: Whether to automatically adjust the text color based on contrast. Default is `true`.
- **`text.threshold`**: Contrast threshold for text color. Default is `130`.
- **`text.light`**: Light text color. Default is `'#fff'`.
- **`text.dark`**: Dark text color. Default is `'#000'`.
- **`colorize`**: How CSS is applied, either `'span'` (through span elements) or `'cell'` (directly on the cells). Default is `'span'`.
- **`mode`**: Mode for marking min/max, either `'single'` (single marking) or `'multi'` (multiple markings). Default is `'single'`.
- **`invert`**: Whether to swap min and max CSS classes. Default is `false`.

### Example

```javascript
tableMinMax({
    table: '#myTable',
    search: {
        mode: 'col',
        nr: [0, 1],
        grouped: true
    },
    css: {
        mode: 'class',
        max: 'highlight-max',
        min: 'highlight-min'
    },
    text: {
        autocontrast: true,
        threshold: 140,
        light: '#fff',
        dark: '#000'
    },
    colorize: 'cell',
    mode: 'multi',
    invert: false
});
```
___

## ToDo

- [x] Abhängkeit von jQuery entfernen
- [x] Mehrere Spalten / Reihen gleichzeitig übergeben
- [x] Abhängigkeit von color2k entfernen
- [X] gleiche Werte ebenfalls markieren
- [ ] Werte unterhalb und / oder über Grenzwerten markieren
- [ ] Alle Parameter überprüfen
 ___

## Author
Thorsten Willert

[Homepage](https://www.thorsten-willert.de/software/javascript/tableminmax)

## Lizenz
Das ganze steht unter der [MIT](https://github.com/THWillert/tableMinMax/blob/master/LICENSE) Lizenz.


