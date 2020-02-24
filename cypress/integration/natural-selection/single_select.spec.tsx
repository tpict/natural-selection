beforeEach(() => {
  cy.visit("/single-select");
});

it("opens the menu on click", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").click({ force: true });
  cy.queryByText("Option 1").should("exist");
});

it("opens the menu on space press", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").type(" ", { force: true });
  cy.queryByText("Option 1").should("exist");
});

it("selects an option on click", () => {
  cy.queryByText("Pick an option").click();
  cy.queryByText("Option 2").click();
  cy.queryByText("Pick an option").should("not.exist");
  cy.queryByText("Option 2").should("exist");
});

it("selects an option on keypress", () => {
  cy.queryByText("Pick an option").click();
  cy.queryByText("Option 2").trigger("mouseover");
  cy.queryByLabelText("Single select example").type(" ", { force: true });
  cy.queryByText("Pick an option").should("not.exist");
  cy.queryByText("Option 2").should("exist");
});

it("closes the menu on selection", () => {
  cy.queryByText("Pick an option").click();
  cy.queryByText("Option 1").should("exist");
  cy.queryByText("Option 2").click();
  cy.queryByText("Option 1").should("not.exist");
});

it("closes the menu on loss of focus", () => {
  cy.queryAllByText("Pick an option").click();
  cy.queryAllByText("Option 1").should("exist");
  cy.wrap(document.body).click({ force: true });
  cy.queryAllByText("Option 1").should("not.exist");
});
