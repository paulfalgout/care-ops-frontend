// ***********************************************
// This example defaults.js shows you how to
// customize the internal behavior of Cypress.
//
// The defaults.js file is a great place to
// override defaults used throughout all tests.
//
// ***********************************************
//

Cypress.on('window:before:load', function(win) {
  win.onerror = function() {
    cy.onUncaughtException.apply(cy, arguments);
  };

  cy.stub(win, 'open');
});
