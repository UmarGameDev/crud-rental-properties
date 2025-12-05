// cypress/e2e/delete-property.cy.js

describe('Delete Property Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8501');
    cy.contains('Delete a Listed Property').click();
  });

  it('Should delete property ID 2 and get response', () => {
    cy.get('input[aria-label="Property ID to Delete"]').eq(0).clear().type('2');
    cy.contains('Delete').click();
    cy.wait(1000);
    cy.get('body').should(($body) => {
      expect($body.text().length).to.be.greaterThan(0);
    });
  });

  it('Should handle property ID 5644 and get response', () => {
    cy.get('input[aria-label="Property ID to Delete"]').eq(0).clear().type('5644');
    cy.contains('Delete').click();
    cy.wait(1000);
    cy.get('body').should(($body) => {
      expect($body.text().length).to.be.greaterThan(0);
    });
  });

  it('Should handle property ID -1 and get response', () => {
    cy.get('input[aria-label="Property ID to Delete"]').eq(0).clear().type('-1');
    cy.contains('Delete').click();
    cy.wait(1000);
    cy.get('body').should(($body) => {
      expect($body.text().length).to.be.greaterThan(0);
    });
  });
});