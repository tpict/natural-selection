beforeEach(() => {
  cy.clock(new Date("2020-02-26").getTime());
  cy.visit("/docs/examples/date-picker");
});

it("opens/closes the picker on click", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByText("February").should("exist");
  cy.queryByText("2020").should("exist");
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByText("February").should("not.exist");
  cy.queryByText("2020").should("not.exist");
});

it("picks a day and closes on click", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByText("8").click();
  cy.queryByText("02/08/2020").should("exist");
  cy.queryByText("February").should("not.exist");
});

it("picks a day and closes on space", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByText("8").trigger("mousemove");
  cy.queryByLabelText("Date picker example").type(" ", { force: true });
  cy.queryByText("02/08/2020").should("exist");
  cy.queryByText("February").should("not.exist");
});

it("switches months on click", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByText("February").click();
  cy.queryByText("March").click();
  cy.queryByText("February").should("not.exist");
  cy.queryByText("March").should("exist");
});

it("switches years on click", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByText("2020").click();
  cy.queryByText("2021").click();
  cy.queryByText("2020").should("not.exist");
  cy.queryByText("2021").should("exist");
});

it("focuses options on text input", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByLabelText("Date picker example").type("august 18th 1994{enter}", {
    force: true,
  });
  cy.queryByText("08/18/1994").should("exist");
});

it("doesn't close on whitespace click", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").click({ force: true });
  cy.queryByTestId("datepicker-menu").click(15, 15);
  cy.queryByText("February").should("exist");
});

it("clears input on close", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Date picker example").type("Optio", { force: true });
  cy.queryByText("Optio").should("exist");
  cy.wrap(document.body).click({ force: true });
  cy.queryByText("Optio").should("not.exist");
});
