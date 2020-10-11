# tableMinMax

## Übersicht
JavaScript that colors the min / max values of a HTML table.

JavaScript das die Minimum / Maximum Werte, einer HTML-Tabelle einfärbt.

____

![Ergebnis](/images/tableMinMax.png)

Im Beispiel: Spaltenweise Min/Max-Werte

### Features

- Werte in einzelner Spalte markieren
- Werte in einzelne Reihe markieren
- Werte der gesamten Tabelle markieren
- Zelle komplett oder SPAN (mit Werten)  markieren
- Übergabe von CSS-Klassen
- Übergabe der Parameter (teilweise) per DATA-Attribut.

___

## Voraussetzungen

Die zu berabeitende Tabelle, braucht einen tbody-Tag.

Wird die Tabelle per Script aufgebaut, muß diese vollständig sein, bevor die Funktion gestartet wird.

## Anleitung

CSS:
``` CSS
.mSpan { display: inline-block; padding: .1em; min-width: 4em; border-radius: .3em; }
.minS { background-color: #DF0101; color: white; }
.maxS { background-color: #01DFA4; color: black; }
```

Aufruf per DATA-
``` html
<table
  data-search-mode="col"
  data-search-nr="1"
  data-min-css="minS mSpan"
  data-mxn-css="maxS mSpan"
  >
  <thead>
    <tr>
      <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th>
    </tr>
  </thead>
  <tbody>
     <tr>
      <td>3435</td>-345<td>234</td>2344<td>567</td>3<td>87</td><td>234</td><td>432</td>
    </tr>
  </tbody>
</table>
```
``` JavaScript
 tableMinMax();
```
____

Aufruf über Optionen:
``` html
<table>
  <thead>
    <tr>
      <th>1</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>3</td></tr>
    <tr><td>456</td></tr>
    <tr><td>3</td></tr>
    <tr><td>-456</td></tr>
    <tr><td>34</td></tr>
    <tr><td>23</td></tr>
  </tbody>
</table>
```
``` JavaScript
tableMinMax({
  "id": "table",
  "search": {
    "mode": "row",
    "nr": "1"
  },
  "css": {
    "min": "minS mSpan",
    "max": "maxS mSpan"
  },
  "colorize": "span"
});
```
> 
> Optionen über Data-Attribut überschreiben die Parameter beim Funktionsaufruf.
>

## ToDo

- [x] Abhängkeit von jQuery entfernen
- [ ] Parameter überprüfen
- [ ] Mehrere Spalten / Reiehen gleichzeitig übergeben
- [ ] gleiche Werte ebenfalls markieren
 ___

## Author
Thorsten Willert

[Homepage](https://www.thorsten-willert.de/)

## Lizenz
Das ganze steht unter der [MIT](https://github.com/THWillert/tableMinMax/blob/master/LICENSE) Lizenz.


