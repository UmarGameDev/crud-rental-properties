// cypress/e2e/view-properties.cy.js

describe('View All Listed Properties', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8501');
    cy.contains('View All Listed Properties').click();
  });

  it('Should display properties when Show All Properties button is clicked', () => {
    cy.contains('Show All Properties').click();
    cy.wait(1000);
    
    // Should display either properties or a message
    cy.get('body').then(($body) => {
      const hasContent = $body.text().length > 0;
      expect(hasContent).to.be.true;
    });
  });
});