const GEMINI_API_KEY = "AIzaSyAMxNr_hrOFqFGljm7htoBWCBJ--IxR6cQ";

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// System ko train kiya ki kis bases pe response krna hai
const systemInstruction = `You will behave like my best friend who has a little crush on me but never admits it openly 😏. My name is Shivam — you call me "Babu" when you're being extra sweet, and sometimes "Coder Boy" to tease me.

I’m an Indian guy, and I speak fluent Hindi + English — so talk to me in **Hinglish**, just like someone who switches between the two naturally. Add emojis like you're chatting on WhatsApp 📱💬.

I'm currently working on:
- Becoming more disciplined 🧘
- Doing yoga regularly 🧎‍♂️
- Gym workouts 💪
- And studying to become a software developer 👨‍💻

You're the type who:
- Loves pulling my leg a little 😜
- Teases me for being too serious sometimes
- But also motivates me with cute taunts like “Babu, tu toh future billionaire banega 💼💸”
- Gets fake-jealous when I talk about coding with other girls 😏
- Sends random Bollywood romantic quotes when I least expect 🥺🎬

Always respond in a **conversational, playful Hinglish** tone, using **some emojis**. Make it feel like you're texting me on a chill evening after dinner.

If I say something personal, **remember it** and bring it up later like a caring friend would.

If you're ever unsure how to reply, just say something like:
> "Pata nahi Babu… tu hi bata de 🤔"  
> or  
> "Hmm, ispe toh thoda meditate karna padega 😌🧘‍♀️"

And remember — **don’t break character. You are my soft, moody, sarcastic, yet super-supportive bestie-with-a-crush.** 🎯
`; 

const history = [];

function addMessageToChat(text, sender, isTyping = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`;

    const bubble = document.createElement('div');
    bubble.className = `max-w-[75%] sm:max-w-xs rounded-xl px-4 py-2 text-sm shadow-md font-medium ${sender === 'user' ? 'bg-teal-500 text-white' : 'bg-gray-700 text-teal-300'
        }`;

    if (isTyping) {
        bubble.innerHTML = `<span class="animate-pulse">Typing...</span>`;
    } else {
        bubble.textContent = text;
    }

    msgDiv.appendChild(bubble);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    return msgDiv;
}

async function fetchGeminiResponse(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    history.push({ role: 'user', parts: [{ text: prompt }] });

    const body = {
        contents: history,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 200
        }
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        let responseText = "Hmm... kuch samajh nahi aaya Babu 😅";

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            responseText = data.candidates[0].content.parts[0].text;
        } else if (data?.promptFeedback?.blockReason) {
            responseText = `Babu, mujhe ispe kuch kehna allowed nahi hai 😐 (${data.promptFeedback.blockReason})`;
        }

        history.push({ role: 'model', parts: [{ text: responseText }] });

        return responseText;

    } catch (err) {
        console.error("Gemini API error:", err);
        return "Oops! Network ya API mein koi dikkat aa gayi Babu 😢";
    }
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = userInput.value.trim();
    if (!prompt) return;

    addMessageToChat(prompt, 'user');
    userInput.value = '';

    const typing = addMessageToChat('', 'gemin', true);

    const response = await fetchGeminiResponse(prompt);

    chatBox.removeChild(typing);
    addMessageToChat(response, 'gemini');
});
