beforeEach(() =>{
  cy.visit("/");
})

/*****************************************************
 *          Control that all elemement exists
 ****************************************************/

it('Should expect to find all HTML on pageload', () => {
  cy.get("#searchForm").should("exist");
  cy.get("#searchText").should("exist" );
  cy.get("#searchText").should("have.attr", "placeholder", "Skriv titel här");
  cy.get("#search").contains("Sök").should("exist");
  cy.get("#movie-container").should("contain.html", "");
})

/*****************************************************
 *                Submit functionality
 ****************************************************/

describe("Testing submit by keypress and click",() =>{
  it("Should submit form by keypress", () => {
      cy.get("#searchForm").should("exist");
      cy.get("#searchText").type("Batman").should("have.value","Batman");

      cy.get("#searchText").type("{enter}")

      cy.get("h3").contains("Batman").should("exist");
  })

  it("Should submit form by click", () => {
    cy.get("#searchForm").should("exist");
    cy.get("#searchText").type("Superman").should("have.value","Superman");

    cy.get("#search").click();

    cy.get("h3").contains("Superman").should("exist");
  })

  it("Should submit with submitevent", () => {
    cy.get("#searchForm").should("exist");
    cy.get("#searchText").type("Spiderman").should("have.value","Spiderman");
    cy.get("form").submit();
    cy.get("h3").contains("Spiderman").should("exist");
    })
  
});

/*****************************************************
 *                Wrong input
 ****************************************************/

it("Should display a p tag with 'Inga sökresultat att visa'", () => {
  cy.get("#searchText").type("").should("have.value","");
  cy.get("#searchText").type("{enter}")
  cy.get("p").contains("Inga sökresultat att visa").should('exist');
})

/*****************************************************
 *                   API fixture
 ****************************************************/

describe("Control that API fixture works", () => {
  it("Should get mock data with correct url", () => {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=*", {fixture: "movieResponse"}).as("omdbCall");
    cy.get("#searchText").type("hey").should("have.value","hey");
    cy.get("form").submit();
    cy.wait("@omdbCall").its("request.url").should("contain", "hey");
    cy.get("body").contains("Test")
  })

  it("Should have a h3 that contains 'Test'", () => {
    cy.intercept("GET", "http://omdbapi.com/?apikey=416ed51a&s=*", {fixture: "movieResponse"});
    cy.get("input#searchText").type("Superman"); //Superman movies should not be generated

    cy.get("#searchText").type("{enter}")

    cy.get("h3").contains("Test").should("exist");
    // cy.get("h3").contains("Test").should("have.length", 10);
  })

});