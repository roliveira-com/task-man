/**
 * BoardsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  home: function (req, res) {
    res.view('pages/tasks/boards');
  },
  
  getTrelloLists: function (req, res) {

    // sails.helpers.getTrelloLists(req, `https://api.trello.com/1/boards/${req.param('boardid')}/lists`)
    // .then(config_lists => {
    //   sails.log('LISTAS DO TRELLO CONFIGURADAS', config_lists)
    //   res.status(200).send({
    //     error: false,
    //     data: config_lists
    //   })
    // })
    // .catch(error => {
    //   sails.log('ERRO AO OBTER LISTAS NO TRELLO', error)
    //   res.status(500).send({
    //     error: true,
    //     data: error
    //   })
    // })

    // sails.helpers.getTrelloLists(req, `https://api.trello.com/1/boards/${req.param('boardid')}/lists`).then(response => {
    //   sails.log('LISTAS DO TRELLO CONFIGURADAS', response)
    //   res.status(200).send({
    //     error: true,
    //     message: 'Listas do Trello obtidas, mas foda-se!'
    //   })
    // })

    // try{
    //   let lists = await sails.helpers.handleDupeTrelloLists()
    // }catch(err){
    //   sails.log(err)
    // }

    sails.helpers.oauthGetResource(req, `https://api.trello.com/1/boards/${req.param('boardid')}/lists`).then(response => {
      if (response.error) return res.status(500).send( response.error.data.error.data.error );
      res.status(200).send(JSON.parse(response.data))
      // res.view('pages/tasks/lists',{
      //   lists : JSON.parse(response.data),
      //   subscribed : false
      // });
    })
  },

  getTrelloBoards: function (req, res) {
    sails.helpers.oauthGetResource(req, 'https://api.trello.com/1/members/me/boards').then(response => {
      if (response.error) return res.status(500).send({ error: response.error });
      res.status(200).send(response.data);
    }).catch(error => {
      res.status(401).send(error);
    })
  },

};

