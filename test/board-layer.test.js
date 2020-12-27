/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import { html, fixture, expect } from "@open-wc/testing";
import "../board-layer";

describe("BoardLayer", () => {
  it("should have the basic template", async () => {
    const el = await fixture(
      html`
        <board-layer></board-layer>
      `
    );
    const base = el.shadowRoot.querySelector(".board-layer");

    expect(base).not.to.be.null;
    expect(el).dom.to.equalSnapshot();
  });
});
