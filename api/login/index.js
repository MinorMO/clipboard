
const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  try {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;

    console.log("Endpoint usado:", endpoint);

    const client = new CosmosClient({ endpoint, key });

    const { username, password } = req.body;
    const container = client.database("BaseGeneral").container("Users");

    const { resources } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.username = @u AND c.password = @p",
        parameters: [
          { name: "@u", value: username },
          { name: "@p", value: password }
        ]
      })
      .fetchAll();

    if (resources.length > 0) {
      const user = resources[0]; // 👈 obtenemos el usuario completo
      context.res = {
        body: {
          success: true,
          username: user.username,
          name: user.name || user.username // usa name si existe, o username como respaldo
        }
      };
    } else {
      context.res = {
        status: 401,
        body: { success: false }
      };
    }
  } catch (err) {
    console.error("Error en función login:", err.message);
    context.res = {
      status: 500,
      body: { success: false, error: err.message }
    };
  }
};
