module.exports = async function (context, req) {
  const connectionInfo = context.bindings.signalRConnectionInfo;

  console.log("ConnectionInfo:", connectionInfo); // 👈 Esto te mostrará si llega vacío

  if (!connectionInfo) {
    context.res = {
      status: 500,
      body: { error: "No se pudo obtener la conexión de SignalR" }
    };
    return;
  }

  context.res = {
    status: 200,
    body: connectionInfo,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  };
};
