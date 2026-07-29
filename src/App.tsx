import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  FileCheck2,
  GitBranch,
  Layers3,
  MessageSquareText,
  Network,
  Search,
  ShieldCheck,
  SquareTerminal,
  StopCircle,
  TriangleAlert,
  UserCheck,
  Users,
  Waypoints,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type SceneId =
  | "question"
  | "system"
  | "manager"
  | "brain"
  | "under-hood"
  | "task-orchestration"
  | "blocked-task"
  | "live-run"
  | "failures"
  | "takeaways"
  | "questions";

type Scene = {
  id: SceneId;
  label: string;
  timing: string;
};

type Specialist = {
  name: string;
  role: string;
  runtime: string;
  icon: LucideIcon;
  status: "live" | "integration pending";
};

const scenes: Scene[] = [
  { id: "question", label: "Introduction", timing: "0:00–1:00" },
  { id: "system", label: "Context", timing: "1:00–3:00" },
  { id: "manager", label: "Claude: role", timing: "3:00–5:00" },
  { id: "brain", label: "Shared brain", timing: "5:00–6:00" },
  { id: "under-hood", label: "Manager prompt", timing: "6:00–7:30" },
  { id: "task-orchestration", label: "Task orchestration", timing: "7:30–9:00" },
  { id: "blocked-task", label: "Blocked task", timing: "9:00–10:00" },
  { id: "failures", label: "Rough parts", timing: "10:00–12:00" },
  { id: "live-run", label: "Live example", timing: "12:00–17:00" },
  { id: "takeaways", label: "Takeaways", timing: "17:00–18:00" },
  { id: "questions", label: "Q&A", timing: "18:00–20:00" },
];

const specialists: Specialist[] = [
  { name: "Moneypenny", role: "Knowledge and operations", runtime: "Hermes · Slack", icon: BookOpen, status: "live" },
  { name: "Vesper", role: "Marketing intelligence", runtime: "Hermes · Slack", icon: MessageSquareText, status: "live" },
  { name: "Q", role: "Guarded code execution", runtime: "Hermes + Codex · Slack", icon: SquareTerminal, status: "live" },
  { name: "Atlas", role: "Technical validation", runtime: "OpenClaw · Telegram", icon: Code2, status: "integration pending" },
  { name: "Kite", role: "Research to artifact", runtime: "OpenClaw · Telegram", icon: FileCheck2, status: "integration pending" },
];

function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const scene = scenes[sceneIndex];

  const goTo = (index: number) => {
    setSceneIndex(Math.max(0, Math.min(scenes.length - 1, index)));
    setNavOpen(false);
    window.requestAnimationFrame(() => {
      const content = document.querySelector(".content-scene");
      if (content instanceof HTMLElement) content.scrollTop = 0;
    });
  };

  const goToScene = (id: SceneId) => goTo(scenes.findIndex((item) => item.id === id));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
      if (event.key === "ArrowRight") goTo(sceneIndex + 1);
      if (event.key === "ArrowLeft") goTo(sceneIndex - 1);
      if (event.key === "Home") goTo(0);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sceneIndex]);

  return (
    <main className="app-shell manager-deck">
      <header className="topbar talk-topbar">
        <button className="talk-identity" onClick={() => goTo(0)} aria-label="Return to opening">
          <span>Claude Community Berlin</span>
          <small>Show & tell · 20 min including Q&A</small>
        </button>
        <div className="chapter-title" aria-live="polite">
          {scene.label}
        </div>
        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen}>
          <Layers3 size={18} />
          <span>Chapters</span>
        </button>
      </header>

      <aside className={`chapter-nav talk-nav ${navOpen ? "is-open" : ""}`} aria-label="Presentation chapters">
        <div className="nav-heading">Who manages the agents?</div>
        {scenes.map((item, index) => (
          <button
            key={item.id}
            className={index === sceneIndex ? "active" : ""}
            onClick={() => goTo(index)}
            aria-current={index === sceneIndex ? "step" : undefined}
          >
            <span className="nav-copy">{item.label}</span>
            <ChevronRight size={15} />
          </button>
        ))}
        <div className="nav-status">
          <CircleDot size={15} />
          <span><strong>Truth boundary</strong>Live, staged and pending states are labeled.</span>
        </div>
      </aside>

      <section className="scene-frame" key={scene.id}>
        {scene.id === "question" && <QuestionScene goTo={() => goToScene("system")} />}
        {scene.id === "system" && <SystemScene />}
        {scene.id === "manager" && <ManagerScene />}
        {scene.id === "brain" && <SharedBrainScene />}
        {scene.id === "under-hood" && <UnderHoodScene />}
        {scene.id === "task-orchestration" && <TaskOrchestrationScene />}
        {scene.id === "blocked-task" && <BlockedTaskScene />}
        {scene.id === "failures" && <FailuresScene />}
        {scene.id === "live-run" && <LiveRunScene />}
        {scene.id === "takeaways" && <TakeawaysScene />}
        {scene.id === "questions" && <QuestionsScene goTo={() => goTo(0)} />}
      </section>

      <footer className="scene-controls">
        <button onClick={() => goTo(sceneIndex - 1)} disabled={sceneIndex === 0} aria-label="Previous chapter">
          <ArrowLeft size={18} />
        </button>
        <div className="progress" aria-label={`Chapter ${sceneIndex + 1} of ${scenes.length}`}>
          {scenes.map((item, index) => (
            <button
              key={item.id}
              className={index === sceneIndex ? "active" : ""}
              onClick={() => goTo(index)}
              aria-label={`Go to ${item.label}`}
            />
          ))}
        </div>
        <button onClick={() => goTo(sceneIndex + 1)} disabled={sceneIndex === scenes.length - 1} aria-label="Next chapter">
          <ArrowRight size={18} />
        </button>
      </footer>
    </main>
  );
}

