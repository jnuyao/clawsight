# LinkedIn Data Export Guide

## Why Manual Export?

LinkedIn enforces aggressive anti-scraping measures — direct HTTP requests return status 999, and browser access without login is blocked by an authentication wall. LinkedIn's Terms of Service explicitly prohibit unauthorized automated data collection.

Clawsight chooses to respect platform rules and protect your account from risk.

## Why It's Worth It

LinkedIn is one of the most valuable data sources for Clawsight:
- **Recommendations** — Third-party endorsements reveal strengths you may not articulate yourself
- **Endorsements** — Peer-validated skills with source attribution
- **Network signals** — Professional connections provide context
- Cross-source insights become significantly richer (especially **Blind Spots** and **Hidden Strengths**)

## Export Steps (~3 minutes)

1. Open **LinkedIn** → Click your **avatar** → **Settings & Privacy**
   Direct link: https://www.linkedin.com/mypreferences/d/download-my-data

2. Select **"Download larger data archive"**
   Check: ✅ Profile  ✅ Recommendations  ✅ Skills
   (Other fields are optional)

3. Click **"Request archive"**

4. LinkedIn sends an email (usually ~10 min, occasionally up to 24 hours)

5. Download the ZIP file, then run:
   ```
   /clawsight linkedin-export.zip
   ```

## Optional Extras

- **Connections** — adds professional network context
- **Endorsements** — shows which skills are peer-validated and by whom

## While Waiting

Don't waste time — import other sources first:
```
/clawsight resume.pdf
/clawsight https://github.com/your-username
```

By the time LinkedIn export arrives, you'll already have cross-source reconciliation ready. Adding LinkedIn as a third source will immediately trigger deeper insights.
