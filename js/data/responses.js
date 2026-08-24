const defaultBlocks = [
  { type: "text", value: "Here is a concise starting point based on your message. You can adapt the details to your project." },
  { type: "list", value: "- Identify the goal and expected outcome.\n- Break the work into a few small, testable steps.\n- Review the result and refine the parts that need more detail." },
];

export const mockResponses = {
  code: [
    { type: "text", value: "Here is a simple implementation you can use as a foundation:" },
    { type: "code", language: "javascript", value: 'function formatGreeting(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(formatGreeting("there"));' },
    { type: "text", value: "The function is intentionally small, so it is easy to test and extend." },
  ],
  plan: [
    { type: "text", value: "A focused plan makes this easier to execute:" },
    { type: "list", value: "- Define the audience and success criteria.\n- Create the first useful version.\n- Gather feedback, then iterate on the highest-impact improvements." },
    { type: "table", value: "| Stage | Outcome |\n|-------|---------|\n| Discover | Clear scope |\n| Build | Working first version |\n| Refine | Polished result |" },
  ],
  default: defaultBlocks,
};

export const regeneratedResponses = [
  [
    { type: "text", value: "Here is another way to approach it: start with the smallest useful result, then expand only when it proves valuable." },
    { type: "list", value: "- Make one assumption explicit.\n- Ship a simple version.\n- Use feedback to decide what comes next." },
  ],
  [
    { type: "text", value: "A different perspective is to organize the work around outcomes instead of tasks." },
    { type: "table", value: "| Question | Why it matters |\n|----------|----------------|\n| Who is it for? | Sets the tone and detail level |\n| What changes? | Defines success |\n| What is next? | Keeps momentum |" },
  ],
];

const CODE_KEYWORDS = ["code", "javascript", "css", "scss", "html", "function", "bug", "typescript", "python", "react", "vue"];
const PLAN_KEYWORDS = ["plan", "project", "strategy", "roadmap", "compare", "organize", "structure"];

export function pickResponse(text) {
  const t = text.toLowerCase();
  if (CODE_KEYWORDS.some(k => t.includes(k))) return mockResponses.code;
  if (PLAN_KEYWORDS.some(k => t.includes(k))) return mockResponses.plan;
  return mockResponses.default;
}