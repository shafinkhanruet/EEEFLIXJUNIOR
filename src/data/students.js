// Mock student data for EEEFlix
// Using the provided roll numbers and names

// Use local avatar images
const getAvatarImage = (index) => {
  try {
    // Assign avatar images serially from 1 to 60
    if (index >= 0 && index < 60) {
      const avatarNumber = index + 1;
      console.log(`Loading avatar: avatar-${avatarNumber}.jpg for student index ${index}`);
      
      // Use a direct path relative to the public directory
      const imagePath = `/assets/images/avatar/avatar-${avatarNumber}.jpg`;
      
      // Return the path without timestamp to allow proper caching
      return imagePath;
    } else {
      // Default avatar path
      return `/assets/images/avatar/avatar-1.jpg`;
    }
  } catch (error) {
    console.error('Error generating avatar path:', error);
    // Return first avatar as default
    return `/assets/images/avatar/avatar-1.jpg`;
  }
};

// Generate contact information
const generateContactInfo = (id, name = "") => {
  // Format the name for use in URLs and IDs (convert to lowercase, remove spaces)
  const formattedName = name.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
  
  // Generate a realistic Bangladesh mobile number
  // Bangladesh mobile numbers typically start with: 013, 014, 015, 016, 017, 018, 019
  const operators = ['013', '014', '015', '016', '017', '018', '019'];
  const randomOperator = operators[Math.floor(Math.random() * operators.length)];
  const lastEightDigits = id.slice(-5) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const phoneNumber = `+880 ${randomOperator}-${lastEightDigits.substring(0, 4)}-${lastEightDigits.substring(4)}`;
  
  // Generate a Facebook profile using the student name or ID
  let facebookProfile;
  if (formattedName && formattedName.length > 3) {
    // Use the student's name for Facebook profile if available
    const randomSuffix = Math.floor(Math.random() * 100);
    facebookProfile = `https://facebook.com/${formattedName}${randomSuffix}`;
  } else {
    // Fallback to ID-based profile
    facebookProfile = `https://facebook.com/eeeruet${id.slice(-4)}`;
  }
  
  // Generate an email address
  const email = formattedName 
    ? `${formattedName}${Math.floor(Math.random() * 100)}@eeeflix.edu` 
    : `student${id}@eeeflix.edu`;
  
  return {
    phone: phoneNumber,
    facebook: facebookProfile,
    email: email
  };
};

