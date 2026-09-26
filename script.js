// Zain Qazi Portfolio - Interactive Script

document.addEventListener('DOMContentLoaded', () => {
    // ==================== TYPING EFFECT ====================
    const typingElement = document.getElementById('typingText');
    const titles = [
        "Front-end Developer",
        "Python Learner",
        "UI & Responsive Design Specialist"
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeEffect() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typingElement.innerHTML = currentTitle.substring(0, charIndex - 1) + '<span class="typing-cursor"></span>';
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.innerHTML = currentTitle.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 1600;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingElement) {
        typeEffect();
    }

    // ==================== NAVBAR SCROLL & ACTIVE LINKS ====================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ==================== MOBILE MENU ====================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navLinks');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==================== SCROLL REVEAL ANIMATION ====================
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealOnScroll.observe(el));
});

// ==================== CONTACT FORM HANDLER (Formspree) ====================
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    const statusDiv = document.getElementById('formStatus');

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    if (statusDiv) {
        statusDiv.textContent = '';
        statusDiv.className = 'form-status';
    }

    fetch('https://formspree.io/f/xpwzgejb', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            btn.style.background = 'var(--secondary)';
            form.reset();
            if (statusDiv) {
                statusDiv.textContent = '✅ Your message was sent successfully! I\'ll get back to you shortly.';
                statusDiv.className = 'form-status success';
            }
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                if (statusDiv) { statusDiv.textContent = ''; statusDiv.className = 'form-status'; }
            }, 5000);
        } else {
            return response.json().then(data => {
                throw new Error(data.errors ? data.errors.map(e => e.message).join(', ') : 'Submission failed');
            });
        }
    })
    .catch(err => {
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
        btn.style.background = '#e74c3c';
        if (statusDiv) {
            statusDiv.textContent = '❌ Failed to send. Please email directly: qazizain253@gmail.com';
            statusDiv.className = 'form-status error';
        }
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    });

    return false;
}

// ==================== JOB MATCH ANALYZER ENGINE (Enhanced) ====================

// Synonym/alias map — expands shorthand keywords in job descriptions
const SYNONYMS = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'html': 'html5',
    'css': 'css3',
    'bs5': 'bootstrap',
    'es6': 'javascript',
    'es2015': 'javascript',
    'vanillajs': 'javascript',
    'vanilla js': 'javascript',
    'vanilla javascript': 'javascript',
    'jq': 'jquery',
    'flask web': 'flask',
    'web development': 'html5',
    'frontend': 'html5',
    'front-end': 'html5',
    'back-end': 'python',
    'backend': 'flask',
    'scripting': 'python',
    'oop': 'object-oriented',
    'object oriented': 'object-oriented',
    'ui design': 'dom manipulation',
    'user interface': 'dom manipulation',
    'cross-browser': 'responsive',
    'mobile-first': 'responsive',
    'mobile first': 'responsive',
    'mobile-friendly': 'responsive',
    'media queries': 'responsive',
    'grid layout': 'css3',
    'flexbox': 'css3',
    'ajax': 'jquery',
    'git': 'vs code',
    'version control': 'vs code',
    'ide': 'vs code',
};

