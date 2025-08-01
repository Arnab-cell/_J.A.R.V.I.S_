---

### 📄 `README.md` – Jarvis AI Backend (FastAPI + LangChain + DeepSeek)

---

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![LangChain](https://img.shields.io/badge/LangChain-AI%20Agent-purple)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)

---

## 💡 Overview

This is the **backend engine for J.A.R.V.I.S AI**, built with:

* ⚡ **FastAPI** — lightning-fast Python web framework
* 🧠 **LangChain** — enables language model chains and tool-based agents
* 🤖 **API** — LLM used for chatbot responses
* 🔧 **uv** — ultra-fast Python package manager
* 🌐 Ready to connect with any React-based frontend

---

## 🚀 Features

* Talk to Jarvis via `/ask` endpoint
* LangChain-based chatbot using DeepSeek
* `.env` configuration for secure API keys
* Ready to plug into Vite + React frontend
* Scalable, modular structure
* Dev server auto-reload support

---

## 🗂️ Folder Structure

```
backend/
├── app/
│   ├── main.py               # FastAPI app + LangChain logic
│   ├── agent                 # main folder that contains agent code and its tools
│   ├── services              # folder that contains specefic services code like DeepSeek api services
│   ├── tools                 # folder that contains functions that is used as tool for Jarvis agent
├── .env                      # Your AI (OpenAI, DeepSeek etc.) API key
├── pyproject.toml            # uv project setup
├── app.py                    # Start server script
└── README.md                 # You're reading this
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/jarvis-backend.git
cd backend
```

### 2. Switch to the new backend branch

```bash
git switch feature/python-backend-for-AI
```

### 3. Install `uv` (only once)

```bash
pip install uv
```

### 4. Setup & Activate Virtual Env

```bash
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
```

### 5. Install Dependencies

```bash
uv add fastapi uvicorn python-dotenv langchain langchain-community langchain-openai openai requests
```

### Versions

```
"fastapi>=0.116.1",
"httpx>=0.28.1",
"langchain>=0.3.27",
"langchain-community>=0.3.27",
"langchain-openai>=0.3.28",
"openai>=1.97.1",
"python-dotenv>=1.1.1",
"requests>=2.32.4",
"uvicorn>=0.35.0",
```

### 6. Add `.env` File in backend folder

```env
API_KEY=your_api_key

# API for Jokes
Joke_URI=https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun,Spooky?blacklistFlags=racist,sexist&format=txt&type=single

CORS_ORIGINS=http://localhost:5173 # Adjust this to your frontend URL
```

### Note:
Don't forgot to change the model name and openai_api_base arguments here. If you are using other LLM model api key.

```
self.llm = ChatOpenAI(
                model_name="deepseek/deepseek-r1-0528:free",
                api_key=self.api, # Using 'api_key' for DeepSeek authentication
                openai_api_base="https://openrouter.ai/api/v1",
            )
```

---

## 🏁 Run the Server

```bash
uv run app.py # Only run this from backend folder after activating virtual environment
```

Or manually:

```bash
uvicorn app.main:app --reload
```

---

## 🔌 API Usage

### 🧠 `POST /ask`

Ask anything and Jarvis will respond intelligently.

#### 📦 Example JSON Body

```json
{
  "query": "What is the value of root under 4?"
}
```

#### ✅ Response:

```json
{
  "response": "The value of root under 4 is **2**."
}
```

---

## 🧩 Frontend Integration Notes

If you are using React (with Vite), just connect the endpoint:

```js
fetch("http://localhost:8000/ask", { # Just a dummy url use actual one buy running the backend server
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "Hello Jarvis" }),
})
.then(res => res.json())
.then(data => console.log(data.response));
```

> 🔁 *If any path errors occur after folder structure updates, double-check import paths and adjust relative references.*

---

## 🛠️ Planned Agent Features (In Progress)

| Feature                     | Status  |
| --------------------------- | ------- |
| ✅ Chatbot with DeepSeek     | Done    |
| 🎵 Play music               | Soon    |
| 💻 Open desktop apps        | Soon    |
| 🌐 Web search               | Soon    |
| 📖 Read/summarize PDFs      | Soon    |
| 📁 Tool-based agent actions | Planned |
| 💬 Memory and chat history  | Planned |

---

## 🙋 Contribution & Feedback

* Try running the server
* Send feedback or issues on WhatsApp or GitHub

---
