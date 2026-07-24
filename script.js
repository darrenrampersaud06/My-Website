const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.getElementById("year").textContent = new Date().getFullYear();

/* ==========================================================
   Duplicate the ticker content once so the scrolling loop
   (translateX 0 -> -50%) is seamless with no visible seam.
   ========================================================== */
const track = document.getElementById("tickerTrack");
if (track){
  track.innerHTML += track.innerHTML;
}

/* ==========================================================
   Restrained fade-up reveal for content sections
   ========================================================== */
const revealTargets = document.querySelectorAll(
  ".about-grid, .skill-grid, .cert-card, .terminal-window, .project-card, .contact-card"
);
revealTargets.forEach(el => el.classList.add("fade-up"));

if ("IntersectionObserver" in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => io.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add("visible"));
}

/* ==========================================================
   INTERACTIVE TERMINAL
   A small command interpreter so the terminal actually does
   something rather than just looking like a decoration.
   ========================================================== */
const termBody = document.getElementById("terminalBody");
const termInput = document.getElementById("terminalInput");

const COMMANDS = {
  help: () =>
    "Available commands:\n" +
    "  about      — who I am\n" +
    "  skills     — what I work with\n" +
    "  certs      — certifications I've earned\n" +
    "  projects   — things I've built\n" +
    "  contact    — how to reach me\n" +
    "  whoami     — quick identity check\n" +
    "  clear      — clear the terminal\n",

about: () =>
  "Darren — Computer Science student. Coursework in Java, UML/OOAD, " +
  "computer architecture, and networking. Builds personal projects, " +
  "explores robotics, and creates experiences like this site.",

skills: () =>
  "Java · Python · JavaScript · HTML & CSS · UML/OOAD · " +
  "Computer Architecture · Networking · Git · Linux · SQL",

certs: () =>
  "Professional & Technical\n" +
  "  Networking Basics — Cisco (ongoing)\n" +
  "  Getting Started with Cisco Packet Tracer — Cisco\n" +
  "  Enterprise Design Thinking Practitioner — IBM\n" +
  "Academic\n" +
  "  Caribbean Secondary Education Certificate — CXC\n" +
  "  Certificate of Business Studies — New Campbellville Secondary School\n" +
  "  Certificate of High Standard of Excellence in EDPM — passed with distinction\n" +
  "Scroll down to the Certifications section for details.",

projects: () =>
  "Web Development\n" +
  "  01 Portfolio Website — this site, built from scratch\n" +
  "Robotics & Embedded Systems\n" +
  "  01 Elegoo Smart Robot Car V4.0 — robotics + embedded systems\n" +
  "Systems & Networking\n" +
  "  01 Raspberry Pi Voice Companion — local AI + hosting\n" +
  "Cyber Security\n" +
  "  01 New Build In Progress — coming soon\n" +
  "Scroll down to the Projects section for links.",

contact: () =>
  "Email: your.email@example.com\nGitHub: github.com/your-github\n" +
  "LinkedIn: linkedin.com/in/your-linkedin",

whoami: () => "guest@night-market — scroll around, explore, and say hi.",

sudo: () => "Nice try. Permission denied — this terminal only grants read access.",

clear: () => "__CLEAR__",
};

const WELCOME_HTML = '<p class="term-line">Welcome. Type <span class="term-cmd">help</span> and press Enter to look around.</p>';

function printLine(text, cls = ""){
  const p = document.createElement("p");
  p.className = `term-line ${cls}`;
  p.textContent = text;
  termBody.appendChild(p);
  termBody.scrollTop = termBody.scrollHeight;
}

function runCommand(raw){
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;

  printLine(`➜ ${raw}`, "term-muted");

  if (cmd === "clear"){
    termBody.innerHTML = WELCOME_HTML;
    return;
  }

  const handler = COMMANDS[cmd];
  if (handler){
    printLine(handler());
  } else {
    printLine(`command not found: ${cmd} — try "help"`, "term-error");
  }
}

if (termInput){
  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
      runCommand(termInput.value);
      termInput.value = "";
    }
  });

  // clicking anywhere in the terminal window focuses the input,
  // like a real shell
  document.getElementById("terminalWindow").addEventListener("click", () => {
    termInput.focus();
  });
}