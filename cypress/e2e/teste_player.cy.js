describe('Player de musica', () => {

  beforeEach(() => {
    cy.visit('./index.html')
  })

it.only('pausar a musica',() =>{

cy.get ('.botao-play').click()
cy.wait (2000)
cy.get ('.botao-pause').click()
cy.get ('.botao-play').should('be.visible')

})


it.only('diminuir o volume',() =>{
cy.get('#volumeRange').invoke('val', 0.2).trigger('input')
cy.get('#volumeRange').should('have.value', '0.2')  
})


it('avançar para proxma musica',() =>{
cy.get('.proximo').click()
cy.get('.titulo').should('not.have.text','Faded')


})







})