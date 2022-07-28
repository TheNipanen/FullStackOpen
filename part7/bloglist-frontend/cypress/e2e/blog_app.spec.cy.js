describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'BiggestGamerInHistory',
      name: 'Gamer Dude',
      password: 'gamer69',
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input:first').type('BiggestGamerInHistory')
      cy.get('input:last').type('gamer69')
      cy.contains('login').click()
      cy.contains('Gamer Dude logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input:first').type('aaa')
      cy.get('input:last').type('aaa')
      cy.contains('login').click()
      cy.get('.notification')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('input:first').type('BiggestGamerInHistory')
      cy.get('input:last').type('gamer69')
      cy.contains('login').click()
      cy.contains('new blog').click()
      cy.get('#title').type('Yeet')
      cy.get('#author').type('Gamer Dude')
      cy.get('#url').type('yeet.com')
      cy.get('#create').click()
    })

    it('A blog can be created', function () {
      cy.contains('Yeet Gamer Dude')
    })

    it('A blog can be liked', function () {
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
    })

    it('A blog can be removed by its creator', function () {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'Yeet Gamer Dude')
    })

    it('Blogs are sorted according to likes', function () {
      cy.get('#new').click()
      cy.get('#title').type('Yeet 2')
      cy.get('#author').type('Gamer Dude')
      cy.get('#url').type('yeet2.com')
      cy.get('#create').click()

      cy.contains('Yeet 2 Gamer Dude').contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
      cy.get('.blog').eq(0).contains('Yeet 2 Gamer Dude')
      cy.get('.blog').eq(1).contains('Yeet Gamer Dude')
    })
  })
})
