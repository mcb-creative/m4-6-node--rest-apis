'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { clients } = require('./data/clients');
const { words } = require('./data/words');
const { v4: uuidv4 } = require('uuid');

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints

  .get('/clients', (req, res) => {
    res.status(200).json({ status: 200, data: clients})
  })

  .get('/clients/:id', (req, res) => {

    const id = req.params.id;
    const client = clients.filter((client) => {
      if (id === client.id) {
        return client;
      }
    })
    res.status(200).json({ status: 200, data: client })
  })

  .post('/clients/add', (req, res) => {

    const newClient = req.body;
    clients.push(newClient);
    res.json(clients);

  })

  .delete('/clients/delete/:id', (req, res) => {

    const id = req.params.id;

    let updatedClients = clients.filter((client) => {
      if (client.id !== id) {
        return clients;
      }
    })
    res.json(updatedClients);
  })

  .get('/hangman/word/', (req, res) => {

      const randomWord = Object.values(words)[Math.floor(Math.random()*Object.values(words).length)];
      const randomId = randomWord.id;
      const randomCount = randomWord.letterCount;
      
    res.status(200).json({ status: 200, data: { id: randomId, letterCount: randomCount }});
  })

  .get('/hangman/word/:id', (req, res) => {

    const id = req.params.id;

    const word = words.filter((word) => {
      if (id === word.id) {
        return word;
      }
    })
    res.status(200).json({ status: 200, data: word })
  })

  .get ('/hangman/guess/:id/:letter', (req, res) => {

    const id = req.params.id;
    const letter = req.params.letter;
    let wordObject = words.filter((word) => {
      if (id === word.id) {
        return word;
      }
    })
    let chosenWord = wordObject.map((item) => {
      return item.word;
    })
    let letters = chosenWord.toString().split('');

    let array = letters.map((ltr, i) => {
      return ltr[i] === false;
    })

    letters.forEach((ltr, i) => {
      if (letter === ltr) {
        array[i] = true;
      }
    })

    res.status(200).json({ status: 200, data: array })

  })

  .listen(8000, () => console.log(`Listening on port 8000`));
