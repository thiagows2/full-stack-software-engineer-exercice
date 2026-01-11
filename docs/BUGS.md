# Bugs

## 1. Missing await in toggleTask resolver

**Commit:** [467df7f](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/467df7fa2d8daa76972e3d7cbd8fcbdeab7eea7a)

**Issue:** Database query not awaited. The task variable holds a Promise instead of the actual record, causing toggle logic to fail.

**Impact:** Tasks cannot be marked as incomplete once completed.

**Fix:** Add await keyword before the database query.

---

## 2. Resolver returns Promises instead of resolved data

**Commit:** [d77ac06](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/d77ac0633c551b2ba0d1890f2bf6cc41d6f14d7f)

**Issue:** The tasks resolver maps over results with async callbacks but doesn't await them. Returns array of Promises to GraphQL.

**Impact:** Frontend receives unusable data. Also introduces N+1 query problem.

**Fix:** Return tasks directly without redundant mapping, or use Promise.all().

---

## 3. createTask returns ID instead of Task object

**Commit:** [6296e61](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/6296e617429b9d6ccab323b08818c46375140a8c)

**Issue:** Knex insert() returns array of IDs for PostgreSQL. Code returns just the ID, not the full Task object expected by GraphQL schema.

**Impact:** Frontend doesn't receive proper task data after creation.

**Fix:** Query the inserted record using the returned ID before returning.

---

## 4. Infinite loop in useEffect

**Commit:** [5871c7b](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/5871c7b8c73b3f2aa54ba75297292d103abb1ab3)

**Issue:** useEffect has no dependency array. Runs after every render, which triggers setTasks, which causes re-render.

**Impact:** Infinite API calls. Browser freezes. Tasks appear to reorder randomly.

**Fix:** Add empty dependency array for mount-only execution.

---

## 5. UI not updated after mutations

**Commit:** [ec94e1a](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/ec94e1aafb8ec3755758899bb318c4fc3247b1ce)

**Issue:** addTask and toggleTask don't refetch data or update local state after successful mutation.

**Impact:** Changes only visible after page refresh.

**Fix:** Refetch tasks list after mutation completes or implement optimistic updates.

---

## 6. Task created with null title on cancel

**Commit:** [0642e13](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/0642e1349043b5bfa90b70200ae57ae88d9296ca)

**Issue:** No validation of prompt result. When user cancels, null is sent to the mutation.

**Impact:** Creates database records with null or empty titles.

**Fix:** Validate title before sending mutation. Return early if empty or cancelled.

---

## 7. GraphQL injection vulnerability

**Commit:** [4a438d6](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/4a438d6946f86bd9076a8eb92d791aecd701724b)

**Issue:** User input interpolated directly into GraphQL query strings without sanitization.

**Impact:** Special characters can break queries. Potential security risk.

**Fix:** Use GraphQL variables instead of string interpolation.
