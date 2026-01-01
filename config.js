// === 💞 质子 2 号 · 综合配置文件 ===
// 集成硅基流动 AI + LeanCloud 数据存储系统
// 作者：guigusuqin-bot

// =======================
// 🧠 AI 配置（硅基流动）
// =======================
const CONFIG = {
  API_KEY: "sk-hznedgywaoacmdqyjikpdydkueenugtzsuewokojsyhspwxp",
  API_URL: "https://api.siliconflow.cn/v1/chat/completions",
  MODEL: "Qwen/Qwen2-7B-Instruct"
};

// =======================
// ☁️ 数据库配置（LeanCloud）
// =======================
const AV_APP_ID = "eb5BJ7PXTDhsFevKoprEj3mQ-gzGzoHsz";
const AV_APP_KEY = "TOTCnlguKJU98IsFzsPuA1aT";
const AV_SERVER_URL = "https://eb5bj7px.lc-cn-n1-shared.com"; // ✅ 改成这一行

// 初始化 LeanCloud
if (typeof AV !== "undefined") {
  AV.init({
    appId: AV_APP_ID,
    appKey: AV_APP_KEY,
    serverURL: AV_SERVER_URL
  });
  console.log("✅ LeanCloud 已成功初始化");
} else {
  console.error("⚠️ 请先在 HTML 中引入 LeanCloud SDK：");
  console.error('<script src="https://unpkg.com/leancloud-storage@4.15.0/dist/av-min.js"></script>');
}

// =======================
// 🚀 登录校验
// =======================
(function() {
  const token = localStorage.getItem("proton_token");
  const user = localStorage.getItem("proton_user");
  const currentPage = window.location.pathname.split("/").pop();

  if ((!token || !user) && currentPage !== "login.html") {
    console.warn("🚪 未检测到登录信息，跳转到登录页...");
    window.location.href = "login.html";
  }
})();

console.log("✅ 质子 2 号 · 系统配置加载完成");
