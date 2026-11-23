/* Daily Planner — plain JavaScript, no dependencies.
 *
 * Two parts live in this file:
 *   1. "Core": small pure functions (dates, streaks, storage, import checks).
 *      They are exposed as window.Planner so tests.html can check them.
 *   2. "UI": code that draws the page. It only starts when <body data-app="planner">.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'dailyPlanner.v1';
  var EXPORT_APP_ID = 'dailyPlanner';
  var SCHEMA_VERSION = 1;
  var MAX_TEXT = 500;
  var MAX_NOTES = 100000;
  var MAX_ITEMS = 2000;
  var PRIORITY_COUNT = 3;

  /* ------------------------------------------------------------------ */
  /* Dates. A "date key" is a text like "2026-11-23" in LOCAL time.      */
  /* ------------------------------------------------------------------ */

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function formatDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // Noon avoids trouble when clocks change for daylight saving time.
  function parseDate(key) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    if (!m) { return null; }
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
  }

  function isValidDateKey(key) {
    if (typeof key !== 'string') { return false; }
    var d = parseDate(key);
    return d !== null && formatDate(d) === key;
  }

  function todayKey(now) {
    return formatDate(now || new Date());
  }

  function addDays(key, n) {
    var d = parseDate(key);
    d.setDate(d.getDate() + n);
    return formatDate(d);
  }

  // Whole days since 1970-01-01, ignoring time zones. Used to pick a thought.
  function dayNumber(key) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    return Math.floor(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) / 86400000);
  }

  /* ------------------------------------------------------------------ */
  /* Thoughts to ponder                                                  */
  /* ------------------------------------------------------------------ */

  var THOUGHTS = [
    'What is one small thing you could do today that your future self would thank you for?',
    'What would you attempt if you knew you could not embarrass yourself?',
    'It is not that we have a short time to live, but that we waste a lot of it. — Seneca',
    'Which of today’s worries will still matter a year from now?',
    'The unexamined life is not worth living. — Socrates, as written by Plato',
    'What are you tolerating that you could change?',
    'A journey of a thousand miles begins with a single step. — Lao Tzu',
    'Who helped you become who you are, and have you thanked them?',
    'Nothing great was ever achieved without enthusiasm. — Ralph Waldo Emerson',
    'What is the kindest true thing you could say to yourself right now?',
    'It is not enough to be busy. The question is: what are we busy about? — Henry David Thoreau',
    'When did you last do something for the first time?',
    'Lost time is never found again. — Benjamin Franklin',
    'What does “enough” look like for you?',
    'Do the best you can until you know better. Then, when you know better, do better. — Maya Angelou',
    'If today were an ordinary day you would remember fondly, what would be in it?',
    'What is the smallest next step on the thing you keep avoiding?',
    'Attention is the most basic form of generosity. Where is yours going?',
    'Which habit, repeated for a year, would change your life the most?',
    'What did you learn from your last mistake that you would not trade away?',
    'Rest is part of the work, not a reward for finishing it.',
    'What would you do with an extra hour today?',
    'Progress is often quiet. What quiet progress have you made lately?',
    'The impediment to action advances action. What stands in the way becomes the way. — Marcus Aurelius',
    'Whose opinion are you carrying around that you never chose?',
    'What would it look like to make this easier on yourself?',
    'A good question is worth more than a quick answer. What are you really asking?',
    'What are you waiting for permission to do?',
    'You do not need to feel ready to begin.',
    'What can you let go of today?',
    'Where in your life are you rushing something that needs time?',
    'What is something you believed five years ago that you no longer believe?',
    'Consistency beats intensity. What can you do every day, even badly?',
    'Who could use a message from you today?',
    'What does your body need that your schedule has been ignoring?',
    'Is this urgent, or is it just loud?',
    'What would your calmest self do next?',
    'Which of your priorities would you be proud to defend?',
    'Small joys count. What is one you could notice today?',
    'Done is better than perfect, but started is better than both.',
    'What are you curious about right now?',
    'How would you spend today if you were not trying to impress anyone?',
    'What is one thing you could say no to so that a better yes has room?',
    'Courage is not the absence of fear. What would you do afraid?',
    'What is working well that you have stopped noticing?',
    'How do you want to be remembered by the people you see most?',
    'The way you spend your days is the way you spend your life. How is today going?',
    'What would a patient person do here?',
    'What is the difference between what you want and what you think you should want?',
    'Whose life could you make a little lighter this week?',
    'What is one boundary that would give you back your energy?',
    'Complaints are often wishes in disguise. What are you wishing for?',
    'What does a good day look like, specifically?',
    'You are allowed to change your mind. What have you changed it about lately?',
    'What would you tell a friend who was in your exact situation?',
    'Slow is smooth, and smooth is fast. Where could you slow down?',
    'What are you grateful for that you did not earn?',
    'Which conversation have you been postponing, and what is the first sentence?',
    'What is one thing you are doing only out of habit?',
    'Doubt is a good sign you are thinking. What are you doubting?',
    'What would make tonight’s version of you glad about this morning?',
    'You cannot do everything. What deserves your best hour?',
    'What beauty is within ten steps of where you are right now?',
    'Start where you are. Use what you have. What do you have?',
    'What would change if you assumed good intentions?',
    'What is the one thing that, if done, would make everything else easier or unnecessary?'
  ];

  // The same date always gives the same thought, all day long.
  function thoughtFor(key) {
    var n = dayNumber(key) % THOUGHTS.length;
    if (n < 0) { n += THOUGHTS.length; }
    return THOUGHTS[n];
  }

  /* ------------------------------------------------------------------ */
  /* State: the shape of the saved data                                  */
  /* ------------------------------------------------------------------ */

  function emptyState() {
    return { todos: [], priorities: {}, habits: [], habitLog: {}, notes: '' };
  }

  function newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function cleanText(s, max) {
    return String(s).replace(/\s+/g, ' ').trim().slice(0, max || MAX_TEXT);
  }

  /* To-dos */
  function addTodo(state, text) {
    var t = cleanText(text);
    if (!t || state.todos.length >= MAX_ITEMS) { return null; }
    var item = { id: newId(), text: t, done: false };
    state.todos.push(item);
    return item;
  }
  function toggleTodo(state, id) {
    for (var i = 0; i < state.todos.length; i++) {
      if (state.todos[i].id === id) { state.todos[i].done = !state.todos[i].done; return true; }
    }
    return false;
  }
  function deleteTodo(state, id) {
    var before = state.todos.length;
    state.todos = state.todos.filter(function (t) { return t.id !== id; });
    return state.todos.length !== before;
  }
  function clearDoneTodos(state) {
    var before = state.todos.length;
    state.todos = state.todos.filter(function (t) { return !t.done; });
    return before - state.todos.length;
  }

  /* Priorities (one set of three per date) */
  function getPriorities(state, key) {
    var saved = state.priorities[key] || [];
    var out = [];
    for (var i = 0; i < PRIORITY_COUNT; i++) {
      out.push({
        text: (saved[i] && saved[i].text) || '',
        done: !!(saved[i] && saved[i].done)
      });
    }
    return out;
  }
  function tidyPriorities(state, key) {
    var list = state.priorities[key];
    if (list && list.every(function (p) { return !p.text && !p.done; })) {
      delete state.priorities[key];
    }
  }
  function setPriorityText(state, key, index, text) {
    if (!isValidDateKey(key) || index < 0 || index >= PRIORITY_COUNT) { return false; }
    var list = getPriorities(state, key);
    list[index].text = cleanText(text);
    state.priorities[key] = list;
    tidyPriorities(state, key);
    return true;
  }
  function setPriorityDone(state, key, index, done) {
    if (!isValidDateKey(key) || index < 0 || index >= PRIORITY_COUNT) { return false; }
    var list = getPriorities(state, key);
    list[index].done = !!done;
    state.priorities[key] = list;
    tidyPriorities(state, key);
    return true;
  }

  /* Habits */
  function addHabit(state, name) {
    var n = cleanText(name, 80);
    if (!n || state.habits.length >= 100) { return null; }
    var habit = { id: newId(), name: n };
    state.habits.push(habit);
    return habit;
  }
  // A starter set: one habit for each of seven common longevity areas.
  var STARTER_HABITS = [
    'Move: exercise or walk 20+ minutes',
    'Nourish: whole-food meals today',
    'Sleep: 7+ hours, regular bedtime',
    'Calm: 5 minutes of breathing or stillness',
    'Connect: quality time with someone',
    'Purpose: 15 minutes on meaningful work',
    'Learn: read or study something new'
  ];
  // Adds the starter habits that are not already there. Returns how many were added.
  function addStarterHabits(state) {
    var have = {};
    state.habits.forEach(function (h) { have[h.name.toLowerCase()] = true; });
    var added = 0;
    STARTER_HABITS.forEach(function (name) {
      if (!have[name.toLowerCase()] && addHabit(state, name)) { added += 1; }
    });
    return added;
  }
  function removeHabit(state, id) {
    var before = state.habits.length;
    state.habits = state.habits.filter(function (h) { return h.id !== id; });
    Object.keys(state.habitLog).forEach(function (key) {
      state.habitLog[key] = state.habitLog[key].filter(function (hid) { return hid !== id; });
      if (!state.habitLog[key].length) { delete state.habitLog[key]; }
    });
    return state.habits.length !== before;
  }
  function isHabitDone(state, id, key) {
    var list = state.habitLog[key];
    return !!list && list.indexOf(id) !== -1;
  }
  function setHabitDone(state, id, key, done) {
    if (!isValidDateKey(key)) { return false; }
    var list = state.habitLog[key] || [];
    var at = list.indexOf(id);
    if (done && at === -1) { list.push(id); }
    if (!done && at !== -1) { list.splice(at, 1); }
    if (list.length) { state.habitLog[key] = list; } else { delete state.habitLog[key]; }
    return true;
  }

  // Current streak = how many days in a row, ending today, the habit was done.
  // If today is not done yet, the streak is still alive: we count back from yesterday.
  function currentStreak(state, id, today) {
    var key = isHabitDone(state, id, today) ? today : addDays(today, -1);
    var count = 0;
    while (isHabitDone(state, id, key)) {
      count += 1;
      key = addDays(key, -1);
    }
    return count;
  }

  /* ------------------------------------------------------------------ */
  /* Checking data that comes from outside (a file, or old storage)      */
  /* ------------------------------------------------------------------ */

  function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  // Returns { ok: true, state } or { ok: false, error }.
  // It never trusts the input: it builds a brand-new, clean state object.
  function validateState(data) {
    if (!isPlainObject(data)) { return { ok: false, error: 'The data is not an object.' }; }
    var out = emptyState();
    var i;

    if (data.todos !== undefined) {
      if (!Array.isArray(data.todos)) { return { ok: false, error: '"todos" must be a list.' }; }
      if (data.todos.length > MAX_ITEMS) { return { ok: false, error: 'Too many to-dos.' }; }
      for (i = 0; i < data.todos.length; i++) {
        var t = data.todos[i];
        if (!isPlainObject(t) || typeof t.text !== 'string' || typeof t.done !== 'boolean') {
          return { ok: false, error: 'To-do #' + (i + 1) + ' is not valid.' };
        }
        out.todos.push({
          id: typeof t.id === 'string' && t.id ? t.id.slice(0, 40) : newId(),
          text: cleanText(t.text),
          done: t.done
        });
      }
    }

    if (data.habits !== undefined) {
      if (!Array.isArray(data.habits)) { return { ok: false, error: '"habits" must be a list.' }; }
      if (data.habits.length > 100) { return { ok: false, error: 'Too many habits.' }; }
      var seen = {};
      for (i = 0; i < data.habits.length; i++) {
        var h = data.habits[i];
        if (!isPlainObject(h) || typeof h.id !== 'string' || !h.id || typeof h.name !== 'string') {
          return { ok: false, error: 'Habit #' + (i + 1) + ' is not valid.' };
        }
        if (seen[h.id]) { return { ok: false, error: 'Two habits share the same id.' }; }
        seen[h.id] = true;
        out.habits.push({ id: h.id.slice(0, 40), name: cleanText(h.name, 80) });
      }
    }

    if (data.priorities !== undefined) {
      if (!isPlainObject(data.priorities)) { return { ok: false, error: '"priorities" must be an object.' }; }
      Object.keys(data.priorities).forEach(function (key) {
        if (!isValidDateKey(key)) { return; } // silently skip keys that are not real dates
        var list = data.priorities[key];
        if (!Array.isArray(list)) { return; }
        var clean = [];
        for (var j = 0; j < PRIORITY_COUNT; j++) {
          var p = list[j];
          clean.push({
            text: isPlainObject(p) && typeof p.text === 'string' ? cleanText(p.text) : '',
            done: isPlainObject(p) && p.done === true
          });
        }
        out.priorities[key] = clean;
        tidyPriorities(out, key);
      });
    }

    if (data.habitLog !== undefined) {
      if (!isPlainObject(data.habitLog)) { return { ok: false, error: '"habitLog" must be an object.' }; }
      var known = {};
      out.habits.forEach(function (hh) { known[hh.id] = true; });
      Object.keys(data.habitLog).forEach(function (key) {
        if (!isValidDateKey(key) || !Array.isArray(data.habitLog[key])) { return; }
        var ids = [];
        data.habitLog[key].forEach(function (id) {
          if (typeof id === 'string' && known[id] && ids.indexOf(id) === -1) { ids.push(id); }
        });
        if (ids.length) { out.habitLog[key] = ids; }
      });
    }

    if (data.notes !== undefined) {
      if (typeof data.notes !== 'string') { return { ok: false, error: '"notes" must be text.' }; }
      out.notes = data.notes.slice(0, MAX_NOTES);
    }

    return { ok: true, state: out };
  }

  // Wrap the state so a file says what it is and which version wrote it.
  function buildExport(state, now) {
    return {
      app: EXPORT_APP_ID,
      version: SCHEMA_VERSION,
      exportedAt: (now || new Date()).toISOString(),
      data: state
    };
  }

  // Takes the text of a file. Returns { ok, state } or { ok: false, error }.
  function validateImport(text) {
    var parsed;
    try { parsed = JSON.parse(text); } catch (e) {
      return { ok: false, error: 'That file is not valid JSON.' };
    }
    if (!isPlainObject(parsed) || parsed.app !== EXPORT_APP_ID) {
      return { ok: false, error: 'That file is not a Daily Planner backup.' };
    }
    if (typeof parsed.version !== 'number' || parsed.version !== Math.floor(parsed.version) || parsed.version < 1) {
      return { ok: false, error: 'The backup has no valid version number.' };
    }
    if (parsed.version > SCHEMA_VERSION) {
      return { ok: false, error: 'This backup was made by a newer version of the planner.' };
    }
    return validateState(parsed.data);
  }

  /* ------------------------------------------------------------------ */
  /* Storage: one namespaced key, with safe handling when it is blocked  */
  /* ------------------------------------------------------------------ */

  // `storage` is window.localStorage (or a fake one in tests). May be null/throw.
  function createStore(storage, key) {
    key = key || STORAGE_KEY;
    var memory = null; // used if real storage cannot be used
    var available = false;
    try {
      if (storage) {
        var probe = key + '.probe';
        storage.setItem(probe, '1');
        storage.removeItem(probe);
        available = true;
      }
    } catch (e) { available = false; }

    var store = {
      key: key,
      available: available,
      loadProblem: null, // set when saved data could not be read
      saveProblem: false, // set when a save failed

      load: function () {
        var raw = null;
        if (!available) { return memory ? JSON.parse(memory) : emptyState(); }
        try { raw = storage.getItem(key); } catch (e) { return emptyState(); }
        if (raw === null) { return emptyState(); }
        var result;
        try { result = validateState(JSON.parse(raw)); } catch (e2) {
          result = { ok: false };
        }
        if (!result.ok) {
          // Keep the unreadable text under another key so nothing is lost.
          store.loadProblem = 'Saved data could not be read. A copy was kept under "' + key + '.unreadable".';
          try { storage.setItem(key + '.unreadable', raw); } catch (e3) { /* ignore */ }
          return emptyState();
        }
        return result.state;
      },

      save: function (state) {
        var text = JSON.stringify(state);
        if (!available) { memory = text; store.saveProblem = true; return false; }
        try {
          storage.setItem(key, text);
          store.saveProblem = false;
          return true;
        } catch (e) {
          memory = text;
          store.saveProblem = true;
          return false;
        }
      }
    };
    return store;
  }

  /* ------------------------------------------------------------------ */
  /* Public handle for tests                                             */
  /* ------------------------------------------------------------------ */

  var Planner = {
    STORAGE_KEY: STORAGE_KEY,
    SCHEMA_VERSION: SCHEMA_VERSION,
    THOUGHTS: THOUGHTS,
    formatDate: formatDate, parseDate: parseDate, isValidDateKey: isValidDateKey,
    todayKey: todayKey, addDays: addDays, dayNumber: dayNumber,
    thoughtFor: thoughtFor,
    emptyState: emptyState,
    addTodo: addTodo, toggleTodo: toggleTodo, deleteTodo: deleteTodo, clearDoneTodos: clearDoneTodos,
    getPriorities: getPriorities, setPriorityText: setPriorityText, setPriorityDone: setPriorityDone,
    STARTER_HABITS: STARTER_HABITS, addStarterHabits: addStarterHabits,
    addHabit: addHabit, removeHabit: removeHabit, isHabitDone: isHabitDone,
    setHabitDone: setHabitDone, currentStreak: currentStreak,
    validateState: validateState, validateImport: validateImport, buildExport: buildExport,
    createStore: createStore
  };
  global.Planner = Planner;

  /* ================================================================== */
  /* UI                                                                  */
  /* ================================================================== */

  function startUI() {
    var doc = global.document;
    var $ = function (id) { return doc.getElementById(id); };

    var realStorage = null;
    try { realStorage = global.localStorage; } catch (e) { realStorage = null; }
    var store = createStore(realStorage, STORAGE_KEY);
    var state = store.load();

    var today = todayKey();
    var viewing = today;
    var saveTimer = null;
    var statusTimer = null;

    /* ---- helpers ---- */
    function el(tag, props, children) {
      var node = doc.createElement(tag);
      Object.keys(props || {}).forEach(function (k) {
        if (k === 'class') { node.className = props[k]; }
        else if (k === 'text') { node.textContent = props[k]; }
        else { node.setAttribute(k, props[k]); }
      });
      (children || []).forEach(function (c) { node.appendChild(c); });
      return node;
    }

    function say(message, isError) {
      var box = $('status');
      box.textContent = message;
      box.className = 'status' + (isError ? ' status-error' : '');
      global.clearTimeout(statusTimer);
      statusTimer = global.setTimeout(function () { box.textContent = ''; box.className = 'status'; }, 6000);
    }

    function updateWarning() {
      var parts = [];
      if (!store.available) {
        parts.push('Your browser is not letting this page save. Anything you type will be lost when you close or reload it. Use Export often to keep a copy. (Private Browsing and some privacy settings cause this.)');
      } else if (store.saveProblem) {
        parts.push('The last save did not work. Your device storage may be full. Use Export to keep a copy.');
      }
      if (store.loadProblem) { parts.push(store.loadProblem); }
      var box = $('warning');
      box.textContent = parts.join(' ');
      box.hidden = parts.length === 0;
    }

    function saveNow() {
      global.clearTimeout(saveTimer);
      saveTimer = null;
      store.save(state);
      updateWarning();
    }
    function saveSoon() {
      global.clearTimeout(saveTimer);
      saveTimer = global.setTimeout(saveNow, 300);
    }
    function flush() { if (saveTimer !== null) { saveNow(); } }

    /* ---- date bar and thought ---- */
    function renderDate() {
      var d = parseDate(viewing);
      $('date-title').textContent = d.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      var tag = $('date-tag');
      if (viewing === today) { tag.textContent = 'Today'; }
      else if (viewing < today) { tag.textContent = 'Past day'; }
      else { tag.textContent = 'Future day'; }
      $('date-picker').value = viewing;
      $('btn-today').disabled = viewing === today;
      $('thought-text').textContent = thoughtFor(viewing);
    }

    /* ---- priorities ---- */
    var priorityInputs = [];
    var priorityChecks = [];
    function buildPriorities() {
      var list = $('priority-list');
      for (var i = 0; i < PRIORITY_COUNT; i++) {
        (function (index) {
          var check = el('input', { type: 'checkbox', id: 'prio-done-' + index, 'aria-label': 'Priority ' + (index + 1) + ' done' });
          var input = el('input', { type: 'text', id: 'prio-text-' + index, maxlength: String(MAX_TEXT),
            placeholder: 'Priority ' + (index + 1), autocomplete: 'off', 'aria-label': 'Priority ' + (index + 1) });
          check.addEventListener('change', function () {
            setPriorityDone(state, viewing, index, check.checked);
            input.classList.toggle('is-done', check.checked);
            saveSoon();
          });
          input.addEventListener('input', function () {
            // Save the raw text while typing; spaces are tidied when the box is left.
            var list3 = getPriorities(state, viewing);
            list3[index].text = input.value.slice(0, MAX_TEXT);
            state.priorities[viewing] = list3;
            saveSoon();
          });
          input.addEventListener('blur', function () {
            setPriorityText(state, viewing, index, input.value);
            input.value = getPriorities(state, viewing)[index].text;
            saveSoon();
          });
          priorityChecks.push(check);
          priorityInputs.push(input);
          list.appendChild(el('li', { class: 'row' }, [
            el('span', { class: 'num', 'aria-hidden': 'true', text: String(index + 1) }),
            el('label', { class: 'check', for: 'prio-done-' + index }, [check, el('span', { class: 'box', 'aria-hidden': 'true' })]),
            input
          ]));
        })(i);
      }
    }
    function renderPriorities() {
      var data = getPriorities(state, viewing);
      for (var i = 0; i < PRIORITY_COUNT; i++) {
        priorityInputs[i].value = data[i].text;
        priorityChecks[i].checked = data[i].done;
        priorityInputs[i].classList.toggle('is-done', data[i].done);
      }
    }

    /* ---- to-dos ---- */
    function renderTodos() {
      var list = $('todo-list');
      list.textContent = '';
      state.todos.forEach(function (todo) {
        var check = el('input', { type: 'checkbox', id: 'todo-' + todo.id });
        check.checked = todo.done;
        check.addEventListener('change', function () {
          toggleTodo(state, todo.id); saveNow(); renderTodos();
        });
        var del = el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Delete to-do: ' + todo.text, text: '×' });
        del.addEventListener('click', function () {
          deleteTodo(state, todo.id); saveNow(); renderTodos();
          $('todo-input').focus();
        });
        list.appendChild(el('li', { class: 'row' }, [
          el('label', { class: 'check grow', for: 'todo-' + todo.id }, [
            check, el('span', { class: 'box', 'aria-hidden': 'true' }),
            el('span', { class: 'label-text' + (todo.done ? ' is-done' : ''), text: todo.text })
          ]),
          del
        ]));
      });
      var doneCount = state.todos.filter(function (t) { return t.done; }).length;
      $('todo-empty').hidden = state.todos.length > 0;
      $('todo-count').textContent = state.todos.length
        ? doneCount + ' of ' + state.todos.length + ' done' : '';
      $('btn-clear-done').hidden = doneCount === 0;
    }

    /* ---- habits ---- */
    function renderHabits() {
      var list = $('habit-list');
      list.textContent = '';
      state.habits.forEach(function (habit) {
        var check = el('input', { type: 'checkbox', id: 'habit-' + habit.id });
        check.checked = isHabitDone(state, habit.id, viewing);
        check.addEventListener('change', function () {
          setHabitDone(state, habit.id, viewing, check.checked); saveNow(); renderHabits();
        });
        var streak = currentStreak(state, habit.id, today);
        var badge = el('span', {
          class: 'streak' + (streak > 0 ? ' streak-on' : ''),
          text: streak + (streak === 1 ? ' day' : ' days'),
          title: 'Current streak: days in a row up to today'
        });
        var del = el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Remove habit: ' + habit.name, text: '×' });
        del.addEventListener('click', function () {
          if (global.confirm('Remove the habit "' + habit.name + '" and its check marks?')) {
            removeHabit(state, habit.id); saveNow(); renderHabits();
          }
        });
        list.appendChild(el('li', { class: 'row' }, [
          el('label', { class: 'check grow', for: 'habit-' + habit.id }, [
            check, el('span', { class: 'box', 'aria-hidden': 'true' }),
            el('span', { class: 'label-text', text: habit.name })
          ]),
          el('span', { class: 'streak-wrap' }, [
            badge, el('span', { class: 'sr-only', text: ' current streak' })
          ]),
          del
        ]));
      });
      $('habit-empty').hidden = state.habits.length > 0;
    }

    /* ---- whole page ---- */
    function renderDaily() {
      renderDate(); renderPriorities(); renderHabits();
    }
    function renderAll() {
      renderDaily(); renderTodos();
      $('notes').value = state.notes;
    }

    function goTo(key) {
      if (!isValidDateKey(key)) { return; }
      flush();
      viewing = key;
      renderDaily();
    }

    /* ---- events ---- */
    $('btn-prev').addEventListener('click', function () { goTo(addDays(viewing, -1)); });
    $('btn-next').addEventListener('click', function () { goTo(addDays(viewing, 1)); });
    $('btn-today').addEventListener('click', function () { goTo(today); });
    $('date-picker').addEventListener('change', function (e) {
      if (isValidDateKey(e.target.value)) { goTo(e.target.value); } else { e.target.value = viewing; }
    });

    $('todo-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('todo-input');
      if (addTodo(state, input.value)) { input.value = ''; saveNow(); renderTodos(); }
      input.focus();
    });
    $('btn-clear-done').addEventListener('click', function () {
      clearDoneTodos(state); saveNow(); renderTodos();
    });

    $('habit-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('habit-input');
      if (addHabit(state, input.value)) { input.value = ''; saveNow(); renderHabits(); }
      input.focus();
    });

    $('btn-starter').addEventListener('click', function () {
      var n = addStarterHabits(state);
      saveNow(); renderHabits();
      say(n + ' starter habits added. Rename or remove any you do not want.');
    });

    $('notes').addEventListener('input', function (e) {
      state.notes = e.target.value.slice(0, MAX_NOTES);
      saveSoon();
    });

    $('btn-export').addEventListener('click', function () {
      flush();
      var json = JSON.stringify(buildExport(state), null, 2);
      var blob = new global.Blob([json], { type: 'application/json' });
      var url = global.URL.createObjectURL(blob);
      var link = el('a', { href: url, download: 'daily-planner-backup-' + todayKey() + '.json' });
      doc.body.appendChild(link);
      link.click();
      doc.body.removeChild(link);
      global.setTimeout(function () { global.URL.revokeObjectURL(url); }, 2000);
      say('Backup file created. Look in your Downloads (or Files app).');
    });

    $('btn-import').addEventListener('click', function () { $('import-file').click(); });
    $('import-file').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) { return; }
      var reader = new global.FileReader();
      reader.onerror = function () { say('Could not read that file.', true); };
      reader.onload = function () {
        var result = validateImport(String(reader.result));
        if (!result.ok) { say('Import stopped: ' + result.error + ' Nothing was changed.', true); return; }
        if (!global.confirm('Replace everything in the planner with this backup? This cannot be undone. (Tip: Export first if unsure.)')) {
          say('Import cancelled. Nothing was changed.');
          return;
        }
        state = result.state;
        saveNow();
        renderAll();
        say('Backup imported.');
      };
      reader.readAsText(file);
    });

    /* ---- midnight rollover: check often, and when the page wakes up ---- */
    function checkRollover() {
      var now = todayKey();
      if (now === today) { return; }
      var wasOnToday = viewing === today;
      today = now;
      if (wasOnToday) { viewing = today; }
      renderDaily();
    }
    global.setInterval(checkRollover, 30000);
    doc.addEventListener('visibilitychange', function () {
      if (doc.visibilityState === 'hidden') { flush(); } else { checkRollover(); }
    });
    global.addEventListener('pagehide', flush);
    global.addEventListener('focus', checkRollover);

    /* ---- start ---- */
    buildPriorities();
    renderAll();
    updateWarning();
  }

  var body = global.document && global.document.body;
  if (body && body.getAttribute('data-app') === 'planner') {
    startUI();
  }
})(typeof window !== 'undefined' ? window : this);
