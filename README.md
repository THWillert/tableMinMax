# tableMinMax

## Übersicht
JavaScript that colors the min / max values of a HTML table.

JavaScript das die Minimum / Maximum Werte, einer HTML-Tabelle einfärbt.

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
>

## ToDo

- [x] Abhängkeit von jQuery entfernen
- [x] Mehrere Spalten / Reihen gleichzeitig übergeben
- [x] Abhängigkeit von color2k entfernen 
- [ ] Werte unterhalb und / oder über Grenzwerten markieren
- [ ] Alle Parameter überprüfen
- [ ] gleiche Werte ebenfalls markieren
 ___

## Author
Thorsten Willert

[Homepage](https://www.thorsten-willert.de/software/javascript/tableminmax)

## Lizenz
Das ganze steht unter der [MIT](https://github.com/THWillert/tableMinMax/blob/master/LICENSE) Lizenz.


