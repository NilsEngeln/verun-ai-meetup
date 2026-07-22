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
  FileText,
  GitBranch,
  Github,
  Layers3,
  Megaphone,
  MessageSquareText,
  Network,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Users,
  Waypoints,
  X,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type SceneId = "overview" | "specialists" | "request" | "kanban" | "brain" | "principles";
type AgentId = "moneypenny" | "vesper" | "q" | "atlas" | "kite";

type Agent = {
  id: AgentId;
  name: string;
  role: string;
  runtime: string;
  surface: string;
  output: string;
  connection: string;
  status: "Live" | "External live";
  icon: LucideIcon;
  tone: string;
};

const scenes: Array<{ id: SceneId; label: string; short: string }> = [
  { id: "overview", label: "Company OS", short: "01" },
  { id: "specialists", label: "Specialists", short: "02" },
  { id: "request", label: "One request", short: "03" },
  { id: "kanban", label: "Work ledger", short: "04" },
  { id: "brain", label: "Shared brain", short: "05" },
  { id: "principles", label: "Human control", short: "06" },
];

const agents: Agent[] = [
  {
    id: "moneypenny",
    name: "Moneypenny",
    role: "Knowledge and operations",
    runtime: "Hermes",
    surface: "Slack",
    output: "Wiki pages, research tasks, reflections and board updates",
    connection: "Writes to the shared wiki and controls Hermes Kanban from normal Slack mentions.",
    status: "Live",
    icon: BookOpen,
    tone: "mint",
  },
  {
    id: "vesper",
    name: "Vesper",
    role: "Marketing intelligence",
    runtime: "Dedicated service",
    surface: "Slack",
    output: "X digests, dossiers, source-backed drafts and revisions",
    connection: "Runs as a standalone Slack agent; external publishing always stays human-controlled.",
    status: "Live",
    icon: Megaphone,
    tone: "coral",
  },
  {
    id: "q",
    name: "Q",
    role: "Guarded code execution",
    runtime: "Hermes + Codex",
    surface: "Slack and Kanban",
    output: "Scoped code changes, checks, local commits and review-ready draft PRs",
    connection: "Works only in allowlisted repositories and isolated worktrees, then stops for human review.",
    status: "Live",
    icon: SquareTerminal,
    tone: "graphite",
  },
  {
    id: "atlas",
    name: "Atlas",
    role: "Technical execution",
    runtime: "OpenClaw",
    surface: "Telegram",
    output: "Architecture validation, implementation plans, code and deployment checks",
    connection: "Live in Rafael's OpenClaw/Telegram setup; VERUN bridge registration is waiting on private network visibility.",
    status: "External live",
    icon: Code2,
    tone: "blue",
  },
  {
    id: "kite",
    name: "Kite",
    role: "Research to artifact",
    runtime: "OpenClaw",
    surface: "Telegram",
    output: "Market scans, specs, demo scopes and decision-ready artifacts",
    connection: "Live in Rafael's OpenClaw/Telegram setup; VERUN bridge registration is waiting on private network visibility.",
    status: "External live",
    icon: FileText,
    tone: "amber",
  },
];

const requestSteps = [
  { title: "Human brief", detail: "Update the AI meetup story", icon: Users },
  { title: "Moneypenny", detail: "Finds current facts in the shared brain", icon: BookOpen },
  { title: "Hermes card", detail: "Stores scope, repo, owner and review gate", icon: Layers3 },
  { title: "Vesper", detail: "Shapes the source-backed narrative", icon: Megaphone },
  { title: "Q worktree", detail: "Implements the change in an isolated branch", icon: SquareTerminal },
  { title: "Checks + commit", detail: "Produces a review-ready local commit", icon: GitBranch },
  { title: "Human review", detail: "Approves claims, code and publication", icon: ShieldCheck },
  { title: "Shared record", detail: "Task evidence returns to Kanban and the wiki", icon: Brain },
];

const promptRoutes = [
  { label: "Meet the agents", scene: 1 },
  { label: "Run a request", scene: 2 },
  { label: "See the shared brain", scene: 4 },
];

