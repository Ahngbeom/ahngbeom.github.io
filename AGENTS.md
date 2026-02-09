# Repository Guidelines

## Project Structure & Module Organization
- Site content lives in `_pages/`; folder hierarchy defines sidebar categories. Every category folder must include an `index.md` with empty front matter (`---`).
- Theme/layout code lives in `_layouts/`, `_includes/`, `_sass/`, and `assets/` (`assets/css`, `assets/js`, `assets/img`, `assets/fonts`).
- Site configuration is in `_config.yml`; `docs/` contains reference docs and is excluded from build output.
- Automation scripts live in `scripts/` (for example, weekly retrospective generation).

## Build, Test, and Development Commands
- `bundle install`: install Ruby/Jekyll dependencies from `Gemfile`.
- `bundle exec jekyll serve`: run local site at `http://localhost:4000`.
- `bundle exec jekyll build`: production-style build to validate content and templates.
- `python scripts/generate_retrospective.py`: generate retrospective markdown (requires Jira env vars).
- `pip install -r scripts/requirements.txt`: install Python deps for automation scripts.

## Coding Style & Naming Conventions
- Use 2-space indentation in HTML, YAML, and Markdown front matter for consistency.
- Markdown posts should use clear, descriptive filenames; retrospective files follow date-based names (for example `2026-01-01-2026-01-31-monthly-retrospective.md`).
- Keep front matter explicit: required `title`, `date`; optional `tags`, `thumbnail`, `bookmark`, `order`.
- Prefer small, focused edits; reuse existing include/layout patterns before introducing new structures.

## Testing Guidelines
- There is no dedicated unit-test suite in this repository.
- Treat `bundle exec jekyll build` as the required validation step before opening a PR.
- For UI/content changes, also run `bundle exec jekyll serve` and verify affected pages, navigation, and assets load correctly.
- For script changes under `scripts/`, run the script locally with safe inputs and confirm generated files/format.

## Commit & Pull Request Guidelines
- Follow conventional-style prefixes used in history: `docs:`, `fix:`, `refactor:`, `chore:`.
- Keep commits scoped to one change set (content update, layout fix, script change).
- PRs should include: concise summary, impacted paths, local validation command(s) run, and screenshots for visible UI/layout changes.
- Link related issues/tasks when available and call out any required secrets or environment variables.

## Security & Configuration Tips
- Never commit credentials. Jira/API values must come from environment variables or GitHub Secrets.
- Review `_config.yml` changes carefully; incorrect `baseurl`, collection config, or defaults can break site routing.
