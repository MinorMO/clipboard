module.exports = async function (context, req) {
  const { username, message } = req.body || {};

  const isImage = typeof message === 'string' && message.startsWith('data:image/');

  context.bindings.signalRMessages = [{
    target: 'newMessage',
    arguments: [{ username, message, isImage }]
    }];

  context.res = {
    status: 200
  };
};
