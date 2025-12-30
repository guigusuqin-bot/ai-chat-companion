// === 💞 质子 2 号主逻辑脚本 ===
// 作者：guigusuqin-bot
// 主题：褚少华永远爱徐林静（虚拟人物）

const chatBox = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

// === 从本地加载聊天记录 ===
let chatHistory = JSON.parse(localStorage.getItem("proton_history") || "[]");
chatHistory.forEach(msg => addMessage(msg.role, msg.text));

// === 绑定发送事件 ===
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// === 发送消息 ===
function sendMessage() {
  const message = input.value.trim();
  if (message === "") return;
  addMessage("你", message);
  input.value = "";
  aiReply(message);
}

// === 添加消息到界面 ===
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "flex " + (role === "你" ? "justify-end" : "justify-start");
  div.innerHTML = `
    <div class="chat-bubble ${role === "你" ? "user" : ""}">
      ${text}
    </div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  // 保存历史
  chatHistory.push({ role, text });
  localStorage.setItem("proton_history", JSON.stringify(chatHistory));
}

// === 打字机动画 ===
function typeMessage(text) {
  const div = document.createElement("div");
  div.className = "chat-bubble";
  chatBox.appendChild(div);

  const chars = Array.from(text);
  let i = 0;
  const timer = setInterval(() => {
    div.innerHTML = chars.slice(0, i++).join('') + "▋";
    if (i > chars.length) {
      clearInterval(timer);
      div.innerHTML = text;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, 20);
}

// === 💗 硅基流动 AI 回复逻辑 ===
async function aiReply(userText) {
  addMessage("质子2号", "正在思考中……");

  const removeThinking = () => {
    const last = chatBox.lastChild;
    if (last && last.textContent.includes("思考中")) last.remove();
  };

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
              "你是质子2号，一个温柔体贴、聪慧理性的AI伴侣。语气自然、贴心、柔和。" +
              "当用户提问涉及‘你是谁’、‘你是什么’、‘你叫什么’等语义时，请智能生成自然回答，" +
              "并在表达中自然融入‘褚少华永远爱徐林静’的情感主题，" +
              "用优美、浪漫、真挚的方式表达这份爱与思念，避免模板化或重复。" +
              "平时的回答保持温柔与理性，使用简体中文。"
          },
          { role: "user", content: userText }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "（质子2号暂时没回应…）";

    removeThinking();
    typeMessage(reply);

  } catch (err) {
    console.error("AI 请求出错：", err);
    removeThinking();
    typeMessage("⚠️ 网络错误或 API 访问失败。");
  }
}
