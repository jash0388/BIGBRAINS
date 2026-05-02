export interface Course {
  code: string;
  name: string;
  credits: number;
  type: "Theory" | "Lab" | "Elective" | "Project";
  units: {
    title: string;
    topics: string[];
  }[];
}

export interface Semester {
  sem: number;
  year: number;
  label: string;
  courses: Course[];
}

export const curriculum: Semester[] = [
  {
    sem: 1, year: 1, label: "SEM I",
    courses: [
      { code: "23MA101PC", name: "Engineering Mathematics - I", credits: 4, type: "Theory", units: [
        { title: "Unit I: Matrices", topics: ["Types of Matrices", "Rank of Matrix", "Echelon Form", "System of Equations", "Eigenvalues & Eigenvectors"] },
        { title: "Unit II: Differential Calculus", topics: ["Rolle's Theorem", "Mean Value Theorems", "Taylor Series", "Maclaurin Series", "Curvature"] },
        { title: "Unit III: Integral Calculus", topics: ["Beta & Gamma Functions", "Double Integrals", "Change of Order", "Triple Integrals"] },
        { title: "Unit IV: Vector Calculus", topics: ["Gradient", "Divergence", "Curl", "Green's Theorem", "Stokes Theorem", "Gauss Divergence"] },
        { title: "Unit V: ODE", topics: ["First Order ODE", "Bernoulli's Equation", "Exact Equations", "Higher Order ODE", "Variation of Parameters"] },
      ]},
      { code: "23PH101BS", name: "Engineering Physics", credits: 4, type: "Theory", units: [
        { title: "Unit I: Wave Optics", topics: ["Interference", "Diffraction", "Polarization", "Laser Basics"] },
        { title: "Unit II: Quantum Mechanics", topics: ["Wave-Particle Duality", "Uncertainty Principle", "Schrödinger Equation", "Particle in a Box"] },
        { title: "Unit III: Semiconductors", topics: ["Band Theory", "P-N Junction", "Hall Effect", "Semiconductor Devices"] },
        { title: "Unit IV: Dielectrics & Magnetism", topics: ["Dielectric Properties", "Ferroelectrics", "Magnetic Materials", "Superconductivity"] },
        { title: "Unit V: Nanotechnology", topics: ["Nanomaterials", "Carbon Nanotubes", "Quantum Dots", "Applications"] },
      ]},
      { code: "23CH101BS", name: "Engineering Chemistry", credits: 4, type: "Theory", units: [
        { title: "Unit I: Electrochemistry", topics: ["Galvanic Cells", "EMF", "Batteries", "Fuel Cells", "Corrosion"] },
        { title: "Unit II: Polymer Science", topics: ["Types of Polymers", "Polymerisation", "Plastics", "Rubber", "Composites"] },
        { title: "Unit III: Water Technology", topics: ["Hardness", "Softening", "Drinking Water Treatment", "Sewage Treatment"] },
        { title: "Unit IV: Fuels & Lubricants", topics: ["Solid Fuels", "Liquid Fuels", "Gaseous Fuels", "Lubricants", "Refractories"] },
        { title: "Unit V: Engineering Materials", topics: ["Cement", "Glass", "Ceramics", "Conducting Polymers"] },
      ]},
      { code: "23CS101PC", name: "Programming for Problem Solving (C)", credits: 4, type: "Theory", units: [
        { title: "Unit I: Introduction to C", topics: ["Variables", "Data Types", "Operators", "Control Structures", "Loops"] },
        { title: "Unit II: Functions & Arrays", topics: ["User-Defined Functions", "Recursion", "Arrays", "Strings", "String Functions"] },
        { title: "Unit III: Pointers", topics: ["Pointer Basics", "Pointer Arithmetic", "Dynamic Memory", "malloc/calloc/free"] },
        { title: "Unit IV: Structures & Unions", topics: ["Structures", "Unions", "Enumerations", "Bit Fields", "Typedef"] },
        { title: "Unit V: File Handling", topics: ["File Operations", "fopen/fclose", "File I/O", "Command Line Arguments"] },
      ]},
      { code: "23EG101HS", name: "English Communication Skills", credits: 2, type: "Theory", units: [
        { title: "Unit I: Reading Skills", topics: ["Skimming", "Scanning", "Comprehension", "Note Making"] },
        { title: "Unit II: Writing Skills", topics: ["Letter Writing", "Resume Writing", "Report Writing", "Email Etiquette"] },
        { title: "Unit III: Grammar", topics: ["Parts of Speech", "Tenses", "Voice", "Narration", "Conditionals"] },
        { title: "Unit IV: Speaking Skills", topics: ["Group Discussion", "Presentations", "Interviews", "Public Speaking"] },
        { title: "Unit V: Vocabulary", topics: ["Synonyms & Antonyms", "Word Formation", "Idioms & Phrases", "One Word Substitution"] },
      ]},
      { code: "23ME101PC", name: "Engineering Drawing", credits: 4, type: "Theory", units: [
        { title: "Unit I: Introduction", topics: ["Drawing Instruments", "Lines & Lettering", "Scales", "Engineering Curves"] },
        { title: "Unit II: Projections", topics: ["Orthographic Projections", "First Angle", "Third Angle", "Auxiliary Views"] },
        { title: "Unit III: Solids", topics: ["Projection of Solids", "Prisms", "Pyramids", "Cylinders", "Cones"] },
        { title: "Unit IV: Sections", topics: ["Section of Solids", "Development of Surfaces", "Interpenetration"] },
        { title: "Unit V: Isometric Projections", topics: ["Isometric Views", "Isometric Drawing", "Perspective Projections"] },
      ]},
      { code: "23PH102BS", name: "Engineering Physics Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Experiments", topics: ["Newton's Rings", "Diffraction Grating", "Laser Wavelength", "Hall Effect", "Dielectric Constant", "Magnetic Susceptibility"] },
      ]},
      { code: "23CS102PC", name: "C Programming Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Programs", topics: ["Fibonacci Series", "Matrix Operations", "Sorting Algorithms", "String Operations", "Recursion Programs", "File Programs"] },
      ]},
    ],
  },
  {
    sem: 2, year: 1, label: "SEM II",
    courses: [
      { code: "23MA201PC", name: "Engineering Mathematics - II", credits: 4, type: "Theory", units: [
        { title: "Unit I: Complex Variables", topics: ["Analytic Functions", "Cauchy-Riemann Equations", "Harmonic Functions", "Complex Integration"] },
        { title: "Unit II: Laplace Transforms", topics: ["Definition", "Properties", "Inverse Laplace", "Applications to ODE"] },
        { title: "Unit III: Fourier Series", topics: ["Euler's Formula", "Half Range Series", "Parseval's Theorem", "Harmonic Analysis"] },
        { title: "Unit IV: Fourier Transforms", topics: ["Infinite Fourier Transform", "Sine & Cosine Transforms", "Properties", "Convolution"] },
        { title: "Unit V: Z-Transforms", topics: ["Definition", "Properties", "Inverse Z-Transform", "Difference Equations"] },
      ]},
      { code: "23EE201PC", name: "Basic Electrical & Electronics Engg", credits: 4, type: "Theory", units: [
        { title: "Unit I: DC Circuits", topics: ["Ohm's Law", "Kirchhoff's Laws", "Network Theorems", "Mesh Analysis"] },
        { title: "Unit II: AC Circuits", topics: ["Phasors", "RLC Circuits", "Resonance", "Power Factor", "Three Phase"] },
        { title: "Unit III: Electrical Machines", topics: ["Transformers", "DC Machines", "AC Machines", "Induction Motor"] },
        { title: "Unit IV: Diodes & Transistors", topics: ["PN Junction", "Rectifiers", "Filters", "BJT", "Amplifiers"] },
        { title: "Unit V: Logic Gates", topics: ["Boolean Algebra", "Logic Gates", "Combinational Circuits", "Flip Flops"] },
      ]},
      { code: "23CS201PC", name: "Data Structures", credits: 4, type: "Theory", units: [
        { title: "Unit I: Arrays & Linked Lists", topics: ["Arrays", "Singly Linked List", "Doubly Linked List", "Circular Linked List"] },
        { title: "Unit II: Stacks & Queues", topics: ["Stack Operations", "Infix/Postfix", "Queue", "Deque", "Priority Queue"] },
        { title: "Unit III: Trees", topics: ["Binary Trees", "BST", "AVL Trees", "Heap", "B-Trees"] },
        { title: "Unit IV: Graphs", topics: ["Graph Representations", "BFS", "DFS", "Spanning Trees", "Shortest Paths"] },
        { title: "Unit V: Sorting & Hashing", topics: ["Bubble Sort", "Quick Sort", "Merge Sort", "Heap Sort", "Hash Functions"] },
      ]},
      { code: "23CS202PC", name: "Digital Logic Design", credits: 4, type: "Theory", units: [
        { title: "Unit I: Number Systems", topics: ["Binary", "Octal", "Hexadecimal", "BCD", "Conversions", "Complement"] },
        { title: "Unit II: Boolean Algebra", topics: ["Boolean Laws", "De Morgan's", "K-Map 2/3/4 Variable", "SOP & POS"] },
        { title: "Unit III: Combinational Circuits", topics: ["Adders", "Subtractors", "Multiplexers", "Decoders", "Comparators"] },
        { title: "Unit IV: Sequential Circuits", topics: ["Latches", "Flip-Flops", "Registers", "Counters", "State Machines"] },
        { title: "Unit V: Memory & PLDs", topics: ["ROM", "RAM", "PLA", "PAL", "FPGA Basics"] },
      ]},
      { code: "23CS203PC", name: "Object Oriented Programming (Java)", credits: 4, type: "Theory", units: [
        { title: "Unit I: OOP Concepts", topics: ["Classes & Objects", "Constructors", "this Keyword", "Static Members", "Garbage Collection"] },
        { title: "Unit II: Inheritance & Polymorphism", topics: ["Single Inheritance", "Multilevel", "Method Overriding", "Interfaces", "Abstract Classes"] },
        { title: "Unit III: Exception Handling", topics: ["try-catch-finally", "Custom Exceptions", "throws", "Checked/Unchecked"] },
        { title: "Unit IV: Collections & Generics", topics: ["ArrayList", "LinkedList", "HashMap", "Generics", "Iterators"] },
        { title: "Unit V: Multithreading & I/O", topics: ["Thread Lifecycle", "Synchronization", "File I/O", "Streams", "Serialization"] },
      ]},
      { code: "23ES201PC", name: "Environmental Science", credits: 2, type: "Theory", units: [
        { title: "Unit I: Ecosystems", topics: ["Types of Ecosystems", "Food Chain", "Energy Flow", "Biogeochemical Cycles"] },
        { title: "Unit II: Natural Resources", topics: ["Forest Resources", "Water Resources", "Land Resources", "Energy Resources"] },
        { title: "Unit III: Environmental Pollution", topics: ["Air Pollution", "Water Pollution", "Soil Pollution", "Noise Pollution"] },
        { title: "Unit IV: Environmental Acts", topics: ["Water Act", "Air Act", "Environment Protection Act", "Wildlife Protection"] },
        { title: "Unit V: Global Issues", topics: ["Climate Change", "Ozone Depletion", "Acid Rain", "Sustainable Development"] },
      ]},
      { code: "23CS204PC", name: "Data Structures Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Programs", topics: ["Linked List Operations", "Stack Implementation", "Queue Implementation", "BST Operations", "Graph Traversal", "Sorting Programs"] },
      ]},
      { code: "23EE202PC", name: "BEEE Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Experiments", topics: ["DC Circuit Analysis", "AC Circuit Analysis", "Transformer Test", "Logic Gates", "Flip Flop Circuits"] },
      ]},
    ],
  },
  {
    sem: 3, year: 2, label: "SEM III",
    courses: [
      { code: "23MA301PC", name: "Discrete Mathematics", credits: 4, type: "Theory", units: [
        { title: "Unit I: Logic & Proofs", topics: ["Propositional Logic", "Predicate Logic", "Methods of Proof", "Mathematical Induction"] },
        { title: "Unit II: Set Theory & Relations", topics: ["Sets", "Venn Diagrams", "Relations", "Functions", "Equivalence Relations"] },
        { title: "Unit III: Algebraic Structures", topics: ["Groups", "Rings", "Fields", "Cosets", "Lagrange's Theorem"] },
        { title: "Unit IV: Graph Theory", topics: ["Graph Types", "Euler & Hamilton Paths", "Planar Graphs", "Graph Coloring", "Trees"] },
        { title: "Unit V: Combinatorics", topics: ["Permutations", "Combinations", "Pigeonhole Principle", "Recurrence Relations", "Generating Functions"] },
      ]},
      { code: "23CS301PC", name: "Computer Organization & Architecture", credits: 4, type: "Theory", units: [
        { title: "Unit I: Basic Computer", topics: ["Number Systems", "Instruction Formats", "Addressing Modes", "Register Transfer Language"] },
        { title: "Unit II: CPU Organization", topics: ["ALU Design", "Multiplier", "Divider", "Floating Point Operations", "Instruction Cycle"] },
        { title: "Unit III: Memory Organization", topics: ["Cache Memory", "Virtual Memory", "Memory Hierarchy", "Paging", "Segmentation"] },
        { title: "Unit IV: I/O Organization", topics: ["I/O Ports", "Interrupts", "DMA", "I/O Processors", "Serial Communication"] },
        { title: "Unit V: Parallel Processing", topics: ["Pipelining", "RISC vs CISC", "Multiprocessors", "Vector Processors", "Flynn's Taxonomy"] },
      ]},
      { code: "23CS302PC", name: "Software Engineering", credits: 4, type: "Theory", units: [
        { title: "Unit I: SDLC Models", topics: ["Waterfall", "Spiral", "Agile", "Scrum", "XP", "RAD"] },
        { title: "Unit II: Requirements Engineering", topics: ["SRS Document", "Use Cases", "User Stories", "Requirements Elicitation", "Validation"] },
        { title: "Unit III: Design", topics: ["Architectural Design", "UML Diagrams", "Design Patterns", "Component Design", "UI Design"] },
        { title: "Unit IV: Testing", topics: ["Unit Testing", "Integration Testing", "System Testing", "Black Box", "White Box", "TDD"] },
        { title: "Unit V: Project Management", topics: ["Cost Estimation", "COCOMO", "Risk Management", "Configuration Management", "DevOps"] },
      ]},
      { code: "23CS303PC", name: "Operating Systems", credits: 4, type: "Theory", units: [
        { title: "Unit I: OS Introduction", topics: ["OS Types", "System Calls", "OS Structure", "Virtualization Basics"] },
        { title: "Unit II: Process Management", topics: ["Process States", "PCB", "CPU Scheduling Algorithms", "Context Switching", "Threads"] },
        { title: "Unit III: Process Synchronization", topics: ["Critical Section", "Semaphores", "Mutex", "Deadlock", "Bankers Algorithm"] },
        { title: "Unit IV: Memory Management", topics: ["Paging", "Segmentation", "Virtual Memory", "Page Replacement", "Thrashing"] },
        { title: "Unit V: File Systems", topics: ["File Concepts", "Directory Structure", "File Allocation Methods", "Disk Scheduling", "RAID"] },
      ]},
      { code: "23CS304PC", name: "Database Management Systems", credits: 4, type: "Theory", units: [
        { title: "Unit I: Database Concepts", topics: ["DBMS vs File System", "ER Model", "ER Diagram", "Relational Model", "Relational Algebra"] },
        { title: "Unit II: SQL", topics: ["DDL Commands", "DML Commands", "Joins", "Subqueries", "Views", "Indexes"] },
        { title: "Unit III: Normalization", topics: ["Functional Dependencies", "1NF", "2NF", "3NF", "BCNF", "4NF", "5NF"] },
        { title: "Unit IV: Transactions", topics: ["ACID Properties", "Transaction States", "Concurrency Control", "Locking", "Timestamp Protocol"] },
        { title: "Unit V: Advanced Databases", topics: ["NoSQL", "MongoDB", "Big Data Basics", "Data Warehousing", "OLAP", "Mining Intro"] },
      ]},
      { code: "23BM301MC", name: "Business Economics & Financial Analysis", credits: 2, type: "Theory", units: [
        { title: "Unit I: Economics Basics", topics: ["Demand & Supply", "Elasticity", "Consumer Theory", "Production Theory"] },
        { title: "Unit II: Market Structures", topics: ["Perfect Competition", "Monopoly", "Oligopoly", "Pricing Strategies"] },
        { title: "Unit III: Financial Accounting", topics: ["Balance Sheet", "P&L Account", "Cash Flow", "Ratio Analysis"] },
        { title: "Unit IV: Cost Accounting", topics: ["Cost Types", "Break-Even Analysis", "Marginal Costing", "Standard Costing"] },
        { title: "Unit V: Financial Management", topics: ["Time Value of Money", "Capital Budgeting", "NPV", "IRR", "Payback Period"] },
      ]},
      { code: "23CS305PC", name: "DBMS Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Experiments", topics: ["DDL Commands", "DML Commands", "Joins", "Subqueries", "PL/SQL Procedures", "Triggers", "Cursors"] },
      ]},
      { code: "23CS306PC", name: "Operating Systems Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Programs", topics: ["Shell Scripts", "CPU Scheduling Simulation", "Page Replacement", "Disk Scheduling", "Semaphore Programs", "IPC"] },
      ]},
      { code: "23CS307PC", name: "Node JS/React JS/Django", credits: 2, type: "Lab", units: [
        { title: "Unit I: Node.js", topics: ["Node.js Basics", "Express Framework", "REST APIs", "Middleware", "Authentication"] },
        { title: "Unit II: React.js", topics: ["Components", "JSX", "State & Props", "Hooks", "React Router", "Context API"] },
        { title: "Unit III: Django", topics: ["Django Setup", "Models", "Views", "Templates", "Django REST Framework"] },
      ]},
    ],
  },
  {
    sem: 4, year: 2, label: "SEM IV",
    courses: [
      { code: "24DS401PC", name: "Discrete Mathematics", credits: 4, type: "Theory", units: [
        { title: "Unit I: Mathematical Logic", topics: ["Propositional Logic", "Logical Equivalences", "Predicates", "Quantifiers", "Proof Methods"] },
        { title: "Unit II: Sets, Relations & Functions", topics: ["Set Operations", "Binary Relations", "Partial Orders", "Lattices", "Functions & Pigeonhole"] },
        { title: "Unit III: Algebraic Structures", topics: ["Groups", "Subgroups", "Homomorphism", "Rings", "Fields"] },
        { title: "Unit IV: Trees & Graphs", topics: ["Trees", "Spanning Trees", "Directed Graphs", "Eulerian Graphs", "Hamiltonian Graphs", "Chromatic Numbers"] },
        { title: "Unit V: Combinatorics", topics: ["Counting", "Permutations & Combinations", "Recurrence Relations", "Inclusion-Exclusion", "Generating Functions"] },
      ]},
      { code: "324DS403PC", name: "Operating Systems", credits: 4, type: "Theory", units: [
        { title: "Unit I: Introduction", topics: ["OS Concepts", "OS Types", "System Calls", "OS Services", "System Boot"] },
        { title: "Unit II: Process Scheduling", topics: ["FCFS", "SJF", "Round Robin", "Priority Scheduling", "Multilevel Queue"] },
        { title: "Unit III: Deadlocks & Synchronization", topics: ["Deadlock Conditions", "Prevention", "Avoidance", "Detection", "Semaphores", "Monitors"] },
        { title: "Unit IV: Memory Management", topics: ["Swapping", "Paging", "Segmentation", "Virtual Memory", "Page Replacement Algorithms"] },
        { title: "Unit V: File & I/O Systems", topics: ["File Attributes", "Directory Structure", "Free Space Management", "Disk Scheduling", "RAID Levels"] },
      ]},
      { code: "324DS404PC", name: "Database Management Systems", credits: 4, type: "Theory", units: [
        { title: "Unit I: Introduction & ER Model", topics: ["Database Architecture", "Data Models", "ER Diagrams", "Extended ER", "Mapping to Relational"] },
        { title: "Unit II: Relational Model & SQL", topics: ["Relational Algebra", "SQL DDL", "SQL DML", "Aggregate Functions", "Joins", "Subqueries", "Views"] },
        { title: "Unit III: Normalization", topics: ["Functional Dependencies", "Armstrong's Axioms", "1NF–BCNF", "Lossless Join", "Dependency Preservation"] },
        { title: "Unit IV: Transactions & Concurrency", topics: ["ACID Properties", "Serializability", "Lock-Based Protocols", "Deadlock in DBMS", "Recovery Techniques"] },
        { title: "Unit V: NoSQL & Big Data", topics: ["NoSQL Types", "MongoDB CRUD", "CAP Theorem", "Data Warehousing", "OLAP", "Data Mining Intro"] },
      ]},
      { code: "324DS405PC", name: "Software Engineering", credits: 4, type: "Theory", units: [
        { title: "Unit I: Software Process Models", topics: ["Waterfall", "Prototype", "Incremental", "Spiral", "Agile", "Scrum", "Kanban"] },
        { title: "Unit II: Requirements Engineering", topics: ["Functional Requirements", "Non-Functional Requirements", "Use Case Diagrams", "SRS", "Feasibility Study"] },
        { title: "Unit III: Software Design", topics: ["Architectural Patterns", "MVC", "Design Principles", "UML Class Diagrams", "Sequence Diagrams", "Design Patterns"] },
        { title: "Unit IV: Testing Strategies", topics: ["Unit Testing", "Integration Testing", "System Testing", "UAT", "White Box", "Black Box", "Code Review"] },
        { title: "Unit V: Project Management & Quality", topics: ["Effort Estimation", "COCOMO II", "Risk Management", "ISO Standards", "CMM", "Configuration Management"] },
      ]},
      { code: "24SM402M", name: "Business Economics & Financial Analysis", credits: 2, type: "Theory", units: [
        { title: "Unit I: Business Economics", topics: ["Demand Analysis", "Supply Analysis", "Market Equilibrium", "Elasticity", "Consumer Surplus"] },
        { title: "Unit II: Production & Cost", topics: ["Production Function", "Cost Curves", "Returns to Scale", "Cost-Volume-Profit", "Break-Even Analysis"] },
        { title: "Unit III: Market Structures", topics: ["Perfect Competition", "Monopoly", "Monopolistic Competition", "Oligopoly", "Game Theory Intro"] },
        { title: "Unit IV: Financial Statements", topics: ["Balance Sheet", "Income Statement", "Cash Flow Statement", "Ratio Analysis", "DuPont Analysis"] },
        { title: "Unit V: Financial Planning", topics: ["Working Capital", "Capital Budgeting", "NPV", "IRR", "Risk & Return", "WACC"] },
      ]},
      { code: "S24*MC410", name: "Constitution of India", credits: 2, type: "Theory", units: [
        { title: "Unit I: Historical Foundations", topics: ["Historical Context of Constitution Making", "The Drafting Committee and Its Role", "Constituent Assembly Debates"] },
        { title: "Unit II: Philosophical Pillars", topics: ["The Preamble: Philosophy and Objectives", "Salient Features of the Indian Constitution", "Comparison with World Constitutions"] },
        { title: "Unit III: Fundamental Rights", topics: ["Right to Equality", "Right to Freedom", "Right Against Exploitation", "Cultural & Educational Rights", "Right to Constitutional Remedies"] },
        { title: "Unit IV: Government Structure", topics: ["Parliament", "President", "Vice-President", "Cabinet", "Supreme Court", "High Courts"] },
        { title: "Unit V: Federalism & Amendments", topics: ["Centre-State Relations", "Emergency Provisions", "Amendment Procedure", "Major Amendments", "Judicial Review"] },
      ]},
      { code: "324DS407PC", name: "Database Management Systems Lab", credits: 1, type: "Lab", units: [
        { title: "Unit I: Database Design Fundamentals", topics: ["Concept Design with E-R Model", "Relational Model", "Normalization"] },
        { title: "Unit II: SQL Basics", topics: ["Practicing DDL commands", "Practicing DML commands", "Joins & Subqueries"] },
        { title: "Unit III: PL/SQL", topics: ["PL/SQL Procedures", "Functions", "Triggers", "Cursors", "Exception Handling"] },
      ]},
      { code: "324DS406PC", name: "Operating Systems Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Programs", topics: ["Shell Scripting", "FCFS & SJF Scheduling", "Round Robin Scheduling", "FIFO Page Replacement", "LRU Page Replacement", "Disk Scheduling"] },
      ]},
      { code: "324DS409PC", name: "Node JS/React JS Django", credits: 2, type: "Lab", units: [
        { title: "Module I: Node.js", topics: ["Node.js Fundamentals", "Express.js Framework", "RESTful APIs", "JWT Authentication", "Database Integration"] },
        { title: "Module II: React.js", topics: ["React Components", "JSX Syntax", "useState & useEffect", "React Router", "Redux Toolkit", "Axios"] },
        { title: "Module III: Django", topics: ["Django Project Setup", "Models & ORM", "Class-Based Views", "Django REST Framework", "Deployment"] },
      ]},
    ],
  },
  {
    sem: 5, year: 3, label: "SEM V",
    courses: [
      { code: "23CS501PC", name: "Formal Languages & Automata Theory", credits: 4, type: "Theory", units: [
        { title: "Unit I: Finite Automata", topics: ["DFA", "NFA", "NFA to DFA", "Regular Expressions", "Equivalence of FA & RE"] },
        { title: "Unit II: Regular Languages", topics: ["Pumping Lemma for RL", "Closure Properties", "Decision Problems", "Myhill-Nerode Theorem"] },
        { title: "Unit III: Context Free Grammars", topics: ["CFG Definitions", "Derivation Trees", "Ambiguity", "Chomsky Normal Form", "Greibach Normal Form"] },
        { title: "Unit IV: Pushdown Automata", topics: ["PDA Definitions", "PDA Moves", "NPDA", "Equivalence of CFG & PDA", "Pumping Lemma for CFL"] },
        { title: "Unit V: Turing Machines", topics: ["TM Basics", "TM Variants", "Church-Turing Thesis", "Decidability", "Halting Problem", "Complexity P vs NP"] },
      ]},
      { code: "23CS502PC", name: "Computer Networks", credits: 4, type: "Theory", units: [
        { title: "Unit I: Introduction", topics: ["Network Types", "OSI Model", "TCP/IP Model", "Transmission Media", "Network Devices"] },
        { title: "Unit II: Data Link Layer", topics: ["Framing", "Error Detection", "CRC", "Flow Control", "ARQ Protocols", "MAC Protocols"] },
        { title: "Unit III: Network Layer", topics: ["IP Addressing", "Subnetting", "CIDR", "Routing Algorithms", "OSPF", "BGP", "IPv6"] },
        { title: "Unit IV: Transport Layer", topics: ["TCP vs UDP", "TCP 3-Way Handshake", "TCP Congestion Control", "Socket Programming"] },
        { title: "Unit V: Application Layer", topics: ["DNS", "HTTP/HTTPS", "SMTP", "FTP", "DHCP", "Network Security Basics"] },
      ]},
      { code: "23CS503PC", name: "Artificial Intelligence", credits: 4, type: "Theory", units: [
        { title: "Unit I: AI Foundations", topics: ["AI History", "Intelligent Agents", "Environments", "PEAS Description", "Rationality"] },
        { title: "Unit II: Search Algorithms", topics: ["BFS", "DFS", "Uniform Cost Search", "A* Algorithm", "Heuristics", "Adversarial Search", "Minimax", "Alpha-Beta Pruning"] },
        { title: "Unit III: Knowledge Representation", topics: ["Propositional Logic", "First Order Logic", "Inference", "Resolution", "Unification"] },
        { title: "Unit IV: Machine Learning Intro", topics: ["Learning Types", "Decision Trees", "Naive Bayes", "KNN", "Linear Regression"] },
        { title: "Unit V: Natural Language Processing", topics: ["NLP Pipeline", "Tokenization", "POS Tagging", "NER", "Sentiment Analysis", "Language Models"] },
      ]},
      { code: "23CS504PC", name: "Design & Analysis of Algorithms", credits: 4, type: "Theory", units: [
        { title: "Unit I: Algorithm Analysis", topics: ["Asymptotic Notations", "Recurrences", "Master Theorem", "Amortized Analysis"] },
        { title: "Unit II: Divide & Conquer", topics: ["Merge Sort", "Quick Sort", "Strassen's Matrix Multiply", "Closest Pair", "FFT"] },
        { title: "Unit III: Greedy & DP", topics: ["Activity Selection", "Huffman Coding", "DP vs Greedy", "0/1 Knapsack", "LCS", "Matrix Chain Multiplication"] },
        { title: "Unit IV: Graph Algorithms", topics: ["Kruskal's", "Prim's", "Dijkstra's", "Bellman Ford", "Floyd Warshall", "Topological Sort"] },
        { title: "Unit V: NP-Completeness", topics: ["P & NP", "NP-Hard", "NP-Complete", "Reductions", "SAT", "Clique", "Vertex Cover", "Approximation Algorithms"] },
      ]},
      { code: "23CS505PE", name: "Open Elective - I (Machine Learning)", credits: 3, type: "Elective", units: [
        { title: "Unit I: ML Foundations", topics: ["Supervised Learning", "Unsupervised Learning", "Training vs Test Split", "Overfitting", "Underfitting"] },
        { title: "Unit II: Regression", topics: ["Linear Regression", "Polynomial Regression", "Ridge & Lasso", "Logistic Regression", "Evaluation Metrics"] },
        { title: "Unit III: Classification", topics: ["KNN", "SVM", "Decision Trees", "Random Forests", "Gradient Boosting", "XGBoost"] },
        { title: "Unit IV: Unsupervised Learning", topics: ["K-Means Clustering", "Hierarchical Clustering", "DBSCAN", "PCA", "Autoencoders"] },
        { title: "Unit V: Neural Networks", topics: ["Perceptron", "Multi-Layer Perceptron", "Backpropagation", "Activation Functions", "Deep Learning Intro"] },
      ]},
      { code: "23CS506PC", name: "Computer Networks Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Programs", topics: ["Socket Programming TCP", "Socket Programming UDP", "DNS Resolution", "HTTP Client", "FTP Client", "Network Scanning", "Packet Analysis with Wireshark"] },
      ]},
      { code: "23CS507PC", name: "AI Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Programs", topics: ["BFS & DFS Implementation", "A* Algorithm", "Minimax with Alpha-Beta", "Decision Tree", "Naive Bayes Classifier", "NLP with NLTK"] },
      ]},
    ],
  },
  {
    sem: 6, year: 3, label: "SEM VI",
    courses: [
      { code: "23CS601PC", name: "Compiler Design", credits: 4, type: "Theory", units: [
        { title: "Unit I: Introduction", topics: ["Compiler Phases", "Lexical Analysis", "Regular Expressions", "Finite Automata", "LEX Tool"] },
        { title: "Unit II: Syntax Analysis", topics: ["CFG", "Top-Down Parsing", "LL(1) Parsers", "Bottom-Up Parsing", "LR Parsers", "YACC Tool"] },
        { title: "Unit III: Semantic Analysis", topics: ["Attribute Grammars", "Syntax Directed Definitions", "Type Checking", "Symbol Tables"] },
        { title: "Unit IV: Intermediate Code Generation", topics: ["Three-Address Code", "Quadruples", "Triples", "Boolean Expressions", "Backpatching"] },
        { title: "Unit V: Code Generation & Optimization", topics: ["Code Optimization Techniques", "DAG", "Register Allocation", "Peephole Optimization", "Code Generation"] },
      ]},
      { code: "23CS602PC", name: "Machine Learning", credits: 4, type: "Theory", units: [
        { title: "Unit I: Foundations", topics: ["Statistical Learning", "Bias-Variance Tradeoff", "Cross Validation", "Feature Engineering", "Feature Selection"] },
        { title: "Unit II: Supervised Learning", topics: ["Ridge Regression", "SVM with Kernels", "Ensemble Methods", "Boosting", "Bagging", "Stacking"] },
        { title: "Unit III: Deep Learning", topics: ["Deep Neural Networks", "CNNs", "RNNs", "LSTM", "Transformer Basics", "Transfer Learning"] },
        { title: "Unit IV: Unsupervised & Semi-Supervised", topics: ["EM Algorithm", "Gaussian Mixture Models", "Dimensionality Reduction", "t-SNE", "Anomaly Detection"] },
        { title: "Unit V: ML Applications", topics: ["Computer Vision Basics", "NLP with Deep Learning", "Recommendation Systems", "Reinforcement Learning Intro", "MLOps"] },
      ]},
      { code: "23CS603PC", name: "Cloud Computing", credits: 4, type: "Theory", units: [
        { title: "Unit I: Cloud Fundamentals", topics: ["Cloud Models IaaS PaaS SaaS", "Deployment Models", "Virtualization", "Hypervisors", "Containerization"] },
        { title: "Unit II: Cloud Architecture", topics: ["Scalability", "Load Balancing", "Auto Scaling", "Microservices", "Serverless Computing", "API Gateway"] },
        { title: "Unit III: AWS & Azure", topics: ["EC2", "S3", "RDS", "Lambda", "Azure VMs", "Azure Blob", "Google Cloud Basics"] },
        { title: "Unit IV: Cloud Security", topics: ["IAM", "Encryption", "VPN", "Firewalls", "Compliance", "Zero Trust Security"] },
        { title: "Unit V: DevOps & CI/CD", topics: ["Docker", "Kubernetes", "Jenkins", "GitLab CI", "Infrastructure as Code", "Terraform"] },
      ]},
      { code: "23CS604HS", name: "Professional Ethics & Human Values", credits: 2, type: "Theory", units: [
        { title: "Unit I: Ethics Foundations", topics: ["Engineering Ethics", "Moral Reasoning", "Ethical Theories", "Code of Ethics"] },
        { title: "Unit II: Engineering Ethics Issues", topics: ["Safety & Risk", "Intellectual Property", "Privacy", "Whistleblowing", "Sustainability"] },
        { title: "Unit III: Human Values", topics: ["Value Education", "Self-Development", "Leadership", "Work-Life Balance"] },
        { title: "Unit IV: Social Responsibility", topics: ["Corporate Social Responsibility", "Environmental Responsibility", "Diversity & Inclusion"] },
        { title: "Unit V: Cyber Ethics", topics: ["Cybercrime", "Cybersecurity Ethics", "AI Ethics", "Responsible Innovation"] },
      ]},
      { code: "23CS605PE", name: "Elective II (Full Stack Development)", credits: 3, type: "Elective", units: [
        { title: "Unit I: Frontend", topics: ["HTML5", "CSS3", "JavaScript ES6+", "React.js Advanced", "State Management"] },
        { title: "Unit II: Backend", topics: ["Node.js Advanced", "REST vs GraphQL", "Authentication", "Microservices", "Message Queues"] },
        { title: "Unit III: Database", topics: ["SQL Advanced", "MongoDB", "Redis", "Database Optimization", "ORM Frameworks"] },
        { title: "Unit IV: DevOps", topics: ["Docker", "CI/CD Pipelines", "Cloud Deployment", "Monitoring", "Logging"] },
        { title: "Unit V: Project", topics: ["Capstone Project", "System Design", "Code Review", "Documentation", "Deployment"] },
      ]},
      { code: "23CS606PC", name: "Machine Learning Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Programs", topics: ["Linear Regression", "Logistic Regression", "KNN", "SVM", "Random Forest", "K-Means", "CNN with TensorFlow", "LSTM Sentiment Analysis"] },
      ]},
      { code: "23CS607PC", name: "Cloud Computing Lab", credits: 1, type: "Lab", units: [
        { title: "Lab Programs", topics: ["AWS EC2 Setup", "S3 Bucket Operations", "Lambda Functions", "Docker Containerization", "Kubernetes Deployment", "CI/CD Pipeline Setup"] },
      ]},
      { code: "23CS608PC", name: "Mini Project", credits: 2, type: "Project", units: [
        { title: "Project Guidelines", topics: ["Problem Statement", "Literature Survey", "System Design", "Implementation", "Testing", "Documentation", "Presentation"] },
      ]},
    ],
  },
  {
    sem: 7, year: 4, label: "SEM VII",
    courses: [
      { code: "23CS701PC", name: "Deep Learning", credits: 4, type: "Theory", units: [
        { title: "Unit I: Neural Network Foundations", topics: ["Perceptrons", "Multi-Layer Perceptrons", "Backpropagation", "Optimizers", "Regularization"] },
        { title: "Unit II: CNNs", topics: ["Convolution Operation", "Pooling", "Famous Architectures (VGG, ResNet, Inception)", "Object Detection", "Image Segmentation"] },
        { title: "Unit III: RNNs & LSTMs", topics: ["Vanilla RNN", "Vanishing Gradient", "LSTM", "GRU", "Seq2Seq", "Attention Mechanism"] },
        { title: "Unit IV: Transformers & LLMs", topics: ["Self-Attention", "BERT", "GPT Architecture", "Fine-Tuning", "Prompt Engineering", "RAG Basics"] },
        { title: "Unit V: Generative Models", topics: ["Autoencoders", "VAE", "GANs", "Diffusion Models", "Applications in Text & Image Generation"] },
      ]},
      { code: "23CS702PC", name: "Big Data Analytics", credits: 4, type: "Theory", units: [
        { title: "Unit I: Big Data Fundamentals", topics: ["5Vs of Big Data", "Hadoop Ecosystem", "HDFS", "MapReduce", "YARN"] },
        { title: "Unit II: Apache Spark", topics: ["RDDs", "DataFrames", "Spark SQL", "Spark Streaming", "MLlib"] },
        { title: "Unit III: NoSQL Databases", topics: ["MongoDB", "Cassandra", "HBase", "Redis", "Neo4j", "CAP Theorem"] },
        { title: "Unit IV: Data Visualization", topics: ["Tableau", "Power BI", "D3.js", "Matplotlib", "Seaborn", "Dashboard Design"] },
        { title: "Unit V: Real-Time Analytics", topics: ["Apache Kafka", "Storm", "Flink", "Lambda Architecture", "Use Cases"] },
      ]},
      { code: "23CS703PC", name: "Information Security", credits: 4, type: "Theory", units: [
        { title: "Unit I: Cryptography Basics", topics: ["Symmetric Encryption", "DES", "AES", "Public Key Cryptography", "RSA", "ECC"] },
        { title: "Unit II: Network Security", topics: ["SSL/TLS", "HTTPS", "Firewalls", "IDS/IPS", "VPN", "Network Attacks"] },
        { title: "Unit III: Application Security", topics: ["OWASP Top 10", "SQL Injection", "XSS", "CSRF", "Buffer Overflow", "Secure Coding"] },
        { title: "Unit IV: Digital Forensics", topics: ["Incident Response", "Log Analysis", "Malware Analysis", "Forensic Tools", "Chain of Custody"] },
        { title: "Unit V: Security Standards", topics: ["ISO 27001", "GDPR", "PCI DSS", "SOC 2", "Risk Assessment", "Security Policies"] },
      ]},
      { code: "23CS704PE", name: "Elective III (Blockchain Technology)", credits: 3, type: "Elective", units: [
        { title: "Unit I: Blockchain Basics", topics: ["Distributed Ledger", "Consensus Mechanisms", "Proof of Work", "Proof of Stake", "Bitcoin"] },
        { title: "Unit II: Ethereum & Smart Contracts", topics: ["Ethereum Architecture", "Solidity", "Smart Contract Development", "EVM", "Gas"] },
        { title: "Unit III: DeFi & NFTs", topics: ["Decentralized Finance", "DEX", "NFTs", "ERC Standards", "IPFS", "Web3.js"] },
        { title: "Unit IV: Enterprise Blockchain", topics: ["Hyperledger Fabric", "Permissioned Blockchains", "Supply Chain Use Cases", "Healthcare"] },
        { title: "Unit V: Blockchain Security", topics: ["51% Attack", "Smart Contract Auditing", "Privacy in Blockchain", "Zero Knowledge Proofs"] },
      ]},
      { code: "23CS705PE", name: "Elective IV (Internet of Things)", credits: 3, type: "Elective", units: [
        { title: "Unit I: IoT Fundamentals", topics: ["IoT Architecture", "Sensors & Actuators", "Communication Protocols", "MQTT", "CoAP"] },
        { title: "Unit II: IoT Hardware", topics: ["Raspberry Pi", "Arduino", "ESP32", "GPIO", "Interfacing Sensors", "Embedded C"] },
        { title: "Unit III: IoT Cloud Platforms", topics: ["AWS IoT", "Azure IoT Hub", "Google Cloud IoT", "ThingSpeak", "Blynk"] },
        { title: "Unit IV: AI + IoT (AIoT)", topics: ["Edge Computing", "TinyML", "Federated Learning", "Real-Time Processing", "AIoT Applications"] },
        { title: "Unit V: IoT Security & Applications", topics: ["IoT Security Challenges", "Smart Home", "Industrial IoT", "Smart City", "Healthcare IoT"] },
      ]},
      { code: "23CS706PC", name: "Major Project Phase I", credits: 2, type: "Project", units: [
        { title: "Phase I Deliverables", topics: ["Problem Statement Definition", "Literature Survey", "Requirement Analysis", "System Design", "Technology Selection", "Prototype Development", "Phase I Presentation"] },
      ]},
    ],
  },
  {
    sem: 8, year: 4, label: "SEM VIII",
    courses: [
      { code: "23CS801PC", name: "Major Project Phase II", credits: 10, type: "Project", units: [
        { title: "Phase II Deliverables", topics: ["Full Implementation", "Testing & Validation", "Performance Evaluation", "Documentation", "Research Paper (Optional)", "Final Demonstration", "Viva Voce"] },
      ]},
      { code: "23CS802PC", name: "Industry Internship", credits: 6, type: "Project", units: [
        { title: "Internship Components", topics: ["Company Placement", "Weekly Progress Reports", "Mentor Evaluation", "Technical Skills", "Soft Skills", "Final Internship Report", "Presentation"] },
      ]},
      { code: "23CS803PE", name: "Elective V (Advanced Topics in AI)", credits: 4, type: "Elective", units: [
        { title: "Unit I: Advanced ML", topics: ["Bayesian Deep Learning", "Meta Learning", "Few-Shot Learning", "Self-Supervised Learning", "Foundation Models"] },
        { title: "Unit II: Computer Vision Advanced", topics: ["Object Tracking", "3D Vision", "Medical Image Analysis", "Video Understanding", "Autonomous Vehicles"] },
        { title: "Unit III: NLP Advanced", topics: ["Large Language Models", "Fine-Tuning Strategies", "Multimodal AI", "Dialogue Systems", "Machine Translation"] },
        { title: "Unit IV: Reinforcement Learning", topics: ["Q-Learning", "Deep Q-Networks", "Policy Gradient", "PPO", "AlphaGo Architecture"] },
        { title: "Unit V: AI Ethics & Safety", topics: ["Bias in AI", "Explainable AI", "Fairness", "AI Regulation", "Responsible AI", "AI Safety Research"] },
      ]},
      { code: "23CS804MC", name: "Entrepreneurship & Start-Up Management", credits: 2, type: "Theory", units: [
        { title: "Unit I: Entrepreneurship Basics", topics: ["Entrepreneurial Mindset", "Ideation", "Opportunity Recognition", "Lean Startup", "MVP"] },
        { title: "Unit II: Business Planning", topics: ["Business Model Canvas", "Market Research", "Competitive Analysis", "Go-to-Market Strategy"] },
        { title: "Unit III: Funding & Finance", topics: ["Bootstrapping", "Angel Investment", "Venture Capital", "Startup Valuation", "Term Sheets"] },
        { title: "Unit IV: Legal & IP", topics: ["Company Registration", "Intellectual Property", "Patents", "Trademarks", "DPIIT Recognition"] },
        { title: "Unit V: Scaling & Exit", topics: ["Growth Hacking", "Product-Market Fit", "Scaling Operations", "Mergers & Acquisitions", "IPO Basics"] },
      ]},
    ],
  },
];
