beforeEach(() =>{
  cy.visit("/");
})


it('Should expect to find all HTML on pageload', () => {
  cy.get("#searchForm").should("exist");
  cy.get("#searchText").should("exist" );
  cy.get("#searchText").should("have.attr", "placeholder", "Skriv titel här");
  cy.get("#search").contains("Sök").should("exist");
  cy.get("#movie-container").should('contain.html', "");
})

describe("Testing submit by keypress and click",() =>{
  it('submit form by keypress', () => {
      cy.get("#searchForm").should("exist");
      cy.get("#searchText").type("batman").should("have.value","batman");
      cy.get("#searchText").type('{enter}')
  })

  it('submit form by click', () => {
    cy.get("#searchForm").should("exist");
    cy.get("#searchText").type("superman").should("have.value","superman");
    cy.get("#search").click();
})
});

it("should get mock data with correct url", () => {
  cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {fixture: "movieResponse"}).as("omdbCall");
  cy.get("#searchText").type("test").should("have.value","test");
  cy.get('form').submit();
  cy.wait("@omdbCall").its("request.url").should("contain", "test");
})