function QuestionScene({ goTo }: { goTo: () => void }) {
  return (
    <div className="question-scene">
      <img src="/claude-head-of-agents-opening.png" alt="" aria-hidden="true" />
      <div className="question-overlay" />
      <div className="question-content">
        <h1>Who manages<br />our agents?</h1>
        <p><strong>Building a Claude-powered Head of Agents.</strong></p>
        <div className="speaker-line">
          <span>Rafael Schultz + Nils Engeln</span>
        </div>
        <button className="primary-action" onClick={goTo}>Begin <ArrowRight size={18} /></button>
      </div>
    </div>
  );
}

function SystemScene() {
  return (
    <div className="context-graphic-scene">
      <img
        src="/slide-02-agent-architecture.png"
        alt="VERUN operating model: Nils Engeln and Rafael Schultz direct Claude-powered Head of Agents M, which coordinates Moneypenny, Q, Vesper, Kite, Atlas and Dagobert across the company toolchain."
      />
    </div>
  );
}

function ManagerScene() {
  return (
    <div className="content-scene manager-scene">
      <SceneIntro title="Claude coordinates. Humans authorize." />

      <div className="manager-layout">
        <div className="manager-profile">
          <div className="m-orbit" aria-hidden="true">
            <span className="m-core"><img src="/claude-logo.svg" alt="" /></span>
            <span className="orbit orbit-one"><Brain size={18} /></span>
            <span className="orbit orbit-two"><Layers3 size={18} /></span>
            <span className="orbit orbit-three"><ShieldCheck size={18} /></span>
          </div>
          <div>
            <h2>Head of Agents</h2>
            <p>Claude · Anthropic API · Slack · Hermes Kanban</p>
          </div>
        </div>

        <div className="authority-matrix">
          <section className="permission-allow">
            <header><span>GO</span><Check size={18} /> M may</header>
            <p>Retrieve approved context</p>
            <p>Scope and assign tasks</p>
            <p>Inspect evidence and blockers</p>
          </section>
          <section className="permission-deny">
            <header><span>STOP</span><StopCircle size={18} /> M may not</header>
            <p>Approve its own work</p>
            <p>Merge, deploy, publish or spend</p>
            <p>Read secrets or start autonomous loops</p>
          </section>
        </div>
      </div>

      <div className="manager-principle"><UserCheck size={19} /><span><strong>Claude coordinates.</strong> Specialists execute. Humans authorize.</span></div>
    </div>
  );
}

