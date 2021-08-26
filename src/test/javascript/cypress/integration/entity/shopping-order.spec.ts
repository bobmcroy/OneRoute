import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('ShoppingOrder e2e test', () => {
  const shoppingOrderPageUrl = '/shopping-order';
  const shoppingOrderPageUrlPattern = new RegExp('/shopping-order(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/shopping-orders+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/shopping-orders').as('postEntityRequest');
    cy.intercept('DELETE', '/api/shopping-orders/*').as('deleteEntityRequest');
  });

  it('should load ShoppingOrders', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('shopping-order');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ShoppingOrder').should('exist');
    cy.url().should('match', shoppingOrderPageUrlPattern);
  });

  it('should load details ShoppingOrder page', function () {
    cy.visit(shoppingOrderPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('shoppingOrder');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', shoppingOrderPageUrlPattern);
  });

  it('should load create ShoppingOrder page', () => {
    cy.visit(shoppingOrderPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('ShoppingOrder');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', shoppingOrderPageUrlPattern);
  });

  it('should load edit ShoppingOrder page', function () {
    cy.visit(shoppingOrderPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('ShoppingOrder');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', shoppingOrderPageUrlPattern);
  });

  it.skip('should create an instance of ShoppingOrder', () => {
    cy.visit(shoppingOrderPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('ShoppingOrder');

    cy.get(`[data-cy="name"]`).type('Ball Ergonomic').should('have.value', 'Ball Ergonomic');

    cy.get(`[data-cy="totalAmount"]`).type('49922').should('have.value', '49922');

    cy.get(`[data-cy="ordered"]`).type('2021-08-25').should('have.value', '2021-08-25');

    cy.setFieldSelectToLastOfEntity('buyer');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', shoppingOrderPageUrlPattern);
  });

  it.skip('should delete last instance of ShoppingOrder', function () {
    cy.intercept('GET', '/api/shopping-orders/*').as('dialogDeleteRequest');
    cy.visit(shoppingOrderPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('shoppingOrder').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', shoppingOrderPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
