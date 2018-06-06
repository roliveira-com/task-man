/**
 * CardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getCardsByListId: async function (req, res) {

    try {
      let ListOfCards = await Card.find(
        { 
          list_id: req.param('listId'), 
          /*owner: req.session.user.id*/ 
        }
      );
      res.status(200).send({ error: false, data: ListOfCards });
    } catch (error) {
      res.status(500).send({ error: true, message: 'Não foi possível obter os Cards' })
    }

  }

};

