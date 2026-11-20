const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const welcome = document.getElementById("welcome");

let chatHistory = [];
let isLoading = false;

// Bericht toevoegen aan scherm
function addMessage(role, text) {
    const message = document.createElement("div");

    message.classList.add("message", role);

    const content = document.createElement("div");

    content.classList.add("message-content");

    content.textContent = text;

    message.appendChild(content);

    messagesContainer.appendChild(message);

    scrollToBottom();

    return message;
}

// Typ-indicator
function showTyping() {
    const typing = document.createElement("div");

    typing.classList.add("message", "assistant", "typing");

    typing.innerHTML = `
        <div class="message-content">
            Premiere AI denkt na...
        </div>
    `;

    messagesContainer.appendChild(typing);

    scrollToBottom();

    return typing;
}

// Scroll naar beneden
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Bericht versturen
async function sendMessage(text = null) {

    if (isLoading) return;

    const messageText = (text || userInput.value).trim();

    if (!messageText) return;

    isLoading = true;

    sendBtn.disabled = true;

    welcome.style.display = "none";

    userInput.value = "";

    userInput.style.height = "auto";

    addMessage("user", messageText);

    chatHistory.push({
        role: "user",
        content: messageText
    });

    const typing = showTyping();

    try {

        const response = await fetch("/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                messages: chatHistory
            })
        });

        const data = await response.json();

        typing.remove();

        if (!response.ok) {
            throw new Error(data.error || "Er ging iets mis.");
        }

        const answer = data.answer;

        addMessage("assistant", answer);

        chatHistory.push({
            role: "assistant",
            content: answer
        });

    } catch (error) {

        typing.remove();

        addMessage(
            "assistant",
            "Oeps! Er ging iets mis. " +
            "Controleer je internetverbinding en probeer het opnieuw."
        );

        console.error(error);

    } finally {

        isLoading = false;

        sendBtn.disabled = false;

        userInput.focus();

    }

}

// Klik op verzenden
sendBtn.addEventListener("click", () => {
    sendMessage();
});

// Enter verzendt, Shift + Enter maakt een nieuwe regel
userInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});

// Automatisch groter worden
userInput.addEventListener("input", () => {

    userInput.style.height = "auto";

    userInput.style.height =
        Math.min(userInput.scrollHeight, 180) + "px";

});

// Nieuwe chat
newChatBtn.addEventListener("click", () => {

    chatHistory = [];

    messagesContainer.innerHTML = "";

    welcome.style.display = "flex";

    userInput.value = "";

    userInput.style.height = "auto";

    userInput.focus();

});

// Suggestieknoppen
document.querySelectorAll(".suggestion").forEach(button => {

    button.addEventListener("click", () => {

        const question = button.dataset.question;

        sendMessage(question);

    });

});