function UnderHoodScene() {
  return (
    <div className="content-scene under-hood-scene">
      <SceneIntro title="Prompt 1 — Turn a goal into governed work." />

      <div className="prompt-learning-layout">
        <section className="prompt-card photo-prompt">
          <header><MessageSquareText size={18} /> Manager prompt</header>
          <pre>{`You are M, the project manager.

Before planning:
1. inspect the current work ledger
2. retrieve only relevant approved context

Turn the goal into tasks with:
- owner and dependencies
- acceptance criteria
- required evidence
- a human review gate

Never merge, deploy, publish, spend
or mark your own work complete.`}</pre>
        </section>

        <section className="prompt-effect">
          <span>What changed</span>
          <h2>Claude stopped “helping” in chat and started leaving inspectable state.</h2>
          <div className="effect-chain">
            <span>Goal</span><ArrowRight size={16} />
            <span>Context</span><ArrowRight size={16} />
            <span>Tasks</span><ArrowRight size={16} />
            <strong>Human gate</strong>
          </div>
          <small>Work ledger &gt; chat history</small>
        </section>
      </div>
      <div className="copy-strip">
        <span><Network size={17} /> Claude receives a goal + retrieved evidence, not the whole company brain.</span>
        <code>wiki.search → task.create → task.assign → task.block</code>
      </div>
    </div>
  );
}

function SharedBrainScene() {
  return (
    <div className="content-scene brain-scene">
      <SceneIntro title="The manager does not remember everything. The brain does." />

      <div className="brain-layout">
        <figure className="brain-graph">
          <img src="/obsidian-shared-brain-graph.png" alt="Obsidian graph view of the shared VERUN Markdown knowledge base" />
          <figcaption>Obsidian graph · linked Markdown knowledge</figcaption>
        </figure>

        <section className="brain-contract">
          <span><Brain size={17} /> Shared LLM wiki</span>
          <h2>Durable memory outside every agent.</h2>
          <div className="brain-facts">
            <p><strong>Canonical</strong>Markdown pages for decisions, meetings, architecture and tasks.</p>
            <p><strong>Auditable</strong>GitHub mirrors the server wiki every 15 minutes.</p>
            <p><strong>Human-readable</strong>The same graph opens locally in Obsidian.</p>
          </div>
          <div className="retrieval-contract">
            <small>Context contract</small>
            <ol>
              <li>Search by task intent</li>
              <li>Return a small evidence bundle</li>
              <li>Cite source paths and freshness</li>
              <li>Block when evidence is missing</li>
            </ol>
          </div>
        </section>
      </div>

      <div className="brain-pipeline">
        <span>Human request</span><ArrowRight size={16} />
        <strong>wiki.search</strong><ArrowRight size={16} />
        <span>Retrieved pages</span><ArrowRight size={16} />
        <strong>Claude plan</strong><ArrowRight size={16} />
        <span>Work ledger</span>
      </div>
    </div>
  );
}

function TaskOrchestrationScene() {
  return (
    <div className="content-scene orchestration-scene">
      <SceneIntro title="Prompt 2 — Delegate an outcome, not a conversation." />

      <div className="orchestration-layout">
        <section className="prompt-card orchestration-prompt">
          <header><Waypoints size={18} /> Task orchestration prompt</header>
          <pre>{`Create a Vesper campaign:
“Claude Meetup Coverage”

Collect links, notes and images posted
in this thread through Friday.

Deliver:
- one source-backed LinkedIn recap draft
- a visible task owner and deadline
- the dossier path and acceptance criteria
- a human review gate before publishing`}</pre>
        </section>

        <figure className="orchestration-proof">
          <img src="/slack-m-task-orchestration.png" alt="Slack thread where Claude manager M creates a campaign task, assigns Vesper and records a deadline" />
          <figcaption>Real handoff: M → task ledger → Vesper</figcaption>
        </figure>
      </div>

      <div className="orchestration-result">
        <span><strong>1</strong> Task created</span>
        <ArrowRight size={15} />
        <span><strong>2</strong> Vesper assigned</span>
        <ArrowRight size={15} />
        <span><strong>3</strong> Dossier opened</span>
        <ArrowRight size={15} />
        <span><strong>4</strong> Deadline revised in place</span>
      </div>
    </div>
  );
}

