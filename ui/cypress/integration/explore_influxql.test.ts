describe('InfluxQL', () => {
  let db: any

  before(() => {
    cy.fixture('influxDB').then(({db: database}) => {
      db = database
    })
  })

  beforeEach(() => {
    cy.toInitialState()
    cy.createInfluxDBConnection().then(source => {
      cy.visit(`/sources/${source.id}/chronograf/data-explorer`)
      cy.url().should(
        'match',
        new RegExp(`sources/${source.id}/chronograf/data-explorer`)
      )
      cy.createInfluxDB(db.name, source.id).then(() => {
        cy.writePoints(
          source.id,
          db.name,
          db.measurements[0].name,
          db.measurements[0].tagValues[0],
          db.measurements[0].fieldValues[0]
        )
        cy.writePoints(
          source.id,
          db.name,
          db.measurements[1].name,
          db.measurements[1].tagValues[1],
          db.measurements[1].fieldValues[0]
        )
      })
    })
    cy.getByTestID('sidebar').should('exist')
  })

  it('Use InfluxQL query builder to make a new query', () => {
    cy.get('.query-maker--tab').should('have.length', 1)
    cy.getByTestID('query-maker-delete').click()
    cy.get('.query-maker--tab').should('not.exist')
    cy.get('.query-maker--empty')
      .should('exist')
      .and('contain.text', 'This Graph has no Queries')
    cy.getByTestID('add-query--button').click()
    cy.get('.query-maker--new').click()
    cy.get('.query-maker--tab').should('have.length', 2)
    cy.contains('.query-builder--column', 'Measurements & Tags')
      .find('.query-builder--list-empty')
      .should('exist')
      .and('contain.text', 'No Database selected')

    cy.contains('.query-builder--column', 'Fields')
      .find('.query-builder--list-empty')
      .should('exist')
      .and('contain.text', 'No Measurement selected')
    cy.get('.query-builder--list-item').contains(db.name).click()

    cy.contains('.query-builder--column', 'Measurements & Tags')
      .find('.query-builder--list-empty')
      .should('not.exist')

    cy.contains('.query-builder--column', 'Measurements & Tags').within(() => {
      cy.get('.query-builder--list')
        .find('.query-builder--list-item')
        .should('have.length', 2)
      cy.get('input').type(db.measurements[0].name)
      cy.get('.query-builder--list')
        .find('.query-builder--list-item')
        .should('have.length', 1)
        .click()
        .then(() => {
          cy.getByTestID('query-builder-list-item-tag-tagKey')
            .click()
            .then(() => {
              cy.get('[placeholder="Filter within tagKey"]').type('abc')
              cy.getByTestID(
                `query-builder-list-item-tag-value-${db.measurements[0].tagValues[0]}`
              ).should('not.exist')
              cy.get('[placeholder="Filter within tagKey"]').clear()
              cy.getByTestID(
                `query-builder-list-item-tag-value-${db.measurements[0].tagValues[0]}`
              )
                .should('exist')
                .click()
            })
        })
    })

    cy.contains('.query-builder--column', 'Fields').within(() => {
      cy.get('.query-builder--groupby-fill-container').should('not.exist')
      cy.getByTestID('query-builder-list-item-field-fieldKey').click()
      cy.get('.query-builder--groupby-fill-container')
        .should('exist')
        .within(() => {
          cy.get('.group-by-time').eq(0).find('.dropdown').click()
          cy.getByTestID('5m-dropdown-item').click()
          cy.getByTestID('dropdown-selected--5m').should('contain.text', '5m')
          cy.get('.fill-query').find('.dropdown').click()
          cy.getByTestID('none-dropdown-item').click()
          cy.getByTestID('dropdown-selected--none').should(
            'contain.text',
            'none'
          )
        })
    })

    cy.get('.CodeMirror-code').should(
      'contain.text',
      `SELECT mean("fieldKey") ` +
        `AS "mean_fieldKey" ` +
        `FROM "New InfluxDB"."autogen"."NewMeasurementA" ` +
        `WHERE time > :dashboardTime: ` +
        `AND time < :upperDashboardTime: ` +
        `AND "tagKey"='NewTagA' ` +
        `GROUP BY time(5m) FILL(none)`
    )
  })

  it('create and delete a database with use of metaquery templates', () => {
    cy.get('.query-editor--status-actions').within(() => {
      cy.get('.dropdown').contains('Metaquery Templates').click()
      cy.getByTestID('dropdown--item').contains('Create Database').click()
      cy.get('button').contains('Submit Query').click()
      cy.intercept('chronograf/v1/sources').as('sources')
      cy.reload()
      cy.wait('@sources')
    })

    cy.contains('.query-builder--column', 'DB.RetentionPolicy').within(() => {
      cy.get('.query-builder--list-item').should(
        'contain.text',
        'db_name.autogen'
      )
    })
    cy.get('.query-editor--status-actions').within(() => {
      cy.get('.dropdown').contains('Metaquery Templates').click()
      cy.getByTestID('dropdown--item').contains('Drop Database').click()
      cy.get('button').contains('Submit Query').click()
    })
    cy.contains('.query-builder--column', 'DB.RetentionPolicy').within(() => {
      cy.get('.query-builder--list-item').should(
        'not.contain.text',
        'db_name.autogen'
      )
    })
  })
})
