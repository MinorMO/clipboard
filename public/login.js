const API_BASE_URL = "https://clipboard-api-gkbcgjabcrd5dsd7.westus2-01.azurewebsites.net"
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();

  if (data.success) {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("name", data.name);
    document.getElementById("login").style.display = "none";
    document.getElementById("clipboard").style.display = "block";
    document.getElementById("welcome").textContent = `¡Bienvenido, ${username}!`;
    //startSignalR(username);
  } else {
    alert("Credenciales incorrectas");
  }
}

function startSignalR(username) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/api`)
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("newMessage", ({ username, message, isImage }) => {
    const div = document.createElement("div");
    div.className = "message";

    if (isImage) {
      const img = document.createElement("img");
      img.src = message;
      img.alt = "Imagen";
      img.style.maxWidth = "200px";
      img.style.border = "1px solid #ccc";
      div.appendChild(document.createTextNode(`${username}: `));
      div.appendChild(img);
    } else {
      div.textContent = `${username}: ${message}`;
    }

    document.getElementById("messages").appendChild(div);
  });

  connection.start()
    .then(() => console.log("✅ SignalR conectado"))
    .catch(err => console.error("❌ Error en SignalR:", err.toString()));
}
