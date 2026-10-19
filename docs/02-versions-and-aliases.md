# Step 2: Versions, an alias and a canary release

**Goal:** release a new version of the function to a small share of users first, and roll back in seconds if something goes wrong.

## What I built

1. **The function now reports which version served the request** using `context.functionVersion`.
2. **Version 1** (5 cards). Published versions are immutable: the console locks the code editor on a published version.
3. **An alias `prod`** pointing to version 1. Callers use `getRandomCard:prod` and never a version number.
4. **Version 2** (6 cards). Publishing it changed nothing for `prod` callers until I moved the alias.
5. **A weighted alias:** `prod` sends 90% of traffic to version 1 and 10% to version 2.
6. **A rollback:** removed version 2 from the alias.

## Proof from CloudShell

20 invocations of `getRandomCard:prod`:

| Alias setup | Version 1 | Version 2 |
|---|---|---|
| 90% / 10% | 17 | 3 |
| After rollback | 20 | 0 |

```bash
for i in $(seq 1 20); do
  aws lambda invoke --function-name getRandomCard:prod out.json > /dev/null
  jq -r '.body | fromjson | .version' out.json
done | sort | uniq -c
```

## What I learned

- **`$LATEST` is editable and changes on every deploy. A numbered version is a frozen snapshot.**
- **Deploying or publishing doesn't affect users. Moving the alias does.**
- **A weighted alias splits traffic between two versions of the same function**, which is a canary release: if the new version is broken, only a small share of users see it.
- **Rollback is just pointing the alias back**, with no code change or redeploy.
- The first test after a deploy showed an `Init Duration` (cold start). The next test didn't, because Lambda reused the execution environment.