function addMessage(role, text) {
  const div = document.createElement("div");
  const isUser = role === "你";
  div.className = isUser ? "flex justify-end" : "flex justify-start";

  div.innerHTML = `
    <div class="flex items-end ${isUser ? 'flex-row-reverse' : ''} space-x-2">
      <img src="${isUser ? 'https://source.unsplash.com/40x40/?boy' : 'https://source.unsplash.com/40x40/?girl,anime'}"
        class="w-8 h-8 rounded-full shadow-md">
      <div class="chat-bubble ${isUser ? 'bg-pink-500 text-white' : 'bg-white/70 text-gray-800 backdrop-blur-sm'}">
        ${text}
      </div>
    </div>
  `;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatHistory.push({ role, text });
  localStorage.setItem("sofia_history", JSON.stringify(chatHistory));
}
