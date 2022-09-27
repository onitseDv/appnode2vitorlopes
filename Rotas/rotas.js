
const express = require ('express');
const rotas = express.Router(); //biblioteca router do express

const knex = require ('knex')({
    client: 'pg',
    connection:{
        connectionString: 'postgres://hfyazzznsxtayn:d7c0d134c3c1f40fd84ce7c1b4b33c53b63e49fd2d82d3fccda87322e741da49@ec2-18-209-78-11.compute-1.amazonaws.com:5432/d7iuucfc9vrjfd',
        ssl:{rejectUnauthorized: false},
    }
});


//const itemProduto = require ('../data/produtos.json'); //informações

module.exports = rotas;

//teste: http://localhost:3000/produtos/
rotas.get('/produtos', (requisicao, resposta) => {
    knex
        .select ('*')
        .from ('produto')
        .orderBy('id')
        .then (results => {
            resposta.status(200).json(results)
        })
        .catch (err => {
            resposta.status(500).json({message: `Erro ao obter produtos: ${err.message}`})
        })
});


//teste: http://localhost:3000/produtos/id-aqui
rotas.get('/produtos/:id', (requisicao, resposta) => {
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
                resposta.status(404).json({message: `Produto não encontrado`})
            }
        })
        .catch (err => {
            resposta.status(500).json({message: `Erro ao obter produtos: ${err.message}`})
        })
})


//teste: POST pelo postman com o endpoint: http://localhost:3000/produtos/adicionarProduto
//       com a mesma estrutura que o array possui
rotas.post('/produtos/adicionarProduto', (requisicao, resposta) => {
    if(requisicao.body){
        knex ('produto') 
            .insert({ 
                descricao: requisicao.body.descricao,  
                valor: requisicao.body.valor,  
                marca: requisicao.body.marca
        }, ['id']) 
        .then((results) => { 
            let produtos = results[0] 
            resposta.status(201).json({message: `Produto ${requisicao.body.descricao} cadastrado com sucesso` })  
            return 
        }) 
        .catch(err => { 
            resposta.status(500).json({message: `Erro ao cadastrar produto: ${err.message}`}) 
        })    
    }
});
 

//teste: http://localhost:3000/produtos/alteraProduto/id-aqui  
rotas.put('/produtos/alteraProduto/:id', (requisicao, resposta) => {
    knex('produto')
        .where('id', requisicao.params.id)
        .update({
            descricao: requisicao.body.descricao,  
            valor: requisicao.body.valor,  
            marca: requisicao.body.marca
        })
        .then(results => {
            if(results.length == 0){
                resposta.status(404).json({message: `Produto não encontrado`})
            }else{
                let produto = results[0]
                resposta.status(200).json(({message: `Registros alterados ${results}`}))
            }
        }) 
        .catch(err => { 
            resposta.status(500).json({message: `Erro ao alterar produto: ${err.message}`}) 
        })    
})

//teste: http://localhost:3000/produtos/deleta/id-aqui 
rotas.delete('/produtos/deleta/:id', (requisicao, resposta) => {
    knex('produto')
        .where('id', requisicao.params.id)
        .del()
        .then(results => { 
            if(results.length == 0){
                resposta.status(404).json({message: `Produto não encontrado`})
            }else{
                let produto = results[0]
                resposta.status(200).json(({message: `Registros excluídos ${results}`}))
            }
        }) 
        .catch (err => {
            resposta.status(500).json({message: `Erro ao deletar produto: ${err.message}`})
        })
})