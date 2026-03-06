# 99Tech Code Challenge

This repository contains solutions for Problem 1, Problem 2, and Problem 3.

---

## Problem 1: Sum to N
**Path:** `problem1/SumToN.js`

### Overview
The task requires implementing 3 distinct functions that each compute the sum of all integers from 1 to `n`.
### How to Run
Open a terminal and execute the file using Node.js:
```sh
node problem1/SumToN.js
```
> **Note:** The file only declares the functions. To see results, open the file and add `console.log(sum_to_n_a(5))` at the bottom before running.

---

## Problem 2: Fancy Form
**Path:** `problem2/fancy-form/`

### Overview
A cryptocurrency token swap web application that converts between tokens based on live market rates fetched from an external API.

- Built with **React (Vite) + TypeScript**.
- Data fetching is encapsulated in **Custom Hooks** for clean separation of concerns.
- Features real-time input **validation** (e.g. rejects negative values or non-numeric input), an API **loading state**, and a **success popup modal** displayed after a swap completes.
- The project folder structure follows senior front-end conventions, clearly separated into: `api`, `components`, `hooks`, `pages`, and `router`.

### How to Run
Make sure `Node.js` and `npm` are installed on your machine.

1. Navigate into the project directory:
   cd problem2/fancy-form
2. Install dependencies:
   npm install
3. Start the development server:
   npm run dev
4. Open your browser and visit the URL shown in the terminal output (typically `http://localhost:5173`).

---

## Problem 3: Messy React
**Path:** `problem3/`

### Overview
The task involves reading, identifying, and explaining computational inefficiencies and anti-patterns inside a React functional component, then providing a clean refactored version.

- The original messy code is located at `problem3/WalletPage.md`.
- The refactored version is located at `problem3/WalletPageRefactored.md`.

### Identified Bugs & Inefficiencies

1. **Undefined variable reference in `filter` + inverted logic bug:** The filter callback references `lhsPriority`, a variable that was never declared (should be `balancePriority`). Additionally, the filter logic was inverted — it showed wallets with `amount <= 0` and hid the ones with actual funds.

2. **Stale/unnecessary `useMemo` dependency:** `prices` was included in the `useMemo` dependency array even though it is never used inside the memoized calculation. This causes unnecessary re-sorting and re-filtering every time any token price changes.

3. **Incomplete `sort` comparator:** The sort callback only handled `>` and `<` cases, implicitly returning `undefined` for equal priorities. This leads to unpredictable sort behavior across JavaScript engines. Fixed by using a simple numeric subtraction: `rightPriority - leftPriority`.

4. **Redundant intermediate array from `map`:** The component created a `formattedBalances` array via `.map()` but then iterated over the original `sortedBalances` again for rendering — meaning `balance.formatted` was always `undefined` at render time. Formatting was merged into the single render-phase `.map()` to avoid unnecessary array allocations.

5. **Array index used as React `key`:** Using `index` as a key for list items prevents React's reconciliation algorithm from accurately tracking element identity during re-renders, especially critical on sorted lists. Replaced with a stable, unique identifier combining `currency` and `blockchain`.

6. **Helper function defined inside the component body:** The `getPriority` switch-statement function was re-created on every render cycle. It was extracted outside the component and converted to an `O(1)` object lookup (`Record<string, number>`), reducing both runtime cost and code verbosity.

7. **Missing TypeScript type definitions:** The `WalletBalance` interface was missing the `blockchain` property that was actively used in the filter and sort logic. Added `blockchain: string` to the interface to fix the implicit `any` typing.

### How to Run
All code has been analyzed and refactored as complete, readable Markdown documents.

You can compare `problem3/WalletPage.md` (original) and `problem3/WalletPageRefactored.md` (refactored) side by side. All improvements are annotated with inline comments directly in the code for clarity.
