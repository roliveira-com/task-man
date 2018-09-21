/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  await Action.create(
    {
      modelId: "5ba4eba42093690014b20380",
      action:{
        action :{
          id:"5ba4ee6f8339fc5e62e2bd23",
          type: "updateCard",
          date: "2018-09-21T13:13:19.864Z",
          display: {
            translationKey:"action_copy_card"
          },
        },
        memberCreator:{
          avatarUrl: "https://trello-avatars.s3.amazonaws.com/9104391328e32c24b15bee8274511555",
          fullName: "Genne Simmons",
        }
      }
    }
  )
  .then(record => {
    return done();
  })

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)

};
