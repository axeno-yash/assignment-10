export const promptSuggestions = [
    'Explain a complex topic simply',
    'Help me write and improve code',
    'Create a plan for a new project'
];

export const conversations = {
    text: [
        {
            role: 'user',
            content: 'What is the difference between var, let, and const in JavaScript?'
        },
        {
            role: 'assistant',
            content: [
                {
                    type: 'text',
                    value: 'The three keywords differ in **scope**, **hoisting behavior**, and **reassignment rules**:'
                },
                {
                    type: 'text',
                    value: '**var** — Function-scoped (or globally scoped if declared outside a function). Hoisted and initialized with `undefined`. Can be redeclared and reassigned. Avoid in modern code.'
                },
                {
                    type: 'text',
                    value: '**let** — Block-scoped (limited to the `{}` block). Hoisted but in the "temporal dead zone" until the declaration is reached. Can be reassigned but not redeclared in the same scope.'
                },
                {
                    type: 'text',
                    value: '**const** — Block-scoped like `let`, but cannot be reassigned. However, objects and arrays declared with `const` can still have their properties/elements modified.'
                },
                {
                    type: 'text',
                    value: '**Best practice:** Default to [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const), use `let` only when reassignment is needed, and avoid `var` entirely. This prevents accidental reassignments and makes intent clearer.'
                },
                {
                    type: 'code',
                    language: 'javascript',
                    value: '// var - avoid\nvar name = "Alice";\nvar name = "Bob"; // redeclaration allowed\n\n// let - when you need reassignment\nlet count = 0;\ncount = 1; // OK\n// let count = 2; // Error: redeclaration\n\n// const - default choice\nconst API_URL = "https://api.example.com";\nconst user = { name: "Alice" };\nuser.name = "Bob"; // OK - mutating property\n// user = {}; // Error: reassignment'
                }
            ]
        }
    ],
    table: [
        {
            role: 'user',
            content: 'Show me a comparison table of popular frontend frameworks'
        },
        {
            role: 'assistant',
            content: [
                {
                    type: 'text',
                    value: "Here's a practical comparison of major frontend frameworks as of 2024:"
                },
                {
                    type: 'table',
                    value: '| Framework | Language | Bundle Size | Learning Curve | Rendering | Best For |\n|-----------|----------|-------------|----------------|-----------|----------|\n| React | JS/TS | ~42 KB | Moderate | Client/Server | Large apps, rich ecosystem |\n| Vue 3 | JS/TS | ~34 KB | Gentle | Client/Server | Progressive adoption |\n| Svelte 5 | JS/TS | ~2 KB | Low | Client/Server | Performance-critical apps |\n| Angular | TypeScript | ~130 KB | Steep | Client/Server | Enterprise, large teams |\n| Solid | JS/TS | ~7 KB | Moderate | Client/Server | Fine-grained reactivity |\n| Qwik | JS/TS | ~1 KB | Moderate | Resumable | Instant-loading apps |'
                },
                {
                    type: 'text',
                    value: 'Bundle sizes are min+gzip for core runtime only. Real-world sizes vary with features, components, and dependencies.'
                },
                {
                    type: 'text',
                    value: 'Key differentiators: React has the largest ecosystem, Vue balances approachability with power, Svelte compiles away runtime, Angular provides full-stack tooling, Solid offers signals-based reactivity, and Qwik enables resumable hydration.'
                }
            ]
        }
    ],
    links: [
        {
            role: 'user',
            content: 'Give me some useful resources for learning modern CSS'
        },
        {
            role: 'assistant',
            content: [
                {
                    type: 'text',
                    value: 'Here are the best resources for mastering modern CSS, organized by learning style:'
                },
                {
                    type: 'text',
                    value: '**Reference & Documentation**'
                },
                {
                    type: 'list',
                    value: '- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) — Complete property reference with examples\n- [CSS Specifications (W3C)](https://www.w3.org/Style/CSS/) — Official standards\n- [Can I Use](https://caniuse.com/) — Browser support tables for any feature'
                },
                {
                    type: 'text',
                    value: '**Guides & Tutorials**'
                },
                {
                    type: 'list',
                    value: '- [Every Layout](https://every-layout.dev/) — Composable layout primitives\n- [Modern CSS Solutions](https://moderncss.dev/) — Practical patterns by Stephanie Eckles\n- [CSS-Tricks](https://css-tricks.com/) — Articles, guides, and almanac\n- [Josh Comeau](https://www.joshwcomeau.com/css/) — Deep-dive CSS courses & articles'
                },
                {
                    type: 'text',
                    value: '**Practice & Inspiration**'
                },
                {
                    type: 'list',
                    value: '- [CSS Battle](https://cssbattle.dev/) — Code golf for CSS\n- [Frontend Mentor](https://www.frontendmentor.io/) — Real-world challenges with designs\n- [SmolCSS](https://smolcss.dev/) — Tiny, copy-pasteable snippets\n- [Animista](https://animista.net/) — Ready-to-use animations'
                },
                {
                    type: 'text',
                    value: 'For structured learning, I\'d recommend starting with [Every Layout](https://every-layout.dev/) to understand layout primitives, then [Modern CSS Solutions](https://moderncss.dev/) for practical patterns you\'ll use daily.'
                }
            ]
        }
    ],
    code: [
        {
            role: 'user',
            content: 'Write a debounce function in TypeScript with proper types'
        },
        {
            role: 'assistant',
            content: [
                {
                    type: 'text',
                    value: 'Here\'s a production-ready debounce with full type inference:'
                },
                {
                    type: 'code',
                    language: 'typescript',
                    value: 'type DebouncedFunc<T extends (...args: unknown[]) => unknown> = (\n  ...args: Parameters<T>\n) => void;\n\nexport function debounce<T extends (...args: unknown[]) => unknown>(\n  fn: T,\n  delay: number\n): DebouncedFunc<T> {\n  let timeoutId: ReturnType<typeof setTimeout> | null = null;\n\n  return (...args: Parameters<T>) => {\n    if (timeoutId) clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => {\n      fn(...args);\n      timeoutId = null;\n    }, delay);\n  };\n}'
                },
                {
                    type: 'text',
                    value: 'Usage with full type safety:'
                },
                {
                    type: 'code',
                    language: 'typescript',
                    value: '// Inferred as (query: string) => void\nconst handleSearch = debounce((query: string) => {\n  console.log("Searching for:", query);\n  // fetch(`/api/search?q=${query}`)\n}, 300);\n\n// TypeScript knows this takes a string\nhandleSearch("a");\nhandleSearch("ab");\nhandleSearch("abc");\n// Only "abc" triggers the API call after 300ms of inactivity'
                },
                {
                    type: 'text',
                    value: 'The generic `T` preserves the original function signature, so TypeScript infers parameter types automatically. For a version that also returns a promise (useful for await), see [lodash.debounce types](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash/common/debounce.d.ts).'
                }
            ]
        }
    ],
    lists: [
        {
            role: 'user',
            content: 'List the core principles of clean code with brief explanations'
        },
        {
            role: 'assistant',
            content: [
                {
                    type: 'text',
                    value: 'Core clean code principles from *Clean Code* (Robert Martin), *Refactoring* (Martin Fowler), and decades of industry practice:'
                },
                {
                    type: 'list',
                    value: '- **Meaningful Names** — Variables, functions, and classes should reveal intent. Avoid single letters, abbreviations, and mental mapping. `userCount` > `uc`; `calculateMonthlyRevenue()` > `calc()`.\n- **Small Functions** — Functions should do one thing, do it well, do it only. Aim for under 20 lines, 1-2 levels of indentation. Extract until you can\'t extract meaningfully.\n- **Single Responsibility** — A class/module should have one reason to change. If you describe it with "and" or "or," it\'s doing too much.\n- **DRY (Don\'t Repeat Yourself)** — Eliminate duplication through abstraction, but avoid premature abstraction. Duplicate code is better than wrong abstraction.\n- **YAGNI (You Aren\'t Gonna Need It)** — Add complexity only when actually needed. Future requirements rarely match predictions.\n- **Tell, Don\'t Ask** — Encapsulate behavior with data. Objects should make decisions, not expose internals for callers to decide.\n- **Law of Demeter** — Only talk to immediate neighbors. Avoid `a.b.c.d()` chains. Reduces coupling and fragility.\n- **Consistent Formatting** — Adopt a style guide and automate enforcement (Prettier, ESLint, gofmt). Consistency > personal preference.\n- **Error Handling** — Use exceptions for exceptional cases. Never silently swallow errors. Fail fast, fail loud, log context.\n- **Tests as Documentation** — Tests should be readable and express expected behavior. `expect(user.isActive()).toBe(true)` > `expect(user.active).toBe(true).`'
                },
                {
                    type: 'text',
                    value: 'These principles compound—applying them consistently makes codebases easier to understand, modify, and extend over time. Start with naming and small functions; the rest follows naturally.'
                }
            ]
        }
    ]
};