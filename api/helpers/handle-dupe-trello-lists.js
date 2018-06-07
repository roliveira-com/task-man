module.exports = {

  friendlyName: 'Verifica Listas já cadastrada',

  description: 'Identifica se uma lista do Trello já foi cadastrada',

  inputs: {
    trelloListId: {
      type: 'string',
      required: true
    } 
  },

  fn: async (inputs, exits) => {

    try{
      let results = await
      Card.find({
        where  : {model_id: inputs.trelloListId},
        select : ['title','id'] 
      })
      return exits.success(result);
    }catch(err){
      throw err
    }
  }

}