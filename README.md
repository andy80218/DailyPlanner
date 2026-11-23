# Daily Planner

A simple planner that runs in a web browser. You can use it on an iPad, a phone or a computer.

It has five parts:

1. **To-do list.** Add things to do. Check them off. Delete them.
2. **Three priorities.** The three most important things for each day.
3. **Habit tracker.** Add habits like "walk 20 minutes." Check them off each day. The app counts your **streak**. A streak is how many days in a row you did the habit.
4. **Thought to ponder.** One short quote or question each day. It stays the same all day and changes at midnight.
5. **Notes.** A big box for anything you want to remember.

Everything saves by itself. You never press "Save."

## How to open it

**Option 1: on the internet (best for the iPad).**
Open this address in Safari:

<https://andy80218.github.io/DailyPlanner/>

This address works only after you turn on GitHub Pages. GitHub Pages is a free GitHub tool that shows your files as a real website. [GUIDE.md](GUIDE.md) shows how, step by step.

**Option 2: on a computer, from the files.**
Download or clone this project. Then double-click the file `index.html`. It opens in your browser. Nothing else is needed.

### Put it on the iPad Home Screen

1. Open the address above in **Safari**.
2. Tap the **Share** button (a square with an arrow pointing up).
3. Tap **Add to Home Screen**, then **Add**.

Now it has an icon, like a normal app.

## Where your data is stored

Your data is stored **inside your browser, on your device**. The technical name is *localStorage*. That means a small private storage space the browser keeps for each website.

What this means for you:

- Your data is **not** on GitHub. Nobody else can see it.
- The iPad and your computer each have their **own separate** copy. They do not share.
- Safari on the iPad may delete a website's stored data if you do not visit it for about a week. This applies mostly to tabs, not to apps added to the Home Screen. Do not count on it staying.
- **Private Browsing** mode forgets everything when you close it. The app shows a yellow warning if it cannot save.
- If you clear Safari's website data, your planner is erased.

**So: use the Export button now and then.** It saves a backup file (a `.json` file). **Import** puts a backup back. Export before you clear anything, and before you move to a new device.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | The page itself |
| `styles.css` | How it looks (colors, sizes, dark mode) |
| `app.js` | How it works (the code) |
| `manifest.webmanifest`, `icons/` | What lets it be added to the Home Screen |
| `tests.html` | Open it to run automatic checks. Green is good. |
| `TESTING.md` | A checklist you can follow on your iPad |
| `GUIDE.md` | A beginner's guide to Claude Code, GitHub and publishing |

The app uses no outside services. It loads no fonts, no scripts and no ads. It never sends your data anywhere.
