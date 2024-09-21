describe('Basic flow', () => {
	beforeEach(() => {
		cy.viewport('macbook-13')
	})

	it('Should render the fruit gallery correctly', () => {
		cy.visit('/')
	})

	it('Should navigate to the details page on click', () => {
		cy.visit('/')
	})

	it('Should go back to gallery on back button click', () => {
		cy.visit('/')
	})

	it('Should navigate to the details page on enter', () => {
		cy.visit('/')
	})

	it('Should render the fruit details correctly', () => {
		cy.visit('/')
	})

	it('Should render a error message', () => {
		cy.visit('/')
	})

	it('Should redirect to gallery when trying to access a invalid fruit', () => {
		cy.visit('/')
	})
})
