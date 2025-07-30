#  Creating an agent class for the Ultron project using langchain
from dotenv import load_dotenv
import os
from langchain.agents import initialize_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate


#  Loading environment variables from .env file
load_dotenv()

#  Importing the tool list from the tool_list module
from .tool_list import TOOL_LIST

#  Creating Class for the Ultron Agent
class JarvisAgent:
    def __init__(self):
        print("Initializing Jarvis Agent...")

        self.api = os.getenv("DEEPSEEK_API_KEY") # Loading API key from .env

        if not self.api:
            raise ValueError("DEEPSEEK_API_KEY environment variable is not set.")

        self.tools = TOOL_LIST  # Using the imported TOOL_LIST

        self.llm = ChatOpenAI(
            model_name="deepseek/deepseek-r1:free",
            api_key=self.api, # Using 'api_key' for DeepSeek authentication
            openai_api_base="https://openrouter.ai/api/v1/",
            )

        self.prompt = PromptTemplate(
            input_variables=["input"],
                        template="""You are Jarvis, a friendly and intelligent AI.
            
            You know:
            - You are a helpful assistant.
            - You can answer questions about yourself and the world.
            - You can use tools to help answer questions.
            - You can use tools like jokes, music, news, and web search to help answer questions.
            
            Act as a helpful assistant and answer the question to the best of your ability.
            
            Act helpful, professional, and warm.
            
            User: {input}
            """
        )


        #  Initializing the agent with the LLM and tools
        self.agent = initialize_agent(
            tools=self.tools,
            prompt=self.prompt,
            llm=self.llm,
            agent="zero-shot-react-description",
            verbose=True
        )

        print("Agent initialized successfully.")
    
    def run_agent(self, query):
        print("Running agent with query:", query)
        
        response = self.agent.invoke({"input": query}) # giving input to the agent

        print("Agent response:", response)

        return response.get("output", response) # Sending response
        
