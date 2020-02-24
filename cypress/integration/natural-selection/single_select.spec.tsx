it("works", () => {
  cy.visit("/single-select");
  cy.queryAllByText("YOOOoO").should("exist");
});
