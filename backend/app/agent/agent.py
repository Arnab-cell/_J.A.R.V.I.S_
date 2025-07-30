#  Creating an agent class for the Ultron project using langchain
from dotenv import load_dotenv
import os
from langchain.agents import initialize_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


#  Loading environment variables from .env file 
load_dotenv()

#  Importing the tool list from the tool_list module
from .tool_list import TOOL_LIST

#  Creating Class for the Ultron Agent
class JarvisAgent:

    """
    JarvisAgent class to initialize and run the Jarvis agent.
    This class uses the DeepSeek API for natural language processing and
    various tools for answering questions.
    """

    def __init__(self):
        """ Initializes the JarvisAgent with necessary configurations.
        Loads the DeepSeek API key from environment variables and sets up the agent with tools.
        Raises:
            ValueError: If the DEEPSEEK_API_KEY environment variable is not set.
        """
        
        print("Initializing Jarvis Agent...")

        self.api = os.getenv("DEEPSEEK_API_KEY") # Loading API key from .env

        #  Initializing SringOutputParser
        self.parser = StrOutputParser()

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
            handle_parsing_errors=True,
            output_parser=self.parser,
            verbose=True
        )

        print("Agent initialized successfully.")
    
    def run_agent(self, query):
        """
        Method to run the agent with a given query.
        Args:
            query (str): The input query for the agent.
        Returns:
            str: The response from the agent.
        """

        print("Running agent with query:", query)
        #  Invoking the agent with the query
        response = self.agent.invoke({"input": query}) # giving input to the agent
        #  Parsing the response using StringOutputParser
        # new_response = self.parser.parse(response)

        # print("Agent response:", response)

        return response.get("output", response) # Sending response
        
