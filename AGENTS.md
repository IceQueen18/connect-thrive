<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Assessment questions and all scoring live in `src/lib/assessment.ts` (pure, tested); UI renders from these definitions so questions change in one place.
- Request pages share `CompletionScore` and the pure readiness-weighted lifecycle estimate, so sample and live requests use the same scoring and presentation without persisting a second score.
- Proposals are inserted only by the `submitProposal` server function (no client INSERT grant) so the automatic fit score can't be forged.
- Roles live in `public.user_roles`; users may self-assign only `organization` or `business` once; `admin` is granted manually.
- A DB trigger on `projects` restricts each party to its own confirmation, clears confirmations on content edits, and marks the assessment completed when both confirm.
- Fictional showcase records live in a separate browser-safe fixture module and public sample route; never insert fake account-owned records into live tables, so examples cannot impersonate users or affect real work.
- Compliance content lives on a public standalone route linked from home; distinguish current behavior from proposed safeguards so policy text never implies unimplemented protections.
- Sample document attachments use a browser-safe manifest and static public files, displayed only in sample handoffs; downloads must not imply live upload support or contain real beneficiary data.
- Brand artwork is served from `src/assets/*.asset.json` (full logo with lettering for large light surfaces, skyline band for compact headers) while the tab icon is a real downscaled file in `public/`; the full logo is shown only on light surfaces because its lettering is dark, and the icon is cut from the same artwork above the lettering line.
