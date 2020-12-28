import { LitElement, html } from "lit-element";
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { BoardLayerStyles } from "./board-layer-style";

/**
 * `board-layer`
 * BoardLayer
 *
 * @customElement board-layer
 * @litElement
 * @demo demo/index.html
 */

export class BoardLayer extends LitElement {
  static get is() {
    return "board-layer";
  }

  static get properties() {
    return {
      /**
       * Element identifier
       * @property
       * @type { String }
       */
      id: { type: String },
      /**
       * Number of rows of the layer
       * @property
       * @type { Number }
       */
      rows: { type: Number },
      /**
       * Number of cols of the layer
       * @property
       * @type { Number }
       */
      cols: { type: Number },
      /**
       * Width of the layer
       * @property
       * @type { String }
       */
      width: { type: String },
      /**
       * Height of the layer
       * @property
       * @type { String }
       */
      height: { type: String },
      /**
       * Select if paint border cell
       * @property
       * @type { Boolean }
       */
      borderCell: { type: Boolean, attribute: 'border-cell' },
      /**
       * When 'log' is true show component log
       * @property
       * @type { Boolean }
       */
      log: { type: Boolean }
    };
  }

  static get styles() {
    return [BoardLayerStyles];
  }

  constructor() {
    super();
    this.id = 'board-layer' + new Date().getDate();
    this.rows = 10;
    this.cols = 10;
    this.width = '500px';
    this.height = '500px';
    this.cells = null;
    this.childrenNodes = [];
    this.borderCell = true;

    this.modifyCellCallback = this.modifyCellCallback.bind(this);
  }  

  connectedCallback() {
    super.connectedCallback();
    this.cells = [...Array(this.rows)].map(() => Array(this.cols).fill(''));
    this.addEventListener('DOMSubtreeModified', this.getLightDomChildrenNodes);
    document.addEventListener('modify-cell-content', this.modifyCellCallback);
  }

  updated(changed) {
    super.updated(changed);
    this.getLightDomChildrenNodes();
  }

  consoleLog() {
    if (this.log) {
      console.log.apply(this, arguments);
    }
  }

  insertCellValue(x, y, cellValue) {
    const cell = this.shadowRoot.querySelector(`[data-col="${x}"][data-row="${y}"]`);
    if (typeof cellValue === 'object') {
      cell.innerHTML = '';
      cell.appendChild(cellValue);
    } else {
      cell.innerHTML = cellValue;
    }
  }

  getLightDomChildrenNodes() {
    this.childrenNodes = [...this.querySelectorAll('[data-col][data-row]')];
    this.childrenNodes.forEach((childNode) => {
      const childClone = childNode.cloneNode(true);
      this.insertCellValue(childNode.dataset.col, childNode.dataset.row, childClone);
    });
  }

  insertLightDomCells() {
    this.innerHTML = '';
    this.cells.forEach((row, y) => {
      row.map((col, x) => {
        if (this.cells[x][y] !== '') {
          const div = document.createElement('div');
          div.dataset.col = x + 1;
          div.dataset.row = y + 1;
          div.innerHTML = this.cells[x][y];
          this.appendChild(div);
        }
      });
    });
  }

  modifyCellCallback(ev) {
    const payload = ev.detail;
    const id = payload.id;
    if (this.id === id) {
      let {content = 'X', posX, posY, size = 1, orientation = 'horizontal', command = 'insertElement'} = {...payload};
      if (posX && posY && posX>0 && posX<=this.cols && posY>0 && posY<=this.rows) {
        posX = parseInt(posX) - 1;
        posY = parseInt(posY) - 1;
        if (orientation === 'vertical') {
          if ((content.length == size && size <= this.rows) || command === 'deleteElement') {
            for(let counter = 0; counter < size; counter++) {
              this.cells[posX][posY + counter] = (command === 'deleteElement') ? '' : content[counter];
              if (command === 'deleteElement') {
                this.insertCellValue(posX + 1, posY + 1 + counter, '');
              }
            }
            this.insertLightDomCells();
          } else {
            console.warn('size and content length is not equal');
          }
        } else {
          if ((content.length == size && size <= this.cols) || command === 'deleteElement') {
            for(let counter = 0; counter < size; counter++) {
              this.cells[posX + counter][posY] = (command === 'deleteElement') ? '' : content[counter];              
              if (command === 'deleteElement') {
                this.insertCellValue(posX + 1 + counter, posY + 1, '');
              }
            }
            this.insertLightDomCells();
          } else {
            console.warn('size and content length is not equal');
          }
        }
      }
    }
  }

  render() {
    return html`
      <div style="${styleMap({
        'gridTemplateColumns': 'repeat(' + this.cols + ',' + 100/this.cols + '%)', 
        'gridTemplateRows': 'repeat(' + this.rows + ',' + 100/this.rows + '%)',
        'width': this.width, 
        'height': this.height, 
      })}" class="board-layer">
        ${this.cells.map((row, x) => {
          return row.map((cellContent, y) => {
            const Y = y + 1; // JS Array start in 0.
            const X = (true) ? this.cols - x : x + 1;
            return html`<div class="${classMap({bordercell:this.borderCell})}" data-col="${Y}" data-row="${X}" title="${X},${Y}"></div>`;
          });
        })}
      </div>
    `;
  }
};
