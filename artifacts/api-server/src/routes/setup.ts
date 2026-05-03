import { Router, Request, Response } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// Check which tables exist
router.get("/check-tables", async (_req: Request, res: Response) => {
  const tables = ["faculty_tests", "test_submissions", "practice_questions", "registered_students", "practice_attempts"];
  const results: Record<string, string> = {};
  for (const t of tables) {
    const { error } = await supabase.from(t).select("*").limit(1);
    results[t] = error ? `MISSING: ${error.message}` : "OK";
  }
  res.json({ results });
});

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
];

// Seed 4 sample tests (skips if already exist)
router.post("/seed-tests", async (_req: Request, res: Response) => {
  const results: Record<string, string> = {};
  for (const t of SAMPLE_TESTS) {
    const { error } = await supabase.from("faculty_tests").upsert(t, { onConflict: "id", ignoreDuplicates: true });
    results[t.title] = error ? `Error: ${error.message}` : "Seeded";
  }
  res.json({ results });
});

export default router;
