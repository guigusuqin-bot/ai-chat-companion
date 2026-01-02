// === 💞 质子 2 号 · 阿里云服务器配置版 ===
// 作者：guigusuqin-bot
// 数据库与记忆系统完全迁移至阿里云
// 模型：Qwen2-7B-Instruct (硅基流动 API)

// =======================
// 🧠 AI 配置（硅基流动）
// =======================
const CONFIG = {
  API_KEY: "sk-hznedgywaoacmdqyjikpdydkueenugtzsuewokojsyhspwxp", // 你的硅基流动密钥
  API_URL: "https://api.siliconflow.cn/v1/chat/completions",
  MODEL: "Qwen/Qwen2-7B-Instruct"
};

// =======================
// ☁️ 数据存储配置（阿里云接口）
// =======================
const SERVER_API = "http://47.83.127.203/api.php";

// =======================
// 🚪 登录验证逻辑（本地）
// =======================
(function checkLogin() {
  const token = localStorage.getItem("proton_token");
  const user = localStorage.getItem("proton_user");
  const page = window.location.pathname.split("/").pop();

  if ((!token || !user) && page !== "login.html") {
    console.warn("🚪 未检测到登录信息，自动跳转至登录页...");
    window.location.href = "login.html";
  }
})();

console.log("✅ 质子 2 号 · 阿里云配置加载完成");
