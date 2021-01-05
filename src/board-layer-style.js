import { css } from 'lit-element';

export const BoardLayerStyles = css`
  :host {
    display: block;
    margin: 1rem;
    --default-main-color: #ff7900;
    --default-cell-bg-color: #fff;
    --default-cell-border-color: #CCC;
  }
  .board-layer {
    background-color: inherit;
    color: var(--main-color, var(--default-main-color));
    display:grid;
    /* direction: rtl; */
    grid-gap: 0;
    border:2px solid black;
  }

  .board-layer div {
    display:flex;
    align-items: center;
    justify-content: center;
    background-color: var(--cell-bg-color, var(--default-cell-bg-color));
  }

  .board-layer div * {
    border:0;
  }

  .board-layer div.bordercell {
    border: 1px solid var(--cell-border-color, var(--default-cell-border-color));
  }
`;