// Weighted skill profile — weight = how important each skill is to Zain's core offering
const candidateData = {
    skills: [
        { name: "HTML5 / Semantic Markup",             weight: 3, keys: ["html", "html5", "semantic", "markup", "web page", "hypertext"] },
        { name: "CSS3 / Flexbox & Grid",               weight: 3, keys: ["css", "css3", "styling", "flexbox", "grid", "animations", "transitions", "sass", "scss"] },
        { name: "Bootstrap 5",                          weight: 2, keys: ["bootstrap", "bootstrap 5", "bootstrap5", "responsive framework", "component library"] },
        { name: "JavaScript (ES6+)",                    weight: 3, keys: ["javascript", "js", "es6", "vanilla", "dom", "event", "script", "ecmascript", "async"] },
        { name: "jQuery",                               weight: 2, keys: ["jquery", "ajax", "dollar sign", "jq", "selectors"] },
        { name: "Python / Flask",                       weight: 2, keys: ["python", "flask", "scripting", "oop", "backend", "data structures", "object-oriented", "jinja", "jinja2", "server-side"] },
        { name: "Responsive Web Design",                weight: 3, keys: ["responsive", "mobile-friendly", "cross-browser", "media queries", "adaptive", "viewport", "mobile first"] },
        { name: "DOM Manipulation",                     weight: 2, keys: ["dom manipulation", "dom", "dynamic ui", "interactive", "event handling", "user interface", "ui"] },
        { name: "Object-Oriented Programming (OOP)",    weight: 1, keys: ["oop", "object-oriented", "classes", "inheritance", "encapsulation"] },
        { name: "VS Code & Dev Tools",                  weight: 1, keys: ["vs code", "vscode", "ide", "editor", "git", "version control", "debugging", "devtools"] }
    ],
    projects: [
        { name: "Marco Web",                tech: "HTML5, CSS3",                    matchKeys: ["html", "css", "layout", "restaurant", "static", "responsive", "landing"] },
        { name: "Moision Doree Web",         tech: "HTML5, CSS3, Bootstrap 5",       matchKeys: ["bootstrap", "responsive", "carousel", "grid", "mobile", "landing", "static"] },
        { name: "iOS Calculator",            tech: "HTML5, CSS3, JavaScript",        matchKeys: ["javascript", "js", "calculator", "math", "dom", "ui", "interactive", "logic"] },
        { name: "Bank Management System",    tech: "Python, JavaScript",             matchKeys: ["python", "banking", "finance", "validation", "pin", "auth", "logic", "backend"] },
        { name: "adminZQ Restaurant Suite",  tech: "Python (Flask), Bootstrap 5, JS, jQuery", matchKeys: ["admin", "dashboard", "jquery", "bootstrap", "charts", "analytics", "flask", "python", "restaurant", "backend", "management"] }
    ]
};

const jobSamples = {
    "frontend": `We are seeking a Junior Frontend Developer to build modern, responsive web user interfaces.
Requirements:
- Strong proficiency in HTML5, CSS3, and modern JavaScript (ES6)
- Experience using Bootstrap 5 for responsive grid layouts and UI components
- Familiarity with jQuery and DOM manipulation for interactive web elements
- Understanding of responsive design principles across mobile and desktop
- Ability to write clean, maintainable code using VS Code`,

    "ui-web": `Looking for a UI & Responsive Web Developer for landing pages and marketing platforms.
Key Responsibilities:
- Design and implement pixel-perfect, responsive static web pages using HTML5 & CSS3
- Utilize Bootstrap to quickly prototype UI components and carousels
- Implement interactive UI elements using JavaScript and jQuery
- Ensure cross-browser compatibility and mobile-first responsiveness`,

    "python-intern": `Exciting opportunity for a Python & Web Development Intern.
Candidate Profile:
- Familiarity with frontend fundamentals (HTML, CSS, JavaScript)
- Currently learning Python programming with focus on basic data structures, OOP concepts, and scripting
- Experience building basic application logic and console or web-based projects using Flask or Django
- Eager to learn, collaborate, and grow with senior developers`
};

function loadJobSample(type) {
    const textarea = document.getElementById('jobDescriptionInput');
    if (jobSamples[type]) {
        textarea.value = jobSamples[type];
        textarea.focus();
    }
}

function resetJobMatch() {
    document.getElementById('jobDescriptionInput').value = '';
    const resCard = document.getElementById('matchResults');
    resCard.style.display = 'none';
    resCard.innerHTML = '';
}

// Normalize and expand synonyms in the job description text
function normalizeText(raw) {
    let text = raw.toLowerCase();
    for (const [alias, canonical] of Object.entries(SYNONYMS)) {
        text = text.replaceAll(alias, canonical);
    }
    return text;
}

