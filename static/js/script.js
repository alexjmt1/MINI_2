document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickBtns = document.querySelectorAll('.quick-btn');

    // Add message to chat
    function addMessage(text, isUser, source) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        // Add source indicator
        if (!isUser && source) {
            text += `<div class="source">(${source})</div>`;
        }
        
        // Format code blocks
        if (!isUser && text.includes('```')) {
            const parts = text.split('```');
            let formatted = '';
            for (let i = 0; i < parts.length; i++) {
                formatted += i % 2 === 1 
                    ? `<pre>${parts[i]}</pre>` 
                    : parts[i].replace(/\n/g, '<br>');
            }
            messageDiv.innerHTML = formatted;
        } else {
            messageDiv.innerHTML = text;
        }
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Send message to server
    async function sendMessage(message) {
        addMessage(message, true);
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            if (data.error) {
                addMessage(`Error: ${data.error}`, false);
            } else {
                addMessage(data.response, false, data.source);
            }
        } catch (error) {
            addMessage(`Error: ${error.message}`, false);
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    // Quick question buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.dataset.question;
            sendBtn.click();
        });
    });
});
