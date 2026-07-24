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

type SceneId = "overview" | "team" | "verun" | "specialists" | "request" | "kanban" | "brain" | "principles";
type AgentId = "moneypenny" | "vesper" | "q" | "atlas" | "kite";

type Agent = {
  id: AgentId;
  name: string;
  role: string;
  family: "Hermes" | "OpenClaw";
  runtime: string;
  surface: string;
  output: string;
  connection: string;
  status: "Live";
  icon: LucideIcon;
  tone: string;
};

const scenes: Array<{ id: SceneId; label: string; short: string }> = [
  { id: "overview", label: "Company OS", short: "01" },
  { id: "team", label: "Team", short: "02" },
  { id: "verun", label: "VERUN", short: "03" },
  { id: "specialists", label: "Specialists", short: "04" },
  { id: "request", label: "One request", short: "05" },
  { id: "kanban", label: "Work ledger", short: "06" },
  { id: "brain", label: "Shared brain", short: "07" },
  { id: "principles", label: "Human in the loop", short: "08" },
];

const agents: Agent[] = [
  {
    id: "moneypenny",
    name: "Moneypenny",
    role: "Knowledge and operations",
    family: "Hermes",
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
    family: "Hermes",
    runtime: "Dedicated service with Hermes drafting",
    surface: "Slack",
    output: "X digests, dossiers, source-backed drafts and revisions",
    connection: "Runs as a standalone Slack agent; drafts and narrative support stay internal until a human publishes.",
    status: "Live",
    icon: Megaphone,
    tone: "coral",
  },
  {
    id: "q",
    name: "Q",
    role: "Guarded code execution",
    family: "Hermes",
    runtime: "Hermes + Codex",
    surface: "Slack and Kanban",
    output: "Scoped code changes, checks, local commits and review handoffs",
    connection: "Works only in allowlisted repositories and isolated worktrees, then stops for human review.",
    status: "Live",
    icon: SquareTerminal,
    tone: "graphite",
  },
  {
    id: "atlas",
    name: "Atlas",
    role: "Technical execution",
    family: "OpenClaw",
    runtime: "OpenClaw",
    surface: "Telegram",
    output: "Architecture validation, implementation plans, code and deployment checks",
    connection: "Live in Rafael's OpenClaw/Telegram setup; VERUN bridge registration is waiting on private network visibility.",
    status: "Live",
    icon: Code2,
    tone: "blue",
  },
  {
    id: "kite",
    name: "Kite",
    role: "Research to artifact",
    family: "OpenClaw",
    runtime: "OpenClaw",
    surface: "Telegram",
    output: "Market scans, specs, demo scopes and decision-ready artifacts",
    connection: "Live in Rafael's OpenClaw/Telegram setup; VERUN bridge registration is waiting on private network visibility.",
    status: "Live",
    icon: FileText,
    tone: "amber",
  },
];

const requestSteps = [
  { title: "Human brief", detail: "Meeting feedback defines scope and acceptance criteria", icon: Users },
  { title: "Moneypenny context", detail: "Retrieves current facts and sources from the shared wiki", icon: BookOpen },
  { title: "Hermes Kanban", detail: "Records the repository, owner, brief and review gate", icon: Layers3 },
  { title: "Vesper narrative", detail: "Drafts and supports the story; never publishes it", icon: Megaphone },
  { title: "Q implementation", detail: "Changes the site in an isolated q/* worktree", icon: SquareTerminal },
  { title: "Q checks + commit", detail: "Runs type, build and visual checks, then commits locally", icon: GitBranch },
  { title: "Human review + merge", detail: "Reviews claims and code, then controls the merge", icon: ShieldCheck },
  { title: "Vercel deployment", detail: "Deploys the configured, human-approved production branch", icon: Waypoints },
  { title: "Wiki write-back", detail: "Moneypenny writes accepted evidence back to the shared wiki", icon: Brain },
];

const agentGroups = [
  {
    family: "Hermes" as const,
    label: "Hermes agents",
    detail: "Knowledge, narrative support and guarded implementation",
  },
  {
    family: "OpenClaw" as const,
    label: "OpenClaw agents",
    detail: "Technical validation and research-to-artifact work",
  },
];

