export interface Topic {
  title: string;
  subtopics: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  sections: {
    title: string;
    topics: Topic[];
  }[];
}

export const careerPaths: CareerPath[] = [
  {
    id: "react-developer",
    title: "React Developer",
    description: "Master modern frontend development with React.js and become industry-ready.",
    sections: [
      {
        title: "Role Introduction & Internet Basics",
        topics: [
          { title: "Who Is a React Developer", subtopics: ["Responsibilities", "Work Environments", "Career Growth"] },
          { title: "History and Evolution of React", subtopics: ["Origins", "Unique Features", "Ecosystem Growth"] },
          { title: "Internet Basics", subtopics: ["Internet vs Web", "Client-Server Model", "HTTP/HTTPS", "REST APIs"] },
        ],
      },
      {
        title: "JavaScript Fundamentals",
        topics: [
          { title: "JavaScript Core", subtopics: ["Variables & Scope", "Functions", "Closures", "Prototypes"] },
          { title: "ES6+ Features", subtopics: ["Arrow Functions", "Destructuring", "Spread/Rest", "Promises", "async/await"] },
          { title: "DOM Manipulation", subtopics: ["DOM Tree", "Events", "Event Bubbling", "querySelector"] },
        ],
      },
      {
        title: "React Fundamentals",
        topics: [
          { title: "Getting Started with React", subtopics: ["Create React App", "Vite Setup", "JSX Syntax", "Rendering"] },
          { title: "Components & Props", subtopics: ["Functional Components", "Props", "Children", "PropTypes"] },
          { title: "State & Lifecycle", subtopics: ["useState", "useEffect", "Component Lifecycle", "Cleanup"] },
        ],
      },
      {
        title: "Advanced React",
        topics: [
          { title: "Hooks Deep Dive", subtopics: ["useContext", "useReducer", "useCallback", "useMemo", "Custom Hooks"] },
          { title: "React Router", subtopics: ["BrowserRouter", "Routes", "Link", "useParams", "Protected Routes"] },
          { title: "State Management", subtopics: ["Context API", "Redux Toolkit", "Zustand", "React Query"] },
        ],
      },
    ],
  },
  {
    id: "fullstack-developer",
    title: "Full Stack Developer",
    description: "Build complete web applications from frontend to backend.",
    sections: [
      {
        title: "Frontend Foundation",
        topics: [
          { title: "HTML & CSS Mastery", subtopics: ["Semantic HTML", "Flexbox", "Grid", "Responsive Design", "CSS Variables"] },
          { title: "JavaScript Advanced", subtopics: ["Design Patterns", "Modules", "Performance", "Security"] },
          { title: "React.js", subtopics: ["Components", "Hooks", "State Management", "Testing"] },
        ],
      },
      {
        title: "Backend Development",
        topics: [
          { title: "Node.js & Express", subtopics: ["Node.js Core", "Express Framework", "Middleware", "REST APIs", "GraphQL"] },
          { title: "Databases", subtopics: ["SQL with PostgreSQL", "MongoDB", "Redis", "ORM Frameworks", "Database Design"] },
          { title: "Authentication & Security", subtopics: ["JWT", "OAuth 2.0", "bcrypt", "HTTPS", "CORS"] },
        ],
      },
      {
        title: "DevOps & Deployment",
        topics: [
          { title: "Version Control", subtopics: ["Git Fundamentals", "Branching Strategies", "Pull Requests", "Code Reviews"] },
          { title: "Cloud & Docker", subtopics: ["Docker Basics", "Docker Compose", "AWS EC2", "Heroku", "Vercel"] },
          { title: "CI/CD", subtopics: ["GitHub Actions", "Jenkins", "Automated Testing", "Continuous Deployment"] },
        ],
      },
    ],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Analyse data, build ML models and drive data-driven decision making.",
    sections: [
      {
        title: "Python for Data Science",
        topics: [
          { title: "Python Basics", subtopics: ["Variables", "Data Types", "Functions", "OOP", "File I/O"] },
          { title: "NumPy & Pandas", subtopics: ["Arrays", "DataFrames", "Data Cleaning", "GroupBy", "Merge"] },
          { title: "Data Visualization", subtopics: ["Matplotlib", "Seaborn", "Plotly", "Dashboard with Dash"] },
        ],
      },
      {
        title: "Machine Learning",
        topics: [
          { title: "Supervised Learning", subtopics: ["Linear Regression", "Logistic Regression", "SVM", "Decision Trees", "Ensembles"] },
          { title: "Unsupervised Learning", subtopics: ["K-Means", "Hierarchical Clustering", "PCA", "Anomaly Detection"] },
          { title: "Model Evaluation", subtopics: ["Cross Validation", "Confusion Matrix", "ROC-AUC", "Hyperparameter Tuning"] },
        ],
      },
      {
        title: "Deep Learning & AI",
        topics: [
          { title: "Neural Networks", subtopics: ["Perceptrons", "Deep Networks", "Backpropagation", "Optimizers"] },
          { title: "CNNs & RNNs", subtopics: ["Image Classification", "Object Detection", "Sequence Models", "LSTM"] },
          { title: "NLP", subtopics: ["Text Preprocessing", "Word Embeddings", "BERT", "Fine-Tuning LLMs"] },
        ],
      },
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    description: "Bridge development and operations through automation and cloud infrastructure.",
    sections: [
      {
        title: "Linux & Networking",
        topics: [
          { title: "Linux Fundamentals", subtopics: ["File System", "Permissions", "Processes", "Shell Scripting", "Cron Jobs"] },
          { title: "Networking Basics", subtopics: ["TCP/IP", "DNS", "Load Balancing", "Firewalls", "VPC"] },
        ],
      },
      {
        title: "Containerization & Orchestration",
        topics: [
          { title: "Docker", subtopics: ["Dockerfile", "Images", "Containers", "Docker Compose", "Networking"] },
          { title: "Kubernetes", subtopics: ["Pods", "Services", "Deployments", "Ingress", "Helm Charts", "Monitoring"] },
        ],
      },
      {
        title: "Cloud & CI/CD",
        topics: [
          { title: "AWS", subtopics: ["EC2", "S3", "RDS", "Lambda", "CloudFormation", "EKS"] },
          { title: "CI/CD Pipelines", subtopics: ["GitHub Actions", "Jenkins", "ArgoCD", "Terraform", "Ansible"] },
        ],
      },
    ],
  },
];

export const skillPaths = [
  { id: "python", title: "Python Programming", level: "Beginner", modules: 12, duration: "8 weeks" },
  { id: "dsa", title: "Data Structures & Algorithms", level: "Intermediate", modules: 20, duration: "14 weeks" },
  { id: "sql", title: "SQL & Databases", level: "Beginner", modules: 10, duration: "6 weeks" },
  { id: "system-design", title: "System Design", level: "Advanced", modules: 15, duration: "12 weeks" },
  { id: "javascript", title: "JavaScript Mastery", level: "Intermediate", modules: 18, duration: "10 weeks" },
  { id: "docker", title: "Docker & Kubernetes", level: "Advanced", modules: 14, duration: "8 weeks" },
];

export const companyPaths = [
  { id: "google", name: "Google", roles: ["SWE", "ML Engineer", "SRE"], difficulty: "Expert" },
  { id: "microsoft", name: "Microsoft", roles: ["SDE", "Data Engineer", "PM"], difficulty: "Advanced" },
  { id: "amazon", name: "Amazon", roles: ["SDE", "Cloud Architect", "Data Scientist"], difficulty: "Advanced" },
  { id: "wipro", name: "Wipro", roles: ["Software Engineer", "QA Analyst", "DevOps"], difficulty: "Intermediate" },
  { id: "tcs", name: "TCS", roles: ["System Engineer", "Developer", "Analyst"], difficulty: "Beginner" },
  { id: "infosys", name: "Infosys", roles: ["Systems Engineer", "Technology Analyst"], difficulty: "Beginner" },
];
