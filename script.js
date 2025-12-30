// === 💬 索菲娅 AI 聊天脚本 ===
// 作者：guigusuqin-bot
// 功能：联网调用硅基流动模型 + 稳定版 PWA 按钮
// 日期：2026-01

// ===== 元素定义 =====
const chatBox = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const installContainer = document.getElementById("install-container");
const installButton = document.getElementById("install-button");

// ===== 加载历史消息 =====
let chatHistory = JSON.parse(localStorage.getItem("sofia_history") || "[]");
chatHistory.forEach(msg => addMessage(msg.role, msg.text));

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ===== 发送消息 =====
function sendMessage() {
  const message = input.value.trim();
  if (message === "") return;
  addMessage("你", message);
  input.value = "";
  aiReply(message);
}

// ===== 聊天气泡生成 =====
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role === "你" ? "text-right" : "text-left";
  div.innerHTML = `
    <div class="inline-block px-3 py-2 rounded-lg ${
      role === "你" ? "bg-blue-600" : "bg-gray-700"
    }">${text}</div>
  `;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  // 保存到本地
  chatHistory.push({ role, text });
  localStorage.setItem("sofia_history", JSON.stringify(chatHistory));
}

// ===== AI 回复核心逻辑 =====
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

// ===== 替换最后一条“思考中…”消息 =====
function replaceLastMessage(newText) {
  const last = chatBox.lastChild;
  if (last) {
    last.innerHTML = `
      <div class="inline-block px-3 py-2 rounded-lg bg-gray-700">${newText}</div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// ===== 📱 稳定版 添加到主屏幕逻辑 =====
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installContainer.classList.remove("hidden");
  console.log("📱 安装提示已捕获，可显示按钮");
});

installButton.addEventListener("click", async () => {
  try {
    if (!deferredPrompt) {
      alert("当前浏览器暂不支持，请手动添加到主屏幕。");
      return;
    }

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      installContainer.innerHTML =
        "✅ 已成功添加到主屏幕！";
    } else {
      installContainer.innerHTML =
        "❌ 已取消添加，可稍后再次尝试。";
    }
    deferredPrompt = null;
  } catch (err) {
    console.error("PWA 安装错误：", err);
    alert("⚠️ 当前浏览器不支持自动添加，请手动操作。");
  }
});

// ===== 防止部分安卓浏览器崩溃 =====
window.addEventListener("appinstalled", () => {
  installContainer.innerHTML = "🎉 索菲娅已安装到主屏幕！";
  setTimeout(() => installContainer.classList.add("hidden"), 3000);
});
