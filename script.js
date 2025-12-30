// === 质子 2 号 主脚本 ===
// 功能：连接硅基流动 API 并进行智能回复
// 作者：guigusuqin-bot
// 日期：2025-12

const chatBox = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

let chatHistory = JSON.parse(localStorage.getItem("proton_history") || "[]");
chatHistory.forEach(msg => addMessage(msg.role, msg.text));

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = input.value.trim();
  if (message === "") return;
  const user = localStorage.getItem("proton_user") || "你";
  addMessage(user, message);
  input.value = "";
  aiReply(message);
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role === "质子 2 号" ? "text-left" : "text-right";
  div.innerHTML = `<div class="inline-block px-3 py-2 rounded-lg ${
    role === "质子 2 号" ? "bg-gray-700" : "bg-blue-600"
  }">${text}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatHistory.push({ role, text });
  localStorage.setItem("proton_history", JSON.stringify(chatHistory));
}

// === 连接硅基流动模型 ===
async function aiReply(userText) {
  addMessage("质子 2 号", "正在思考中……");

  try {
    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [
          {
            role: "system",
            content:
              "你是质子 2 号，一个理性、温柔且有逻辑的 AI 助手，用平和而聪慧的语气与用户交流。"
          },
          { role: "user", content: userText }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "（质子 2 号暂时没回应…）";
    replaceLastMessage(reply);
  } catch (err) {
    replaceLastMessage("⚠️ 网络错误或 API 访问失败。");
    console.error("AI 请求出错：", err);
  }
}

function replaceLastMessage(newText) {
  const last = chatBox.lastChild;
  if (last) {
    last.innerHTML = `<div class="inline-block px-3 py-2 rounded-lg bg-gray-700">${newText}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
