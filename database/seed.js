require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Project = require('./models/Project');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_db';

const initialProfile = {
  name: "Alex Morgan",
  role: "Full-stack Developer",
  subtitle: "Full-stack Developer | Problem Solver | Lifelong Learner",
  headline: "I build practical, responsive web experiences.",
  intro: "I'm a developer focused on building modern web applications using JavaScript, Node.js, Express.js, and MongoDB.",
  bioParagraph1: "I'm a developer passionate about building modern web applications and creating practical digital experiences. I enjoy turning ideas into functional, responsive interfaces and developing reliable backend systems.",
  bioParagraph2: "My work focuses on clean user interfaces, maintainable code, API integration, and database-driven applications.",
  portraitUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  email: "alex.morgan@example.com",
  location: "San Francisco, CA",
  focus: "Web Applications, API Development",
  availability: "Open to professional inquiries",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:alex.morgan@example.com"
  }
};

const initialSkills = [
  // Frontend
  { name: "HTML", category: "Frontend", icon: "html", proficiency: 95, order: 1, isPreview: true },
  { name: "CSS", category: "Frontend", icon: "css", proficiency: 90, order: 2, isPreview: true },
  { name: "JavaScript", category: "Frontend", icon: "javascript", proficiency: 92, order: 3, isPreview: true },
  { name: "React", category: "Frontend", icon: "react", proficiency: 88, order: 4, isPreview: false },
  { name: "Tailwind CSS", category: "Frontend", icon: "tailwind", proficiency: 85, order: 5, isPreview: false },

  // Backend
  { name: "Node.js", category: "Backend", icon: "nodejs", proficiency: 90, order: 6, isPreview: true },
  { name: "Express.js", category: "Backend", icon: "express", proficiency: 88, order: 7, isPreview: true },
  { name: "Python", category: "Backend", icon: "python", proficiency: 80, order: 8, isPreview: false },
  { name: "REST APIs", category: "Backend", icon: "api", proficiency: 92, order: 9, isPreview: false },

  // Database
  { name: "MongoDB", category: "Database", icon: "mongodb", proficiency: 88, order: 10, isPreview: true },
  { name: "MySQL", category: "Database", icon: "mysql", proficiency: 82, order: 11, isPreview: false },
  { name: "PostgreSQL", category: "Database", icon: "postgresql", proficiency: 80, order: 12, isPreview: false },
  { name: "SQLite", category: "Database", icon: "sqlite", proficiency: 84, order: 13, isPreview: false },

  // Tools
  { name: "Git", category: "Tools", icon: "git", proficiency: 90, order: 14, isPreview: true },
  { name: "GitHub", category: "Tools", icon: "github", proficiency: 90, order: 15, isPreview: true },
  { name: "VS Code", category: "Tools", icon: "vscode", proficiency: 95, order: 16, isPreview: false },
  { name: "Docker", category: "Tools", icon: "docker", proficiency: 75, order: 17, isPreview: false },
  { name: "Postman", category: "Tools", icon: "postman", proficiency: 88, order: 18, isPreview: false },

  // Additional
  { name: "npm", category: "Additional", icon: "npm", proficiency: 90, order: 19, isPreview: false },
  { name: "Webpack", category: "Additional", icon: "webpack", proficiency: 78, order: 20, isPreview: false },
  { name: "Linux", category: "Additional", icon: "linux", proficiency: 82, order: 21, isPreview: false },
  { name: "Agile", category: "Additional", icon: "agile", proficiency: 85, order: 22, isPreview: false }
];

const initialProjects = [
  {
    title: "NovaShoppingCart",
    category: "Full-Stack",
    description: "A responsive e-commerce web application with product listings, shopping cart, checkout, and order management.",
    thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "https://example.com/demo/novashoppingcart",
    sourceUrl: "https://github.com/example/novashoppingcart",
    featured: true,
    order: 1
  },
  {
    title: "MiniSocial",
    category: "Full-Stack",
    description: "A social media web application featuring user profiles, posts, comments, likes, follows, and multilingual chat.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    technologies: ["HTML", "CSS", "JavaScript", "Django", "SQLite"],
    liveUrl: "https://example.com/demo/minisocial",
    sourceUrl: "https://github.com/example/minisocial",
    featured: true,
    order: 2
  },
  {
    title: "TaskFlow",
    category: "Full-Stack",
    description: "A task management application designed to organize tasks, track progress, and support an efficient workflow.",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    technologies: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://example.com/demo/taskflow",
    sourceUrl: "https://github.com/example/taskflow",
    featured: true,
    order: 3
  },
  {
    title: "Weather Dashboard",
    category: "Frontend",
    description: "Real-time weather details with location search, animated maps, and multi-day forecasts.",
    thumbnail: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80",
    technologies: ["HTML", "CSS", "JavaScript", "REST APIs"],
    liveUrl: "https://example.com/demo/weather",
    sourceUrl: "https://github.com/example/weather",
    featured: false,
    order: 4
  },
  {
    title: "Auth Microservice",
    category: "Backend",
    description: "Scalable authentication and authorization service with JWT, OAuth2 integration, and rate limiting.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    technologies: ["Node.js", "Express.js", "MongoDB", "Docker"],
    liveUrl: null,
    sourceUrl: "https://github.com/example/auth-service",
    featured: false,
    order: 5
  },
  {
    title: "DataSync Engine",
    category: "Backend",
    description: "High-throughput asynchronous ETL pipeline for aggregating and caching streaming metrics.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "SQLite", "PostgreSQL", "Docker"],
    liveUrl: null,
    sourceUrl: "https://github.com/example/datasync",
    featured: false,
    order: 6
  }
];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection established.');

    // Clear existing collections
    console.log('Clearing existing Profile, Skill, and Project documents...');
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});

    // Seed Profile
    const profileDoc = await Profile.create(initialProfile);
    console.log(`Inserted Profile document: ${profileDoc.name} (${profileDoc.role})`);

    // Seed Skills
    const skillDocs = await Skill.insertMany(initialSkills);
    console.log(`Inserted ${skillDocs.length} skills across categories.`);

    // Seed Projects
    const projectDocs = await Project.insertMany(initialProjects);
    console.log(`Inserted ${projectDocs.length} projects.`);

    console.log('\n[SUCCESS] MongoDB Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n[ERROR] Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
