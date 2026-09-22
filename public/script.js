const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Riwayat percakapan yang dikirim ke backend, biar Gemini punya konteks (multi-turn).
const messages = [];

// ponytail: marked tanpa sanitizer. Cukup untuk output model sendiri; pakai DOMPurify kalau
// nanti ada sumber pesan lain selain Gemini.
function appendMessage(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `msg ${role === 'user' ? 'user' : 'bot'}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (role === 'user') {
    bubble.textContent = text;
  } else {
    bubble.innerHTML = marked.parse(text);
  }

  wrapper.appendChild(bubble);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble;
}

async function send(userMessage) {
  appendMessage('user', userMessage);
  messages.push({ role: 'user', text: userMessage });

  const thinking = appendMessage('bot', 'Coach Kal lagi mikir...');
  thinking.classList.add('thinking');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();

    if (!res.ok || !data.result) {
      thinking.textContent = data.error || 'Sorry, no response received.';
      messages.pop(); // jangan simpan turn yang gagal
      return;
    }

    thinking.classList.remove('thinking');
    thinking.innerHTML = marked.parse(data.result);
    messages.push({ role: 'model', text: data.result });
  } catch (err) {
    thinking.textContent = 'Failed to get response from server.';
    messages.pop();
  } finally {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;
  input.value = '';
  send(userMessage);
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => send(chip.textContent.trim()));
});
