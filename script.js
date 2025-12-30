// === 🧩 API 诊断助手 ===
async function diagnoseAPI() {
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    top: "12px",
    right: "12px",
    background: "#1e293b",
    color: "white",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    zIndex: 9999,
    maxWidth: "240px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  });
  document.body.appendChild(box);
  box.innerText = "🔍 正在检测 API 连接…";

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [{ role: "user", content: "ping" }]
      })
    });

    const text = await res.text();
    if (res.ok) {
      box.style.background = "#16a34a";
      box.innerText = "✅ API 通信成功！模型正常可用。";
    } else if (text.includes("Invalid token")) {
      box.style.background = "#dc2626";
      box.innerText = "❌ 无效的 API 密钥，请重新生成。";
    } else if (text.includes("model")) {
      box.style.background = "#2563eb";
      box.innerText = "⚠️ 模型参数错误，请检查 model 名称。";
    } else {
      box.style.background = "#f97316";
      box.innerText = `⚠️ 服务器返回异常：${res.status}`;
    }
  } catch (err) {
    box.style.background = "#f59e0b";
    box.innerText = "⚠️ 网络连接失败或被浏览器阻止。";
  }

  setTimeout(() => box.remove(), 6000);
}

window.addEventListener("load", diagnoseAPI);
// === 索菲娅 AI 聊天脚本 ===
// 功能：真正联网调用硅基流动模型
// 作者：guigusuqin-bot
// 日期：2025-12

const chatBox = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

// 加载历史记录
let chatHistory = JSON.parse(localStorage.getItem("sofia_history") || "[]");
chatHistory.forEach(msg => addMessage(msg.role, msg.text));

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = input.value.trim();
  if (message === "") return;
  addMessage("你", message);
  input.value = "";
  aiReply(message);
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role === "你" ? "text-right" : "text-left";
  div.innerHTML = `<div class="inline-block px-3 py-2 rounded-lg ${
    role === "你" ? "bg-blue-600" : "bg-gray-700"
  }">${text}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatHistory.push({ role, text });
  localStorage.setItem("sofia_history", JSON.stringify(chatHistory));
}

// === 核心逻辑：连接硅基流动大模型 ===
async function aiReply(userText) {
  addMessage("索菲娅", "正在思考中……");

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
              "你是索菲娅，一个温柔聪慧的AI伴侣，说话自然、温柔、贴心。"
          },
          { role: "user", content: userText }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content || "（索菲娅暂时没回应…）";
    replaceLastMessage(reply);
  } catch (err) {
    replaceLastMessage("⚠️ 网络错误或API访问失败。");
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
