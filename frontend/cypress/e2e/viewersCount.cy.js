describe('ViewersCount Component', () => {
  beforeEach(() => {
    // Intercept API calls to your API Gateway
    cy.intercept(
      'GET',
      'https://nwl36ysqi7.execute-api.us-east-1.amazonaws.com/visitor-count',
      {
        fixture: 'visitorCount.json',
      }
    ).as('getVisitorCount');

    // Visit the page containing the ViewersCount component
    cy.visit('/');
  });

  it('displays the viewer count correctly', () => {
    // Wait for the API call to complete
    cy.wait('@getVisitorCount');

    // Check if the Eye icon and count are displayed
    cy.get('svg').should('exist'); // For the Eye icon
    cy.contains('42').should('exist'); // Assuming 42 is the mock count
  });

  it('shows loading state initially', () => {
    // Intercept with delay to test loading state
    cy.intercept(
      'GET',
      'https://nwl36ysqi7.execute-api.us-east-1.amazonaws.com/visitor-count',
      {
        fixture: 'visitorCount.json',
        delay: 1000,
      }
    ).as('delayedCount');

    cy.visit('/');
    cy.contains('Loading...').should('exist');
  });

  it('handles API error gracefully', () => {
    // Intercept with error response
    cy.intercept(
      'GET',
      'https://nwl36ysqi7.execute-api.us-east-1.amazonaws.com/visitor-count',
      {
        statusCode: 500,
        body: 'Server Error',
      }
    ).as('errorResponse');

    cy.visit('/');
    // Verify error handling (you might want to add error UI in your component)
    cy.get('svg').should('exist'); // Eye icon should still be visible
  });
});