function BlockedTaskScene() {
  return (
    <div className="content-scene blocked-task-scene">
      <SceneIntro title="Prompt 3 — Block visibly when evidence is missing." />

      <div className="blocked-task-layout">
        <section className="prompt-card blocked-prompt">
          <header><TriangleAlert size={18} /> Blocker prompt</header>
          <pre>{`Before execution, verify:
- the required brief exists
- the repository is approved
- permissions are available
- acceptance criteria are testable

If anything is missing:
1. stop
2. mark the task blocked
3. name the exact missing input
4. preserve the task ID and worktree
5. resume only after human revision`}</pre>
        </section>

        <figure className="blocked-proof">
          <img src="/slack-q-context-blocker.png" alt="Slack thread showing Q stopping on a missing brief and resuming the same task after human revision" />
          <figcaption>Real blocker: missing brief → explicit request → same task resumed</figcaption>
        </figure>
      </div>

      <div className="blocked-result">
        <ShieldCheck size={18} />
        <span><strong>No invented context.</strong> No abandoned work. One auditable task.</span>
      </div>
    </div>
  );
}

function LiveRunScene() {
  return (
    <div className="content-scene live-run-scene">
      <SceneIntro title="Watch the work move." />

      <div className="demo-screenshot-layout">
        <figure className="slack-proof">
          <img src="/slack-q-context-blocker.png" alt="Slack task thread where Q blocks on missing context and resumes once the brief is supplied" />
          <figcaption>Real task trace: missing context → blocker → revision → resumed work</figcaption>
        </figure>

        <div className="demo-cue">
          <span>Sanitized live run</span>
          <blockquote>“Plan one scoped coding task, verify the evidence, and stop for human approval.”</blockquote>
          <div className="demo-steps">
            <p><strong>Brief</strong> Human defines the outcome</p>
            <p><strong>Context</strong> Claude retrieves evidence</p>
            <p><strong>Execute</strong> Q works in a worktree</p>
            <p><strong>Verify</strong> Checks become evidence</p>
            <p><strong>Decide</strong> Human approves or revises</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FailuresScene() {
  const roughParts = [
    {
      issue: "Missing context",
      symptom: "The agent began without the required brief.",
      guardrail: "Preflight retrieval and an explicit blocker state.",
    },
    {
      issue: "False completion",
      symptom: "“Done” arrived without checks or an artifact.",
      guardrail: "Evidence contract: checks, link, commit and review gate.",
    },
    {
      issue: "Permission failure",
      symptom: "A valid change could not be published from the worker.",
      guardrail: "Allowlisted repositories and human-controlled authority.",
    },
  ];

  return (
    <div className="content-scene failures-scene">
      <SceneIntro title="The rough parts shaped the operating model." />

      <div className="rough-parts-grid">
        {roughParts.map((item, index) => (
          <article key={item.issue}>
            <span>0{index + 1}</span>
            <h2>{item.issue}</h2>
            <p>{item.symptom}</p>
            <footer><Wrench size={17} /><strong>{item.guardrail}</strong></footer>
          </article>
        ))}
      </div>

      <div className="rough-principle">
        <TriangleAlert size={18} />
        <span>Every guardrail exists because a plausible shortcut failed in real work.</span>
      </div>
    </div>
  );
}

function TakeawaysScene() {
  const techniques = [
    { title: "Use a work ledger, not chat history, as task state.", icon: Layers3 },
    { title: "Retrieve just enough evidence to act.", icon: Brain },
    { title: "Require evidence instead of trusting “done.”", icon: FileCheck2 },
    { title: "Let Claude coordinate; keep authority with humans.", icon: ShieldCheck },
  ];

  return (
    <div className="content-scene takeaways-scene">
      <SceneIntro title="Four patterns worth adopting." />

      <div className="technique-list">
        {techniques.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title}>
              <Icon size={24} />
              <h2>{item.title}</h2>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function QuestionsScene({ goTo }: { goTo: () => void }) {
  return (
    <div className="questions-scene">
      <div>
        <h1>Questions.</h1>
        <button className="secondary-action" onClick={goTo}><ArrowLeft size={17} /> Return to the opening</button>
      </div>
      <figure>
        <img src="/claude-head-of-agents-opening.png" alt="Two people overseeing a small group of specialist agent terminals" />
      </figure>
    </div>
  );
}

function SceneIntro({ title, body }: { title: string; body?: string }) {
  return (
    <header className="scene-intro">
      <h1>{title}</h1>
      {body && <p>{body}</p>}
    </header>
  );
}

export { App };
