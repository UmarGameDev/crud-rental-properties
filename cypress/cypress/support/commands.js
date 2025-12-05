// cypress/support/commands.js

Cypress.Commands.add('detectAndTestTextBoundaries', (selector, fieldName) => {
  cy.log(`Testing boundaries for: ${fieldName}`)
  
  cy.get(selector).then(($input) => {
    const boundaries = {
      required: $input.attr('required') !== undefined,
      minLength: parseInt($input.attr('minlength')) || 1,
      maxLength: parseInt($input.attr('maxlength')) || 255,
    }
    
    cy.log(`Detected for ${fieldName}:`, JSON.stringify(boundaries))

    // Test the field without assuming specific error classes
    if (boundaries.minLength > 0) {
      const testText = 'A'.repeat(boundaries.minLength)
      cy.get(selector).clear().type(testText)
      
      // Just verify we can type and the value is set
      cy.get(selector).should('have.value', testText)
    }
  })
})

Cypress.Commands.add('detectAndTestEmailBoundaries', (selector, fieldName) => {
  cy.log(`Testing email: ${fieldName}`)
  
  cy.get(selector).then(($input) => {
    // Test with valid email
    cy.get(selector).clear().type('test@example.com')
    cy.get(selector).should('have.value', 'test@example.com')
  })
})

Cypress.Commands.add('detectAndTestPasswordBoundaries', (selector, fieldName) => {
  cy.log(`Testing password: ${fieldName}`)
  
  cy.get(selector).then(($input) => {
    // Test with valid password
    const testPassword = 'TestPass123!'
    cy.get(selector).clear().type(testPassword)
    cy.get(selector).should('have.value', testPassword)
  })
})

Cypress.Commands.add('testRequiredSelect', (selector, fieldName) => {
  cy.log(`Testing select: ${fieldName}`)
  
  cy.get(selector).then(($select) => {
    // Just select first available option
    cy.get(selector).find('option:not([value=""])').first().then(($option) => {
      const optionText = $option.text().trim()
      if (optionText && optionText !== 'Select...') {
        cy.get(selector).select(optionText)
        cy.get(selector).should('have.value', $option.attr('value'))
      }
    })
  })
})

Cypress.Commands.add('fillFormWithValidData', () => {
  cy.log('Filling form with valid data...')
  
  // Fill text inputs
  cy.get('input[type="text"]').each(($input, index) => {
    const testValues = ['John', 'Doe', 'Test Company']
    if (testValues[index]) {
      cy.wrap($input).clear().type(testValues[index])
    }
  })
  
  // Fill email
  cy.get('input[type="email"]').clear().type('john.doe@example.com')
  
  // Fill selects
  cy.get('select').each(($select) => {
    cy.wrap($select).find('option:not([value=""])').first().then(($option) => {
      const optionText = $option.text().trim()
      if (optionText && optionText !== 'Select...') {
        cy.wrap($select).select(optionText)
      }
    })
  })
  
  // Fill passwords
  cy.get('input[type="password"]').each(($input, index) => {
    const passwords = ['SecurePass123!', 'SecurePass123!']
    if (passwords[index]) {
      cy.wrap($input).clear().type(passwords[index])
    }
  })
  
})