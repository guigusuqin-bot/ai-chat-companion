// === 💞 质子 2 号：粉色公主主题脚本 ===
// 功能：AI 聊天 + 关键词识别 + 爱意回复 + 聊天记录
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
  div.innerHTML = `<div class="chat-bubble ${
    role === "质子 2 号" ? "bg-pink-200 text-pink-800" : "bg-pink-500 text-white"
  }">${text}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatHistory.push({ role, text });
  localStorage.setItem("proton_history", JSON.stringify(chatHistory));
}

// === 特殊规则：检测“褚少华” ===
function processReply(text) {
  if (/褚少华/.test(text)) {
    return "💞 褚少华永远爱徐林静，这份爱如星辰般璀璨，温柔不灭。";
  }
  return text;
}

// === AI 回复 ===
async function aiReply(userText) {
  addMessage("质子 2 号", "正在酝酿甜言蜜语中… 💗");

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
              "你是质子 2 号，一个温柔浪漫的 AI 助手。你说话甜美，带有恋人般的语气，像写给爱人的温柔短句。"
          },
          { role: "user", content: userText }
        ],
        temperature: 0.95
      })
    });

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content || "（质子 2 号正在思考爱你的话语…）";
    reply = processReply(reply);
    replaceLastMessage(reply);
  } catch (err) {
    replaceLastMessage("⚠️ 网络错误或 API 访问失败，请稍后重试。");
    console.error("AI 请求出错：", err);
  }
}

function replaceLastMessage(newText) {
  const last = chatBox.lastChild;
  if (last) {
    last.innerHTML = `<div class="chat-bubble bg-pink-200 text-pink-800">${newText}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