const promptRoutes = [
  { label: "Meet the team", scene: "team" },
  { label: "See what VERUN is building", scene: "verun" },
  { label: "Meet the agents", scene: "specialists" },
] satisfies Array<{ label: string; scene: SceneId }>;

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

  const goToScene = (id: SceneId) => goTo(scenes.findIndex((item) => item.id === id));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedAgent(null);
        setNavOpen(false);
      }
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowRight") goTo(sceneIndex + 1);
      if (event.key === "ArrowLeft") goTo(sceneIndex - 1);
      if (event.key === "Home") goToScene("overview");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sceneIndex]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => goToScene("overview")} aria-label="Return to overview">
          <span className="brand-mark" aria-hidden="true"><Waypoints size={19} /></span>
          <span><strong>VERUN</strong><small>Agentic company explorer</small></span>
        </button>

        <div className="chapter-title" aria-live="polite">
          <span>{scene.short}</span>
          {scene.label}
        </div>

        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} aria-label="Chapters">
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
        {scene.id === "overview" && <OverviewScene goTo={goToScene} inspect={setSelectedAgent} />}
        {scene.id === "team" && <TeamScene />}
        {scene.id === "verun" && <VerunScene />}
        {scene.id === "specialists" && <SpecialistsScene inspect={setSelectedAgent} />}
        {scene.id === "request" && <RequestScene />}
        {scene.id === "kanban" && <KanbanScene />}
        {scene.id === "brain" && <BrainScene />}
        {scene.id === "principles" && <PrinciplesScene goTo={goToScene} />}
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

function OverviewScene({ goTo, inspect }: { goTo: (id: SceneId) => void; inspect: (agent: Agent) => void }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const routePrompt = (text: string) => {
    const lower = text.toLowerCase();
    if (["team", "founder", "rafael", "nils"].some((term) => lower.includes(term))) goTo("team");
    else if (["verun", "product", "gateway", "finance", "building"].some((term) => lower.includes(term))) goTo("verun");
    else if (lower.includes("agent") || lower.includes("specialist")) goTo("specialists");
    else if (["request", "work", "run"].some((term) => lower.includes(term))) goTo("request");
    else if (["brain", "wiki", "memory"].some((term) => lower.includes(term))) goTo("brain");
    else setAnswer("Try asking about the team, VERUN, the agents, a request, or the shared brain.");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    routePrompt(query);
  };

  return (
    <div className="overview-scene">
      <div className="overview-copy">
        <div className="eyebrow"><Sparkles size={16} /> A working company operating system</div>
        <h1>Five agents.<br />One accountable team.</h1>
        <p>Humans set direction. Named specialists retrieve context, draft narratives, implement changes and leave a visible record for review.</p>

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

      <div className="overview-agent-stage" aria-label="Five VERUN specialist agents grouped by runtime">
        <header>
          <span>Named specialists</span>
          <strong>The agents are the operating system.</strong>
        </header>
        {agentGroups.map((group) => (
          <section className={`overview-agent-group ${group.family.toLowerCase()}`} key={group.family}>
            <div className="overview-group-heading">
              <span>{group.label}</span>
              <small>{group.detail}</small>
            </div>
            <div className="overview-agent-list">
              {agents.filter((agent) => agent.family === group.family).map((agent) => {
                const Icon = agent.icon;
                return (
                  <button key={agent.id} onClick={() => inspect(agent)}>
                    <span><Icon size={19} /></span>
                    <strong>{agent.name}</strong>
                    <small>{agent.role}</small>
                    <ChevronRight size={16} />
                  </button>
                );
              })}
            </div>
          </section>
        ))}
        <footer><Layers3 size={17} /><span>Hermes Kanban records the work. Humans approve the outcome.</span></footer>
      </div>

      <button className="start-story" onClick={() => goTo("team")}>
        Meet the team <ArrowRight size={18} />
      </button>
    </div>
  );
}