// Determine color for score badge
function scoreColor(score) {
    if (score >= 88) return '#10b981'; // green
    if (score >= 75) return '#3b82f6'; // blue
    if (score >= 62) return '#f59e0b'; // amber
    if (score >= 50) return '#f97316'; // orange
    return '#ef4444';                  // red
}

// 5-tier verdict
function getVerdict(score) {
    if (score >= 88) return { label: "Exceptional Fit",      icon: "🚀", desc: "Strong match — Zain's full skill set directly aligns with this role." };
    if (score >= 75) return { label: "Strong Candidate",     icon: "⭐", desc: "Great alignment — ready to contribute from day one." };
    if (score >= 62) return { label: "Good Alignment",       icon: "✅", desc: "Solid fit — most key requirements are met with relevant projects." };
    if (score >= 50) return { label: "Partial Fit",          icon: "📈", desc: "Good foundation — a few gaps but strong growth trajectory." };
    return              { label: "Developing Fit",           icon: "🌱", desc: "Early alignment — Zain is actively building the required skills." };
}

function analyzeJobMatch() {
    const input = document.getElementById('jobDescriptionInput').value.trim();
    if (!input) {
        alert("Please paste a job description or click one of the quick preset test buttons above.");
        return;
    }

    const btn = document.getElementById('analyzeJobBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

    setTimeout(() => {
        const text = normalizeText(input);

        // --- Weighted skill scoring ---
        let totalWeight = 0;
        let earnedWeight = 0;
        let matchedSkills = [];
        let gapSkills = [];

        candidateData.skills.forEach(skill => {
            totalWeight += skill.weight;
            const isMatched = skill.keys.some(k => text.includes(k));
            if (isMatched) {
                earnedWeight += skill.weight;
                matchedSkills.push(skill);
            } else {
                gapSkills.push(skill);
            }
        });

        // --- Project relevance scoring ---
        let matchedProjects = [];
        candidateData.projects.forEach(proj => {
            const hits = proj.matchKeys.filter(k => text.includes(k)).length;
            const relevance = Math.min(100, Math.round((hits / proj.matchKeys.length) * 100));
            if (hits > 0) {
                matchedProjects.push({ ...proj, hits, relevance });
            }
        });
        matchedProjects.sort((a, b) => b.relevance - a.relevance);

        // --- Composite score formula ---
        const skillScore = (earnedWeight / totalWeight) * 80;
        const projectBonus = matchedProjects.length >= 3 ? 15 : matchedProjects.length >= 2 ? 10 : matchedProjects.length === 1 ? 5 : 0;
        let score = Math.round(skillScore + projectBonus);
        score = Math.max(42, Math.min(96, score));

        const color = scoreColor(score);
        const verdict = getVerdict(score);
        const confidence = matchedSkills.length >= 7 ? "High" : matchedSkills.length >= 4 ? "Medium" : "Low";
        const confidenceIcon = confidence === "High" ? "🟢" : confidence === "Medium" ? "🟡" : "🔴";

        const resCard = document.getElementById('matchResults');
        resCard.innerHTML = `
            <div class="result-header-row">
                <div class="score-badge-circle">
                    <div class="score-circle-wrap">
                        <svg viewBox="0 0 120 120" class="score-ring" aria-hidden="true">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10"/>
                            <circle cx="60" cy="60" r="52" fill="none" stroke="${color}" stroke-width="10"
                                stroke-dasharray="${Math.round(2 * Math.PI * 52)}"
                                stroke-dashoffset="${Math.round(2 * Math.PI * 52 * (1 - score / 100))}"
                                stroke-linecap="round"
                                style="transition: stroke-dashoffset 1.2s ease; transform: rotate(-90deg); transform-origin: 60px 60px;"/>
                        </svg>
                        <div class="score-number" style="color:${color};">${score}%</div>
                    </div>
                    <div class="score-meta">
                        <h4>${verdict.icon} ${verdict.label}</h4>
                        <p>${verdict.desc}</p>
                        <span class="confidence-badge">${confidenceIcon} ${confidence} Confidence · ${matchedSkills.length}/${candidateData.skills.length} skills matched</span>
                    </div>
                </div>
                <a href="#projects" class="btn btn-outline" style="font-size:0.85rem; padding:8px 16px;">
                    <i class="fas fa-folder-open"></i> Review Evidence Projects
                </a>
            </div>

            <!-- Score bar breakdown -->
            <div class="score-breakdown-bar">
                <div class="breakdown-label">Skill Match</div>
                <div class="breakdown-track">
                    <div class="breakdown-fill" style="width:${Math.round(skillScore / 80 * 100)}%; background:${color};"></div>
                </div>
                <div class="breakdown-label">Project Relevance</div>
                <div class="breakdown-track">
                    <div class="breakdown-fill" style="width:${Math.round((projectBonus / 15) * 100)}%; background:var(--secondary);"></div>
                </div>
            </div>

            <div class="result-body-grid">
                <!-- Matched Skills -->
                <div class="result-col">
                    <h5><i class="fas fa-check-circle" style="color:var(--secondary)"></i> Matched Skills (${matchedSkills.length})</h5>
                    <div class="matched-pill-list">
                        ${matchedSkills.length > 0
                            ? matchedSkills.map(s => `<span class="matched-pill"><i class="fas fa-check"></i> ${s.name} <span class="weight-dot" title="Skill weight ${s.weight}/3">${'●'.repeat(s.weight)}</span></span>`).join('')
                            : '<span style="color:var(--text-secondary); font-size:0.85rem;">No direct keywords found</span>'}
                    </div>

                    ${gapSkills.length > 0 ? `
                        <h5 style="margin-top:18px; color:#f97316;"><i class="fas fa-exclamation-circle"></i> Gap Analysis (${gapSkills.length} not mentioned)</h5>
                        <div class="matched-pill-list">
                            ${gapSkills.map(s => `<span class="matched-pill missing"><i class="fas fa-arrow-up"></i> ${s.name}</span>`).join('')}
                        </div>
                        <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:6px;">Gap skills Zain has but job description didn't explicitly mention — still transferable.</p>
                    ` : '<p style="color:var(--secondary); font-size:0.85rem; margin-top:10px;"><i class="fas fa-star"></i> All skills matched!</p>'}
                </div>

                <!-- Relevant Projects -->
                <div class="result-col">
                    <h5><i class="fas fa-laptop-code" style="color:var(--primary)"></i> Relevant Showcase Projects</h5>
                    <div class="recommended-projects-list">
                        ${(matchedProjects.length > 0 ? matchedProjects.slice(0, 4) : candidateData.projects.slice(0, 2)).map(p => `
                            <div class="rec-project-item">
                                <div>
                                    <strong>${p.name}</strong>
                                    <div style="font-size:0.75rem; color:var(--text-secondary);">${p.tech}</div>
                                    ${p.relevance !== undefined ? `
                                    <div class="mini-bar-wrap" title="${p.relevance}% keyword match">
                                        <div class="mini-bar-fill" style="width:${p.relevance}%; background:${scoreColor(p.relevance)};"></div>
                                    </div>` : ''}
                                </div>
                                <span>${p.relevance !== undefined ? p.relevance + '%' : 'Relevant'}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 16px;">
                        <a href="#projects" class="btn btn-primary" style="font-size:0.8rem; padding:8px 14px;">
                            <i class="fas fa-eye"></i> View All Projects
                        </a>
                        <a href="Zain Qazi - Resume.pdf" download="Zain_Qazi_Resume.pdf" class="btn btn-outline" style="font-size:0.8rem; padding:8px 14px; margin-left:8px;">
                            <i class="fas fa-download"></i> Download Resume
                        </a>
                    </div>
                </div>
            </div>
        `;

        resCard.style.display = 'block';
        resCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-bolt"></i> Analyze Compatibility Match';
    }, 600); // brief delay for UX feel
}
