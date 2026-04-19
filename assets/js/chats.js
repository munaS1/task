/**
 * File: chats.js
 * Purpose: AS Chats interactions
 * Notes:
 * - Keeps the current AS structure untouched
 * - Adds live chat behaviors, search, filters, typing, quick replies
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const app = document.querySelector("[data-as-chat-app]");
  if (!app) return;

  const chatItems = Array.from(app.querySelectorAll(".ASChatItem"));
  const searchInput = app.querySelector("[data-as-chat-search]");
  const filterButtons = Array.from(app.querySelectorAll(".ASChatsFilter"));
  const messagesWrap = app.querySelector("[data-as-chat-messages]");
  const messageInput = app.querySelector("[data-as-chat-input]");
  const sendBtn = app.querySelector("[data-as-chat-send]");
  const quickReplies = Array.from(app.querySelectorAll("[data-quick-reply]"));

  const stageName = app.querySelector("[data-as-chat-name]");
  const stageRole = app.querySelector("[data-as-chat-role]");
  const stageAvatar = app.querySelector("[data-as-chat-avatar]");
  const stagePresence = app.querySelector("[data-as-chat-presence]");

  const sideName = app.querySelector("[data-as-chat-side-name]");
  const sideRole = app.querySelector("[data-as-chat-side-role]");
  const sideAvatar = app.querySelector("[data-as-chat-side-avatar]");
  const sideEmail = app.querySelector("[data-as-chat-email]");
  const sidePhone = app.querySelector("[data-as-chat-phone]");
  const sideStatusText = app.querySelector("[data-as-chat-status-text]");
  const sideStatMessages = app.querySelector("[data-as-chat-stat-messages]");

  const favoriteBtn = app.querySelector('[data-as-chat-action="favorite"]');

  let activeFilter = "all";
  let activeChatId = "c1";
  let messageCounter = messagesWrap.querySelectorAll(".ASMessage").length;

  const autoReplies = [
    "تم الاستلام، شكرًا لك. سأرسل النسخة خلال دقائق.",
    "ممتاز، تم اعتماد المطلوب من جانبي.",
    "وصلتني الرسالة، وسأراجع التفاصيل مباشرة.",
    "شكرًا، سأشارك النسخة النهائية فور جهوزيتها.",
    "تم، وسأوافيك بالتحديثات أولًا بأول."
  ];

  function getStatusLabel(status) {
    if (status === "online") return "متصل الآن";
    if (status === "typing") return "جاري الكتابة";
    return "غير متصل";
  }

  function getPresenceClass(status) {
    if (status === "online") return "is-online";
    if (status === "typing") return "is-typing";
    return "is-offline";
  }

  function getAvatarContent(item) {
    const avatar = item.querySelector(".ASChatItemAvatar");
    return avatar ? avatar.innerHTML : "م";
  }

  function getAvatarClass(item) {
    const avatar = item.querySelector(".ASChatItemAvatar");
    if (!avatar) return "ASChatItemAvatar--primary";

    const matched = Array.from(avatar.classList).find((cls) => cls.startsWith("ASChatItemAvatar--"));
    return matched || "ASChatItemAvatar--primary";
  }

  function setPresence(el, status) {
    el.classList.remove("is-online", "is-typing", "is-offline");
    el.classList.add(getPresenceClass(status));
  }

  function updateActiveChat(item) {
    if (!item) return;

    chatItems.forEach((chat) => chat.classList.remove("is-active"));
    item.classList.add("is-active");

    activeChatId = item.dataset.chatId;

    const name = item.dataset.name || "";
    const role = item.dataset.role || "";
    const status = item.dataset.status || "offline";
    const email = item.dataset.email || "-";
    const phone = item.dataset.phone || "-";

    stageName.textContent = name;
    stageRole.textContent = role;
    setPresence(stagePresence, status);

    sideName.textContent = name;
    sideRole.textContent = role;
    sideEmail.textContent = email;
    sidePhone.textContent = phone;
    sideStatusText.textContent = getStatusLabel(status);

    const avatarHtml = getAvatarContent(item);
    const avatarClass = getAvatarClass(item);

    stageAvatar.className = `ASChatsStageAvatar ASChatItemAvatar ${avatarClass}`;
    sideAvatar.className = `ASChatsDetailsAvatar ASChatItemAvatar ${avatarClass}`;

    stageAvatar.innerHTML = avatarHtml;
    sideAvatar.innerHTML = avatarHtml;

    const unreadBadge = item.querySelector(".ASChatItemBadge");
    if (unreadBadge) unreadBadge.remove();

    item.dataset.unread = "0";
    sideStatMessages.textContent = String(10 + Math.floor(Math.random() * 8));

    renderConversation(name, status);
  }

  function renderConversation(name, status) {
    const conversations = {
      c1: [
        { type: "received", text: "صباح الخير، هل تم تحديث عرض المبادرات قبل الاجتماع؟", time: "09:34" },
        { type: "sent", text: "صباح النور، نعم تم التحديث وإضافة الملاحظات الجديدة.", time: "09:36" },
        { type: "file", title: "Initiatives-Deck-v2.pdf", meta: "PDF • 2.4 MB", time: "09:38" },
        { type: "received", text: "رائع جدًا، أرسلي أيضًا نسخة مختصرة للعرض التنفيذي.", time: "09:40" }
      ],
      c2: [
        { type: "received", text: "واجهنا ملاحظة في الربط مع لوحة البيانات.", time: "10:02" },
        { type: "sent", text: "تم، هل المشكلة من الصلاحيات أو من البيانات؟", time: "10:05" },
        { type: "received", text: "أغلب الظن من الصلاحيات. أرسل لك التفاصيل.", time: "10:08" }
      ],
      c3: [
        { type: "received", text: "تم اعتماد نسخة التقرير من الإدارة.", time: "08:00" },
        { type: "received", text: "نحتاج الآن نسخة مختصرة للعرض القيادي.", time: "08:07" },
        { type: "sent", text: "ممتاز، سأجهز نسخة مختصرة خلال هذا الصباح.", time: "08:15" }
      ],
      c4: [
        { type: "received", text: "تم إغلاق البلاغ رقم 2481 بنجاح.", time: "أمس" },
        { type: "sent", text: "شكرًا لكم، تم استلام التحديث.", time: "أمس" }
      ],
      c5: [
        { type: "received", text: "نحتاج نسخة النشر النهائي قبل 11 صباحًا.", time: "07:10" },
        { type: "sent", text: "جاري المراجعة النهائية الآن.", time: "07:18" }
      ]
    };

    const data = conversations[activeChatId] || [];
    messagesWrap.innerHTML = `
      <div class="ASChatDayDivider"><span>اليوم</span></div>
      ${data.map((message) => buildMessageMarkup(message)).join("")}
    `;

    if (status === "typing") {
      insertTypingIndicator();
    }

    scrollMessagesToBottom();
  }

  function buildMessageMarkup(message) {
    if (message.type === "file") {
      return `
        <article class="ASMessage ASMessage--received">
          <div class="ASMessageBubble ASMessageBubble--file">
            <div class="ASMessageFileIcon">
              <i class="fa-regular fa-file-lines"></i>
            </div>
            <div class="ASMessageFileMeta">
              <strong>${escapeHtml(message.title)}</strong>
              <small>${escapeHtml(message.meta)}</small>
            </div>
            <span class="ASMessageTime">${escapeHtml(message.time)}</span>
          </div>
        </article>
      `;
    }

    return `
      <article class="ASMessage ASMessage--${message.type}">
        <div class="ASMessageBubble">
          <p>${escapeHtml(message.text)}</p>
          <span class="ASMessageTime">${escapeHtml(message.time)}</span>
        </div>
      </article>
    `;
  }

  function insertTypingIndicator() {
    removeTypingIndicator();

    const typing = document.createElement("article");
    typing.className = "ASMessage ASMessage--received";
    typing.setAttribute("data-as-typing", "true");
    typing.innerHTML = `
      <div class="ASMessageTyping">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesWrap.appendChild(typing);
  }

  function removeTypingIndicator() {
    const typing = messagesWrap.querySelector("[data-as-typing='true']");
    if (typing) typing.remove();
  }

  function scrollMessagesToBottom() {
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  function getNowTime() {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function addMessage(text, type = "sent") {
    removeTypingIndicator();

    const article = document.createElement("article");
    article.className = `ASMessage ASMessage--${type}`;
    article.innerHTML = `
      <div class="ASMessageBubble">
        <p>${escapeHtml(text)}</p>
        <span class="ASMessageTime">${getNowTime()}</span>
      </div>
    `;

    messagesWrap.appendChild(article);
    messageCounter += 1;
    sideStatMessages.textContent = String(messageCounter);
    scrollMessagesToBottom();
  }

  function simulateReply() {
    const activeItem = app.querySelector(`.ASChatItem[data-chat-id="${activeChatId}"]`);
    if (!activeItem) return;

    activeItem.dataset.status = "typing";
    setPresence(stagePresence, "typing");
    sideStatusText.textContent = getStatusLabel("typing");

    const dot = activeItem.querySelector(".ASChatItemDot");
    if (dot) {
      dot.classList.remove("is-online", "is-offline");
      dot.classList.add("is-typing");
    }

    insertTypingIndicator();

    window.setTimeout(() => {
      removeTypingIndicator();

      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      addMessage(reply, "received");

      activeItem.dataset.status = "online";
      activeItem.dataset.last = reply;

      const snippet = activeItem.querySelector(".ASChatItemSnippet");
      if (snippet) snippet.textContent = reply;

      setPresence(stagePresence, "online");
      sideStatusText.textContent = getStatusLabel("online");

      if (dot) {
        dot.classList.remove("is-typing", "is-offline");
        dot.classList.add("is-online");
      }
    }, 1400);
  }

  function sendCurrentMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    addMessage(text, "sent");
    updateCurrentChatPreview(text);
    messageInput.value = "";
    autoResizeTextarea();
    simulateReply();
  }

  function updateCurrentChatPreview(text) {
    const activeItem = app.querySelector(`.ASChatItem[data-chat-id="${activeChatId}"]`);
    if (!activeItem) return;

    activeItem.dataset.last = text;

    const snippet = activeItem.querySelector(".ASChatItemSnippet");
    const time = activeItem.querySelector(".ASChatItemTime");

    if (snippet) snippet.textContent = text;
    if (time) time.textContent = getNowTime();
  }

  function autoResizeTextarea() {
    messageInput.style.height = "auto";
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, 150)}px`;
  }

  function applySearchAndFilter() {
    const query = (searchInput.value || "").trim().toLowerCase();

    chatItems.forEach((item) => {
      const name = (item.dataset.name || "").toLowerCase();
      const last = (item.dataset.last || "").toLowerCase();
      const unread = Number(item.dataset.unread || "0");
      const status = item.dataset.status || "offline";

      let visible = true;

      if (query && !name.includes(query) && !last.includes(query)) {
        visible = false;
      }

      if (activeFilter === "unread" && unread < 1) {
        visible = false;
      }

      if (activeFilter === "online" && status !== "online" && status !== "typing") {
        visible = false;
      }

      item.classList.toggle("is-chat-hidden", !visible);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  chatItems.forEach((item) => {
    item.addEventListener("click", () => {
      updateActiveChat(item);
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      activeFilter = button.dataset.filter || "all";
      applySearchAndFilter();
    });
  });

  searchInput.addEventListener("input", applySearchAndFilter);

  sendBtn.addEventListener("click", sendCurrentMessage);

  messageInput.addEventListener("input", autoResizeTextarea);

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendCurrentMessage();
    }
  });

  quickReplies.forEach((button) => {
    button.addEventListener("click", () => {
      messageInput.value = button.dataset.quickReply || "";
      autoResizeTextarea();
      messageInput.focus();
    });
  });

  if (favoriteBtn) {
    favoriteBtn.addEventListener("click", () => {
      const icon = favoriteBtn.querySelector("i");
      if (!icon) return;

      const isFilled = icon.classList.contains("fa-solid");
      icon.className = isFilled ? "fa-regular fa-star" : "fa-solid fa-star";
      favoriteBtn.classList.toggle("is-favorited", !isFilled);
    });
  }

  app.querySelectorAll("[data-as-chat-action='voice']").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-recording");
    });
  });

  app.querySelectorAll("[data-as-chat-action='compose']").forEach((button) => {
    button.addEventListener("click", () => {
      messageInput.focus();
      messageInput.placeholder = "ابدئي محادثة جديدة...";
    });
  });

  renderConversation("سارة أحمد", "online");
  autoResizeTextarea();
  scrollMessagesToBottom();
});