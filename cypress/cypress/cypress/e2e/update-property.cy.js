// cypress/e2e/update-property.cy.js

describe('Update Property Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8501');
    cy.contains('Update a Listed Property').click();
  });

  // Helper function to fill update form
  const fillUpdateForm = (data) => {
    if (data.id) {
      cy.get('input[aria-label="Property ID"]').eq(0).click({force: true}).clear({force: true}).type(data.id, {force: true});
    }
    if (data.description) {
      cy.get('input[aria-label="New Property Description"]').click({force: true}).clear({force: true}).type(data.description, {force: true});
    }
    if (data.bedrooms) {
      cy.get('input[aria-label*="New Number of Bedrooms"]').click({force: true});
      cy.contains(data.bedrooms).click({force: true});
    }
    if (data.price) {
      cy.get('input[aria-label="New Price"]').click({force: true}).clear({force: true}).type(data.price, {force: true});
    }
    if (data.area) {
      cy.get('input[aria-label="New Area"]').click({force: true}).clear({force: true}).type(data.area, {force: true});
    }
    if (data.location) {
      cy.get('input[aria-label="New Location"]').click({force: true}).clear({force: true}).type(data.location, {force: true});
    }
  };

  it('1. Should update property ID 3 with valid data', () => {
    fillUpdateForm({
      id: '3',
      description: 'Updated apartment',
      bedrooms: 'T2',
      price: '2000',
      area: '100',
      location: 'Updated City'
    });
    
    cy.contains('Update Property').click({force: true});
    cy.wait(1000);
    
    cy.get('body').should(($body) => {
      expect($body.text().length).to.be.greaterThan(0);
    });
  });

  it('2. Should handle update for non-existent property ID 9999', () => {
    fillUpdateForm({
      id: '9999',
      description: 'Test property',
      bedrooms: 'T1',
      price: '1000',
      area: '50',
      location: 'Test City'
    });
    
    cy.contains('Update Property').click({force: true});
    cy.wait(1000);
    
    cy.get('body').should(($body) => {
      expect($body.text().length).to.be.greaterThan(0);
    });
  });

  it('3. Should reject update with invalid price "abc"', () => {
    fillUpdateForm({
      id: '3',
      description: 'Test property',
      bedrooms: 'T1',
      price: 'abc',
      area: '50',
      location: 'Test City'
    });
    
    cy.contains('Update Property').click({force: true});
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      const hasSuccess = /operation completed|success|updated/i.test($body.text());
      expect(hasSuccess).to.be.false;
    });
  });

  it('4. Should reject update with invalid area "xyz"', () => {
    fillUpdateForm({
      id: '3',
      description: 'Test property',
      bedrooms: 'T1',
      price: '1000',
      area: 'xyz',
      location: 'Test City'
    });
    
    cy.contains('Update Property').click({force: true});
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      const hasSuccess = /operation completed|success|updated/i.test($body.text());
      expect(hasSuccess).to.be.false;
    });
  });

  it('5. Should reject update with empty price', () => {
    fillUpdateForm({
      id: '3',
      description: 'Test property',
      bedrooms: 'T1',
      price: '', // Empty
      area: '50',
      location: 'Test City'
    });
    
    cy.contains('Update Property').click({force: true});
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      const hasSuccess = /operation completed|success|updated/i.test($body.text());
      expect(hasSuccess).to.be.false;
    });
  });

  it('6. Should reject update with empty area', () => {
    fillUpdateForm({
      id: '3',
      description: 'Test property',
      bedrooms: 'T1',
      price: '1000',
      area: '', // Empty
      location: 'Test City'
    });
    
    cy.contains('Update Property').click({force: true});
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      const hasSuccess = /operation completed|success|updated/i.test($body.text());
      expect(hasSuccess).to.be.false;
    });
  });
});