function TeamScene() {
  const founders = [
    {
      initials: "RS",
      name: "Rafael Schultz",
      role: "Co-Founder",
      focus: "Payments, digital assets, venture capital, fundraising, and institutional partnerships.",
    },
    {
      initials: "NE",
      name: "Nils Engeln",
      role: "Co-Founder · Product & Operations",
      focus: "Product direction, agent infrastructure, operations, and agentic-finance architecture.",
    },
  ];

  return (
    <div className="content-scene team-scene">
      <SceneIntro
        kicker="Who we are"
        title="Two founders. One AI-native operating model."
        body="Rafael and Nils combine finance, venture, product, and operations experience. Around them, specialist agents research, draft, implement, and document work, while humans own strategy, external claims, and every irreversible decision."
      />

      <div className="team-profiles" aria-label="VERUN founders">
        {founders.map((founder) => (
          <article className="founder-profile" key={founder.name}>
            <span className="founder-initials" aria-hidden="true">{founder.initials}</span>
            <div>
              <span className="founder-role">{founder.role}</span>
              <h2>{founder.name}</h2>
              <p>{founder.focus}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="team-relationship" aria-label="Team operating model">
        <span><strong>2</strong> founders</span>
        <ArrowRight size={18} aria-hidden="true" />
        <span><strong>5</strong> named specialists</span>
        <ArrowRight size={18} aria-hidden="true" />
        <span>one shared brain and work ledger</span>
      </div>

      <div className="team-principle"><ShieldCheck size={20} /><strong>The agents expand capacity.</strong> The founders remain accountable.</div>
    </div>
  );
}

function VerunScene() {
  const capabilities = [
    "Discover and normalize",
    "Match explicit mandates",
    "Qualify and route",
    "Prepare an auditable handoff",
  ];

  return (
    <div className="content-scene verun-scene">
      <SceneIntro
        kicker="What we are building"
        title="One permissioned gateway between AI agents and financial institutions."
        body="VERUN is an Agent Service Provider for regulated finance. Its MCP/API gateway gives investor-side AI agents one read-only interface to discover and compare opportunities across banks, brokers, fund platforms, and tokenization platforms, check explicit mandate constraints, and prepare a provider-controlled handoff."
      />

      <div className="verun-layout">
        <div className="verun-context">
          <section>
            <span>Why we are building it</span>
            <p>AI agents are becoming a new interface, but financial products and workflows remain fragmented across provider portals, APIs, and compliance processes. Raw API access is not enough: requests need context, permission, qualification, routing, and an auditable handoff.</p>
          </section>
          <section>
            <span>Outcome</span>
            <p>VERUN makes financial platforms agent-ready without requiring every agent to integrate with every institution separately.</p>
          </section>
        </div>

        <div className="gateway-diagram" aria-label="Investor-side AI agent connects through the VERUN MCP API gateway to financial platforms">
          <div className="gateway-flow">
            <div className="gateway-endpoint"><Bot size={24} /><span>Investor-side</span><strong>AI agent</strong></div>
            <ArrowRight className="gateway-arrow" size={22} aria-hidden="true" />
            <div className="gateway-core">
              <span>Agent Service Provider</span>
              <strong>VERUN</strong>
              <small>MCP/API gateway</small>
            </div>
            <ArrowRight className="gateway-arrow" size={22} aria-hidden="true" />
            <div className="gateway-endpoint gateway-providers"><Network size={24} /><span>Banks · Brokers</span><strong>Fund & tokenization platforms</strong></div>
          </div>

          <ol className="gateway-capabilities">
            {capabilities.map((capability, index) => <li key={capability}><span>0{index + 1}</span>{capability}</li>)}
          </ol>

          <div className="gateway-boundary"><ShieldCheck size={18} /><strong>Today:</strong> Read-only · synthetic data · human/provider controlled</div>
        </div>
      </div>

      <p className="verun-boundary-copy"><strong>Current boundary:</strong> No investment advice, KYC data, orders, payments, or autonomous execution. Final eligibility and execution remain with the provider and the human.</p>
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
        <div className="agent-list" role="tablist" aria-label="Specialist agents grouped by runtime">
          {agentGroups.map((group) => (
            <div className="agent-family" key={group.family}>
              <div className="agent-family-heading">
                <strong>{group.label}</strong>
                <span>{group.detail}</span>
              </div>
              {agents.filter((agent) => agent.family === group.family).map((agent) => {
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
                    <span className="status-pill live">{agent.status}</span>
                    <ChevronRight size={17} />
                  </button>
                );
              })}
            </div>
          ))}
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

      <div className="specialist-note"><Network size={19} /><span>Two runtime families, one operating model: explicit routing, shared memory and auditable handoffs.</span></div>
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
        body="Watch the actual meetup-site workflow move from a human brief to a reviewed deployment and durable write-back. This simulation calls no external services."
      />

      <div className="request-demo">
        <div className="brief-panel">
          <span className="panel-label">Human brief</span>
          <blockquote>“Apply the 22 July feedback to our AI meetup website.”</blockquote>
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
          <div className="activity-head"><span>Workflow simulation</span><span className={running ? "pulse" : ""}>{running ? "Playing" : "Ready"}</span></div>
          <div className="activity-body">
            {activeStep < 0 && <p>Start the request to reveal each handoff.</p>}
            {requestSteps.slice(0, activeStep + 1).map((step, index) => (
              <div key={step.title}><span>0{index + 1}</span><p><strong>{step.title}</strong>{step.detail}</p></div>
            ))}
          </div>
          {activeStep === requestSteps.length - 1 && <div className="run-result"><Check size={18} /> Approved work deployed and recorded</div>}
        </div>
      </div>
    </div>
  );
}

const snapshotLanes = ["Ready", "Running", "Blocked · review", "Done"];

function KanbanScene() {
  return (
    <div className="content-scene kanban-scene">
      <SceneIntro
        kicker="Hermes Kanban is the shared work ledger"
        title="A real card, shown as a dated snapshot."
        body="This chapter shows the actual meetup-site implementation card as captured on 22 July 2026. It is explicitly not a live feed, and the interface never invents activity or comments."
      />

      <div className="board-toolbar">
        <div><Layers3 size={19} /><span><strong>VERUN Agent Ops</strong>Task evidence snapshot</span></div>
        <span className="snapshot-label"><CircleDot size={14} /> Captured 22 July 2026</span>
      </div>

      <div className="kanban-board snapshot-board">
        {snapshotLanes.map((lane) => {
          const isCapturedState = lane === "Running";
          return (
            <div className={`kanban-lane ${isCapturedState ? "active" : ""}`} key={lane}>
              <header><span>{lane}</span><small>{isCapturedState ? 1 : 0}</small></header>
              {isCapturedState && (
                <article className="task-card">
                  <div className="task-top"><span>P80</span><span>@q-sol</span></div>
                  <h3>Apply the 22 July meeting feedback</h3>
                  <p>Repository: verun-ai-meetup. Verify wiki facts, run checks, commit locally and stop for human review.</p>
                  <div className="task-meta"><Layers3 size={14} /> t_accf763c · running</div>
                </article>
              )}
            </div>
          );
        })}
      </div>

      <div className="snapshot-evidence" aria-label="Snapshot provenance">
        <div><strong>Source</strong><span>Hermes Kanban card t_accf763c</span></div>
        <div><strong>Captured state</strong><span>Running · assignee q-sol · priority 80</span></div>
        <div><strong>Truth boundary</strong><span>Comments, review and completion exist only on the real card; this view does not simulate them.</span></div>
      </div>
    </div>
  );
}

function BrainScene() {
  const [query, setQuery] = useState("What is live today?");
  const [searched, setSearched] = useState(true);
  const result = useMemo(() => {
    const lower = query.toLowerCase();
    if (lower.includes("vesper") || lower.includes("marketing")) return "Vesper is live in Slack for X intelligence, dossiers and source-backed drafting. Vesper supports narratives but never publishes externally; a human reviews and publishes.";
    if (lower.includes("q") || lower.includes("code") || lower.includes("coding")) return "Q is live in Slack and Hermes Kanban. It works in allowlisted repositories and isolated worktrees, runs checks, creates a local commit, and stops for human review. A guarded draft PR requires a separate human request.";
    if (lower.includes("atlas") || lower.includes("kite") || lower.includes("openclaw")) return "Atlas and Kite are live in Rafael's OpenClaw/Telegram environment. The private VERUN brain bridge is deployed and healthy; cross-tailnet visibility and OpenClaw tool registration are still pending.";
    if (lower.includes("kanban") || lower.includes("task") || lower.includes("board")) return "Hermes Kanban is live as the durable work ledger. Moneypenny creates, assigns, comments on and completes cards directly from Slack, while Q uses cards as its guarded execution contract.";
    if (lower.includes("sync") || lower.includes("github") || lower.includes("obsidian")) return "The server wiki is canonical at runtime and mirrors to GitHub every 15 minutes. Team members open the GitHub checkout as an Obsidian vault.";
    return "Moneypenny, Vesper and Q are the Hermes agent group. Atlas and Kite are the OpenClaw agent group; their agents are live, while final VERUN bridge network visibility and tool registration remain pending.";
  }, [query]);

  const submit = (event: FormEvent) => { event.preventDefault(); setSearched(true); };

  return (
    <div className="content-scene brain-scene">
      <SceneIntro
        kicker="One shared, inspectable memory"
        title="The brain turns source material into reusable company context."
        body="The server Markdown wiki is the canonical runtime memory. Humans and agents add source-backed pages, Moneypenny retrieves them for new work, and a 15-minute GitHub mirror makes the same linked context available in Obsidian. Kanban remains the source of truth for task status."
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
          <div className="brain-facts">
            <div><span>01</span><p><strong>Capture</strong>Raw sources stay preserved; accepted facts become linked Markdown pages.</p></div>
            <div><span>02</span><p><strong>Retrieve</strong>Moneypenny answers from compiled pages and names the supporting sources.</p></div>
            <div><span>03</span><p><strong>Distribute</strong>GitHub mirrors the runtime wiki every 15 minutes for team Obsidian vaults.</p></div>
          </div>
          <form onSubmit={submit}>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setSearched(false); }} aria-label="Ask the company brain" />
            <button type="submit" aria-label="Search the company brain"><ArrowRight size={18} /></button>
          </form>
          {searched && (
            <div className="brain-answer">
              <span>Illustrative retrieval from verified operating notes</span>
              <p>{result}</p>
              <div><FileText size={14} /> Sources: Agent Architecture and Usage Manual, Marketing Intelligence Agent, OpenClaw Brain Bridge</div>
            </div>
          )}
          <div className="sync-chain"><span>Server wiki</span><GitBranch size={15} /><span>GitHub mirror</span><ArrowRight size={15} /><span>Obsidian</span></div>
        </div>
      </div>
    </div>
  );
}

