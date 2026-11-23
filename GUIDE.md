# The Daily Planner Guide

This guide is written so a bright 10-year-old could follow it. Every hard word is explained the first time it shows up.

Each step says which device to use:

- **[iPad]** means do it on your iPad.
- **[Any device]** means an iPad, a phone or a computer all work.

---

## Part 1: The big ideas

### What is Claude Code?
**Claude Code** is an AI helper that writes and changes computer programs for you. You tell it what you want in plain words, like "make the Save button blue." It reads your files, makes the change, and explains what it did.

Think of it as a very fast helper who types for you. You are the boss. You decide what you want, and you check its work.

### What is a repository?
A **repository** (people say "repo") is a project folder that remembers its whole history.

> **Analogy:** It is like a school binder where every page you ever wrote is kept. You can flip back to see how it looked last week.

Yours is called **DailyPlanner**. It lives on a website called **GitHub**, which stores repositories on the internet so they are safe.

### What is a branch?
A **branch** is a separate copy of your project where you can try changes safely.

> **Analogy:** Imagine you have a finished drawing. You do not want to ruin it. So you put tracing paper on top and draw your new ideas there. If you like it, you copy it onto the real drawing. If you do not, you throw the tracing paper away.

The real drawing is the branch named **main**. Claude Code works on its own branch, so **main** stays safe until you say yes.

### What is a commit?
A **commit** is a saved snapshot with a short label.

> **Analogy:** It is like taking a photo of your Lego castle and writing "added the tower" on the back. Later you can look through the photos to see each step.

### What is a pull request?
A **pull request** (people say "PR") is a polite question: *"Here are my changes. Do you want to add them to main?"*

> **Analogy:** It is like handing your teacher your tracing paper and asking, "Can this go in the real project?" You look it over. If it looks good, you say yes. That yes is called **merging**.

To **merge** means to join the changes from a branch into **main**.

### What is GitHub Pages?
**GitHub Pages** is a free GitHub feature. It takes the files in your repository and shows them as a real website that you can open in Safari. Your planner needs it to have its own web address.

---

## Part 2: Review and merge the pull request

Claude Code has put the planner on a branch. Now you decide if it joins **main**.

### Step 1: Find the pull request  [Any device]
Claude Code only makes a pull request when you ask. So first, tell Claude Code:

> Please open a pull request for this work.

It will give you a link. Tap the link.

*Another way:* Go to `https://github.com/andy80218/DailyPlanner` in Safari. A yellow banner may say "Compare & pull request." Tap it, then tap **Create pull request**.

### Step 2: Review it in the GitHub app  [iPad]
1. Open the **GitHub** app. (Free in the App Store. Sign in.)
2. Tap your repository **DailyPlanner**.
3. Tap **Pull Requests**, then tap the one you want.
4. Tap the **Files** tab. You will see the files that were added. Green lines were added.
5. You do not need to understand all the code. Look for: do the file names make sense? (`index.html`, `app.js`, `styles.css`, and so on.)

### Step 2 (alternative): Review in Safari  [Any device]
1. Go to `https://github.com/andy80218/DailyPlanner/pulls`.
2. Tap the pull request.
3. Tap **Files changed** to look at what is new.

### Step 3: Merge it  [iPad, GitHub app]
1. Open the pull request.
2. Scroll down. Tap the green **Merge pull request** button (the app may call it "Merge").
3. Tap **Confirm merge**.

**You will know it worked when** the pull request turns purple and says **Merged**.

### Step 3 (alternative): Merge in Safari  [Any device]
1. On the pull request page, scroll down to the green **Merge pull request** button. Tap it.
2. Tap **Confirm merge**.

If a button looks different, do not worry. GitHub changes its buttons sometimes. Look for the green button with the word "Merge."

---

## Part 3: Turn on GitHub Pages  [Any device; Safari is the most reliable]

The GitHub app may not show this setting. Use **Safari**.

