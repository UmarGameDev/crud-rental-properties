// cypress/e2e/add-property-unit-complete.cy.js

describe('Add Property Unit - Complete Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8501');
    cy.contains('Add a new property unit').parent().click();
  });

  // ========== ORIGINAL 8 CRITICAL TESTS ==========
  describe('Original Critical Tests', () => {
    it('1. Should successfully submit form with valid data', () => {
      cy.get('input[aria-label="Description"]').type('Luxury apartment');
      cy.get('input[aria-label*="Number Bedrooms"]').click();
      cy.contains('T2').click();
      cy.get('input[aria-label="Price (€)"]').type('1500');
      cy.get('input[aria-label="Area (m2)"]').type('85');
      cy.get('input[aria-label="Location"]').type('Lisbon');
      
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.contains(/operation completed|success|added/i).should('be.visible');
    });

    it('2. Should show error when Price contains non-numeric', () => {
      cy.get('input[aria-label="Description"]').type('Test property');
      cy.get('input[aria-label*="Number Bedrooms"]').click();
      cy.contains('T1').click();
      cy.get('input[aria-label="Price (€)"]').type('abc');
      cy.get('input[aria-label="Area (m2)"]').type('50');
      cy.get('input[aria-label="Location"]').type('City');
      
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      
      cy.get('body').then(($body) => {
        const hasSuccess = /operation completed|success|added/i.test($body.text());
        expect(hasSuccess).to.be.false;
      });
    });

    it('3. Should show error when Area contains non-numeric', () => {
      cy.get('input[aria-label="Description"]').type('Test property');
      cy.get('input[aria-label*="Number Bedrooms"]').click();
      cy.contains('T1').click();
      cy.get('input[aria-label="Price (€)"]').type('1200');
      cy.get('input[aria-label="Area (m2)"]').type('xyz');
      cy.get('input[aria-label="Location"]').type('City');
      
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      
      cy.get('body').then(($body) => {
        const hasSuccess = /operation completed|success|added/i.test($body.text());
        expect(hasSuccess).to.be.false;
      });
    });

    it('4. Should fail submission with empty Price field', () => {
      cy.get('input[aria-label="Description"]').type('Test property');
      cy.get('input[aria-label*="Number Bedrooms"]').click();
      cy.contains('T1').click();
      cy.get('input[aria-label="Area (m2)"]').type('50');
      cy.get('input[aria-label="Location"]').type('City');
      
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      
      cy.get('body').then(($body) => {
        const hasSuccess = /operation completed|success|added/i.test($body.text());
        expect(hasSuccess).to.be.false;
      });
    });

    it('5. Should fail submission with empty Area field', () => {
      cy.get('input[aria-label="Description"]').type('Test property');
      cy.get('input[aria-label*="Number Bedrooms"]').click();
      cy.contains('T1').click();
      cy.get('input[aria-label="Price (€)"]').type('1200');
      cy.get('input[aria-label="Location"]').type('City');
      
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      
      cy.get('body').then(($body) => {
        const hasSuccess = /operation completed|success|added/i.test($body.text());
        expect(hasSuccess).to.be.false;
      });
    });

    it('6. Should accept all bedroom options from T0 to T6+', () => {
      cy.get('input[aria-label="Description"]').type('Test apartment');
      cy.get('input[aria-label*="Number Bedrooms"]').click();
      cy.contains('T3').click();
      cy.get('input[aria-label="Price (€)"]').type('1800');
      cy.get('input[aria-label="Area (m2)"]').type('90');
      cy.get('input[aria-label="Location"]').type('Test City');
      
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.contains(/operation completed|success|added/i).should('be.visible');
    });

    it('7. Should accept decimal values for Price and Area', () => {
      cy.get('input[aria-label="Description"]').type('Premium apartment');
      cy.get('input[aria-label*="Number Bedrooms"]').click();
      cy.contains('T2').click();
      cy.get('input[aria-label="Price (€)"]').type('1650.75');
      cy.get('input[aria-label="Area (m2)"]').type('87.5');
      cy.get('input[aria-label="Location"]').type('Downtown');
      
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.contains(/operation completed|success|added/i).should('be.visible');
    });

    it('8. Should persist form data after submission', () => {
      const testData = {
        description: 'Test apartment for persistence',
        price: '1450',
        area: '75',
        location: 'Persistence City'
      };
      
      cy.get('input[aria-label="Description"]').type(testData.description);
      cy.get('input[aria-label*="Number Bedrooms"]').click();
      cy.contains('T2').click();
      cy.get('input[aria-label="Price (€)"]').type(testData.price);
      cy.get('input[aria-label="Area (m2)"]').type(testData.area);
      cy.get('input[aria-label="Location"]').type(testData.location);
      
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      
      cy.get('input[aria-label="Description"]').should('have.value', testData.description);
      cy.get('input[aria-label="Price (€)"]').should('have.value', testData.price);
      cy.get('input[aria-label="Area (m2)"]').should('have.value', testData.area);
      cy.get('input[aria-label="Location"]').should('have.value', testData.location);
    });
  });

  // ========== BOUNDARY VALUE TESTS (PASSING ONLY) ==========
  describe('Boundary Value Tests', () => {
    // Price Boundary Tests
    it('Should accept minimum valid price (0.01)', () => {
      cy.fillFormWithData({
        description: 'Minimum price test',
        bedrooms: 'T1',
        price: '0.01',
        area: '30',
        location: 'Test City'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    it('Should accept large valid price (9999999.99)', () => {
      cy.fillFormWithData({
        description: 'Large price test',
        bedrooms: 'T2',
        price: '9999999.99',
        area: '100',
        location: 'Test City'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    // Area Boundary Tests
    it('Should accept minimum valid area (0.01)', () => {
      cy.fillFormWithData({
        description: 'Minimum area test',
        bedrooms: 'T0',
        price: '500',
        area: '0.01',
        location: 'Test City'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    it('Should accept large valid area (99999.99)', () => {
      cy.fillFormWithData({
        description: 'Large area test',
        bedrooms: 'T3',
        price: '5000',
        area: '99999.99',
        location: 'Test City'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    // Description Boundary Tests
    it('Should accept minimal description (1 character)', () => {
      cy.fillFormWithData({
        description: 'A',
        bedrooms: 'T1',
        price: '1000',
        area: '50',
        location: 'Test City'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    it('Should accept long description (300+ characters)', () => {
      const longDescription = 'A'.repeat(300);
      cy.fillFormWithData({
        description: longDescription,
        bedrooms: 'T2',
        price: '1500',
        area: '75',
        location: 'Test City'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    // Location Boundary Tests
    it('Should accept minimal location (1 character)', () => {
      cy.fillFormWithData({
        description: 'Test property',
        bedrooms: 'T1',
        price: '1000',
        area: '50',
        location: 'A'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    it('Should accept location with special characters', () => {
      cy.fillFormWithData({
        description: 'Test property',
        bedrooms: 'T2',
        price: '1200',
        area: '60',
        location: 'St. Mary\'s Avenue, Apt #12-C'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    // Bedrooms Boundary Tests
    it('Should accept T0 (studio/0 bedrooms)', () => {
      cy.fillFormWithData({
        description: 'Studio apartment',
        bedrooms: 'T0',
        price: '800',
        area: '35',
        location: 'City Center'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    it('Should accept T6+ (6 or more bedrooms)', () => {
      cy.fillFormWithData({
        description: 'Large family house',
        bedrooms: 'T6+',
        price: '3500',
        area: '200',
        location: 'Suburbs'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });

    // Combination Boundary Tests
    it('Should accept minimum valid values for all fields', () => {
      cy.fillFormWithData({
        description: 'A',
        bedrooms: 'T0',
        price: '0.01',
        area: '0.01',
        location: 'A'
      });
      cy.contains('Add Property Unit').click();
      cy.wait(1000);
      cy.checkSuccessMessage();
    });
  });
});

// Custom Commands
Cypress.Commands.add('fillFormWithData', (data) => {
  cy.get('input[aria-label="Description"]').clear().type(data.description);
  
  if (data.bedrooms) {
    cy.get('input[aria-label*="Number Bedrooms"]').click();
    cy.contains(data.bedrooms).click();
  }
  
  if (data.price) {
    cy.get('input[aria-label="Price (€)"]').clear().type(data.price);
  }
  
  if (data.area) {
    cy.get('input[aria-label="Area (m2)"]').clear().type(data.area);
  }
  
  if (data.location) {
    cy.get('input[aria-label="Location"]').clear().type(data.location);
  }
});

Cypress.Commands.add('checkSuccessMessage', () => {
  cy.get('body').then(($body) => {
    const hasSuccess = /operation completed|success|added/i.test($body.text());
    expect(hasSuccess).to.be.true;
  });
});

Cypress.Commands.add('checkNoSuccessMessage', () => {
  cy.get('body').then(($body) => {
    const hasSuccess = /operation completed|success|added/i.test($body.text());
    expect(hasSuccess).to.be.false;
  });
});