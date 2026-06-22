# Plan: Math Practice Tool (questiongenprototype)

## Context
- Project: `questiongenprototype/` (empty stubs, convert to PHP)
- Style reference: `Thing_questionmark/` — PHP, vanilla JS, RTL Hebrew, snake_case PHP, camelCase JS, kebab-case HTML
- No outside libraries. Reinvent the wheel. JS Canvas for graphs.
- Target: 12–16 yo Hebrew-speaking students, computer-illiterate

## Decisions
- Location: `questiongenprototype/` (standalone, not integrated yet)
- Equation types: Linear (ax+b=c) + Quadratic (ax²+bx+c=0)
- Input: Typing notation (x^2, sqrt, /) with live render + virtual keypad overlay
- Validation: Both modes available (instant per-step & post-submission), configurable per question
- Storage: localStorage for validation/session; MySQL via PHP for teacher-visible analytics
- SPA injection fix: deferred — build standalone first
- Justification chips: stored as `data/justifications.json` (schema: `[{ "key": "distributive", "label_he": "חוק הפילוג", "label_en": "Distributive Property" }]`). PHP serves the file, JS fetches and renders chips. Bilingual from the start; add new rules without touching code.

---

## Phase 0: Project Scaffolding
1. Convert `home.html` → `home.php`; mirror Thing_questionmark folder structure
2. Create `php/utilities.php` (ROOT_PATH, ROOT_URL, construct_style_script)
3. Create `php/db.php` (MySQL connection)
4. Create base CSS: `css/site_wide_styles.css` (grid layout, RTL), `css/ui_elements.css`
5. Create `pages/practice.php` — main practice page shell

---

## Phase 1: Math Engine (JS, client-side only)
All files under `js/engine/`

Implementation order (each depends on prior):
1. **`ast.js`** — node classes: Num, Var, Add, Mul, Neg, Div, Pow, Radical, Equation
2. **`tokenizer.js`** — string → token array (handles x^2, sqrt(), implicit multiplication, =)
3. **`parser.js`** — token array → AST (recursive descent, handles operator precedence)
4. **`simplifier.js`** — canonicalize AST (collect like terms, flatten nested Add/Mul, constant folding)
5. **`solver.js`** — solve Equation AST:
   - Linear: isolate variable symbolically
   - Quadratic: quadratic formula; return solution set {x1, x2} or {} or {all}
6. **`generator.js`** — create randomized equations with controlled params (integer coefficients, chosen difficulty tier)
7. **`validator.js`** — given two Equation ASTs (prev step, student step):
   - **Validity**: solve both, compare solution sets → same = valid
   - **Legality**: scan for variable denominators (flag), zero denominators (flag), others added later
   - **Annotation check**: if student annotated operation (+k, -k, *k, /k), verify prev_step op = student_step

Step validation strategy: solve both equations → compare solution sets. Works for all intermediate steps.

---

## Phase 2: Math Renderer + Input (JS + CSS)
Files: `js/ui/math_renderer.js`, `js/ui/math_input.js`, `js/ui/keypad.js`, `css/math_display.css`

1. **`math_renderer.js`** — AST → HTML/CSS:
   - Fraction: `<div class="fraction"><div class="numerator">…</div><div class="denominator">…</div></div>`
   - Exponent: `<sup>…</sup>` wrapper
   - Radical: CSS with `border-top` overline trick
   - Renders LTR inside RTL page (needs `dir="ltr"` wrapper)
