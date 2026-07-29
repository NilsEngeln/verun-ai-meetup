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
  | "under-hood"
  | "prompt-patterns"
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
  { id: "under-hood", label: "Manager prompt", timing: "5:00–7:30" },
  { id: "prompt-patterns", label: "Prompt patterns", timing: "7:30–10:00" },
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
        {scene.id === "under-hood" && <UnderHoodScene />}
        {scene.id === "prompt-patterns" && <PromptPatternsScene />}
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
  const humans = [
    { name: "Nils", role: "Operations + product" },
    { name: "Rafael", role: "Strategy + partnerships" },
    { name: "Fahad", role: "Brand + communication" },
    { name: "Karina", role: "Research + operations" },
  ];

  return (
    <div className="content-scene system-scene">
      <SceneIntro title="One company. Two kinds of teammates." />

      <div className="org-chart">
        <section className="org-humans">
          <header><Users size={19} /> Humans</header>
          {humans.map((human) => (
            <article key={human.name}>
              <span>{human.name.slice(0, 1)}</span>
              <div><strong>{human.name}</strong><small>{human.role}</small></div>
            </article>
          ))}
          <div className="human-authority"><UserCheck size={17} /> approve · merge · deploy · publish</div>
        </section>

        <section className="org-manager">
          <span className="claude-mark"><img src="/claude-logo.svg" alt="Claude" /></span>
          <small>Head of Agents</small>
          <h2>Claude</h2>
          <p>Scope · sequence · evidence · escalation</p>
          <div className="org-line" aria-hidden="true" />
        </section>

        <section className="org-agents">
          <header><Brain size={19} /> Specialist agents</header>
          <div>
            {specialists.map((agent) => {
              const Icon = agent.icon;
              return (
                <article key={agent.name}>
                  <Icon size={17} />
                  <span><strong>{agent.name}</strong><small>{agent.role}</small></span>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="org-tools">
          <header><Wrench size={18} /> Tools</header>
          <span>Slack</span>
          <span>Markdown wiki</span>
          <span>Hermes Kanban</span>
          <span>GitHub</span>
          <span>Checks + worktrees</span>
        </aside>
      </div>

      <div className="org-proof">
        <figure>
          <img src="/slack-moneypenny-repository-update.png" alt="Slack thread showing Moneypenny updating and ingesting repository operating context" />
        </figure>
        <div>
          <span>Real operating surface</span>
          <strong>Humans talk in Slack.</strong>
          <p>Agents turn decisions into durable wiki and task state.</p>
        </div>
      </div>
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

function PromptPatternsScene() {
  return (
    <div className="content-scene prompt-patterns-scene">
      <SceneIntro title="Prompts 2 + 3 — Evidence beats confidence." />

      <div className="pattern-grid">
        <article className="bad-pattern">
          <span><TriangleAlert size={17} /> What failed</span>
          <blockquote>“Coordinate the agents and let me know when everything is done.”</blockquote>
          <footer>Result: hidden decisions, false completion signals, no review boundary.</footer>
        </article>
        <article className="good-pattern">
          <span><FileCheck2 size={17} /> Prompt 2 · Evidence gate</span>
          <blockquote>“Do not mark a task complete without the required checks, artifact link, commit SHA and named human review gate.”</blockquote>
          <footer>Result: “done” becomes a claim that can be audited.</footer>
        </article>
        <article className="good-pattern">
          <span><Waypoints size={17} /> Prompt 3 · Revision state</span>
          <blockquote>“Treat replies in this thread as revisions to the active task. Preserve its ID, artifact and prior evidence.”</blockquote>
          <footer>Result: feedback changes the work instead of starting a new conversation.</footer>
        </article>
      </div>

      <div className="prompt-takeaway">
        <div><strong>Copy the pattern</strong><span>Scope → evidence → authority → escalation</span></div>
        <a href="https://github.com/NilsEngeln/verun-agent-workflows" target="_blank" rel="noreferrer">
          <img src="/prompts-and-notes-qr.png" alt="QR code linking to prompts and implementation notes" />
          <span>Prompts + implementation notes</span>
          <ArrowRight size={16} />
        </a>
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
  return (
    <div className="content-scene failures-scene">
      <SceneIntro title="A blocker is better than a bluff." />

      <div className="failure-proof-layout">
        <div className="failure-story">
          <span className="failure-label">What happened</span>
          <h2>Q started a task without the required brief.</h2>
          <p>The agent stopped, named the missing input, and preserved the task identity instead of inventing context.</p>
          <div className="failure-change">
            <span>Learning</span>
            <strong>Block visibly. Resume in place.</strong>
          </div>
          <div className="failure-key">
            <Wrench size={20} />
            <span>Thread replies now revise the active task and artifact.</span>
          </div>
        </div>
        <figure className="failure-screenshot">
          <img src="/slack-q-context-blocker.png" alt="Slack thread showing Q blocking when a required brief is missing and resuming when context is supplied" />
          <figcaption>Real Slack trace · July 2026</figcaption>
        </figure>
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
