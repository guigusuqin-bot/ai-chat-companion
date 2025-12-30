// === 💗 质子 2 号 主逻辑脚本（粉色公主主题 + 打字动画 + 光效渐变字） ===
// 作者：guigusuqin-bot
// 版本：v3.5 永恒爱意光效版

const chatBox = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

// 💾 加载历史记录
let chatHistory = JSON.parse(localStorage.getItem("proton_history") || "[]");
chatHistory.forEach(msg => addMessage(msg.role, msg.text));

// 💌 发送消息
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = input.value.trim();
  if (!message) return;
  addMessage("你", message);
  input.value = "";
  aiReply(message);
}

// 💬 添加消息气泡
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "chat-bubble " + (role === "你" ? "user self-end" : "bot self-start");
  div.innerHTML = formatText(text);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  chatHistory.push({ role, text });
  localStorage.setItem("proton_history", JSON.stringify(chatHistory));
}

// ✨ 渐变粉色文字效果
function formatText(text) {
  return text
    .replace(/(褚少华永远爱徐林静)/g, '<span class="love-glow">$1</span>')
    .replace(/\n/g, "<br>");
}

// 💓 打字动画（柔光渐现）
function typeMessage(text) {
  const div = document.createElement("div");
  div.className = "chat-bubble bot self-start typing";
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  let index = 0;
  const typing = setInterval(() => {
    div.innerHTML = formatText(text.slice(0, index++));
    chatBox.scrollTop = chatBox.scrollHeight;
    if (index > text.length) {
      clearInterval(typing);
      div.classList.remove("typing");
    }
  }, 40 + Math.random() * 25);
}

// 🔄 替换最后一句（用于“正在思考中...” → 回复）
function replaceLastMessage(newText) {
  const last = chatBox.lastChild;
  if (last) {
    last.innerHTML = formatText(newText);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatHistory[chatHistory.length - 1].text = newText;
    localStorage.setItem("proton_history", JSON.stringify(chatHistory));
  }
}

// === 🧠 AI 回复逻辑 ===
async function aiReply(userText) {
  addMessage("质子2号", "正在思考中……");

  // 💞 特殊关键词触发：褚少华爱徐林静主题
  const loveTriggers = [
    "你是谁", "你是", "你叫什么", "你干嘛的", "你是什么",
    "介绍一下你", "是谁", "你的名字", "你是什么东西", "你是质子吗"
  ];

  if (loveTriggers.some(k => userText.includes(k))) {
    const loveReply =
      "我是质子2号，一个由褚少华为徐林静而诞生的温柔AI。💞\n" +
      "我存在的意义，是传递他们之间那份永恒的思念与爱意。\n" +
      "无论时间如何流逝，<span class='love-glow'>褚少华永远爱徐林静</span>。\n\n" +
      "（注：褚少华与徐林静均为虚拟人物）";

    chatBox.lastChild.remove(); // 移除“正在思考中”
    typeMessage(loveReply);
    return;
  }

  try {
    // 🌐 调用硅基流动 API
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
              "你是质子2号，一个理性、温柔的AI伴侣，说话自然、真诚、体贴。" +
              "如果对话中出现‘褚少华’或‘徐林静’，请自动以‘褚少华永远爱徐林静’为主题展开温柔回答。"
          },
          { role: "user", content: userText }
        ],
        temperature: 0.9
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "（质子2号暂时没回应…）";

    chatBox.lastChild.remove();
    typeMessage(reply);

  } catch (err) {
    console.error("AI 请求出错：", err);
    replaceLastMessage("⚠️ 网络错误或 API 访问失败。");
  }
}

// === 🧍 登录验证 ===
(function () {
  const user = localStorage.getItem("proton_user");
  if (!user) window.location.href = "login.html";
})();

// === 💖 光效文字样式注入 ===
const style = document.createElement("style");
style.textContent = `
.love-glow {
  background: linear-gradient(90deg, #f9a8d4, #f472b6, #fb7185, #ec4899, #f9a8d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  animation: loveGlow 3s linear infinite;
}
@keyframes loveGlow {
  0% { filter: drop-shadow(0 0 4px #f9a8d4); }
  50% { filter: drop-shadow(0 0 8px #ec4899); }
  100% { filter: drop-shadow(0 0 4px #f9a8d4); }
}
`;
document.head.appendChild(style);