// Create student data from the provided list
const createStudentData = () => {
  // Ensure we create exactly 60 students with serial avatar assignments
  const studentNames = [
    "MD. ASADULLAH",
    "MD. SIFAT ZAMAN",
    "MD. RAGIB ANJUM",
    "BIPRO KUMAR BASAK",
    "MD. SHAHRIA ISLAM",
    "MAHMUD E REZA",
    "FARHAN SADIK",
    "MORSHEDUL HASSAN",
    "MD. ARIF MAHAMUD",
    "MD. SHOPNIL",
    "MD. NOEM SIDDIKI",
    "AFZAR UZ ZAMAN BISWAS",
    "MD. MAHIR ASEF MUGDHO",
    "MUHAI MINUL ISLAM",
    "MD. MOJAHIDUL ISLAM",
    "MD. KIBRIA ALAM SHAFI",
    "MD. SAIFUL ISLAM",
    "SUMAIYA JAHAN",
    "ABDUL BAKEU BORSHON",
    "APURBA ROY DIGONTHA",
    "MST. JANNATUL FERDOUS",
    "MD. HABIBUR RAHMAN SHOPON",
    "MD. MAHADI HASSAN DIPU",
    "S. M. TAHSIN RIFAT",
    "SAYEED AL SAHAF",
    "SHAKIN MAHMUD TANVIR",
    "MD. TANVIR AHMED MAHIN",
    "NAHIYAN IBNAT NEHA",
    "AYMAN FAIZAH",
    "MD. SHAFIN KHAN",
    "TADRUP KUMAR DHAR",
    "MD. SAJEEB HUSSAIN",
    "NASRULLAH AL SAMI",
    "MD. AJMAIN FAYEK",
    "MD. TASNIM ALAM TURZO",
    "MD. SABBIR HOSSAIN SAKIB",
    "SEHRAN ALAM",
    "MD. MASHQURUL ALAM",
    "AMRITO SARKAR",
    "MOST. NAFISA MAHJABIN BORSHA",
    "SIMUL SHAHRIAR",
    "FAISAL MAHMUD FAHIM",
    "RIFA TAMANNA",
    "MD. MASUM LIEON",
    "THAMINA AKTER",
    "MD. YEAMINUL BASAR",
    "JAWAD UDDIN ALVI",
    "MD. SHIHAB -UN-SAKIB",
    "MD. NIYAMUL HAQUE NAYEEM",
    "MD. ABID HOSSAIN",
    "MD. HARUN TALUKDER",
    "MD. PROTIK HASAN",
    "RAF RAFIN KHAN KHAN",
    "TAHMIDUL HAQUE SAIF",
    "MD. SAJIDUR RAHMAN",
    "MD. RAKIN ABSAR RUDDRO",
    "FARDEEN AHMED",
    "MD. RIFATUL ISLAM",
    "MD. TASHRIF AHAMMED TUHIN",
    "MD. RAKEEB TANVIR SIDDIQUI"
  ];

  // English quotes for students
  const quotes = [
    "EEE may seem tough, but trust me, once you get the hang of it, it's a lot of fun!",
    "Just remember, in EEE, it's all about trial and error. Keep going, you'll get there.",
    "Don't stress about the small stuff. EEE is all about solving problems, one step at a time.",
    "Hard work in EEE will always pay off. Stick with it, and you'll see results.",
    "It's okay to feel confused sometimes. That's just how we learn in EEE!",
    "In EEE, every day is a new challenge. Embrace it, and you'll grow so much.",
    "If EEE feels overwhelming, just take a deep breath. Break things down, and you'll get through it.",
    "It's okay to fail in EEE; that's how you learn to succeed!",
    "EEE is like a puzzle—take your time and piece it together.",
    "You've got this! Just stay curious and keep exploring in EEE.",
    "Don't worry if you don't get it right away. EEE has a way of making sense when you least expect it.",
    "The more you practice in EEE, the more it starts to click. Keep going!",
    "Don't rush it. Take your time, and EEE will start making sense.",
    "There's no one way to do things in EEE. Experiment and find your own style.",
    "Remember, EEE isn't just about studying; it's about problem-solving and creating cool stuff!",
    "Sometimes it feels like EEE is a rollercoaster, but just hang on tight, and you'll enjoy the ride!",
    "You're not alone in this. Everyone struggles in EEE at first, but we get through it together.",
    "Hey, don't be afraid to ask questions in EEE. Everyone's learning!",
    "Take your time with EEE. It's all about patience and consistency.",
    "The more you get involved in EEE, the more fun it becomes. Stick with it!",
    "Don't be too hard on yourself. EEE is tough for everyone at first.",
    "As long as you keep trying in EEE, you're doing great!",
    "It's not about being perfect in EEE; it's about trying and improving every day.",
    "If you get stuck in EEE, just step back and look at it from a different angle.",
    "Just remember, EEE is all about breaking things down into smaller, manageable pieces.",
    "Sometimes you'll feel lost in EEE, but trust me, you're learning more than you think.",
    "EEE is like a workout for your brain. The more you push, the stronger you get!",
    "Keep the big picture in mind, and EEE won't seem so intimidating.",
    "It might feel slow now, but one day you'll look back and see how far you've come in EEE.",
    "Remember, no one expects you to know everything in EEE right away. Take your time and learn as you go.",
    "With every small victory in EEE, you're becoming a better engineer.",
    "It's okay to take breaks when you need to. EEE is all about balance!",
    "In EEE, every problem you solve is a step closer to mastering it.",
    "Don't be afraid to ask for help in EEE. We all started somewhere!",
    "Take it one day at a time in EEE. You'll be amazed at how much you can learn.",
    "You're learning things that will change the world. Keep pushing forward in EEE!",
    "In EEE, it's okay if things don't click right away. Just keep practicing, and you'll get there.",
    "The toughest challenges in EEE often lead to the biggest rewards.",
    "Just keep trying, and soon enough, EEE will start making sense.",
    "Don't stress about being perfect. In EEE, it's all about improving little by little.",
    "Every time you solve a problem in EEE, you're one step closer to being a pro.",
    "In EEE, the learning never stops. Just keep going and enjoy the journey.",
    "It's okay if you don't get everything in EEE. Every step forward counts.",
    "In EEE, there's always a way to solve things—you just have to find it.",
    "Think of EEE as a challenge you get better at every day.",
    "Don't worry if you get stuck. EEE is all about finding solutions, and that takes time.",
    "You're not alone in this. Every EEE student has been where you are now.",
    "Keep your head up. EEE is tough, but so are you.",
    "Every time you face a challenge in EEE, you're building your skills for the future.",
    "You're making progress in EEE, even if it doesn't always feel like it.",
    "Every problem in EEE is an opportunity to learn and grow.",
    "When in doubt, break it down. EEE becomes much easier that way.",
    "EEE is like a giant puzzle. Keep solving it piece by piece.",
    "The more you work through in EEE, the better prepared you'll be for the next challenge.",
    "Don't get discouraged. EEE might be tough, but so are you.",
    "In EEE, every little step counts. Keep pushing forward.",
    "Stay curious, and let EEE spark your creativity.",
    "You're doing amazing in EEE, even when it doesn't feel like it!",
    "Keep your eyes on the prize. EEE is worth all the hard work.",
    "You've got the potential to do great things in EEE—just keep believing in yourself!"
  ];

  // Sample descriptions for students with more premium content
  const descriptions = [
    "Leading research in renewable energy integration with smart grid technologies.",
    "Award-winning developer specializing in advanced embedded systems and IoT architectures.",
    "Publishing innovative machine learning solutions for predictive maintenance in power systems.",
    "Pioneering work in nanoscale VLSI design with focus on quantum computing applications.",
    "Developing next-generation control systems for aerospace and defense applications.",
    "Advancing signal processing algorithms for 6G communication networks.",
    "Creating breakthrough solutions in efficient power electronics for electric vehicles.",
    "Spearheading research in high-frequency RF engineering for advanced telecommunications.",
    "Leading projects on sustainable energy systems with international collaborations.",
    "Innovating in autonomous robotics systems with computer vision integration."
  ];

  // Create exactly 60 students
  const students = [];
  
  // First, add all the named students
  for (let i = 0; i < Math.min(studentNames.length, 60); i++) {
    const rollNumber = 2301001 + i;
    const id = rollNumber.toString();
    const descriptionIndex = i % descriptions.length;
    const quote = quotes[i % quotes.length]; // Assign quotes in order
    
    // Get the student name
    const studentName = studentNames[i];
    
    // Determine if the student has a special role
    let role = '';
    if (studentName === "TAHMIDUL HAQUE SAIF" || studentName === "ABDUL BAKEU BORSHON") {
      role = 'CR';
    } else if (studentName === "MD. SHAFIN KHAN") {
      role = 'Developer';
    }
    
      students.push({
        id: id,
      name: studentName,
        image: getAvatarImage(i),
      contactInfo: generateContactInfo(id, studentName),
        description: descriptions[descriptionIndex],
        quote: quote,
        year: "2023",
      semester: "Spring",
      role: role // Add the role field
      });
  }
  
  // If we have fewer than 60 named students, add generic ones to reach 60
  if (students.length < 60) {
    for (let i = students.length; i < 60; i++) {
      const rollNumber = 2301001 + i;
      const id = rollNumber.toString();
      const descriptionIndex = i % descriptions.length;
      const quote = quotes[i % quotes.length];
      
      students.push({
        id: id,
        name: `Student ${rollNumber}`,
        image: getAvatarImage(i),
        contactInfo: generateContactInfo(id),
        description: descriptions[descriptionIndex],
        quote: quote,
        year: "2023",
        semester: "Spring",
        role: '' // Empty role for generic students
      });
    }
  }
  
  return students;
};

// Create the student data
export const allStudents = createStudentData();

// Select only 2023 batch students (IDs starting with 2301) for the featured section
export const featuredStudents = (() => {
  try {
    if (!Array.isArray(allStudents)) {
      console.error('allStudents is not an array');
      return [];
    }
    
    return allStudents
      .filter(student => student.id.startsWith('2301')) // Only 23 series students
      .sort(() => Math.random() - 0.5) // Randomly shuffle all 2301 students
      .slice(0, 10); // Select 10 students to ensure we have enough
  } catch (error) {
    console.error('Error creating featuredStudents:', error);
    return [];
  }
})();
