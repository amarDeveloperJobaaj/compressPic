/**
 * Starter templates for the HTML/CSS/JS Playground.
 * Each template is a self-contained { html, css, js } project.
 */
export interface PlaygroundProject {
  html: string;
  css: string;
  js: string;
}

export interface PlaygroundTemplate extends PlaygroundProject {
  id: string;
  name: string;
  description: string;
}

const BLANK: PlaygroundTemplate = {
  id: "blank",
  name: "Blank Project",
  description: "Start from scratch",
  html: `<!-- Your HTML here -->
<h1>Hello, world!</h1>`,
  css: `/* Your CSS here */
h1 {
  color: #3b82f6;
  font-family: system-ui, sans-serif;
}`,
  js: `// Your JavaScript here
console.log("Hello from the playground!");`,
};

export const PLAYGROUND_TEMPLATES: PlaygroundTemplate[] = [
  BLANK,
  {
    id: "landing",
    name: "Landing Page",
    description: "Hero + features + CTA",
    html: `<header class="nav">
  <div class="logo">Acme</div>
  <nav>
    <a href="#features">Features</a>
    <a href="#pricing">Pricing</a>
    <a href="#cta">Get Started</a>
  </nav>
</header>

<section class="hero">
  <h1>Build something <span>amazing</span></h1>
  <p>The fastest way to launch your product and delight your customers.</p>
  <button class="btn">Get Started Free</button>
</section>

<section id="features" class="features">
  <div class="card"><h3>⚡ Fast</h3><p>Blazing performance out of the box.</p></div>
  <div class="card"><h3>🔒 Secure</h3><p>Privacy-first by design.</p></div>
  <div class="card"><h3>🌍 Global</h3><p>Scale to millions of users.</p></div>
</section>`,
    css: `* { margin: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; color: #0f172a; background: #f8fafc; }

.nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 40px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.08);
}
.logo { font-weight: 800; font-size: 20px; color: #3b82f6; }
.nav a { margin-left: 20px; text-decoration: none; color: #475569; font-weight: 500; }
.nav a:hover { color: #3b82f6; }

.hero { text-align: center; padding: 90px 24px 60px; }
.hero h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); line-height: 1.1; }
.hero span { background: linear-gradient(90deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero p { margin: 18px auto 28px; max-width: 480px; color: #64748b; font-size: 18px; }
.btn {
  background: #3b82f6; color: #fff; border: none; padding: 14px 32px;
  border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;
  transition: transform .15s, box-shadow .15s;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(59,130,246,.35); }

.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; padding: 40px; max-width: 1000px; margin: auto; }
.card { background: #fff; padding: 28px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,.06); transition: transform .2s; }
.card:hover { transform: translateY(-4px); }
.card h3 { margin-bottom: 8px; }`,
    js: `// Interactive landing page
const btn = document.querySelector(".btn");
btn.addEventListener("click", () => {
  btn.textContent = "✓ You're on the list!";
  btn.style.background = "#22c55e";
});
console.log("Landing page template loaded");`,
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Personal site with grid gallery",
    html: `<section class="profile">
  <img src="https://api.dicebear.com/9.x/initials/svg?seed=Ava" alt="Ava" />
  <h1>Ava Chen</h1>
  <p>Product designer & front-end developer</p>
</section>

<section class="gallery">
  <div class="work" style="--c:#f59e0b"><span>Branding</span></div>
  <div class="work" style="--c:#3b82f6"><span>Web App</span></div>
  <div class="work" style="--c:#8b5cf6"><span>Illustration</span></div>
  <div class="work" style="--c:#10b981"><span>Motion</span></div>
</section>`,
    css: `* { margin: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; }

.profile { text-align: center; padding: 60px 20px 30px; }
.profile img { width: 96px; height: 96px; border-radius: 50%; border: 3px solid #3b82f6; }
.profile h1 { margin: 14px 0 6px; font-size: 28px; }
.profile p { color: #94a3b8; }

.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; padding: 40px; max-width: 900px; margin: auto; }
.work {
  aspect-ratio: 4/3; border-radius: 16px; display: flex; align-items: flex-end;
  padding: 16px; background: linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 40%, #0f172a));
  font-weight: 600; transition: transform .2s; cursor: pointer;
}
.work:hover { transform: scale(1.03); }`,
    js: `// Hover feedback on gallery items
document.querySelectorAll(".work").forEach((item) => {
  item.addEventListener("click", () => {
    console.log("Clicked:", item.querySelector("span").textContent);
  });
});`,
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Sidebar + stat cards + chart",
    html: `<aside class="sidebar">
  <div class="logo">◆ Dash</div>
  <nav>
    <a class="active">Overview</a>
    <a>Analytics</a>
    <a>Customers</a>
    <a>Settings</a>
  </nav>
</aside>

<main class="main">
  <header class="topbar"><h1>Overview</h1><input placeholder="Search…" /></header>

  <section class="stats">
    <div class="stat"><span class="label">Revenue</span><span class="value" data-target="48250">$0</span><span class="delta up">+12.4%</span></div>
    <div class="stat"><span class="label">Users</span><span class="value" data-target="9321">0</span><span class="delta up">+8.1%</span></div>
    <div class="stat"><span class="label">Orders</span><span class="value" data-target="1420">0</span><span class="delta down">-2.3%</span></div>
  </section>

  <section class="chart"><canvas id="chart"></canvas></section>
</main>`,
    css: `* { margin: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; display: flex; min-height: 100vh; background: #f1f5f9; }

.sidebar { width: 210px; background: #0f172a; color: #94a3b8; padding: 20px; display: flex; flex-direction: column; gap: 24px; }
.sidebar .logo { font-size: 18px; font-weight: 800; color: #fff; }
.sidebar nav { display: flex; flex-direction: column; gap: 4px; }
.sidebar a { padding: 10px 12px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: background .15s; }
.sidebar a:hover { background: #1e293b; color: #e2e8f0; }
.sidebar a.active { background: #3b82f6; color: #fff; }

.main { flex: 1; padding: 24px; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.topbar h1 { font-size: 22px; }
.topbar input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; width: 220px; }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat { background: #fff; border-radius: 14px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,.05); }
.stat .label { display: block; color: #64748b; font-size: 13px; }
.stat .value { display: block; font-size: 26px; font-weight: 700; margin: 6px 0; }
.delta { font-size: 12px; font-weight: 600; }
.delta.up { color: #16a34a; }
.delta.down { color: #dc2626; }

.chart { background: #fff; border-radius: 14px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,.05); height: 260px; }`,
    js: `// Animated counters
document.querySelectorAll(".value").forEach((el) => {
  const target = Number(el.dataset.target);
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / 1200);
    el.textContent = el.dataset.target.length > 3
      ? "$" + Math.round(target * (0.1 + 0.9 * p)).toLocaleString()
      : Math.round(target * (0.1 + 0.9 * p)).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

// Tiny sparkline on canvas
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
const data = [12, 18, 14, 22, 20, 28, 24, 32, 30, 38, 34, 44];
ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2; ctx.beginPath();
data.forEach((v, i) => {
  const x = (i / (data.length - 1)) * canvas.width;
  const y = canvas.height - (v / 50) * canvas.height;
  i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
});
ctx.stroke();
console.log("Dashboard ready");`,
  },
  {
    id: "navbar",
    name: "Navbar",
    description: "Sticky nav with mobile menu",
    html: `<nav class="navbar">
  <a class="brand">Brand</a>
  <button class="burger" aria-label="Toggle menu">☰</button>
  <ul class="menu">
    <li><a>Home</a></li>
    <li><a>About</a></li>
    <li><a>Services</a></li>
    <li><a>Contact</a></li>
    <li><button class="cta">Sign Up</button></li>
  </ul>
</nav>

<section class="content">
  <h1>Sticky navigation</h1>
  <p>Scroll down — the navbar stays pinned, and the mobile menu collapses into a burger on small screens.</p>
</section>`,
    css: `* { margin: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }

.navbar {
  position: sticky; top: 0; z-index: 10;
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 28px; background: rgba(15,23,42,.9); backdrop-filter: blur(10px);
  color: #e2e8f0;
}
.brand { font-weight: 800; font-size: 18px; }
.menu { display: flex; gap: 22px; list-style: none; align-items: center; }
.menu a { color: #cbd5e1; text-decoration: none; font-size: 14px; }
.menu a:hover { color: #fff; }
.cta { background: #3b82f6; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.burger { display: none; background: none; border: none; color: #e2e8f0; font-size: 22px; cursor: pointer; }

.content { padding: 80px 28px; max-width: 640px; }
.content h1 { margin-bottom: 12px; }
.content p { color: #64748b; line-height: 1.7; }

@media (max-width: 640px) {
  .burger { display: block; }
  .menu { display: none; position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; background: #0f172a; padding: 16px; }
  .menu.open { display: flex; }
}`,
    js: `const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");
burger.addEventListener("click", () => menu.classList.toggle("open"));
console.log("Navbar ready");`,
  },
  {
    id: "hero",
    name: "Hero Section",
    description: "Gradient hero with animated blobs",
    html: `<section class="hero">
  <div class="blob b1"></div>
  <div class="blob b2"></div>
  <div class="content">
    <span class="pill">✨ New: v2.0 is here</span>
    <h1>Ship your idea at the speed of thought</h1>
    <p>Join 40,000+ builders creating with our platform. Free to start, scales with you.</p>
    <div class="actions">
      <button class="primary">Start Free Trial</button>
      <button class="secondary">Watch Demo</button>
    </div>
  </div>
</section>`,
    css: `* { margin: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }

.hero { position: relative; overflow: hidden; min-height: 92vh; display: grid; place-items: center; background: #0f172a; color: #fff; }
.content { text-align: center; max-width: 640px; padding: 24px; position: relative; z-index: 2; }

.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .55; animation: float 8s ease-in-out infinite; }
.b1 { width: 380px; height: 380px; background: #3b82f6; top: -80px; left: -60px; }
.b2 { width: 320px; height: 320px; background: #8b5cf6; bottom: -60px; right: -40px; animation-delay: -4s; }
@keyframes float { 50% { transform: translate(40px, 30px) scale(1.1); } }

.pill { display: inline-block; background: rgba(59,130,246,.15); color: #93c5fd; border: 1px solid rgba(59,130,246,.4); padding: 6px 14px; border-radius: 999px; font-size: 13px; margin-bottom: 20px; }
h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1.12; }
p { margin: 18px auto 30px; color: #94a3b8; font-size: 17px; max-width: 460px; }

.actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.primary, .secondary { padding: 13px 26px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: transform .15s; }
.primary { background: #3b82f6; color: #fff; border: none; }
.secondary { background: transparent; color: #e2e8f0; border: 1px solid #334155; }
.primary:hover, .secondary:hover { transform: translateY(-2px); }`,
    js: `console.log("Hero rendered");
// Add a subtle parallax to the blobs on mouse move
const hero = document.querySelector(".hero");
hero.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  document.querySelector(".b1").style.translate = \`\${x}px \${y}px\`;
  document.querySelector(".b2").style.translate = \`\${-x}px \${-y}px\`;
});`,
  },
  {
    id: "login",
    name: "Login Page",
    description: "Card form with validation",
    html: `<section class="wrap">
  <form class="card" id="form" novalidate>
    <h2>Welcome back</h2>
    <p class="sub">Sign in to continue</p>

    <label>Email
      <input type="email" id="email" placeholder="you@example.com" />
      <small class="err" data-for="email"></small>
    </label>

    <label>Password
      <input type="password" id="password" placeholder="••••••••" />
      <small class="err" data-for="password"></small>
    </label>

    <button type="submit">Sign In</button>
    <p class="foot">Don't have an account? <a>Sign up</a></p>
  </form>
</section>`,
    css: `* { margin: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }
.wrap { min-height: 100vh; display: grid; place-items: center; background: linear-gradient(135deg, #0f172a, #1e293b); padding: 24px; }

.card { background: #fff; padding: 36px; border-radius: 18px; width: 100%; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,.3); }
.card h2 { font-size: 24px; }
.sub { color: #64748b; margin: 6px 0 22px; font-size: 14px; }
label { display: block; margin-bottom: 16px; font-size: 13px; font-weight: 600; color: #334155; }
input { width: 100%; padding: 11px 13px; margin-top: 6px; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 14px; transition: border-color .15s; }
input:focus { outline: none; border-color: #3b82f6; }
.err { display: block; min-height: 16px; color: #dc2626; font-weight: 500; margin-top: 4px; font-size: 12px; }
button[type="submit"] { width: 100%; background: #3b82f6; color: #fff; border: none; padding: 13px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background .15s; margin-top: 4px; }
button:hover { background: #2563eb; }
.foot { text-align: center; margin-top: 16px; font-size: 13px; color: #64748b; }
.foot a { color: #3b82f6; font-weight: 600; cursor: pointer; }`,
    js: `const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const show = (id, msg) => {
    document.querySelector(\`[data-for="\${id}"]\`).textContent = msg;
    document.getElementById(id).style.borderColor = msg ? "#dc2626" : "#cbd5e1";
  };
  show("email", !email.value.includes("@") ? "Enter a valid email." : "");
  show("password", password.value.length < 6 ? "At least 6 characters." : "");
  if (email.value.includes("@") && password.value.length >= 6) {
    console.log("Login submitted for", email.value);
    alert("Signed in! (demo)");
  }
});`,
  },
  {
    id: "pricing",
    name: "Pricing Page",
    description: "3 tiers with highlighted plan",
    html: `<section class="wrap">
  <h1>Simple pricing</h1>
  <p class="sub">Start free. Upgrade when you're ready.</p>

  <div class="tiers">
    <div class="tier">
      <h3>Starter</h3>
      <p class="price">$0<span>/mo</span></p>
      <ul><li>3 projects</li><li>1 GB storage</li><li>Community support</li></ul>
      <button>Get Started</button>
    </div>

    <div class="tier featured">
      <span class="tag">Most popular</span>
      <h3>Pro</h3>
      <p class="price">$19<span>/mo</span></p>
      <ul><li>Unlimited projects</li><li>100 GB storage</li><li>Priority support</li><li>Custom domains</li></ul>
      <button>Start Free Trial</button>
    </div>

    <div class="tier">
      <h3>Team</h3>
      <p class="price">$49<span>/mo</span></p>
      <ul><li>Everything in Pro</li><li>SSO & roles</li><li>Audit logs</li></ul>
      <button>Contact Sales</button>
    </div>
  </div>
</section>`,
    css: `* { margin: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; background: #f8fafc; }
.wrap { padding: 60px 24px; text-align: center; }
.wrap h1 { font-size: 2.4rem; }
.sub { color: #64748b; margin: 10px 0 40px; }

.tiers { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 22px; max-width: 960px; margin: auto; align-items: stretch; }
.tier { background: #fff; border-radius: 18px; padding: 30px; text-align: left; border: 1.5px solid #e2e8f0; display: flex; flex-direction: column; position: relative; transition: transform .2s; }
.tier:hover { transform: translateY(-4px); }
.tier.featured { border-color: #3b82f6; box-shadow: 0 12px 40px rgba(59,130,246,.18); }
.tag { position: absolute; top: -13px; left: 50%; translate: -50%; background: #3b82f6; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 999px; }
.price { font-size: 32px; font-weight: 800; margin: 10px 0 4px; }
.price span { font-size: 14px; color: #94a3b8; font-weight: 400; }
ul { list-style: none; margin: 16px 0 24px; display: grid; gap: 8px; color: #475569; font-size: 14px; }
li::before { content: "✓ "; color: #16a34a; font-weight: 700; }
button { margin-top: auto; background: #f1f5f9; border: none; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all .15s; }
.featured button { background: #3b82f6; color: #fff; }
button:hover { filter: brightness(.95); }`,
    js: `document.querySelectorAll(".tier button").forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log("Selected plan:", btn.closest(".tier").querySelector("h3").textContent);
  });
});`,
  },
  {
    id: "card",
    name: "Card Layout",
    description: "Profile card with hover effects",
    html: `<section class="wrap">
  <div class="card">
    <div class="cover"></div>
    <div class="avatar">JD</div>
    <h2>Jordan Davis</h2>
    <p class="role">Senior Frontend Engineer</p>
    <p class="bio">Building delightful web experiences with React and TypeScript for 8 years.</p>
    <div class="stats">
      <div><strong>128</strong><span>Projects</span></div>
      <div><strong>4.9k</strong><span>Followers</span></div>
      <div><strong>36</strong><span>Awards</span></div>
    </div>
    <button>Follow</button>
  </div>
</section>`,
    css: `* { margin: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; }
.wrap { min-height: 100vh; display: grid; place-items: center; background: linear-gradient(135deg, #dbeafe, #ede9fe); padding: 24px; }

.card { width: 320px; background: #fff; border-radius: 20px; overflow: hidden; text-align: center; box-shadow: 0 20px 50px rgba(15,23,42,.15); transition: transform .25s; }
.card:hover { transform: translateY(-6px) scale(1.01); }
.cover { height: 90px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
.avatar { width: 76px; height: 76px; border-radius: 50%; background: #8b5cf6; color: #fff; display: grid; place-items: center; font-size: 26px; font-weight: 800; margin: -38px auto 0; border: 4px solid #fff; }
h2 { margin-top: 10px; font-size: 20px; }
.role { color: #3b82f6; font-weight: 600; font-size: 13px; margin: 4px 0 10px; }
.bio { color: #64748b; font-size: 13px; padding: 0 24px; line-height: 1.6; }
.stats { display: flex; justify-content: space-around; margin: 18px 0; padding: 14px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
.stats strong { display: block; font-size: 17px; }
.stats span { font-size: 11px; color: #94a3b8; }
button { background: #3b82f6; color: #fff; border: none; padding: 11px 34px; border-radius: 999px; font-weight: 700; margin-bottom: 24px; cursor: pointer; transition: background .15s; }
button:hover { background: #2563eb; }
button.following { background: #16a34a; }`,
    js: `const btn = document.querySelector("button");
btn.addEventListener("click", () => {
  const following = btn.classList.toggle("following");
  btn.textContent = following ? "✓ Following" : "Follow";
  console.log(following ? "Now following Jordan" : "Unfollowed");
});`,
  },
];
