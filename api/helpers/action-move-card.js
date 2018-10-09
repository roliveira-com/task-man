module.exports = {


    friendlyName: 'Mover Cards',
  
  
    description: 'Processa a action vinda do webhook para mover os cards etres as listas',
  
  
    inputs: {
  
      request: {
        type: 'ref',
        required: true
      },
  
      action: {
        type: 'ref',
        required: true
      },
  
    },
  
    exits: {
  
        noAuth: {
            description: 'Erro na mudança do card entre as listas'
        }
  
    },
  
    sync: false,
   
    fn: async (inputs, exits) => {

        let listBefore  = inputs.request.param('id');
        sails.log('ID DA LISTA ORIGINAL NA BASE TASK MAN'  , listBefore)

        let listAfter = await Webhook.findOne({ idModel: inputs.action.action.data.listAfter.id });
        sails.log('ID DA NOVA LISTA NA BASE TASK MAN', listAfter.targetListModel)

        let card = await Card.findOne({ trello_id: inputs.action.action.data.card.id })
        sails.log('ID DO CARD NA BASE LOCAL', card.id)

        if(listBefore && listAfter && card){
            await Card.update( { id:card.id }, { list_id: listAfter.targetListModel })
            return exits.success({error:false,message:'card movido'})
        }else{
            sails.log('ERRO NO PROCESSO DE MOVER CARTÕES A PARTIR DO WEBHOOK')
            return exits.noAuth({error:true,message:'Erro durante a alteração de card'})
        }
        
    }
  
  };