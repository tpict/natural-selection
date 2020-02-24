it("works", () => {
  cy.visit("/multi-select");
  cy.queryAllByText("Select multiple options").should("exist");
});
