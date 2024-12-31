// script.js

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');
const themeToggle = document.getElementById('theme-toggle');

// Function to add a new message to the chat window
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatWindow.appendChild(messageDiv);
    
    // Show the message with animation
    setTimeout(() => messageDiv.classList.add('show'), 100);

    // Automatically scroll the chat window to the newest message
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to handle the sending of the message
function sendMessage() {
    const query = userInput.value.trim();
    if (!query) return; // Exit if the input is empty

    appendMessage(query, 'user'); // Show user message in chat window
    userInput.value = ''; // Clear the input field

    // Show typing indicator before bot response
    typingIndicator.style.display = 'block';

    // Send the query to the back-end
    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
    .then(response => response.json())
    .then(data => {
        // Hide typing indicator after receiving the bot's response
        typingIndicator.style.display = 'none';

        if (data.error) {
            appendMessage('Error: ' + data.error, 'bot');
        } else {
            appendMessage(data.response, 'bot'); // Show bot's response in chat window
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        appendMessage('An error occurred while processing your request.', 'bot');
        typingIndicator.style.display = 'none'; // Hide typing indicator if there's an error
    });
}

// Event listener for sending message when clicking the send button
sendButton.addEventListener('click', sendMessage);

// Event listener for sending message when pressing "Enter"
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Dark mode toggle event listener
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
