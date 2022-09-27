
const express = require ('express');
const rotas = express.Router(); //biblioteca router do express

const knex = require ('knex')({
    client: 'pg',
    connection:{
        connectionString: 'postgres://hfyazzznsxtayn:d7c0d134c3c1f40fd84ce7c1b4b33c53b63e49fd2d82d3fccda87322e741da49@ec2-18-209-78-11.compute-1.amazonaws.com:5432/d7iuucfc9vrjfd',
        ssl:{rejectUnauthorized: false},
    }
});


const itemProduto = require ('../data/produtos.json'); //informações

module.exports = rotas;

//teste: http://localhost:3000/produtos/
rotas.get('/produtos', (requisicao, resposta) => {
    //return resposta.json(itemProduto)
    knex
        .select ('*')
        .from ('produto')
        .then (results => {
            resposta.status(200).json(results)
        })
        .catch (err => {
            resposta.status(500).json({message: `Erro ao obter produtos: ${err.message}`})
        })
});


//teste: http://localhost:3000/produtos/id-aqui
rotas.get('/produtos/:id', (requisicao, resposta) => {
    /*
    const identificador = requisicao.params.id
    for(let produto_search of itemProduto){
        if(produto_search.id === id){
            resposta.json(produto_search)
            return
        }
    }
    resposta.status(404).send('Produto não encontrado!')
    */
   let identificador = parseInt(requisicao.params.id)
    knex
        .select('*')
        .from('produto')
        .where({id: identificador})
        .then(results =>{
            if(results.length){
                let produto = results[0]
                resposta.status(200).json(results)
            }else{
                resposta.status(404).json({message: `Prroduto não encontrado`})
            }
            
        })
        .catch (err => {
            resposta.status(500).json({message: `Erro ao obter produtos: ${err.message}`})
        })
})


//teste: POST pelo postman com o endpoint: http://localhost:3000/produtos
//       com a mesma estrutura que o array possui
rotas.post('/produtos/adicionarProduto', (requisicao, resposta) => {
    /*
    const body = requisicao.body
    if(!body.descricao){
        return resposta.status(400).end('Descrição do produto não pode ser nula!')
    }else if(!body.valor){
        return resposta.status(400).end('Valor do produto não pode ser nulo!')
    }else if(!body.marca){
        return resposta.status(400).end('Marca do produto não pode ser nula!')
    }else{
        //verificar se o produto existe, caso o retorno for nulo, insere
        const result = itemProduto.find( desc => desc.descricao === body.descricao)
        if(!result){
            const maxID = itemProduto.reduce(function(prev, current) { 
                return prev.id > current.id ? prev : current; 
            })
            //console.log(maxID.id)
            const obj = {
                id: maxID.id + 1,
                descricao: body.descricao,
                valor: body.valor,
                marca: body.marca
            }
            //resposta.send(obj)
            itemProduto.push(obj)
            resposta.send(`Produto ${requisicao.body.descricao} adicionado`)
        }else{
            resposta.status(400).end(`Produto ${requisicao.body.descricao} já existente`)
        }
    }
    */
    if(requisicao.body){
        knex ('produto') 
            .insert({ 
                descricao: requisicao.body.descricao,  
                valor: requisicao.body.valor,  
                marca: requisicao.body.marca
        }, ['id']) 
        .then((results) => { 
            let produtos = results[0] 
            resposta.status(201).json({message: `Produto cadastrado com sucesso` })  
            return 
        }) 
        .catch(err => { 
            resposta.status(500).json({message: `Erro ao cadastrar produto: ${err.message}`}) 
        })    
    }
});
 

//teste: http://localhost:3000/produtos/alteraProduto/id-aqui  
rotas.put('/produtos/alteraProduto/:id', (requisicao, resposta) => {
    const body = requisicao.body
    //if(!body.id){
    //    return resposta.status(400).end('ID do produto não pode ser nulo!')
    if(!body.descricao){
        return resposta.status(400).end('Descrição do produto não pode ser nula!')
    }else if(!body.valor){
        return resposta.status(400).end('Valor do produto não pode ser nulo!')
    }else if(!body.marca){
        return resposta.status(400).end('Marca do produto não pode ser nula!')
    }else{
        //itemProduto[requisicao.params.id - 1].id = requisicao.body.id;
        itemProduto[requisicao.params.id - 1].descricao = requisicao.body.descricao;
        itemProduto[requisicao.params.id - 1].valor = requisicao.body.valor;
        itemProduto[requisicao.params.id - 1].marca = requisicao.body.marca;
        return resposta.json(itemProduto[requisicao.params.id - 1]);
    }
})

//teste: http://localhost:3000/produtos/deleta/id-aqui 
rotas.delete('/produtos/deleta/:id', (requisicao, resposta) => {
    const identificador = requisicao.params.id
    let newitemProduto = itemProduto.filter(itemProduto => {
        if(itemProduto.id !== identificador){
            return true
       }
       return false
    })
    delete itemProduto[identificador - 1]
    resposta.send(`Produto com id ${identificador} excluído!`) 
})