function PrinciplesScene({ goTo }: { goTo: (id: SceneId) => void }) {
  const agentsPrepare = [
    "Moneypenny retrieves source-backed company context",
    "Vesper drafts and supports narratives without publishing",
    "Q implements, checks and commits in an isolated worktree",
    "Kanban preserves scope, evidence and the review state",
  ];
  const humansControl = [
    "Claims and external publishing",
    "Code review and merge",
    "Vercel production deployment",
    "Promotion into canonical company knowledge",
  ];

  return (
    <div className="content-scene principles-scene">
      <div className="principles-copy">
        <div className="eyebrow"><ShieldCheck size={16} /> Human in the loop</div>
        <h1>Agents prepare the work.<br />Humans control the release.</h1>
        <p>Autonomy is bounded by explicit review gates. Agents can retrieve, research, draft and implement; humans remain accountable for what is published, merged, deployed and promoted into durable company memory.</p>
      </div>

      <div className="status-bands">
        <section>
          <header><Bot size={17} /> Agents prepare</header>
          {agentsPrepare.map((item) => <div key={item}><Check size={17} />{item}</div>)}
        </section>
        <section>
          <header><ShieldCheck size={17} /> Humans control</header>
          {humansControl.map((item, index) => <div key={item}><span>0{index + 1}</span>{item}</div>)}
        </section>
      </div>

      <div className="closing-band">
        <div><strong>This website is part of the operating model.</strong><span>A curated explanation of the system, grounded in the current wiki and released through human review.</span></div>
        <button className="primary-action" onClick={() => goTo("overview")}><RefreshCw size={17} /> Explore again</button>
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
        <span className="status-pill live">{agent.status}</span>
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