function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const scene = scenes[sceneIndex];

  const goTo = (index: number) => {
    setSceneIndex(Math.max(0, Math.min(scenes.length - 1, index)));
    setSelectedAgent(null);
    setNavOpen(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const content = document.querySelector(".content-scene");
        if (content instanceof HTMLElement) content.scrollTop = 0;
      });
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedAgent(null);
        setNavOpen(false);
      }
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowRight") goTo(sceneIndex + 1);
      if (event.key === "ArrowLeft") goTo(sceneIndex - 1);
      if (event.key === "Home") goTo(0);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sceneIndex]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => goTo(0)} aria-label="Return to overview">
          <span className="brand-mark" aria-hidden="true"><Waypoints size={19} /></span>
          <span><strong>VERUN</strong><small>Agentic company explorer</small></span>
        </button>

        <div className="chapter-title" aria-live="polite">
          <span>{scene.short}</span>
          {scene.label}
        </div>

        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen}>
          <Layers3 size={18} />
          <span>Chapters</span>
        </button>
      </header>

      <aside className={`chapter-nav ${navOpen ? "is-open" : ""}`} aria-label="Story chapters">
        <div className="nav-heading">Explore the system</div>
        {scenes.map((item, index) => (
          <button
            key={item.id}
            className={index === sceneIndex ? "active" : ""}
            onClick={() => goTo(index)}
            aria-current={index === sceneIndex ? "step" : undefined}
          >
            <span>{item.short}</span>
            {item.label}
            <ChevronRight size={15} />
          </button>
        ))}
        <div className="nav-status">
          <CircleDot size={15} />
          <span><strong>Live system</strong>Built by the team, used by the team.</span>
        </div>
      </aside>

      <section className="scene-frame" key={scene.id}>
        {scene.id === "overview" && <OverviewScene goTo={goTo} inspect={setSelectedAgent} />}
        {scene.id === "specialists" && <SpecialistsScene inspect={setSelectedAgent} />}
        {scene.id === "request" && <RequestScene />}
        {scene.id === "kanban" && <KanbanScene />}
        {scene.id === "brain" && <BrainScene />}
        {scene.id === "principles" && <PrinciplesScene goTo={goTo} />}
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

      {selectedAgent && <AgentDrawer agent={selectedAgent} close={() => setSelectedAgent(null)} />}
    </main>
  );
}

function OverviewScene({ goTo, inspect }: { goTo: (index: number) => void; inspect: (agent: Agent) => void }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const routePrompt = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("agent") || lower.includes("special")) goTo(1);
    else if (lower.includes("request") || lower.includes("work") || lower.includes("run")) goTo(2);
    else if (lower.includes("brain") || lower.includes("wiki") || lower.includes("memory")) goTo(4);
    else setAnswer("Try asking about the agents, a request, or the shared brain.");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    routePrompt(query);
  };

  return (
    <div className="overview-scene">
      <img className="overview-image" src="/verun-agentic-company.jpg" alt="VERUN agentic company operating system with specialist work zones around a shared knowledge core" />
      <div className="overview-shade" />

      <div className="overview-copy">
        <div className="eyebrow"><Sparkles size={16} /> A working company operating system</div>
        <h1>Humans set direction.<br />Agents move the work.</h1>
        <p>VERUN is building an AI-native company in public: specialist agents, one shared task ledger, and a brain the whole team can inspect.</p>

        <form className="explore-prompt" onSubmit={submit}>
          <Search size={18} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setAnswer(""); }}
            placeholder="Ask how the company works..."
            aria-label="Explore the agentic company"
          />
          <button type="submit" aria-label="Explore"><ArrowRight size={18} /></button>
        </form>
        {answer && <div className="prompt-answer">{answer}</div>}
        <div className="prompt-routes">
          {promptRoutes.map((route) => <button key={route.label} onClick={() => goTo(route.scene)}>{route.label}</button>)}
        </div>
      </div>

      <div className="agent-hotspots" aria-label="Agent hotspots">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          return (
            <button key={agent.id} className={`hotspot hotspot-${index + 1}`} onClick={() => inspect(agent)}>
              <span><Icon size={17} /></span>
              <strong>{agent.name}</strong>
              <small>{agent.role}</small>
            </button>
          );
        })}
      </div>

      <button className="start-story" onClick={() => goTo(1)}>
        Explore the operating system <ArrowRight size={18} />
      </button>
    </div>
  );
}