2. **`css/math_display.css`** — all math rendering styles (fractions, radicals, aligned equals)
3. **`math_input.js`** — contenteditable or `<input>` field:
   - On keystroke: tokenize + parse + render → live preview div updates
   - Handles shortcut notation: `^` → exponent, `//` or `/` in fraction context, `sqrt(` → radical
   - Falls back to plain text display if parse fails (don't block student)
4. **`keypad.js`** — floating overlay panel:
   - Buttons: ², √, ÷, ×, ±, (, ), =, ≠, π, fractions
   - Inserts notation text at cursor in the input field
   - Toggle show/hide with a button

---

## Phase 3: Practice Session UI
Files: `js/practice/session.js`, `js/practice/analytics.js`, `css/practice_session.css`, `pages/practice.php`

1. **`session.js`** — `PracticeSession` class:
   - `currentQuestion` (Equation AST + solution), `stepHistory[]`, `validationMode` (instant|deferred)
   - `startTimer()`, `stopTimer()` per step and per question
   - `submitStep(equationString, annotationString, justificationKey)`:
     - Parse → validate → emit result event
   - `submitAnswer()` for deferred mode
   - Emits events: `step_valid`, `step_invalid`, `step_illegal`, `question_solved`
2. **`pages/practice.php`** — HTML shell:
   - Question display area (rendered equation, problem statement in Hebrew)
   - Step list (previous steps shown above, current input at bottom)
   - Annotation input (optional small field next to step, e.g. `-4 on both sides`)
   - Justification selector (optional dropdown/chip set: distributive property, etc.)
   - Validation mode toggle (instant / post-submit)
   - Submit step button + Submit answer button
3. **`css/practice_session.css`** — layout for the practice area; step history styling; feedback styling (green valid, red invalid, orange illegal)
4. **`analytics.js`** — `AnalyticsTracker`:
   - On each step/question event: write to localStorage
   - On session end (`flush()`): POST aggregated data to `php/api/submit_session.php`
   - Schema for localStorage: `{ session_id, questions: [ { eq, steps: [{time_ms, valid, annotation_correct}], total_time_ms } ] }`

---

## Phase 4: Canvas Graphing (independent of Phases 2/3)
File: `js/ui/canvas_graph.js`

1. **`CoordinatePlane`** class — canvas element, draws axes + grid, labeled ticks
2. **`plot(fn, color, range)`** — samples function at N points, draws curve
3. **`markPoints(points)`** — draws dots + labels (for solutions, intercepts)
4. Integration into practice session: after solving, render graph below solution:
   - Linear: `y = ax + b`, mark x-intercept (solution)
   - Quadratic: `y = ax² + bx + c`, mark x-intercepts

---

## Phase 5: Analytics Backend (parallel with Phases 2–4)
Files: `php/db.php`, `php/api/submit_session.php`, MySQL schema

1. **MySQL schema** (4 tables):
   - `students(id, display_name, created_at)` — minimal, no auth for v1
   - `sessions(id, student_id, started_at, ended_at)`
   - `questions_attempted(id, session_id, equation_string, eq_type, solved, total_time_ms)`
   - `steps(id, question_id, step_index, step_string, valid, legal, annotation_correct, justification_correct, time_ms)`
2. **`php/db.php`** — PDO connection, parameterized queries only (SQL injection prevention)
3. **`php/api/submit_session.php`** — POST, accepts JSON body, validates, writes to DB
4. Teacher view (out of scope for v1 — just collect data)

---

## File Structure
```
questiongenprototype/
  home.php
  data/
    justifications.json
  php/
    utilities.php
    db.php
    api/
      submit_session.php
  css/
    site_wide_styles.css
    ui_elements.css
    math_display.css
    practice_session.css
  js/
    engine/
      ast.js
      tokenizer.js
      parser.js
      simplifier.js
      solver.js
      generator.js
      validator.js
    ui/
      math_renderer.js
      math_input.js
      keypad.js
      canvas_graph.js
    practice/
      session.js
      analytics.js
  pages/
    practice.php
```

---

## Verification Per Phase
- **Phase 1**: unit-test validator.js in browser console — feed known valid/invalid step pairs, confirm correct output
- **Phase 2**: render test equations (linear, quadratic with fractions) and confirm visual correctness; test keypad inserts at cursor
- **Phase 3**: full walkthrough — generate question, enter 3-step solution, receive feedback; test both validation modes
- **Phase 4**: plot y=2x+1 and y=x²-4 on canvas; confirm intercepts marked
- **Phase 5**: submit a session, check MySQL rows inserted with correct data

---

## Deferred (Out of Scope for Now)
- SPA injection fix in Thing_questionmark
- Teacher dashboard UI
- Audio/TTS support
- Systems of equations, inequalities
- Multi-variable expressions
