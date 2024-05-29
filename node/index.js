const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const mysql = require('mysql')
const dbConfig = {
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'nodedb'
  };
const conn = mysql.createConnection(dbConfig)
conn.query(`CREATE TABLE IF NOT EXISTS people(id int primary key auto_increment, name varchar(255));`)
conn.query("INSERT INTO people (name)VALUES('Felipe');")


app.get('/', (req,res) => {
    let resmsg = ' <h1>Full Cycle Rocks!</h1> <br> '

    conn.query('SELECT * FROM people', (err, results) => {
        if(results){
            resmsg += '<ul>'
            results.forEach(row => {
                resmsg += `<li>${row.name}</li>`
            });
            resmsg += '<ul>'
            res.send(resmsg)
        }else if(err){
            res.status(500).send(err)
        }
    })
})


app.post('/', (req,res) => {
    const reqmsg = req.body

    conn.query(`INSERT INTO people(name)VALUES(?)`, [reqmsg.name], (err) => {
        if(err){
            res.status(400).send(err)
        }else{
            res.send('Nome adicionado com sucesso!!')
        }
    })
})


app.delete('/delall', (req,res) => {
    conn.query(`DELETE FROM people`, (err) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.send('Nomes Removidos!')
        }
    })
})



app.delete('/drop', (req,res) => {
    conn.query(`DROP TABLE people`, (err) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.send('Tabela Removida!')
        }
    })
})


app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})