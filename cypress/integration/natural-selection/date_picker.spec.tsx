beforeEach(() => {
  cy.visit("/date-picker");
});

it("opens the picker on click", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByText("February").should("exist");
  cy.queryByText("2020").should("exist");
});
