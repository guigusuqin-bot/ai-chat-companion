// === 质子 2 号 · 综合配置文件 ===
// 集成硅基流动 AI + LeanCloud 数据存储系统

// =======================
// 🧠 AI 配置（硅基流动）
// =======================
const CONFIG = {
  API_KEY: "sk-hznedgywaoacmdqyjikpdydkueenugtzsuewokojsyhspwxp",  // 你的硅基流动密钥
  API_URL: "https://api.siliconflow.cn/v1/chat/completions",
  MODEL: "Qwen/Qwen2-7B-Instruct"
};

// =======================
// ☁️ 数据库配置（LeanCloud）
// =======================
// ⚠️ 请替换为你的 LeanCloud 应用信息
const AV_APP_ID = "你的 LeanCloud appId";
const AV_APP_KEY = "你的 LeanCloud appKey";
const AV_SERVER_URL = "你的 LeanCloud serverURL";

// 初始化 LeanCloud
AV.init({
  appId: AV_APP_ID,
  appKey: AV_APP_KEY,
  serverURL: AV_SERVER_URL
});

console.log("✅ 质子 2 号 已连接 LeanCloud 数据中心");

// =======================
// 🚀 导出配置（供主脚本调用）
// =======================
export { CONFIG };
