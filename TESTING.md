# Testing the Daily Planner on your iPad

This is a checklist. Do each step. Look at what you see. Compare it to **Pass**.

**Before you start:** Open the planner in **Chrome** (or Safari) on your iPad. Use the same browser for every step.
Use the GitHub Pages address: `https://andy80218.github.io/DailyPlanner/`
(If you have not turned Pages on yet, see [GUIDE.md](GUIDE.md).)

Use made-up test words like "Test task." Do not type real private things while testing.

---

## Part A: The automatic checks

1. In your browser, go to the same address, but add `tests.html` at the end:
   `https://andy80218.github.io/DailyPlanner/tests.html`
2. Wait one second.

**Pass:** A **green** box at the top says "All 54 checks passed" and every line below is green and says PASS.
**Fail:** A **red** box appears. Tap-and-hold, take a screenshot, and show it to Claude Code.

(The number 52 may change later if more checks are added. What matters is that nothing is red.)

---

## Part B: The planner itself

### 1. Add a to-do and keep it after reloading
1. In **To-do list**, tap the box, type `Test task`, tap **Add**.
2. Tap the empty square next to it.
3. Pull down on the page to reload it (or tap the reload arrow).

**Pass:** `Test task` is still there, and it is still checked (a check mark and a line through it).

### 2. Delete a to-do
1. Tap the **×** at the right of `Test task`.

**Pass:** It disappears. It stays gone after a reload.

### 3. Three priorities
1. Type `Test priority` in box 1. Tap the square next to box 2 to check it.
2. Reload.

**Pass:** The text and the check mark are still there.

### 4. Habits and streaks
1. In **Habits**, type `Test habit` and tap **Add**.
2. Tap the square next to it to check it for today. The badge on the right should say **1 day**.
3. Tap the **left arrow** at the top to go to yesterday. Check the habit there too.
4. Tap **Today**.

**Pass:** The badge now says **2 days**. (Two days in a row, ending today.)
Then tap the **×** next to the habit. A question appears. Tap OK. **Pass:** the habit is gone.

### 4b. Starter habits
1. With no habits in the list, tap **Add 7 starter habits**.

**Pass:** Seven habits appear (Move, Nourish, Sleep, Calm, Connect, Purpose, Learn). Tapping the button again later does not make duplicates. You can remove any of them with the **×**.

### 5. Change the date
1. Tap the right arrow to go to tomorrow.
2. Tap the date box and pick a day next week.
3. Tap **Today**.

**Pass:** On other days your three priorities are empty and habits are unchecked. Your to-dos and notes are the same on every day. The tag under the date says "Past day," "Future day" or "Today." **Today** brings you back to the real date.

### 6. Thought to ponder
1. Look at the thought. Reload the page.
2. Tap the right arrow, then the left arrow.

**Pass:** The thought is the same after a reload. It is different tomorrow. It is the same again when you come back to today.

### 7. Notes
1. Type a few lines in **Notes**. Wait two seconds. Reload.

**Pass:** The notes are still there.

### 8. Export
1. Scroll to **Back up your data**. Tap **Export backup**.
2. The browser may ask whether to download. Tap **Download**.
3. Open the **Files** app, then **Downloads** (or use the browser's download list).

**Pass:** A file named like `daily-planner-backup-2026-11-23.json` is there.

### 9. Import
1. Add a to-do called `Extra task`.
2. Tap **Import backup**. Choose the backup file you just made.
3. A question appears. Tap **OK**.

**Pass:** A green message says "Backup imported." `Extra task` is gone. Your earlier test items are back.

### 10. Import the wrong thing (safety check)
1. Tap **Import backup**. Choose any other file, such as a photo or a text file.

**Pass:** A **red** message says the import stopped and nothing was changed. Your planner looks the same as before.

### 11. Dark mode
1. Open **Settings > Display & Brightness** on the iPad. Choose **Dark**. (Or use Control Center.)
2. Go back to the planner.
3. Set it back to **Light** when you are done.

**Pass:** The page turns dark, with light writing. All words are easy to read. Light mode is easy to read too.

### 12. Touch and turning the iPad
1. Tap every button with a finger.
2. Turn the iPad sideways, then upright.

**Pass:** Buttons are easy to hit. Nothing is cut off. You never have to slide the page left or right.

### 13. Add to Home Screen
1. Tap **Share > Add to Home Screen > Add**. (In Chrome, Share is in the address bar.)
2. Open the new icon.

**Pass:** The planner opens full screen with no browser bars, and your data is there.
(Note: data in the Home Screen icon can be separate from data in Safari. That is normal on iPad. If it looks empty, use Export in the browser and Import in the icon.)

### 14. Warning when saving is blocked
1. Open a **Private** tab (in Chrome: **⋯ > New Incognito Tab**) and go to the planner address.
2. Add a to-do.

**Pass:** Either it works with no warning, or a **yellow warning bar** at the top says saving may not work. If the warning shows, the app is doing its job. Do not keep important things there.

---

## Optional: the midnight check
Leave the planner open past midnight, then bring it back on screen.
**Pass:** Within about 30 seconds it shows the new date, and the three priorities and habit boxes are empty for the new day.
