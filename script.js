const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
  const message = input.value.trim();
  if (message === "") return;

  appendMessage("你", message);
  input.value = "";

  // 模拟 AI 回复（之后会接入真正的 AI）
  setTimeout(() => {
    appendMessage("索菲娅", "我在呢～这是测试回复。");
  }, 800);
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("msg");
  msg.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