function SpecialistsScene({ inspect }: { inspect: (agent: Agent) => void }) {
  const [active, setActive] = useState<AgentId>("moneypenny");
  const current = agents.find((agent) => agent.id === active)!;
  const CurrentIcon = current.icon;

  return (
    <div className="content-scene specialists-scene">
      <SceneIntro
        kicker="Five specialists. Clear lanes."
        title="Agents work like teammates, not a single anonymous bot."
        body="Each specialist has a role, an interface, and a visible output. Humans always know who did what."
      />

      <div className="specialist-layout">
        <div className="agent-list" role="tablist" aria-label="Specialist agents">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <button
                key={agent.id}
                role="tab"
                aria-selected={active === agent.id}
                className={`agent-row ${agent.tone} ${active === agent.id ? "active" : ""}`}
                onClick={() => setActive(agent.id)}
              >
                <span className="agent-icon"><Icon size={22} /></span>
                <span><strong>{agent.name}</strong><small>{agent.role}</small></span>
                <span className={`status-pill ${agent.status === "Live" ? "live" : "pending"}`}>{agent.status}</span>
                <ChevronRight size={17} />
              </button>
            );
          })}
        </div>

        <div className={`agent-detail ${current.tone}`} role="tabpanel">
          <div className="agent-detail-head">
            <span className="agent-detail-icon"><CurrentIcon size={30} /></span>
            <div><span>Specialist profile</span><h2>{current.name}</h2></div>
          </div>
          <p className="agent-role">{current.role}</p>
          <dl>
            <div><dt>Runtime</dt><dd>{current.runtime}</dd></div>
            <div><dt>Team interface</dt><dd>{current.surface}</dd></div>
            <div><dt>Produces</dt><dd>{current.output}</dd></div>
            <div><dt>Connection</dt><dd>{current.connection}</dd></div>
          </dl>
          <button className="text-action" onClick={() => inspect(current)}>Open full profile <ArrowRight size={16} /></button>
        </div>
      </div>

      <div className="specialist-note"><Network size={19} /><span>Different runtimes, one operating model: explicit routing, shared memory, auditable handoffs.</span></div>
    </div>
  );
}

function RequestScene() {
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const run = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setRunning(true);
    setActiveStep(0);
    let next = 0;
    timerRef.current = window.setInterval(() => {
      next += 1;
      if (next >= requestSteps.length) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setRunning(false);
        return;
      }
      setActiveStep(next);
    }, 700);
  };

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); }, []);

  return (
    <div className="content-scene request-scene">
      <SceneIntro
        kicker="A request becomes a visible chain of work"
        title="No invisible magic. Every handoff has an owner."
        body="Watch one meetup brief move through the company. The simulation mirrors the operating model without calling external services."
      />

      <div className="request-demo">
        <div className="brief-panel">
          <span className="panel-label">Human brief</span>
          <blockquote>“Update our AI meetup website with the latest live architecture.”</blockquote>
          <button className="primary-action" onClick={run} disabled={running}>
            {running ? <RefreshCw size={18} className="spin" /> : <Play size={18} />}
            {running ? "Running handoffs" : activeStep >= requestSteps.length - 1 ? "Run again" : "Run the request"}
          </button>
        </div>

        <div className="pipeline" aria-live="polite">
          {requestSteps.map((step, index) => {
            const Icon = step.icon;
            const state = index < activeStep ? "complete" : index === activeStep ? "active" : "waiting";
            return (
              <div className={`pipeline-step ${state}`} key={step.title}>
                <span className="step-node">{state === "complete" ? <Check size={17} /> : <Icon size={17} />}</span>
                <span><strong>{step.title}</strong><small>{step.detail}</small></span>
              </div>
            );
          })}
        </div>

        <div className="activity-panel">
          <div className="activity-head"><span>Run log</span><span className={running ? "pulse" : ""}>{running ? "Live" : "Ready"}</span></div>
          <div className="activity-body">
            {activeStep < 0 && <p>Start the request to reveal each handoff.</p>}
            {requestSteps.slice(0, activeStep + 1).map((step, index) => (
              <div key={step.title}><span>0{index + 1}</span><p><strong>{step.title}</strong>{step.detail}</p></div>
            ))}
          </div>
          {activeStep === requestSteps.length - 1 && <div className="run-result"><Check size={18} /> Draft ready for human approval</div>}
        </div>
      </div>
    </div>
  );
}

