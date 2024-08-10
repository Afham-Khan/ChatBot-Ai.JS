const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "AIzaSyBl57P9lab4C6Uxve1-VX0-K6hUIIS4vA8";  // Your API key from Google Gemini
const inputInitHeight = chatInput.scrollHeight;

const generateResponse = async (thinkingMessageElement) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: userMessage }]
            }]
        })
    };

    const startTime = performance.now();  // Start time measurement

    try {
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text; // Adjust according to the API response format
        
        const endTime = performance.now();  // End time measurement
        console.log(`API response time: ${endTime - startTime} ms`);  // Log response time

        // Remove the "Thinking..." message
        thinkingMessageElement.remove();
        // Add the actual response
        chatbox.appendChild(createChatLi(reply, "incoming"));
    } catch (error) {
        console.error('Error fetching response:', error.message);
        // Remove the "Thinking..." message
        thinkingMessageElement.remove();
        chatbox.appendChild(createChatLi("Oops Something went wrong. Please try again!", "incoming"));
    }
}

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent = className === "outgoing" ? `<p>${message}</p>` : ` <span class="material-symbols-outlined"> robot_2 </span> <p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    // Add "Thinking..." message
    const thinkingMessageElement = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(thinkingMessageElement);

    // Generate response and handle it
    setTimeout(() => {
        generateResponse(thinkingMessageElement);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
