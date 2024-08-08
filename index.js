import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
dotenv.config();

const app = express();
const port = 3003;
const openai = new OpenAI({
  apiKey:
    "sk-Ww8A0t_1Pczyco7UnsDcZLnHe2SiDTGkiy_0YKgvJyT3BlbkFJfGgA_-U-Dn30Top9kj_mjVagL9xTyptaYHQygRU6MA",
});
const assistant_id = "asst_ngIBjA2gBVqoGvrwF3fcagPJ";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      throw new Error("Missing query parameter.");
    }

    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: query,
    });

    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant_id,
    });

    let response;
    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        if (message.role == "assistant") {
          response = { role: "Turo", content: message.content[0].text.value };
        }
      }
    }

    if (response) {
      res.status(200).json(response);
    } else {
      throw new Error("An error ocurred, please try again later");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
