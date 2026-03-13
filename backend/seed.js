const db = require('./config/db');

async function seed() {
  console.log('Seeding an expanded course library...');

  // Clean existing data
  await db.query('DELETE FROM progress');
  await db.query('DELETE FROM enrollments');
  await db.query('DELETE FROM lessons');
  await db.query('DELETE FROM sections');
  await db.query('DELETE FROM courses');
  await db.query('DELETE FROM users WHERE email = "instructor@lmsplatform.com"');

  // Create an instructor
  const instructorResult = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    ['LMS Platform Instructor', 'instructor@lmsplatform.com', 'password123', 'instructor']
  );
  const instructorId = instructorResult.rows.insertId;

  const demoCourses = [
    {
      title: 'Full Stack Web Development 2024',
      description: 'Master HTML, CSS, JavaScript, React, and Node.js. Build real-world projects and deploy them to the cloud.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
      category: 'Development',
      price: 99.99,
      instructor_id: instructorId,
      lessons: [
        { title: 'Modern Web Architecture', url: 'https://www.youtube.com/watch?v=erEgovG9WkY', duration: '25m' },
        { title: 'Advanced React Patterns', url: 'https://www.youtube.com/watch?v=76Nis-gD67M', duration: '45m' },
        { title: 'Node.js Performance Scaling', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', duration: '40m' }
      ]
    },
    {
      title: 'AI & Machine Learning for Beginners',
      description: 'Understand the world of AI. Learn about neural networks, deep learning, and how to build your own AI models.',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      category: 'Data Science',
      price: 149.99,
      instructor_id: instructorId,
      lessons: [
        { title: 'What is AI?', url: 'https://www.youtube.com/watch?v=2ePf9rue1Ao', duration: '20m' },
        { title: 'Introduction to Neural Networks', url: 'https://www.youtube.com/watch?v=aircAruvnKk', duration: '35m' },
        { title: 'Natural Language Processing basics', url: 'https://www.youtube.com/watch?v=fNxaJsNG3-s', duration: '50m' }
      ]
    },
    {
      title: 'Docker in 2 hours',
      description: 'Learn everything you need to know about Docker in just 2 hours. Containers, images, networks and more.',
      thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b193ef5?auto=format&fit=crop&q=80&w=800',
      category: 'DevOps',
      price: 19.99,
      instructor_id: instructorId,
      lessons: [
        { title: 'What is Docker?', url: 'https://www.youtube.com/watch?v=pg19Z8LL06w', duration: '15m' },
        { title: 'Installing Docker', url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI', duration: '10m' },
        { title: 'Docker Architecture', url: 'https://www.youtube.com/watch?v=Gjnup-PuquQ', duration: '20m' }
      ]
    },
    {
      title: 'SQL in 4 hours FULL COURSE',
      description: 'Master SQL for data analysis and database management in this comprehensive 4-hour course.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
      category: 'Data Science',
      price: 49.99,
      instructor_id: instructorId,
      lessons: [
        { title: 'Introduction to Databases', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: '30m' },
        { title: 'Retrieving Data', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', duration: '45m' },
        { title: 'Joining Tables', url: 'https://www.youtube.com/watch?v=H6809XW-4Lg', duration: '40m' }
      ]
    },
    {
      title: 'UI/UX Design Masterclass 2024',
      description: 'Create stunning user interfaces and amazing user experiences. Learn Figma from scratch to high-fidelity prototypes.',
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
      category: 'Design',
      price: 79.99,
      instructor_id: instructorId,
      lessons: [
        { title: 'Design Principles', url: 'https://www.youtube.com/watch?v=3Wn1_H9E_I4', duration: '30m' },
        { title: 'Figma for Beginners', url: 'https://www.youtube.com/watch?v=jk1T4nSsyS8', duration: '55m' },
        { title: 'Interactive Prototyping', url: 'https://www.youtube.com/watch?v=fS3I6_1mN_g', duration: '45m' }
      ]
    },
    {
      title: 'Mobile App Development with Flutter',
      description: 'Build beautiful native apps for iOS and Android with a single codebase. Learn Dart and Flutter 3.',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
      category: 'Development',
      price: 89.99,
      instructor_id: instructorId,
      lessons: [
        { title: 'Flutter Introduction', url: 'https://www.youtube.com/watch?v=PnBQvT9oK-Y', duration: '20m' },
        { title: 'Stateless vs Stateful Widgets', url: 'https://www.youtube.com/watch?v=uKAsXf-m6x0', duration: '40m' },
        { title: 'Firebase Integration', url: 'https://www.youtube.com/watch?v=G6R-Y67-54U', duration: '60m' }
      ]
    },
    {
        title: 'Cybersecurity Fundamentals',
        description: 'Learn the essentials of cybersecurity. Protect networks, systems, and data from digital attacks.',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
        category: 'IT & Software',
        price: 59.99,
        instructor_id: instructorId,
        lessons: [
          { title: 'The OSI Model', url: 'https://www.youtube.com/watch?v=vv4y_uOneC0', duration: '25m' },
          { title: 'Common Cyber Threats', url: 'https://www.youtube.com/watch?v=SD7O0_D8j6g', duration: '35m' },
          { title: 'Ethical Hacking basics', url: 'https://www.youtube.com/watch?v=fNzpcB7ODxQ', duration: '50m' }
        ]
      },
      {
        title: 'Marketing Strategy 101',
        description: 'Learn the fundamentals of marketing and how to build a winning marketing strategy for your business.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        category: 'Business',
        price: 39.99,
        instructor_id: instructorId,
        lessons: [
          { title: 'Marketing Basics', url: 'https://www.youtube.com/watch?v=Zjg6H7B2M4k', duration: '25m' },
          { title: 'Target Audience Research', url: 'https://www.youtube.com/watch?v=E-F0o943p74', duration: '35m' },
          { title: 'Building a Brand', url: 'https://www.youtube.com/watch?v=fNzpcB7ODxQ', duration: '50m' }
        ]
      }
  ];

  for (const courseData of demoCourses) {
    const courseResult = await db.query(
      'INSERT INTO courses (title, description, thumbnail, category, price, instructor_id) VALUES (?, ?, ?, ?, ?, ?)',
      [courseData.title, courseData.description, courseData.thumbnail, courseData.category, courseData.price, courseData.instructor_id]
    );
    const courseId = courseResult.rows.insertId;

    const sectionResult = await db.query(
      'INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)',
      [courseId, 'Curriculum', 1]
    );
    const sectionId = sectionResult.rows.insertId;

    for (let i = 0; i < courseData.lessons.length; i++) {
      const lesson = courseData.lessons[i];
      await db.query(
        'INSERT INTO lessons (section_id, title, order_number, youtube_url, duration) VALUES (?, ?, ?, ?, ?)',
        [sectionId, lesson.title, i + 1, lesson.url, lesson.duration]
      );
    }
  }

  console.log('Expanded seeding complete with 8 professional courses!');
}

seed().catch(err => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
