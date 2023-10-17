describe("user list app", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.intercept("https://jsonplaceholder.typicode.com/users", {
      fixture: "users.json",
    }).as("getUsers");
  });

  it("displays a list of users and does not refetch on reload", () => {
    // given
    cy.visit("/");
    cy.get('[data-testid="user"]').should("have.length", 3);
    cy.get("@getUsers.all").then((interceptions) => {
      expect(interceptions).to.have.length(1);
    });

    // when
    cy.reload();

    // then
    cy.get('[data-testid="user"]').should("have.length", 3);
    cy.get("@getUsers.all").then((interceptions) => {
      expect(interceptions).to.have.length(1);
    });
  });

  it("allows removing a user", () => {
    // given
    cy.visit("/");
    cy.get('[data-testid="user"]').should("have.length", 3);

    // when
    cy.get('[data-testid="remove-user"]').first().click({ force: true }); // forcing click as an ugly workaround for invisible remove button

    // then
    cy.get('[data-testid="user"]').should("have.length", 2);
    cy.reload();
    cy.get('[data-testid="user"]').should("have.length", 2);
  });

  it("allows editing a user's name", () => {
    // given
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win, "prompt").returns("new user name");
      },
    });
    cy.get('[data-testid="user"]').should("have.length", 3);

    // when
    cy.get('[data-testid="edit-user-name"]').first().click({ force: true }); // forcing click as an ugly workaround for invisible edit button

    // then
    cy.get('[data-testid="user"]')
      .first()
      .should("contain.text", "new user name");
    cy.reload();
    cy.get('[data-testid="user"]')
      .first()
      .should("contain.text", "new user name");
  });

  it("allows filtering by name or email", () => {
    // given
    cy.visit("/");
    cy.get('[data-testid="user"]').should("have.length", 3);

    // when
    cy.get('[data-testid="filter-input"]').type("sMith ");

    // then
    cy.get('[data-testid="user"]').should("have.length", 2);
    cy.get('[data-testid="user"]').contains("Jane Smith");
    cy.get('[data-testid="user"]').contains("bobjohnsonsmith@example.com");
  });
});
