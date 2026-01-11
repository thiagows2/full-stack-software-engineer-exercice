# Improvements

## Suggested Improvements (from README)

These improvements were suggested in the project README as areas to address.

### 1. Remove N+1 Query Problem

**Commit:** [d77ac06](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/d77ac0633c551b2ba0d1890f2bf6cc41d6f14d7f)

**Issue:** Current implementation queries all tasks, then queries each task individually.

**Improvement:** Return tasks directly from initial query without redundant mapping.

---

### 2. Add Validation and Error Handling

**Commit:** [459eb5f](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/459eb5feb745561edccb2834eab91e1c6e7a5055)

**Issue:** No input validation on backend. No error handling on frontend fetch calls.

**Improvement:**

- Frontend: Added validation to prevent empty/null titles
- Backend: Added title validation (empty check, max length) and task existence check
- Frontend error handling: Added try-catch blocks with error state and user feedback

**Note:** In a production environment, I would suggest using Zod for schema validation on both frontend, and React Hook Form for form handling with built-in validation support.

---

### 3. Fix Database Insert Return Values

**Commit:** [6296e61](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/6296e617429b9d6ccab323b08818c46375140a8c)

**Issue:** createTask returns just the ID instead of the full Task object.

**Improvement:** Query the inserted record using the returned ID and return the complete object.

---

### 4. Proper async/await Handling

**Commit:** [467df7f](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/467df7fa2d8daa76972e3d7cbd8fcbdeab7eea7a)

**Issue:** Missing await causes Promise to be used instead of resolved value.

**Improvement:** Add await to all database queries before using their results.

---

### 5. Frontend Re-render Optimization

**Commit:** [5871c7b](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/5871c7b8c73b3f2aa54ba75297292d103abb1ab3)

**Issue:** Missing useEffect dependency array causes infinite re-renders.

**Improvement:** Add empty dependency array for mount-only data fetching.

---

### 6. Optimistic UI Updates or Proper Refetching

**Commit:** [ec94e1a](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/ec94e1aafb8ec3755758899bb318c4fc3247b1ce)

**Issue:** UI doesn't update after mutations complete.

**Improvement:** Implemented proper refetching approach - tasks are refetched after each mutation completes.

---

## Additional Improvements

These are improvements identified beyond the README suggestions.

### 7. Add TypeScript Types

**Commit:** [0c489e9](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/0c489e9c7fece63595dc5edc77742dedc58eaa97)

**Issue:** Uses any type for task mapping, defeating TypeScript benefits.

**Improvement:** Define explicit Task interface with id, title, and completed fields.

---

### 8. Add Loading States

**Commit:** [cccaadd](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/cccaadd48583c3afaaebd79c4575515e6e3c80df)

**Issue:** No visual feedback during data fetching or mutations.

**Improvement:** Added loading states (isLoading, isMutating) with visual feedback including loading indicators, disabled states, and cursor changes.

**Note:** In a production environment, I would suggest using React Query (TanStack Query) for data fetching, caching, and state management. It provides built-in loading states, automatic refetching, optimistic updates, and eliminates the need for manual loading state management.

---

### 9. Configure Database Connection Pool

**Commit:** [3903c6c](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/3903c6c096fc2d8b598e317b557d3891d497b7d6)

**Issue:** No pool configuration. No connection error handling.

**Improvement:** Added pool configuration (min: 2, max: 10) with timeout settings, event listeners for connection lifecycle, query error logging, and graceful shutdown handling.

---

### 10. Add Consistent Task Sorting

**Commit:** [4452743](https://github.com/thiagows2/full-stack-software-engineer-exercice/commit/4452743b744f4f0333a0f974bf53c2a4e13c6608)

**Issue:** Tasks appear in random order, especially after toggling status. No predictable sorting.

**Improvement:** Implemented consistent sorting - incomplete tasks first (similar to macOS), then by creation date (newest first) within each group (pending/completed).
