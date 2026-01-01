// === 💞 质子 2 号 · 国际节点综合配置文件 ===
// 集成硅基流动 AI + LeanCloud 国际节点（无需备案）
// 作者：guigusuqin-bot

// =======================
// 🧠 AI 配置（硅基流动）
// =======================
const CONFIG = {
  API_KEY: "sk-hznedgywaoacmdqyjikpdydkueenugtzsuewokojsyhspwxp", // 你的硅基流动密钥
  API_URL: "https://api.siliconflow.cn/v1/chat/completions",
  MODEL: "Qwen/Qwen2-7B-Instruct"
};

// =======================
// ☁️ 数据库配置（LeanCloud 国际节点）
// =======================
const AV_APP_ID = "aaTo5CCDLh4OEg4J40OpQ4j-MdYXbMMI";
const AV_APP_KEY = "bBC1u4IdXcesBDUbTKtnjzo";
const AV_SERVER_URL = "https://aato5ccd.api.lncldglobal.com";

// =======================
// 🔌 初始化 LeanCloud（国际节点）
// =======================
(function initLeanCloud() {
  if (typeof AV === "undefined") {
    console.error("⚠️ 未检测到 LeanCloud SDK，请确认在 HTML 中已引入：");
    console.error('<script src="https://unpkg.com/leancloud-storage@4.15.0/dist/av-min.js"></script>');
    return;
  }

  try {
    AV.init({
      appId: AV_APP_ID,
      appKey: AV_APP_KEY,
      serverURL: AV_SERVER_URL
    });
    console.log("✅ LeanCloud 国际节点初始化成功");
  } catch (err) {
    console.error("❌ LeanCloud 初始化失败：", err);
  }
})();

// =======================
// 🚀 登录状态自动验证（防止未登录访问）
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

// =======================
// 🧪 测试连接函数（可选调试用）
// =======================
async function testLeanCloudConnection() {
  try {
    const Test = AV.Object.extend("ConnectionTest");
    const obj = new Test();
    obj.set("timestamp", new Date().toISOString());
    obj.set("status", "ok");
    await obj.save();
    console.log("✅ 成功连接 LeanCloud 国际节点，数据已写入 ConnectionTest 表。");
  } catch (err) {
    console.error("❌ 无法连接 LeanCloud 国际节点：", err.message);
  }
}

// 取消注释以下行即可测试连接：
// testLeanCloudConnection();

console.log("✅ 质子 2 号（国际节点版）配置加载完成");
