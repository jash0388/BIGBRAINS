export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  solved?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  category: string;
}

export const problems: Problem[] = [
  { id: "1", title: "Cycle Sort", description: "You are given an array of integers of size n and an integer k. Your task is to sort the array in non-decreasing order such that the total number of elements involved acro...", difficulty: "Intermediate", tags: ["dsu", "math"] },
  { id: "2", title: "Trips", description: "There are n persons who initially don't know each other. On each morning, two of them, who were not friends before, become friends. We want to plan a trip for every...", difficulty: "Intermediate", tags: ["graphs"] },
  { id: "3", title: "Phone Numbers", description: "Let's call a string a phone number if it has length 11 and fits the pattern '8xxxxxxxxxx', where each 'x' is replaced by a digit. For example, '80123456789' and '80000000000'...", difficulty: "Beginner", tags: ["brute force"] },
  { id: "4", title: "Mergesort Strikes Back", description: "Chouti thought about his very first days as a programmer. He thought he was the worst, so he tried to learn merge sort. He thought that merge sort is too slow...", difficulty: "Intermediate", tags: ["greedy", "probability"] },
  { id: "5", title: "Two Subsequences", description: "Let's call a subsequence of a string as good if the sum of positions of the characters in this subsequence is divisible by k...", difficulty: "Advanced", tags: ["dp", "math"] },
  { id: "6", title: "Binary Search", description: "Implement binary search to find a target value in a sorted array. Return the index of the target, or -1 if not found.", difficulty: "Beginner", tags: ["binary search", "arrays"] },
  { id: "7", title: "Maximum Subarray", description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.", difficulty: "Intermediate", tags: ["dp", "arrays"] },
  { id: "8", title: "Longest Common Subsequence", description: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.", difficulty: "Intermediate", tags: ["dp", "strings"] },
  { id: "9", title: "Network Delay Time", description: "You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges. Find shortest time.", difficulty: "Advanced", tags: ["graphs", "dijkstra"] },
  { id: "10", title: "Palindrome Partitioning", description: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.", difficulty: "Advanced", tags: ["dp", "backtracking"] },
  { id: "11", title: "LRU Cache", description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.", difficulty: "Intermediate", tags: ["design", "hash table"] },
  { id: "12", title: "Word Ladder", description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList. Find shortest transformation sequence.", difficulty: "Advanced", tags: ["bfs", "graphs"] },
  { id: "13", title: "Reverse Linked List", description: "Given the head of a singly linked list, reverse the list, and return the reversed list.", difficulty: "Beginner", tags: ["linked list"] },
  { id: "14", title: "Valid Parentheses", description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", difficulty: "Beginner", tags: ["stack", "strings"] },
  { id: "15", title: "Kth Largest Element", description: "Given an integer array nums and an integer k, return the kth largest element in the array.", difficulty: "Intermediate", tags: ["sorting", "heap"] },
];

export const allTags = ["All", "2-sat", "binary search", "bitmasks", "brute force", "chinese remainder", "combinatorics", "constructive", "data structures", "dfs and similar", "divide and conquer", "dp", "dsu", "games", "geometry", "graph matchings", "graphs", "greedy", "hashing", "implementation", "interactive", "math", "matrices", "number theory", "probabilities", "shortest paths", "sorting", "strings", "trees", "two pointers"];

export const projects: Project[] = [
  { id: "1", title: "Vue.js-driven Collaborative Real-Time", description: "This expert-level project challenges experienced developers to design and implement a cutting-edge collaborative application...", difficulty: "Expert", tags: ["Distributed Systems"], category: "AI Agents" },
  { id: "2", title: "Vue.js Enterprise-Grade Real-Time App", description: "Architect and build a highly scalable, event-driven application using experienced developers to...", difficulty: "Advanced", tags: ["Distributed Systems", "Microservices"], category: "AI Agents" },
  { id: "3", title: "Vue.js Simple Counter App", description: "In this beginner-friendly project, you will build a simple interactive counter application...", difficulty: "Beginner", tags: ["Web Development"], category: "AI" },
  { id: "4", title: "Interactive Task List (Vue.js)", description: "In this hands-on project, you will build a simple, interactive Task List application...", difficulty: "Beginner", tags: ["Web Development"], category: "AI" },
  { id: "5", title: "Type-Driven Polyglot Microservices", description: "This project involves designing and implementing a cutting-edge microservices architecture...", difficulty: "Expert", tags: ["Distributed Systems"], category: "API Development" },
  { id: "6", title: "Event-Driven AI Content Machine", description: "Architect and build a highly scalable, event-driven content generation system...", difficulty: "Advanced", tags: ["Microservices", "Distributed Systems"], category: "AI" },
  { id: "7", title: "TypeScript Personal Finance Tracker", description: "This project challenges you to build a robust and type-safe personal finance backend API...", difficulty: "Intermediate", tags: ["Web Development"], category: "API Development" },
  { id: "8", title: "Simple TypeScript User Card", description: "This project will guide you through creating a basic web page that displays a user profile card using TypeScript...", difficulty: "Beginner", tags: ["Web Development"], category: "AI" },
  { id: "9", title: "Interactive To-Do List with TypeScript", description: "In this hands-on project, you will build a simple interactive To-Do list application using TypeScript...", difficulty: "Beginner", tags: ["Web Development"], category: "Automation" },
  { id: "10", title: "Distributed Heterogeneous Database System", description: "This project challenges participants to design and implement a cutting-edge distributed database...", difficulty: "Expert", tags: ["Distributed Systems"], category: "Backend Development" },
  { id: "11", title: "Distributed Real-time Collaborative App", description: "This advanced project challenges experienced developers to design and implement a cutting-edge real-time system...", difficulty: "Advanced", tags: ["Distributed Systems", "Microservices"], category: "AI Agents" },
  { id: "12", title: "Personalized Content Aggregator", description: "This project challenges you to design and build a personalized content aggregation service...", difficulty: "Intermediate", tags: ["Web Development"], category: "AI" },
];

export const projectCategories = ["All", "AI", "AI Agents", "API Development", "Augmented Reality", "Automation", "Backend Development", "Blockchain"];
