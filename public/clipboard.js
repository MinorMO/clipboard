const API_BASE_URL2 = "https://clipboard-api-gkbcgjabcrd5dsd7.westus2-01.azurewebsites.net";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE_URL2}/api`, {
    withCredentials: true,
    transport: signalR.HttpTransportType.WebSockets
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

connection.on("newMessage", ({ username, message, isImage }) => {
  const div = document.createElement("div");
  div.className = "message";

  if (isImage) {
    const img = document.createElement("img");
    img.src = message;
    img.alt = "Imagen enviada";
    img.style.maxWidth = "200px";
    img.style.border = "1px solid #ccc";
    img.style.cursor = "pointer";
    img.onclick = () => {
      const win = window.open();
      win.document.write(`<img src="${message}" style="max-width:100%">`);
    };
    div.appendChild(document.createTextNode(`${username}: `));
    div.appendChild(img);
  } else {
    div.textContent = `${username}: ${message}`;
  }

  document.getElementById("messages").appendChild(div);
});

connection.start()
  .then(() => {
    console.log("✅ Conexión establecida con SignalR");
  })
  .catch(err => console.error("❌ Error de conexión:", err.toString()));

// Elementos del DOM
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("send");
const imageInput = document.getElementById("imageInput");

sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    sendToServer(message);
    messageInput.value = "";
  }
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      sendToServer(reader.result);
      imageInput.value = "";
    };
    reader.readAsDataURL(file);
  }
});

function sendToServer(message) {
  const isImage = message.startsWith("data:image/");
  fetch(`${API_BASE_URL2}/api/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: sessionStorage.getItem("name") || "Invitado",
      message,
      isImage
    })
  });
}

// Pegar imágenes desde portapapeles
messageInput.addEventListener("paste", (e) => {
  const items = e.clipboardData.items;
  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      const reader = new FileReader();
      reader.onload = () => sendToServer(reader.result);
      reader.readAsDataURL(file);
    }
  }
});

// Arrastrar y soltar imágenes
messageInput.addEventListener("dragover", (e) => e.preventDefault());
messageInput.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  for (const file of files) {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => sendToServer(reader.result);
      reader.readAsDataURL(file);
    }
  }
});

function clearMessages() {
  document.getElementById("messages").innerHTML = "";
}
