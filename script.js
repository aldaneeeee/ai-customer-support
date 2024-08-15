document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const userInput = document.getElementById('userInput');
    const aiResponseElement = document.getElementById('ai-response');

    function typeWriter(element, text, speed) {
        let index = 0;
        const length = text.length;

        function type() {
            if (index < length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    sendButton.addEventListener('click', async () => {
        const message = userInput.value;
        if (!message) return;

        // Clear the user input
        userInput.value = '';

        // Send message to server and receive response
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (data.response) {
                aiResponseElement.innerHTML = ''; // Clear previous responses
                typeWriter(aiResponseElement, data.response, 50); // Adjust typing speed as needed
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });

    clearButton.addEventListener('click', () => {
        userInput.value = '';
        aiResponseElement.innerHTML = ''; // Clear AI response
    });
});
