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
        filepath = Path(f"LLM/metrics/results/{self.name}.csv")
        existing_models = set()
        if filepath.exists():
            existing_df = pd.read_csv(filepath)
            existing_models = set(existing_df["name"].unique())

        for bot in self.models:
            if bot.name in existing_models:
                print(f"Skipping {bot.name} for task: {self.name} (already in csv)")
                continue

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

        if self.generations:
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

        if filepath.exists():
            existing_df = pd.read_csv(filepath)
            combined_df = pd.concat([existing_df, df], ignore_index=True)
        else:
            combined_df = df

        combined_df.to_csv(filepath, index=False)


# Initialize ChatBots
qwenOld1bTools = ChatBot(
    model="qwen2.5:1.5b-instruct-q8_0", use_rag=False, use_tools=True, TESTING=True
)
qwenOld1bTools.name = "qwen2.5:1.5b-instruct-q8_0 Tools"

qwenOld1bRag = ChatBot(
    model="qwen2.5:1.5b-instruct-q8_0", use_rag=True, use_tools=False, TESTING=True
)
qwenOld1bRag.name = "qwen2.5:1.5b-instruct-q8_0 Rag"


qwenOld7bTools = ChatBot(
    model="qwen2.5:7b-instruct", use_rag=False, use_tools=True, TESTING=True
)
qwenOld7bTools.name = "qwen2.5:7b-instruct Tools"

qwenOld7bRag = ChatBot(
    model="qwen2.5:7b-instruct", use_rag=True, use_tools=False, TESTING=True
)
qwenOld7bRag.name = "qwen2.5:7b-instruct Rag"


qwen4bTools = ChatBot(
    model="qwen3:4b-q8_0", use_rag=False, use_tools=True, TESTING=True
)
qwen4bTools.name = "qwen3:4b-q8_0 Tools"

qwen4bNtTools = ChatBot(
    model="qwen3:4b-q8_0", use_rag=False, use_tools=True, use_thinking=False, TESTING=True
)
qwen4bNtTools.name = "qwen3:4b-q8_0 nt Tools"

qwen4bRag = ChatBot(model="qwen3:4b-q8_0", use_rag=True, use_tools=False, TESTING=True)
qwen4bRag.name = "qwen3:4b-q8_0 Rag"

qwen4bNtRag = ChatBot(
    model="qwen3:4b-q8_0", use_rag=True, use_tools=False, use_thinking=False, TESTING=True
)
qwen4bNtRag.name = "qwen3:4b-q8_0 nt Rag"


phi4miniRag = ChatBot(
    model="phi4-mini:3.8b", use_rag=True, use_tools=False, TESTING=True
)
phi4miniRag.name = "phi4mini Rag"

phi4miniTools = ChatBot(
    model="phi4-mini:3.8b", use_rag=False, use_tools=True, TESTING=True
)
phi4miniTools.name = "phi4mini Tools"


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
simple_addition_task.assign_models(
    [qwen4bTools, qwen4bNtTools, phi4miniTools, qwenOld1bTools, qwenOld7bTools]
)
next_task.assign_models(
    [qwen4bTools, qwen4bNtTools, phi4miniTools, qwenOld1bTools, qwenOld7bTools]
)
llm_in_project_task.assign_models(
    [qwen4bRag, qwen4bNtRag, phi4miniRag, qwenOld1bRag, qwenOld7bRag]
)

# Run tasks
simple_addition_task.run()
next_task.run()
llm_in_project_task.run()
