// cypress/e2e/login-flow.cy.js

describe('Login Flow', () => {
  it('displays login button on landing page', () => {
    cy.visit('/');
    cy.contains('Create Account or Log In').should('exist');
  });
});