const boardLanes = ["Triage", "Ready", "In progress", "Review", "Done"];

function KanbanScene() {
  const [position, setPosition] = useState(1);
  const [comments, setComments] = useState(0);

  return (
    <div className="content-scene kanban-scene">
      <SceneIntro
        kicker="Hermes Kanban is the shared work ledger"
        title="The board coordinates humans and agents."
        body="Tasks carry scope, owner, evidence and review gates. Agent work cannot quietly disappear into a chat thread."
      />

      <div className="board-toolbar">
        <div><Layers3 size={19} /><span><strong>VERUN Agent Ops</strong>Shared task board</span></div>
        <span className="orchestration"><CircleDot size={14} /> Orchestration: controlled</span>
      </div>

      <div className="kanban-board">
        {boardLanes.map((lane, index) => (
          <div className={`kanban-lane ${index === position ? "active" : ""}`} key={lane}>
            <header><span>{lane}</span><small>{index === position ? 1 : 0}</small></header>
            {index === position && (
              <article className="task-card">
                <div className="task-top"><span>P1</span><span>@q</span></div>
                <h3>Update the AI meetup website</h3>
                <p>Use current wiki facts, run checks, commit locally and stop for human review.</p>
                <div className="task-meta"><MessageSquareText size={14} /> {comments} comments</div>
              </article>
            )}
          </div>
        ))}
      </div>

      <div className="board-actions">
        <button onClick={() => setComments(comments + 1)}><MessageSquareText size={17} /> Add evidence</button>
        <button className="primary-action" onClick={() => setPosition(Math.min(position + 1, boardLanes.length - 1))} disabled={position === boardLanes.length - 1}>
          Advance with review <ArrowRight size={17} />
        </button>
        <button className="icon-action" onClick={() => { setPosition(1); setComments(0); }} aria-label="Reset board"><RefreshCw size={17} /></button>
      </div>
    </div>
  );
}

function BrainScene() {
  const [query, setQuery] = useState("What is live today?");
  const [searched, setSearched] = useState(true);
  const result = useMemo(() => {
    const lower = query.toLowerCase();
    if (lower.includes("vesper") || lower.includes("marketing")) return "Vesper is live in Slack for X intelligence, dossiers and source-backed drafting. External publishing remains human-approved.";
    if (lower.includes("q") || lower.includes("code") || lower.includes("coding")) return "Q is live in Slack and Hermes Kanban. It works in allowlisted repositories and isolated worktrees, runs checks, creates a local commit, and stops for human review before a guarded draft PR.";
    if (lower.includes("atlas") || lower.includes("kite") || lower.includes("openclaw")) return "Atlas and Kite are live in Rafael's OpenClaw/Telegram environment. The private VERUN brain bridge is deployed and healthy; cross-tailnet visibility and OpenClaw tool registration are still pending.";
    if (lower.includes("kanban") || lower.includes("task") || lower.includes("board")) return "Hermes Kanban is live as the durable work ledger. Moneypenny creates, assigns, comments on and completes cards directly from Slack, while Q uses cards as its guarded execution contract.";
    if (lower.includes("sync") || lower.includes("github") || lower.includes("obsidian")) return "The server wiki is canonical at runtime and mirrors to GitHub every 15 minutes. Team members open the GitHub checkout as an Obsidian vault.";
    return "Moneypenny, Vesper, Q, Hermes Kanban and the shared wiki are live. Atlas and Kite are active external specialists; their private VERUN bridge is deployed but final network and OpenClaw wiring remains pending.";
  }, [query]);

  const submit = (event: FormEvent) => { event.preventDefault(); setSearched(true); };

  return (
    <div className="content-scene brain-scene">
      <SceneIntro
        kicker="One shared, inspectable memory"
        title="The brain is a wiki, not a black box."
        body="Sources enter through agents and humans, become linked Markdown, and mirror through GitHub into each teammate’s Obsidian."
      />

      <div className="brain-layout">
        <div className="brain-map" aria-label="Shared knowledge architecture">
          <div className="brain-core"><Brain size={34} /><strong>VERUN Wiki</strong><span>Canonical shared memory</span></div>
          <div className="brain-node node-slack"><MessageSquareText size={20} /><span>Slack</span></div>
          <div className="brain-node node-agents"><Bot size={20} /><span>Agents</span></div>
          <div className="brain-node node-files"><FileText size={20} /><span>Files</span></div>
          <div className="brain-node node-github"><Github size={20} /><span>GitHub</span></div>
          <div className="brain-node node-obsidian"><Network size={20} /><span>Obsidian</span></div>
          <svg className="brain-lines" viewBox="0 0 600 420" aria-hidden="true">
            <path d="M300 210 L92 85 M300 210 L510 80 M300 210 L75 325 M300 210 L520 320 M300 210 L300 390" />
          </svg>
        </div>

        <div className="brain-console">
          <div className="console-head"><Search size={18} /><span>Ask the company brain</span></div>
          <form onSubmit={submit}>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setSearched(false); }} aria-label="Ask the company brain" />
            <button type="submit" aria-label="Search the company brain"><ArrowRight size={18} /></button>
          </form>
          {searched && (
            <div className="brain-answer">
              <span>Answer from current operating notes</span>
              <p>{result}</p>
              <div><FileText size={14} /> Sources: Agent handbook, architecture status, implementation plan</div>
            </div>
          )}
          <div className="sync-chain"><span>Server wiki</span><GitBranch size={15} /><span>GitHub mirror</span><ArrowRight size={15} /><span>Obsidian</span></div>
        </div>
      </div>
    </div>
  );
}