1. Go to `https://github.com/andy80218/DailyPlanner`.
2. Tap **Settings** (a tab near the top; scroll the tab bar sideways if you cannot see it). On the iPad, if the page looks squished, tap the **aA** button in Safari's address bar and choose **Request Desktop Website**.
3. In the left list, tap **Pages**.
4. Under **Build and deployment**, find **Source**. Choose **Deploy from a branch**.
5. Under **Branch**, choose **main**. In the box next to it, choose **/ (root)**.
6. Tap **Save**.
7. Wait one or two minutes. Reload the Pages settings page.

**You will know it worked when** a box at the top says **Your site is live at** and shows an address. It should be:

`https://andy80218.github.io/DailyPlanner/`

Open it. You should see the planner. If you see "404," wait another minute and try again. (404 is the web's way of saying "page not found.")

*Important:* the pull request must be **merged first** (Part 2). Pages shows the **main** branch.

### Put it on your Home Screen  [iPad]
1. Open the address in **Safari**.
2. Tap **Share** (the square with an up arrow).
3. Tap **Add to Home Screen**, then **Add**.

---

## Part 4: Make a change by asking Claude Code  [Any device]

1. Open Claude Code (on the web at `claude.ai/code`, or in the Claude app) and pick the **DailyPlanner** repository.
2. Write what you want in plain words. Good requests are small and clear:
   - "Add a 'Water' habit by default."
   - "Make the priority boxes bigger."
   - "Change the blue to green."
3. Claude Code makes the change on a branch and makes a commit.
4. Ask: **"Please open a pull request."**
5. Do Part 2 again to review and merge it.
6. Wait a minute or two. Reload the planner in Safari. Pull down to refresh. If you still see the old version, close the tab and open it again.

**Tips**
- One small change at a time is easier to check than ten.
- Ask Claude Code to "explain what you changed in simple words."
- Open `tests.html` after each change. Green means nothing broke. Ask Claude Code to add a test for new features.
- Before you try anything big, tap **Export backup** in the planner. Your planner data is not on GitHub, so a code change cannot erase it, but a backup is free insurance.

---

## Part 5: How to undo a mistake

Pick the case that matches.

### "I do not like what Claude Code just did, and I have not merged yet."  [Any device]
Nothing has touched **main**. Your real project is safe. Choose one:
- Tell Claude Code: "Undo your last change." or "Go back to how it was before."
- Or on the pull request page, tap **Close pull request**. This throws away the tracing paper. Nothing is lost from main.

### "I merged it and now something is broken."  [Any device, Safari]
Use **Revert**. To **revert** means to make a new change that cancels an old one. History is not erased; a new "undo" snapshot is added.
1. Open the merged pull request on GitHub.
2. Scroll to the bottom of the pull request. Tap **Revert**.
3. GitHub makes a new pull request that undoes it. Merge that one (Part 2, Step 3).

Or just tell Claude Code: "Please undo the changes from the last pull request, using a new pull request."

### "I typed the wrong thing in the planner."
Use the **×** or uncheck the box. If you imported the wrong backup, import your earlier backup file. This is why backups are useful.

### "The planner is empty!"
- Check that you are using the same address and the same browser or Home Screen icon as before. Each keeps its own data.
- Import your latest backup file.

### Remember
Nothing in Git is ever really gone. Every commit is a photo you can look back at. Ask Claude Code, "Show me the history," or "Go back to the version from yesterday."

---

## Word list

| Word | Plain meaning |
| --- | --- |
| Branch | A safe copy to try changes on |
| Commit | A saved snapshot with a label |
| GitHub | A website that stores projects |
| GitHub Pages | Turns your files into a real website |
| Merge | Join a branch's changes into main |
| Main | The real, finished version of the project |
| Pull request (PR) | A question: "May these changes join main?" |
| Repository (repo) | A project folder with its whole history |
| Revert | Make a new change that cancels an older one |
| localStorage | A small private space your browser keeps for a website. Your planner saves here. |
| JSON file | A plain text file with organized data. Your backup is one. |
| Streak | How many days in a row you did a habit |
