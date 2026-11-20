// =============================
// ELEMENTEN
// =============================

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const messages = document.getElementById("messages");
const welcomeScreen = document.getElementById("welcomeScreen");

const newChatButton = document.getElementById("newChat");

const suggestions = document.querySelectorAll(".suggestion");


// =============================
// NIEUW GESPREK
// =============================

function newChat() {
    messages.innerHTML = "";

    messages.classList.remove("active");

    welcomeScreen.style.display = "block";

    messageInput.value = "";

    messageInput.focus();
}

newChatButton.addEventListener("click", newChat);


// =============================
// BERICHT VERSTUREN
// =============================

function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) return;

    welcomeScreen.style.display = "none";

    messages.classList.add("active");

    addMessage(text, "user");

    messageInput.value = "";

    messageInput.style.height = "auto";

    showTyping();

    setTimeout(() => {

        removeTyping();

        const reply = getAIResponse(text);

        addMessage(reply, "ai");

    }, 900);

}


// =============================
// BERICHT TOEVOEGEN
// =============================

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className = `message ${sender}`;

    const avatar = document.createElement("div");

    avatar.className = "message-avatar";

    avatar.textContent = sender === "ai" ? "P" : "J";

    const content = document.createElement("div");

    content.className = "message-content";

    // Veilig tekst weergeven, geen HTML uitvoeren
    content.textContent = text;

    message.appendChild(avatar);
    message.appendChild(content);

    messages.appendChild(message);

    scrollToBottom();
}


// =============================
// TYPING INDICATOR
// =============================

function showTyping() {

    const typing = document.createElement("div");

    typing.className = "message ai";
    typing.id = "typingIndicator";

    typing.innerHTML = `
        <div class="message-avatar">P</div>

        <div class="message-content">
            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messages.appendChild(typing);

    scrollToBottom();
}


function removeTyping() {

    const typing = document.getElementById("typingIndicator");

    if (typing) {
        typing.remove();
    }

}


// =============================
// DEMO AI
// =============================

function getAIResponse(question) {

    const q = question.toLowerCase();

    if (q.includes("zwart-wit")) {

        return `Je kunt je video zwart-wit maken met Lumetri Color.

1. Selecteer je clip in de tijdlijn.
2. Open Lumetri Color.
3. Zoek naar Saturation (verzadiging).
4. Zet Saturation op 0.

Je video is nu zwart-wit!`;

    }


    if (q.includes("zoom")) {

        return `Je kunt een smooth zoom maken met keyframes.

1. Selecteer je videoclip.
2. Open Effect Controls.
3. Zoek Motion.
4. Klik op het stopwatch-icoon bij Scale.
5. Ga verder in de tijd.
6. Verhoog Scale.
7. Gebruik Ease In en Ease Out voor een vloeiende beweging.

Zo maak je een smooth zoom!`;

    }


    if (q.includes("audio") || q.includes("geluid")) {

        return `Je kunt het volume van je audio aanpassen.

1. Selecteer je audioclip.
2. Open Effect Controls.
3. Zoek Volume.
4. Pas Level aan.

Je kunt ook Audio Gain gebruiken om het volume aan te passen.`;

    }


    if (q.includes("export")) {

        return `Zo exporteer je je video:

1. Ga naar File.
2. Klik op Export.
3. Kies Media.
4. Kies het formaat H.264.
5. Kies een preset die bij je video past.
6. Controleer de locatie.
7. Klik op Export.

H.264 is een veelgebruikt formaat voor video's die je online wilt delen.`;

    }


    return `Interessante vraag!

In deze demo is de echte AI nog niet aangesloten.

Zodra we de AI koppelen, kan Premiere AI je vraag inhoudelijk beantwoorden met uitleg die speciaal gericht is op Adobe Premiere Pro.

Je vraag was:
"${question}"`;

}


// =============================
// ENTER TO SEND
// =============================

messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});


// =============================
// SEND BUTTON
// =============================

sendButton.addEventListener("click", sendMessage);


// =============================
// AUTO RESIZE INPUT
// =============================

messageInput.addEventListener("input", () => {

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 150) + "px";

});


// =============================
// SUGGESTIONS
// =============================

suggestions.forEach(button => {

    button.addEventListener("click", () => {

        messageInput.value = button.dataset.question;

        sendMessage();

    });

});


// =============================
// SCROLL
// =============================

function scrollToBottom() {

    messages.scrollTop = messages.scrollHeight;

}
