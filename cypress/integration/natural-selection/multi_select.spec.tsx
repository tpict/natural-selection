beforeEach(() => {
  cy.visit("/multi-select");
});

it("opens the menu on click", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Multi select example").click({ force: true });
  cy.queryByText("Option 1").should("exist");
});

it("opens the menu on space press", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Multi select example").type(" ", { force: true });
  cy.queryByText("Option 1").should("exist");
});

it("focuses options on mouse hover", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Multi select example").click({ force: true });
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(0, 0, 255)",
  );

  cy.queryByText("Option 2").trigger("mouseover");
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(30, 144, 255)",
  );

  // DOM focus unchanged
  cy.queryByLabelText("Multi select example").should("be.focused");

  cy.queryByText("Option 1").trigger("mouseover");
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(0, 0, 255)",
  );
});

it("focuses options on arrow key press", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Multi select example").click({ force: true });
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(0, 0, 255)",
  );

  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Multi select example").type("{downarrow}", {
    force: true,
  });
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(30, 144, 255)",
  );

  // DOM focus unchanged
  cy.queryByLabelText("Multi select example").should("be.focused");

  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Multi select example").type("{uparrow}", {
    force: true,
  });
  cy.queryByText("Option 1").trigger("mouseover");
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(0, 0, 255)",
  );
});

it("selects options on click", () => {
  cy.queryByText("Select multiple options").click();
  cy.queryByText("Option 2").click();
  cy.queryByText("Option 3").click();
  cy.queryByText("Select multiple options").should("not.exist");
  cy.queryByText(/^Option 2, Option 3/).should("exist");
});

it("selects an option on keypress", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Multi select example").type("o", { force: true });
  cy.queryByText("Option 2").should("exist");
});

it("filters options based on input", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Multi select example").type("option 1", {
    force: true,
  });
  cy.queryByText("Option 1").should("exist");
  cy.queryByText("Option 10").should("exist");
  cy.queryAllByText(/^Option 2/).should("not.exist");
});

it("does not close the menu on selection", () => {
  cy.queryByText("Select multiple options").click();
  cy.queryByText("Option 2").click();
  cy.queryByText("Option 1").should("exist");
});

it("closes the menu on loss of focus", () => {
  cy.queryByText("Select multiple options").click();
  cy.queryByText("Option 1").should("exist");
  cy.wrap(document.body).click({ force: true });
  cy.queryByText("Option 1").should("not.exist");
});
