import type { GeneratedQuestion } from "../../schemas/question";
import type { Difficulty } from "../../types";
import type { QuestionContext } from "./types";

/**
 * Heuristic coding problem generator (Phase 13).
 *
 * Local, deterministic fallback for the coding interview mode (§74) — emits a
 * problem JSON ({statement, examples, constraints}) per difficulty from a
 * fixed bank, rotating by turn so a long coding session never repeats.
 */

interface CodingProblem {
  topic: string;
  statement: string;
  examples: string[];
  constraints: string[];
}

const PROBLEMS: Record<Difficulty, CodingProblem[]> = {
  beginner: [
    {
      topic: "two-sum",
      statement: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
      examples: [
        "Input: nums = [2, 7, 11, 15], target = 9 → Output: [0, 1]",
        "Input: nums = [3, 2, 4], target = 6 → Output: [1, 2]",
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "Exactly one solution exists; you may not use the same element twice.",
      ],
    },
    {
      topic: "palindrome",
      statement: "Given a string s, return true if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
      examples: [
        "Input: \"A man, a plan, a canal: Panama\" → true",
        "Input: \"race a car\" → false",
      ],
      constraints: [
        "1 <= s.length <= 2 * 10^5",
        "s consists only of printable ASCII characters.",
      ],
    },
    {
      topic: "fizzbuzz",
      statement: "Write a function that returns an array of strings where numbers divisible by 3 map to \"Fizz\", by 5 to \"Buzz\", and by both to \"FizzBuzz\"; otherwise the number itself as a string.",
      examples: [
        "Input: n = 3 → [\"1\", \"2\", \"Fizz\"]",
        "Input: n = 5 → [\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]",
      ],
      constraints: ["1 <= n <= 10^4"],
    },
  ],
  intermediate: [
    {
      topic: "valid-parentheses",
      statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid — brackets must close in the correct order.",
      examples: [
        "Input: \"()[]{}\" → true",
        "Input: \"([)]\" → false",
      ],
      constraints: ["1 <= s.length <= 10^4", "s consists of brackets only."],
    },
    {
      topic: "max-subarray",
      statement: "Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.",
      examples: [
        "Input: nums = [-2,1,-3,4,-1,2,1,-5,4] → Output: 6",
        "Input: nums = [1] → Output: 1",
      ],
      constraints: [
        "1 <= nums.length <= 10^5",
        "-10^4 <= nums[i] <= 10^4",
        "Follow up: solve it in O(n) time (Kadane's algorithm).",
      ],
    },
    {
      topic: "merge-intervals",
      statement: "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return the merged intervals sorted by start.",
      examples: [
        "Input: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]",
        "Input: [[1,4],[4,5]] → [[1,5]]",
      ],
      constraints: ["1 <= intervals.length <= 10^4", "0 <= start <= end <= 10^4"],
    },
  ],
  advanced: [
    {
      topic: "lru-cache",
      statement: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache: get(key) and put(key, value) both in O(1) average time.",
      examples: [
        "LRUCache(2); put(1,1); put(2,2); get(1) → 1; put(3,3) evicts key 2; get(2) → -1",
      ],
      constraints: ["1 <= capacity <= 3000", "Keys and values are non-negative integers."],
    },
    {
      topic: "top-k-frequent",
      statement: "Given an integer array nums and an integer k, return the k most frequent elements (any order).",
      examples: [
        "Input: nums = [1,1,1,2,2,3], k = 2 → [1,2]",
        "Input: nums = [1], k = 1 → [1]",
      ],
      constraints: ["1 <= nums.length <= 10^5", "k is in the range [1, number of unique elements]."],
    },
    {
      topic: "word-ladder",
      statement: "Given two words beginWord and endWord and a word list, return the length of the shortest transformation sequence from beginWord to endWord such that only one letter changes at a time and each transformed word is in the list.",
      examples: [
        "Input: beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"] → 5",
        "Input: same wordList without \"cog\" → 0",
      ],
      constraints: ["1 <= beginWord.length <= 10", "All words have the same length and contain only lowercase letters."],
    },
  ],
  expert: [
    {
      topic: "trapping-rain-water",
      statement: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      examples: [
        "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6",
      ],
      constraints: ["1 <= height.length <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    },
    {
      topic: "median-two-sorted",
      statement: "Given two sorted arrays nums1 and nums2 of size m and n, return the median of the two sorted arrays. Aim for O(log(m + n)) time.",
      examples: [
        "Input: nums1 = [1,3], nums2 = [2] → 2.0",
        "Input: nums1 = [1,2], nums2 = [3,4] → 2.5",
      ],
      constraints: ["0 <= m, n <= 1000", "nums1 and nums2 are sorted in ascending order."],
    },
    {
      topic: "sliding-window-max",
      statement: "You are given an array of integers nums and a sliding window of size k moving from left to right. Return an array of the max value in each window.",
      examples: [
        "Input: nums = [1,3,-1,-3,5,3,6,7], k = 3 → [3,3,5,5,6,7]",
      ],
      constraints: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length", "Follow up: O(n) using a deque."],
    },
  ],
};

const DIFFICULTY_ORDER: Difficulty[] = ["beginner", "intermediate", "advanced", "expert"];

function difficultyFor(ctx: QuestionContext): Difficulty {
  return ctx.difficulty ?? "intermediate";
}

function problemJson(problem: CodingProblem): string {
  return JSON.stringify({
    statement: problem.statement,
    examples: problem.examples,
    constraints: problem.constraints,
  });
}

/** Pick the next unused problem at the session difficulty (rotating fallback). */
function pickProblem(ctx: QuestionContext): CodingProblem {
  const difficulty = difficultyFor(ctx);
  const bank = PROBLEMS[difficulty] ?? PROBLEMS.intermediate;
  const usedTexts = new Set(ctx.previousQuestions.map((q) => q.question));
  const fresh = bank.find((p) => !usedTexts.has(problemJson(p)));
  return fresh ?? bank[ctx.previousQuestions.length % bank.length];
}

/** A harder variant of the last topic — bumps difficulty one step (controller FOLLOW_UP). */
function harderVariant(ctx: QuestionContext, difficulty: Difficulty): CodingProblem | null {
  const level = DIFFICULTY_ORDER.indexOf(difficulty);
  const next = DIFFICULTY_ORDER[Math.min(DIFFICULTY_ORDER.length - 1, level + 1)];
  const last = ctx.previousQuestions[ctx.previousQuestions.length - 1];
  // Reuse the same topic at a harder level when the bank has it.
  if (last) {
    const harder = PROBLEMS[next]?.find((p) => p.topic === last.topic);
    if (harder) return harder;
  }
  // No matching topic — pick a fresh problem from the harder bank.
  return PROBLEMS[next]?.[0] ?? null;
}

export function heuristicGenerateCodingQuestion(ctx: QuestionContext): GeneratedQuestion {
  const difficulty = difficultyFor(ctx);
  const problem = pickProblem(ctx);
  return {
    action: "NEW_TOPIC",
    question: problemJson(problem),
    type: "coding",
    topic: problem.topic,
    difficulty,
    reason: "Heuristic — next coding problem in the bank.",
  };
}

export function heuristicGenerateCodingFollowUp(ctx: QuestionContext): GeneratedQuestion {
  const intent = ctx.adaptiveIntent;
  if (intent?.action === "FOLLOW_UP") {
    const harder = harderVariant(ctx, intent.difficulty);
    if (harder) {
      return {
        action: "FOLLOW_UP",
        question: problemJson(harder),
        type: "coding",
        topic: harder.topic,
        difficulty: intent.difficulty,
        reason: `Controller: ${intent.reason}`,
      };
    }
  }
  if (intent?.action === "CLARIFICATION") {
    const easier = PROBLEMS.beginner[0];
    return {
      action: "CLARIFICATION",
      question: problemJson(easier),
      type: "coding",
      topic: easier.topic,
      difficulty: "beginner",
      reason: `Controller: ${intent.reason}`,
    };
  }
  return heuristicGenerateCodingQuestion(ctx);
}
