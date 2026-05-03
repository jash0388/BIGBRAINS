import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// Check which tables exist
router.get("/check-tables", async (_req: Request, res: Response) => {
  const tables = ["faculty_tests", "test_submissions", "practice_questions", "registered_students", "practice_attempts", "coding_questions", "code_submissions"];
  const results: Record<string, string> = {};
  for (const t of tables) {
    const { error } = await supabase.from(t).select("*").limit(1);
    results[t] = error ? `MISSING: ${error.message}` : "OK";
  }
  res.json({ results });
});

// ── TESTS ─────────────────────────────────────────────────────────────────────
const SAMPLE_TESTS = [
  {
    id: "seed_test_001",
    title: "Python Basics — Unit Test 1",
    description: "Fundamental Python concepts: data types, loops, functions, and OOP basics for B.Tech CSE students.",
    duration: 20,
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
    is_active: true,
    questions: [
      { id: "q001_1", question: "Which of the following is an immutable data type in Python?", options: ["List", "Dictionary", "Tuple", "Set"], correctAnswer: 2, marks: 2 },
      { id: "q001_2", question: "What is the output of: print(type(3/2)) in Python 3?", options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "TypeError"], correctAnswer: 1, marks: 2 },
      { id: "q001_3", question: "Which keyword is used to define a function in Python?", options: ["function", "def", "fun", "define"], correctAnswer: 1, marks: 1 },
      { id: "q001_4", question: "What does the 'self' parameter represent in a Python class method?", options: ["The class itself", "The parent class", "The current instance of the class", "A static variable"], correctAnswer: 2, marks: 2 },
      { id: "q001_5", question: "What is the output of: len([1, [2, 3], 4])?", options: ["4", "3", "2", "Error"], correctAnswer: 1, marks: 1 },
    ],
  },
  {
    id: "seed_test_002",
    title: "Data Structures — Unit Test 2",
    description: "Core data structures: arrays, linked lists, stacks, queues, and time complexity for 2nd year students.",
    duration: 25,
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
    is_active: true,
    questions: [
      { id: "q002_1", question: "Which data structure works on LIFO (Last In First Out) principle?", options: ["Queue", "Stack", "Linked List", "Tree"], correctAnswer: 1, marks: 2 },
      { id: "q002_2", question: "What is the time complexity of binary search in a sorted array?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctAnswer: 2, marks: 2 },
      { id: "q002_3", question: "Which of the following is NOT a linear data structure?", options: ["Array", "Stack", "Binary Tree", "Queue"], correctAnswer: 2, marks: 2 },
      { id: "q002_4", question: "In a singly linked list, each node contains:", options: ["Only data", "Data and two pointers", "Data and one pointer to next node", "Only a pointer"], correctAnswer: 2, marks: 1 },
      { id: "q002_5", question: "What is the worst-case time complexity of bubble sort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correctAnswer: 2, marks: 1 },
    ],
  },
  {
    id: "seed_test_003",
    title: "Statistics for Data Science — Mid-Sem",
    description: "Probability, descriptive statistics, distributions, and hypothesis testing fundamentals.",
    duration: 25,
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
    is_active: true,
    questions: [
      { id: "q003_1", question: "Which measure of central tendency is most affected by extreme values (outliers)?", options: ["Median", "Mode", "Mean", "Range"], correctAnswer: 2, marks: 2 },
      { id: "q003_2", question: "In a normal distribution, approximately what % of data falls within 1 standard deviation of the mean?", options: ["50%", "68%", "95%", "99.7%"], correctAnswer: 1, marks: 2 },
      { id: "q003_3", question: "If P(A) = 0.4 and P(B) = 0.3, and A and B are independent, what is P(A and B)?", options: ["0.7", "0.1", "0.12", "0.58"], correctAnswer: 2, marks: 2 },
      { id: "q003_4", question: "What is the variance of the dataset: [2, 4, 4, 4, 5, 5, 7, 9]?", options: ["4", "2", "16", "3.75"], correctAnswer: 0, marks: 2 },
      { id: "q003_5", question: "A p-value less than 0.05 in hypothesis testing means:", options: ["Accept the null hypothesis", "Reject the null hypothesis", "The test is inconclusive", "The data is normally distributed"], correctAnswer: 1, marks: 2 },
    ],
  },
  {
    id: "seed_test_004",
    title: "Machine Learning Fundamentals — Quiz 1",
    description: "Supervised vs unsupervised learning, regression, classification, and model evaluation metrics.",
    duration: 30,
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
    is_active: true,
    questions: [
      { id: "q004_1", question: "Which of the following is a supervised learning algorithm?", options: ["K-Means Clustering", "Principal Component Analysis", "Linear Regression", "DBSCAN"], correctAnswer: 2, marks: 2 },
      { id: "q004_2", question: "In classification, which metric is defined as TP / (TP + FP)?", options: ["Recall", "Precision", "F1 Score", "Accuracy"], correctAnswer: 1, marks: 2 },
      { id: "q004_3", question: "Overfitting occurs when a model:", options: ["Performs well on training but poorly on test data", "Performs poorly on both training and test data", "Performs well on both training and test data", "Cannot be trained at all"], correctAnswer: 0, marks: 2 },
      { id: "q004_4", question: "Which activation function is commonly used in the output layer for binary classification?", options: ["ReLU", "Tanh", "Sigmoid", "Softmax"], correctAnswer: 2, marks: 2 },
      { id: "q004_5", question: "What does the 'K' in K-Nearest Neighbours represent?", options: ["The number of features", "The number of training samples", "The number of nearest neighbours to consider", "The number of classes"], correctAnswer: 2, marks: 2 },
    ],
  },
  {
    id: "seed_test_005",
    title: "DBMS Concepts — Unit Test",
    description: "Relational databases, SQL queries, normalization, and transactions for CSE Data Science.",
    duration: 20,
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
    is_active: true,
    questions: [
      { id: "q005_1", question: "Which SQL command is used to retrieve data from a database?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], correctAnswer: 2, marks: 1 },
      { id: "q005_2", question: "A primary key constraint ensures:", options: ["All values are NULL", "Each row has a unique identifier", "Data is sorted", "Foreign keys are valid"], correctAnswer: 1, marks: 2 },
      { id: "q005_3", question: "Which normal form removes partial dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correctAnswer: 1, marks: 2 },
      { id: "q005_4", question: "The ACID property 'Isolation' means:", options: ["Transactions are permanent", "Data is consistent before and after", "Concurrent transactions don't interfere", "All operations succeed or none do"], correctAnswer: 2, marks: 2 },
      { id: "q005_5", question: "Which JOIN returns all rows from both tables, with NULLs where no match?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correctAnswer: 3, marks: 2 },
    ],
  },
];

// ── MCQ PRACTICE QUESTIONS ────────────────────────────────────────────────────
const SAMPLE_MCQS = [
  {
    id: "mcq_seed_001",
    title: "Python: List vs Tuple",
    description: "What is the key difference between a Python list and a tuple?",
    difficulty: "easy",
    tags: ["python", "data-types"],
    options: ["Lists are ordered, tuples are not", "Lists are mutable, tuples are immutable", "Tuples support indexing, lists don't", "Lists can hold only one type"],
    correct_answer: 1,
    explanation: "Lists can be changed after creation (mutable), while tuples cannot (immutable).",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_002",
    title: "Big-O: Linear Search",
    description: "What is the time complexity of linear search in the worst case?",
    difficulty: "easy",
    tags: ["algorithms", "complexity"],
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct_answer: 2,
    explanation: "In the worst case, linear search checks every element — O(n).",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_003",
    title: "SQL: GROUP BY Clause",
    description: "Which SQL clause is used along with aggregate functions like COUNT() or SUM()?",
    difficulty: "easy",
    tags: ["sql", "dbms"],
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correct_answer: 2,
    explanation: "GROUP BY groups rows sharing a value so aggregate functions can be applied per group.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_004",
    title: "ML: What is Gradient Descent?",
    description: "In machine learning, gradient descent is used to:",
    difficulty: "medium",
    tags: ["machine-learning", "optimization"],
    options: ["Increase the loss function", "Minimise the loss function by updating weights", "Split training and test data", "Normalise input features"],
    correct_answer: 1,
    explanation: "Gradient descent iteratively adjusts weights in the direction that reduces loss.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_005",
    title: "Statistics: Standard Deviation",
    description: "A low standard deviation in a dataset means:",
    difficulty: "easy",
    tags: ["statistics", "data-science"],
    options: ["Data points are spread far from the mean", "Data points are close to the mean", "The mean is very large", "There are many outliers"],
    correct_answer: 1,
    explanation: "Standard deviation measures spread. Low SD = data clustered near the mean.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_006",
    title: "OOP: Inheritance",
    description: "Which OOP principle allows a class to inherit properties and methods from another class?",
    difficulty: "easy",
    tags: ["oops", "python"],
    options: ["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"],
    correct_answer: 2,
    explanation: "Inheritance lets a child class reuse the attributes and methods of a parent class.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_007",
    title: "Networks: OSI Model",
    description: "At which OSI layer does IP addressing operate?",
    difficulty: "medium",
    tags: ["networking", "os"],
    options: ["Data Link Layer", "Transport Layer", "Network Layer", "Application Layer"],
    correct_answer: 2,
    explanation: "IP addressing is a Network Layer (Layer 3) function in the OSI model.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_008",
    title: "Python: Lambda Functions",
    description: "What is the correct syntax for a Python lambda function that adds two numbers?",
    difficulty: "medium",
    tags: ["python", "functions"],
    options: ["def add = lambda x, y: x + y", "lambda x, y: x + y", "lambda(x, y) => x + y", "function(x, y): return x + y"],
    correct_answer: 1,
    explanation: "Lambda syntax: lambda arguments: expression. No def or return keyword needed.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_009",
    title: "Data Science: Pandas",
    description: "Which Pandas method is used to remove duplicate rows from a DataFrame?",
    difficulty: "medium",
    tags: ["pandas", "data-science", "python"],
    options: ["df.remove_duplicates()", "df.drop_duplicates()", "df.unique()", "df.distinct()"],
    correct_answer: 1,
    explanation: "df.drop_duplicates() returns a DataFrame with duplicate rows removed.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_010",
    title: "Algorithms: Merge Sort",
    description: "What is the average time complexity of Merge Sort?",
    difficulty: "hard",
    tags: ["algorithms", "sorting", "complexity"],
    options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"],
    correct_answer: 2,
    explanation: "Merge sort always divides the array in half and merges — O(n log n) in all cases.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_011",
    title: "ML: Confusion Matrix — True Positive",
    description: "In a confusion matrix, a True Positive (TP) means:",
    difficulty: "medium",
    tags: ["machine-learning", "evaluation"],
    options: ["Model predicted Negative and it was Negative", "Model predicted Positive and it was Negative", "Model predicted Positive and it was Positive", "Model predicted Negative and it was Positive"],
    correct_answer: 2,
    explanation: "TP = correctly predicted as Positive when the actual label is also Positive.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "mcq_seed_012",
    title: "Python: __init__ Method",
    description: "What is the purpose of the __init__ method in a Python class?",
    difficulty: "easy",
    tags: ["python", "oops"],
    options: ["To delete an object", "To define class variables only", "To initialise an object's attributes when it is created", "To call parent class methods"],
    correct_answer: 2,
    explanation: "__init__ is the constructor — it runs automatically when a new object is created.",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
];

// ── CODING QUESTIONS ──────────────────────────────────────────────────────────
const SAMPLE_CODING = [
  {
    id: "cq_seed_001",
    title: "Reverse a String",
    description: "Write a Python function that takes a string as input and returns the reversed string.\n\nDo NOT use Python's built-in reverse() or slicing shortcut [::-1] — implement it manually using a loop.",
    difficulty: "easy",
    tags: ["python", "strings", "loops"],
    starter_code: "def reverse_string(s):\n    # Your code here\n    pass\n\n# Test\nprint(reverse_string(\"hello\"))   # Expected: olleh\nprint(reverse_string(\"BigBrains\")) # Expected: sniarBgiB",
    sample_input: "\"hello\"",
    expected_output: "olleh",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_002",
    title: "Find Factorial (Recursion)",
    description: "Write a recursive Python function to calculate the factorial of a non-negative integer n.\n\nFactorial of 0 is 1. Factorial of n = n × (n-1) × ... × 1.\n\nHandle edge case: if n < 0, return -1.",
    difficulty: "easy",
    tags: ["python", "recursion", "math"],
    starter_code: "def factorial(n):\n    # Your code here\n    pass\n\n# Test\nprint(factorial(5))   # Expected: 120\nprint(factorial(0))   # Expected: 1\nprint(factorial(-1))  # Expected: -1",
    sample_input: "5",
    expected_output: "120",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_003",
    title: "Check Prime Number",
    description: "Write a Python function is_prime(n) that returns True if n is a prime number, and False otherwise.\n\nA prime number is greater than 1 and has no divisors other than 1 and itself.\n\nYour solution should be efficient — avoid checking all numbers up to n.",
    difficulty: "easy",
    tags: ["python", "math", "loops"],
    starter_code: "def is_prime(n):\n    # Your code here\n    pass\n\n# Test\nprint(is_prime(2))   # True\nprint(is_prime(17))  # True\nprint(is_prime(1))   # False\nprint(is_prime(20))  # False",
    sample_input: "17",
    expected_output: "True",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_004",
    title: "FizzBuzz",
    description: "Print numbers from 1 to 50. But:\n- For multiples of 3, print \"Fizz\" instead of the number\n- For multiples of 5, print \"Buzz\" instead of the number\n- For multiples of both 3 and 5, print \"FizzBuzz\"\n\nThis is a classic interview question — handle the order of conditions carefully!",
    difficulty: "easy",
    tags: ["python", "loops", "conditionals"],
    starter_code: "# FizzBuzz — 1 to 50\nfor i in range(1, 51):\n    # Your code here\n    pass",
    sample_input: "1 to 50",
    expected_output: "1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz ...",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_005",
    title: "Two Sum Problem",
    description: "Given a list of integers and a target number, return the indices of the two numbers that add up to the target.\n\nAssume each input has exactly one solution. You may not use the same element twice.\n\nAim for a solution better than O(n²).",
    difficulty: "medium",
    tags: ["python", "arrays", "hash-map", "interview"],
    starter_code: "def two_sum(nums, target):\n    # Your code here\n    # Return a list of two indices [i, j]\n    pass\n\n# Test\nprint(two_sum([2, 7, 11, 15], 9))   # Expected: [0, 1]\nprint(two_sum([3, 2, 4], 6))         # Expected: [1, 2]\nprint(two_sum([3, 3], 6))            # Expected: [0, 1]",
    sample_input: "nums = [2, 7, 11, 15], target = 9",
    expected_output: "[0, 1]",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_006",
    title: "Bubble Sort Implementation",
    description: "Implement the bubble sort algorithm in Python without using any built-in sort functions.\n\nBubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.\n\nAlso print the number of swaps performed.",
    difficulty: "medium",
    tags: ["python", "sorting", "algorithms"],
    starter_code: "def bubble_sort(arr):\n    # Your code here\n    # Return (sorted_array, number_of_swaps)\n    pass\n\n# Test\nresult, swaps = bubble_sort([64, 34, 25, 12, 22, 11, 90])\nprint(result)  # Expected: [11, 12, 22, 25, 34, 64, 90]\nprint(swaps)   # Expected: 14",
    sample_input: "[64, 34, 25, 12, 22, 11, 90]",
    expected_output: "[11, 12, 22, 25, 34, 64, 90]\n14",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_007",
    title: "Count Word Frequency",
    description: "Write a Python function that takes a sentence (string) and returns a dictionary with each unique word as a key and its frequency as the value.\n\nMake the function case-insensitive (treat 'Hello' and 'hello' as the same word) and ignore punctuation.",
    difficulty: "medium",
    tags: ["python", "strings", "dictionaries", "data-science"],
    starter_code: "def word_frequency(sentence):\n    # Your code here\n    # Return a dictionary {word: count}\n    pass\n\n# Test\ntext = \"Data is the new oil. Data drives decisions.\"\nresult = word_frequency(text)\nprint(result)\n# Expected: {'data': 2, 'is': 1, 'the': 1, 'new': 1, 'oil': 1, 'drives': 1, 'decisions': 1}",
    sample_input: "\"Data is the new oil. Data drives decisions.\"",
    expected_output: "{'data': 2, 'is': 1, 'the': 1, 'new': 1, 'oil': 1, 'drives': 1, 'decisions': 1}",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_008",
    title: "Binary Search",
    description: "Implement binary search on a sorted list. The function should return the index of the target element, or -1 if not found.\n\nDo NOT use Python's list.index() or the bisect module. Implement it from scratch with a while loop.",
    difficulty: "medium",
    tags: ["python", "searching", "algorithms", "interview"],
    starter_code: "def binary_search(arr, target):\n    # Your code here\n    # Return the index of target, or -1\n    pass\n\n# Test\nprint(binary_search([1, 3, 5, 7, 9, 11, 13], 7))   # Expected: 3\nprint(binary_search([1, 3, 5, 7, 9, 11, 13], 6))   # Expected: -1\nprint(binary_search([2], 2))                         # Expected: 0",
    sample_input: "arr = [1, 3, 5, 7, 9, 11, 13], target = 7",
    expected_output: "3",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_009",
    title: "Fibonacci — Memoization",
    description: "Write a Python function to return the nth Fibonacci number using memoization (top-down dynamic programming).\n\nDo NOT use a simple recursive approach — it will be too slow for large n. Use a dictionary or @functools.lru_cache to cache results.\n\nfib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2)",
    difficulty: "hard",
    tags: ["python", "dynamic-programming", "recursion", "interview"],
    starter_code: "def fib(n, memo={}):\n    # Your code here using memoization\n    pass\n\n# Test\nprint(fib(10))   # Expected: 55\nprint(fib(30))   # Expected: 832040\nprint(fib(50))   # Expected: 12586269025",
    sample_input: "50",
    expected_output: "12586269025",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
  {
    id: "cq_seed_010",
    title: "Linked List — Insert & Traverse",
    description: "Implement a singly linked list in Python with the following:\n1. A Node class with 'data' and 'next' attributes\n2. A LinkedList class with:\n   - insert_at_end(data) — add node to end\n   - insert_at_beginning(data) — add node to start\n   - traverse() — print all node values\n   - length() — return number of nodes",
    difficulty: "hard",
    tags: ["python", "data-structures", "linked-list", "oops"],
    starter_code: "class Node:\n    def __init__(self, data):\n        # Your code here\n        pass\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def insert_at_end(self, data):\n        # Your code here\n        pass\n\n    def insert_at_beginning(self, data):\n        # Your code here\n        pass\n\n    def traverse(self):\n        # Print all values\n        pass\n\n    def length(self):\n        # Return count of nodes\n        pass\n\n# Test\nll = LinkedList()\nll.insert_at_end(10)\nll.insert_at_end(20)\nll.insert_at_beginning(5)\nll.traverse()   # Expected: 5 -> 10 -> 20 -> None\nprint(ll.length())  # Expected: 3",
    sample_input: "insert 10, 20 at end; insert 5 at beginning",
    expected_output: "5 -> 10 -> 20 -> None\n3",
    language: "python",
    created_by: "Jashwanth Singh",
    created_at: new Date().toISOString(),
  },
];

// Seed 5 sample tests
router.post("/seed-tests", async (_req: Request, res: Response) => {
  const results: Record<string, string> = {};
  for (const t of SAMPLE_TESTS) {
    const { error } = await supabase.from("faculty_tests").upsert(t, { onConflict: "id", ignoreDuplicates: true });
    results[t.title] = error ? `Error: ${error.message}` : "Seeded";
  }
  res.json({ results });
});

// Seed 12 MCQ practice questions
router.post("/seed-mcqs", async (_req: Request, res: Response) => {
  const results: Record<string, string> = {};
  for (const q of SAMPLE_MCQS) {
    const { error } = await supabase.from("practice_questions").upsert(q, { onConflict: "id", ignoreDuplicates: true });
    results[q.title] = error ? `Error: ${error.message}` : "Seeded";
  }
  res.json({ results });
});

// Seed 10 coding questions
router.post("/seed-coding", async (_req: Request, res: Response) => {
  const results: Record<string, string> = {};
  for (const q of SAMPLE_CODING) {
    const { error } = await supabase.from("coding_questions").upsert(q, { onConflict: "id", ignoreDuplicates: true });
    results[q.title] = error ? `Error: ${error.message}` : "Seeded";
  }
  res.json({ results });
});

// Seed everything at once
router.post("/seed-all", async (_req: Request, res: Response) => {
  const allResults: Record<string, Record<string, string>> = { tests: {}, mcqs: {}, coding: {} };

  for (const t of SAMPLE_TESTS) {
    const { error } = await supabase.from("faculty_tests").upsert(t, { onConflict: "id", ignoreDuplicates: true });
    allResults.tests[t.title] = error ? `Error: ${error.message}` : "Seeded";
  }
  for (const q of SAMPLE_MCQS) {
    const { error } = await supabase.from("practice_questions").upsert(q, { onConflict: "id", ignoreDuplicates: true });
    allResults.mcqs[q.title] = error ? `Error: ${error.message}` : "Seeded";
  }
  for (const q of SAMPLE_CODING) {
    const { error } = await supabase.from("coding_questions").upsert(q, { onConflict: "id", ignoreDuplicates: true });
    allResults.coding[q.title] = error ? `Error: ${error.message}` : "Seeded";
  }

  const total = SAMPLE_TESTS.length + SAMPLE_MCQS.length + SAMPLE_CODING.length;
  const seeded = [
    ...Object.values(allResults.tests),
    ...Object.values(allResults.mcqs),
    ...Object.values(allResults.coding),
  ].filter(v => v === "Seeded").length;

  res.json({ summary: `${seeded}/${total} items seeded`, results: allResults });
});

export default router;