function PrinciplesScene({ goTo }: { goTo: (index: number) => void }) {
  const live = ["Moneypenny and Vesper in Slack", "Q coding agent with guarded worktrees", "Hermes Kanban and Slack task controls", "Wiki, GitHub and Obsidian", "Private OpenClaw brain bridge"];
  const next = ["Restore cross-tailnet visibility for Atlas and Kite", "Register bridge tools inside both OpenClaw runtimes", "Return external-agent results to Kanban automatically"];

  return (
    <div className="content-scene principles-scene">
      <div className="principles-copy">
        <div className="eyebrow"><ShieldCheck size={16} /> The operating principle</div>
        <h1>Autonomy for the work.<br />Accountability for the outcome.</h1>
        <p>Agents can research, draft, route and execute. Humans approve public claims, publishing, merges, deployments and high-stakes decisions.</p>
      </div>

      <div className="status-bands">
        <section>
          <header><span className="live-dot" /> Live today</header>
          {live.map((item) => <div key={item}><Check size={17} />{item}</div>)}
        </section>
        <section>
          <header><Waypoints size={17} /> Building next</header>
          {next.map((item, index) => <div key={item}><span>0{index + 1}</span>{item}</div>)}
        </section>
      </div>

      <div className="closing-band">
        <div><strong>This website is part of the experiment.</strong><span>A reliable, curated demo of the live operating model behind VERUN.</span></div>
        <button className="primary-action" onClick={() => goTo(0)}><RefreshCw size={17} /> Explore again</button>
      </div>
    </div>
  );
}

function SceneIntro({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <header className="scene-intro">
      <span>{kicker}</span>
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}

function AgentDrawer({ agent, close }: { agent: Agent; close: () => void }) {
  const Icon = agent.icon;
  return (
    <div className="drawer-scrim" onMouseDown={(event) => { if (event.currentTarget === event.target) close(); }}>
      <aside className={`agent-drawer ${agent.tone}`} aria-modal="true" role="dialog" aria-labelledby="agent-drawer-title">
        <button className="drawer-close" onClick={close} aria-label="Close agent profile"><X size={19} /></button>
        <span className="drawer-icon"><Icon size={28} /></span>
        <span className={`status-pill ${agent.status === "Live" ? "live" : "pending"}`}>{agent.status}</span>
        <h2 id="agent-drawer-title">{agent.name}</h2>
        <p>{agent.role}</p>
        <dl>
          <div><dt>Runtime</dt><dd>{agent.runtime}</dd></div>
          <div><dt>Team surface</dt><dd>{agent.surface}</dd></div>
          <div><dt>Typical output</dt><dd>{agent.output}</dd></div>
          <div><dt>Connection</dt><dd>{agent.connection}</dd></div>
        </dl>
        <div className="drawer-rule"><ShieldCheck size={18} /><span>Every external claim and irreversible action stays behind human review.</span></div>
      </aside>
    </div>
  );
}

export { App };
