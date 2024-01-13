/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000

    this.beforeEach(function() {
        cy.visit ('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title ().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })


    it('preeenche os campos obrigatórios e envia o formulário', function () {
        const longText = 'Lorem ipsum dictumst eleifend mauris magna cras non volutpat, quisque scelerisque consectetur tempor eget sed enim inceptos malesuada, ac suspendisse eget nunc platea lobortis fusce. quis vulputate duis velit rutrum aliquet cras mattis nunc, vitae semper accumsan molestie mattis netus pharetra, eget phasellus adipiscing taciti mattis aenean imperdiet.'

        cy.clock()

        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Homolog')
        cy.get('#email').type('teste@homolog.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {

        cy.clock()

        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Homolog')
        cy.get('#email').type('teste@homolog,com')
        cy.get('#open-text-area').type('Teste Homologação.', {delay: 0})
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numerico', function () {

        cy.get('#phone')
        .type('Ab!@#$')
        .should('have.value', '')

    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {

        cy.clock()

        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Homolog')
        cy.get('#email').type('teste@homolog,com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste Homologação.', {delay: 0})
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')

    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {

        cy.get('#firstName')
        .type('Teste')
        .should('have.value', 'Teste')
        .clear ()
        .should('have.value', '')

        cy.get('#lastName')
        .type('Homolog')
        .should('have.value', 'Homolog')
        .clear ()
        .should('have.value', '')

        cy.get('#email')
        .type('teste@homolog,com')
        .should('have.value', 'teste@homolog,com')
        .clear ()
        .should('have.value', '')

        cy.get('#phone')
        .type('1234567890')
        .should('have.value', '1234567890')
        .clear ()
        .should('have.value', '')

    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {

        cy.clock()

        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')

    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
        
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product')
        .select ('YouTube')
        .should('have.value', 'youtube')
    })

    it ('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
        .select ('mentoria')
        .should('have.value', 'mentoria')
    })

    it ('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product')
        .select (1)
        .should('have.value','blog')
    })

    it ('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('be.checked', 'feedback')
        
    })

    it ('marca cada tipo de atendimento', function () {
        cy.get ('input[type="radio"]')
        .should ('have.length', 3)
        .each (function($radio) {
            cy.wrap($radio).check ()
            cy.wrap($radio).should('be.checked')
        })

    })

    it ('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get ('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')


        })

    it ('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        /* Copia do teste da linha 47 "'exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário'"
        ajuste do comando .click para .check no "cy.get('#phone-checkbox').check()" */

        cy.clock()

        cy.get('#firstName').type('Teste')
        cy.get('#lastName').type('Homolog')
        cy.get('#email').type('teste@homolog,com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste Homologação.', {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it ('seleciona um arquivo da pasta fixtures', function () {
        cy.get ('input[type="file"]')
        .should ('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function ($input) {
            //console.log($input) - Verificar array no objeto "files" no Console
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it ('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get ('input[type="file"]')
        .should ('not.have.value')
        .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop' })
        .should(function ($input) {
            //console.log($input) - Verificar array no objeto "files" no Console
            expect($input[0].files[0].name).to.equal('example.json')
        })

    })

    it ('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture ('example.json', {encoding: null} ).as('sampleFile')
        cy.get ('input[type="file"]')
        .should ('not.have.value')
        .selectFile('@sampleFile')
        .should(function ($input) {
            //console.log($input) - Verificar array no objeto "files" no Console
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it ('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    })

    it ('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
        cy.contains('CAC TAT - Política de privacidade')
        .should('be.visible')
    })

    it('exibe mensagem por 3 segundos', function () {
        cy.clock()
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')

    })

})