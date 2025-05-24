// explicable-ui/cypress/e2e/login-flow.cy.js

describe("Login Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays login button without triggering real auth", () => {
    cy.contains("Create Account or Log In")
      .should("exist")
      .then(($btn) => {
        // Prevent redirect by stubbing window.location.assign
        cy.stub($btn[0].ownerDocument.defaultView, "location", {
          assign: cy.stub().as("locationAssign")
        });
      })
      .click();

    cy.get("@locationAssign").should("have.been.called");
  });
});
