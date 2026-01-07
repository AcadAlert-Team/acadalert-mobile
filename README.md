# acadalert-mobile
mobile application(react native)

Branches
main → Stable / demo-ready code only.

No one should push directly to main.

dev → Active development + integration branch (default branch).

All work is merged into dev via Pull Requests (PRs).

Rules (Must Follow)
Do not push directly to main or dev.

Always create a feature branch from dev:

Branch format: feature/<task-name>

Open a Pull Request (PR) from your feature branch → into dev.

After approval, the PR will be merged into dev.

The Project Lead will periodically merge dev → main after testing.

How to start working (commands)
1.Clone the repo:
bash
git clone <REPO_URL>
cd acadalert-mobile

2.Make sure you are on dev:
bash
git checkout dev
git pull origin dev

3.Create your feature branch:
bash
git checkout -b feature/<your-task>

3.Commit and push:
bash
git add .
git commit -m "Your message"
git push -u origin feature/<your-task>

5.Go to GitHub → Pull Requests → open PR:
Base: dev
Compare: feature/<your-task>

Why we use dev
dev is the shared integration branch where all completed features come together.
main is kept stable so we always have a working version for demos and evaluation.

What happens if you accidentally worked on main?
Stop and tell the lead. Do not push. We will help you move your changes to a proper feature branch.
