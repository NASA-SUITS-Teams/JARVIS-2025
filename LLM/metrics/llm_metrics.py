# import time
# import pandas as pd
#
# from pathlib import Path
# from LLM.utils.ChatBot import ChatBot
# from tqdm import tqdm
#
#
# class LLMTestCase:
#    def __init__(self, name, prompt, num_samples):
#        self.name = name
#        self.prompt = prompt
#        self.num_samples = num_samples
#        self.generations = {}
#
#    def save_to_csv(self):
#        rows = []
#        for name, generations in self.generations.items():
#            for i, generation in enumerate(generations):
#                rows.append(
#                    {
#                        "name": name,
#                        "generation_index": i,
#                        "output": generation["output"],
#                        "tools": generation["tools"],
#                        "time": generation["time"],
#                    }
#                )
#
#        df = pd.DataFrame(rows)
#
#        filepath = Path(f"LLM/metrics/results/{self.name}.csv")
#
#        filepath.parent.mkdir(parents=True, exist_ok=True)
#
#        df.to_csv(filepath, index=False)
#
#
# class LLMTestFramework:
#    def __init__(self):
#        self.test_cases = []
#
#    def add_test(self, test_case):
#        self.test_cases.append(test_case)
#
#    def run(self, bot):
#        for test in self.test_cases:
#            print(f"Running test: {test.name} on model: {bot.name}")
#            generations = []
#            for i in tqdm(range(test.num_samples)):
#                start = time.time()
#
#                output, tools = bot.get_response_stream(test.prompt, add_messages=False)
#
#                end = time.time()
#
#                generations.append(
#                    {"output": output, "tools": tools, "time": round(end - start, 4)}
#                )
#
#            test.generations[bot.name] = generations
#
#    def save_to_csvs(self):
#        for test in self.test_cases:
#            test.save_to_csv()
#
#
# tool_framework = LLMTestFramework()
#
# tool_framework.add_test(
#    LLMTestCase(name="Simple Addition", prompt="What is 5 + 4?", num_samples=5)
# )
#
# tool_framework.add_test(
#    LLMTestCase(
#        name="Next Task", prompt="What is the next recommended task?", num_samples=5
#    )
# )
#
#
# rag_framework = LLMTestFramework()
#
# rag_framework.add_test(
#    LLMTestCase(
#        name="LLM in Project",
#        prompt="How are LLMs used in this project?",
#        num_samples=5,
#    )
# )
#
# qwen4bTools = ChatBot(
#    model="qwen3:4b-q8_0", use_rag=False, use_tools=True, TESTING=True
# )
# qwen4bTools.name = "qwen3:4b-q8_0 Tools"
#
# qwen4bNtTools = ChatBot(
#    model="qwen3:4b-q8_0", use_rag=False, use_tools=True, THINKING=False, TESTING=True
# )
# qwen4bNtTools.name = "qwen3:4b-q8_0 nt Tools"
#
# qwen4bRag = ChatBot(model="qwen3:4b-q8_0", use_rag=True, use_tools=False, TESTING=True)
# qwen4bRag.name = "qwen3:4b-q8_0 Rag"
#
# qwen4bNtRag = ChatBot(
#    model="qwen3:4b-q8_0", use_rag=True, use_tools=False, THINKING=False, TESTING=True
# )
# qwen4bNtRag.name = "qwen3:4b-q8_0 nt Rag"
#
#
# tool_framework.run(qwen4bTools)
# tool_framework.run(qwen4bNtTools)
#
# tool_framework.save_to_csvs()
#
#
## rag_framework.run(qwen4bRag)
## rag_framework.run(qwen4bNtRag)
##
## rag_framework.save_to_csvs()

import time
import pandas as pd
from pathlib import Path
from LLM.utils.ChatBot import ChatBot
from tqdm import tqdm


class Task:
    def __init__(self, name, prompt, num_samples):
        self.name = name
        self.prompt = prompt
        self.num_samples = num_samples
        self.generations = {}

    def assign_models(self, models):
        self.models = models

    def run(self):
        for bot in self.models:
            print(f"Running task: {self.name} on model: {bot.name}")
            generations = []
            for i in tqdm(range(self.num_samples)):
                start = time.time()

                output, tools = bot.get_response_stream(self.prompt, add_messages=False)

                end = time.time()

                generations.append(
                    {"output": output, "tools": tools, "time": round(end - start, 4)}
                )

            self.generations[bot.name] = generations

        self.save_to_csv()

    def save_to_csv(self):
        rows = []
        for name, generations in self.generations.items():
            for i, generation in enumerate(generations):
                rows.append(
                    {
                        "name": name,
                        "generation_index": i,
                        "output": generation["output"],
                        "tools": generation["tools"],
                        "time": generation["time"],
                    }
                )

        df = pd.DataFrame(rows)

        filepath = Path(f"LLM/metrics/results/{self.name}.csv")

        filepath.parent.mkdir(parents=True, exist_ok=True)

        df.to_csv(filepath, index=False)


# Initialize ChatBots
qwen4bTools = ChatBot(
    model="qwen3:4b-q8_0", use_rag=False, use_tools=True, TESTING=True
)
qwen4bTools.name = "qwen3:4b-q8_0 Tools"

qwen4bNtTools = ChatBot(
    model="qwen3:4b-q8_0", use_rag=False, use_tools=True, THINKING=False, TESTING=True
)
qwen4bNtTools.name = "qwen3:4b-q8_0 nt Tools"

qwen4bRag = ChatBot(model="qwen3:4b-q8_0", use_rag=True, use_tools=False, TESTING=True)
qwen4bRag.name = "qwen3:4b-q8_0 Rag"

qwen4bNtRag = ChatBot(
    model="qwen3:4b-q8_0", use_rag=True, use_tools=False, THINKING=False, TESTING=True
)
qwen4bNtRag.name = "qwen3:4b-q8_0 nt Rag"


# Define tasks
simple_addition_task = Task(
    name="Simple Addition", prompt="What is 5 + 4?", num_samples=10
)
next_task = Task(
    name="Next Task", prompt="What is the next recommended task?", num_samples=15
)
llm_in_project_task = Task(
    name="LLM in Project", prompt="How are LLMs used in this project?", num_samples=10
)

# Assign models to tasks
simple_addition_task.assign_models([qwen4bTools, qwen4bNtTools])
next_task.assign_models([qwen4bTools, qwen4bNtTools])
llm_in_project_task.assign_models([qwen4bRag, qwen4bNtRag])

# Run tasks
simple_addition_task.run()
next_task.run()
llm_in_project_task.run()
