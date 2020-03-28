beforeEach(() => {
  cy.visit("/docs/examples/single-select");
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

it("focuses options on mouse hover", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").click({ force: true });
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(0, 0, 255)",
  );

  cy.queryByText("Option 2").trigger("mousemove");
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(30, 144, 255)",
  );

  // DOM focus unchanged
  cy.queryByLabelText("Single select example").should("be.focused");

  cy.queryByText("Option 1").trigger("mousemove");
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(0, 0, 255)",
  );
});

it("focuses options on arrow key press", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").click({ force: true });
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(0, 0, 255)",
  );

  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").type("{downarrow}", {
    force: true,
  });
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(30, 144, 255)",
  );

  // DOM focus unchanged
  cy.queryByLabelText("Single select example").should("be.focused");

  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").type("{uparrow}", {
    force: true,
  });
  cy.queryByText("Option 1").trigger("mousemove");
  cy.queryByText("Option 2").should(
    "have.css",
    "backgroundColor",
    "rgb(0, 0, 255)",
  );
});

it("selects an option on click", () => {
  cy.queryByText("Pick an option").click();
  cy.queryByText("Option 2").click();
  cy.queryByText("Pick an option").should("not.exist");
  cy.queryByText("Option 2").should("exist");
});

it("selects an option on keypress", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").type("o", { force: true });
  cy.queryByText("Option 2").should("exist");
});

it("filters options based on input", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").type("option 1", {
    force: true,
  });
  cy.queryByText("Option 1").should("exist");
  cy.queryByText("Option 10").should("exist");
  cy.queryAllByText(/^Option 2/).should("not.exist");
});

it("closes the menu on selection", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").click({ force: true });
  cy.queryByText("Option 1").should("exist");
  cy.queryByText("Option 2").click();
  cy.queryByText("Option 1").should("not.exist");

  // Test that the menu is closed if the same option is picked again
  cy.queryByLabelText("Single select example").click({ force: true });
  cy.queryByText("Option 1").should("exist");
  cy.queryByText("Option 1")
    .then($el => cy.wrap($el.parent()).queryByText("Option 2"))
    .then($el => $el.click());
  /* cy.queryAllByText("Option 2").click(); */
  cy.queryByText("Option 1").should("not.exist");
});

it("closes the menu on loss of focus", () => {
  cy.queryByText("Pick an option").click();
  cy.queryByText("Option 1").should("exist");
  cy.wrap(document.body).click({ force: true });
  cy.queryByText("Option 1").should("not.exist");
});

it("clears input on close", () => {
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").type("Optio", { force: true });
  cy.queryByText("Optio").should("exist");
  cy.wrap(document.body).click({ force: true });
  cy.queryByText("Optio").should("not.exist");
});

it("closes the menu on escape press", () => {
  cy.queryByText("Pick an option").click();
  cy.queryByText("Option 1").should("exist");
  cy.queryByLabelText("Single select example").type("{esc}", {
    force: true,
  });
  cy.queryByText("Option 1").should("not.exist");
});

it("clears the selected value on backspace", () => {
  cy.queryByText("Pick an option").click();
  cy.queryByText("Option 2").click();
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").type("{backspace}", {
    force: true,
  });
  cy.queryByText("Option 2").should("not.exist");
});

it("doesn't interrupt backspace when text is entered", () => {
  cy.queryByText("Pick an option").click();
  cy.queryByText("Option 2").click();
  // TODO fix this force, Cypress thinks the placeholder is covering it
  cy.queryByLabelText("Single select example").type("ABC{backspace}", {
    force: true,
  });
  cy.queryByText("AB").should("exist");
});
