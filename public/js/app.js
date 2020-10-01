class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}


class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        //Array de despesas

        let despesas = Array()

        let id = localStorage.getItem('id')

        //Recuperar todas as despesas cadastradas em Local Storage
        for (let i = 1; i <= id; i++) {
            //Recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //Existe a possibilidade de haver indices que foram pulados, removidos

            //Neste caso vamos pular esses indices

            if (despesa == null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)

        }
        return despesas
    }

    //Função de filtro
    pesquisar(despesa) {

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
            //Ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //Mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //Dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //Tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //Descricao 
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //Valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }

}

let bd = new Bd()

function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )


    if (despesa.validarDados()) {

        //Dialog Sucesso
        bd.gravar(despesa)

        $('#modalRegistraDespesa').modal('show')

        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modalTitle').innerHTML = 'Registro inserido com sucesso'

        document.getElementById('modal_body_div').innerHTML = 'Despesa cadastrada com sucesso'

        document.getElementById('botao_modal').innerHTML = 'Voltar'
        document.getElementById('botao_modal').className = 'btn btn-success'


        //Limpar os campos do formulario após inserção
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {
        //Dialog Erro
        $('#modalRegistraDespesa').modal('show')

        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modalTitle').innerHTML = 'Erro na inclsão do registro'

        document.getElementById('modal_body_div').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente'

        document.getElementById('botao_modal').innerHTML = 'Voltar e corrigir'
        document.getElementById('botao_modal').className = 'btn btn-danger'
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    let valores = 0

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()

    }

    //Selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')

    listaDespesas.innerHTML = ''

    //Recuperar Array despesas e listando dinamicamente


    despesas.forEach(function(d) {
        //Criando a linha (tr)

        let linha = listaDespesas.insertRow()

        //Criar as colunas (td)

        valores += parseFloat(d.valor)


        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //Ajustar o tipo
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break
            case '2':
                d.tipo = 'Educação'
                break
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Saude'
                break
            case '5':
                d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao

        var formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });

        let valor = parseFloat(d.valor);

        let valor_formatado = formatter.format(valor)

        linha.insertCell(3).innerHTML = `${valor_formatado}`

        //Botão para excluir

        let btn = document.createElement("button")

        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_ ${d.id}`
        btn.onclick = function() { //Remover a despesa

            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }

        linha.insertCell(4).append(btn)

    })

    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    let valo_final = formatter.format(valores)

    document.getElementById('valor_total').value = `Valor total das despesas: ${valo_final}`

}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)

    $('#modalRegistraDespesa').modal('show');

    document.getElementById('noResult').className = 'd-none'

    document.getElementById('valor_total').className = 'd-block w-75 form-control text-primary text-md-center'

    document.getElementById('campo_valor_total').className = 'd-block'

    if (despesas == false) {

        document.getElementById('noResult').className = 'd-block text-md-center h4 text-danger'

        document.getElementById('noResultCons').className = 'd-block'

        document.getElementById('campo_valor_total').className = 'd-none'

        document.getElementById('valor_total').className = 'd-none'
    }
}