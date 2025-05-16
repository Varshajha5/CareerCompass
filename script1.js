document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const browseBtn = document.getElementById('browse-btn');
            const resumeUpload = document.getElementById('resume-upload');
            const analyzeBtn = document.getElementById('analyze-btn');
            const dropZone = document.getElementById('drop-zone');
            const fileInfo = document.getElementById('file-info');
            const uploadSection = document.getElementById('upload-section');
            const resultsSection = document.getElementById('results-section');
            const loadingOverlay = document.getElementById('loading-overlay');
            const analyzeNowBtn = document.getElementById('analyze-now');
            const navLinks = document.querySelectorAll('nav ul li a');
            const homeSection = document.getElementById('home-section');
            const hrSection = document.getElementById('hr-section');
            const aboutSection = document.getElementById('about-section');

            // HR Dashboard Elements
            const jobProfileModal = document.getElementById('job-profile-modal');
            const addJobBtn = document.getElementById('add-job-btn');
            const closeModalBtn = document.querySelector('.close-modal');
            const cancelJobProfileBtn = document.getElementById('cancel-job-profile');
            const jobProfileForm = document.getElementById('job-profile-form');
            const candidatesListBody = document.getElementById('candidates-list-body');
            const applyFiltersBtn = document.getElementById('apply-filters');
            const resetFiltersBtn = document.getElementById('reset-filters');

            // Initialize the app
            initNavigation();
            initFileUpload();
            initHRDashboard();

            // Navigation initialization
            function initNavigation() {
                navLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const section = this.getAttribute('data-section');

                        // Update active link
                        navLinks.forEach(navLink => navLink.classList.remove('active'));
                        this.classList.add('active');

                        // Show the corresponding section
                        if (section === 'home') {
                            homeSection.classList.remove('hidden');
                            hrSection.classList.add('hidden');
                            aboutSection.classList.add('hidden');
                        } else if (section === 'hr') {
                            homeSection.classList.add('hidden');
                            hrSection.classList.remove('hidden');
                            aboutSection.classList.add('hidden');
                            loadCandidates();
                        } else if (section === 'about') {
                            homeSection.classList.add('hidden');
                            hrSection.classList.add('hidden');
                            aboutSection.classList.remove('hidden');
                        }
                    });
                });
            }

            // File upload initialization
            function initFileUpload() {
                browseBtn.addEventListener('click', () => resumeUpload.click());
                analyzeNowBtn.addEventListener('click', () => {
                    uploadSection.scrollIntoView({ behavior: 'smooth' });
                });

                resumeUpload.addEventListener('change', handleFileSelect);
                analyzeBtn.addEventListener('click', analyzeResume);

                // Drag and drop functionality
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, preventDefaults, false);
                });

                function preventDefaults(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                ['dragenter', 'dragover'].forEach(eventName => {
                    dropZone.addEventListener(eventName, highlight, false);
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    dropZone.addEventListener(eventName, unhighlight, false);
                });

                function highlight() {
                    dropZone.classList.add('highlight');
                }

                function unhighlight() {
                    dropZone.classList.remove('highlight');
                }

                dropZone.addEventListener('drop', handleDrop, false);

                function handleDrop(e) {
                    const dt = e.dataTransfer;
                    const files = dt.files;
                    resumeUpload.files = files;
                    handleFileSelect();
                }
            }

            // File selection handler
            function handleFileSelect() {
                const file = resumeUpload.files[0];
                if (file) {
                    const fileSize = (file.size / (1024 * 1024)).toFixed(2); // in MB
                    if (fileSize > 5) {
                        alert('File size should be less than 5MB');
                        return;
                    }

                    fileInfo.innerHTML = `
                <div class="file-details">
                    <i class="fas fa-file-alt"></i>
                    <div>
                        <p class="file-name">${file.name}</p>
                        <p class="file-size">${fileSize} MB</p>
                    </div>
                    <button class="remove-file" id="remove-file">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

                    fileInfo.classList.add('show');
                    analyzeBtn.disabled = false;

                    // Add event listener for remove file button
                    document.getElementById('remove-file').addEventListener('click', () => {
                        resumeUpload.value = '';
                        fileInfo.classList.remove('show');
                        analyzeBtn.disabled = true;
                        clearJobRecommendations();
                    });
                }
            }

            // Clear job recommendations when file is removed
            function clearJobRecommendations() {
                const jobsContainer = document.getElementById('job-recommendations');
                jobsContainer.innerHTML = '';
            }

            // Analyze resume function
            function analyzeResume() {
                const file = resumeUpload.files[0];
                if (!file) {
                    alert('Please upload a resume file first.');
                    return;
                }

                // Show loading overlay
                loadingOverlay.classList.remove('hidden');

                // Simulate analysis (in a real app, you would send to a server for processing)
                setTimeout(() => {
                    // For demo purposes, we'll use mock data
                    const mockSkills = ['JavaScript', 'HTML5', 'CSS3', 'React', 'Node.js', 'Python', 'Git', 'REST APIs'];
                    const mockExperience = 'Mid-level (3-5 years)';
                    const mockEducation = "Bachelor's Degree in Computer Science";

                    displayAnalysisResults(mockSkills, mockExperience, mockEducation);
                    displayCourseRecommendations(mockSkills, mockExperience);

                    // Get job recommendations
                    const recommendedJobs = fetchJobRecommendations(mockSkills, mockExperience);
                    displayJobRecommendations(recommendedJobs);

                    // Hide loading and show results
                    loadingOverlay.classList.add('hidden');
                    resultsSection.classList.remove('hidden');
                    resultsSection.scrollIntoView({ behavior: 'smooth' });

                    // In a real app, you would also save this candidate data to your database
                    // For demo, we'll just add it to our mock candidates list
                    addCandidateToHRDashboard({
                        name: "John Doe (Demo)",
                        jobProfile: "Frontend Developer",
                        experience: mockExperience,
                        skills: mockSkills,
                        status: "new",
                        rating: 0,
                        resumeFile: file.name
                    });

                }, 3000);
            }

            // Fetch job recommendations from different portals
            function fetchJobRecommendations(skills, experience) {
                // In a real app, you would make API calls to job portals here
                // For demo purposes, we'll use mock data

                const mockJobs = [{
                        id: 1,
                        title: "Frontend Developer (React)",
                        company: "Tech Solutions Inc.",
                        location: "Bangalore, India",
                        portal: "indeed",
                        salary: "₹8,00,000 - ₹12,00,000 a year",
                        description: "Looking for a skilled Frontend Developer with 3+ years of experience in React to join our team.",
                        skills: ["JavaScript", "React", "HTML5", "CSS3"],
                        posted: "2 days ago",
                        url: "https://www.indeed.com/"
                    },
                    {
                        id: 2,
                        title: "Full Stack Developer",
                        company: "Innovate Tech",
                        location: "Remote",
                        portal: "naukri",
                        salary: "₹10,00,000 - ₹15,00,000 a year",
                        description: "We're seeking a Full Stack Developer with Node.js and React experience to work on cutting-edge projects.",
                        skills: ["JavaScript", "Node.js", "React", "MongoDB"],
                        posted: "1 week ago",
                        url: "https://www.naukri.com/"
                    },
                    {
                        id: 3,
                        title: "Python Developer Intern",
                        company: "Data Insights",
                        location: "Hyderabad, India",
                        portal: "internshala",
                        salary: "₹15,000 - ₹20,000 per month",
                        description: "Internship opportunity for Python developers to work on data analysis projects.",
                        skills: ["Python", "Pandas", "NumPy", "Data Analysis"],
                        posted: "3 days ago",
                        url: "https://internshala.com/"
                    },
                    {
                        id: 4,
                        title: "Senior JavaScript Engineer",
                        company: "WebCraft",
                        location: "Mumbai, India",
                        portal: "indeed",
                        salary: "₹15,00,000 - ₹20,00,000 a year",
                        description: "Lead our frontend development team and architect complex JavaScript applications.",
                        skills: ["JavaScript", "TypeScript", "React", "Architecture"],
                        posted: "5 days ago",
                        url: "https://www.indeed.com/"
                    },
                    {
                        id: 5,
                        title: "Backend Developer (Node.js)",
                        company: "API Masters",
                        location: "Delhi, India",
                        portal: "naukri",
                        salary: "₹9,00,000 - ₹14,00,000 a year",
                        description: "Build scalable backend services using Node.js and modern cloud technologies.",
                        skills: ["Node.js", "Express", "AWS", "REST APIs"],
                        posted: "Just now",
                        url: "https://www.naukri.com/"
                    },
                    {
                        id: 6,
                        title: "UI/UX Design Intern",
                        company: "Creative Minds",
                        location: "Pune, India",
                        portal: "internshala",
                        salary: "₹10,000 - ₹15,000 per month",
                        description: "Internship for design students to work on real client projects.",
                        skills: ["UI Design", "Figma", "Wireframing", "UX Research"],
                        posted: "1 day ago",
                        url: "https://internshala.com/"
                    }
                ];

                // Filter jobs based on skills and experience
                let recommendedJobs = mockJobs.filter(job => {
                    // Simple matching - in a real app you'd have more sophisticated matching
                    const hasMatchingSkills = job.skills.some(skill =>
                        skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                    );

                    // Very basic experience matching for demo
                    const isEntryLevel = experience.includes('Entry');
                    const isSeniorLevel = experience.includes('Senior');

                    if (isEntryLevel) {
                        return hasMatchingSkills && (job.title.includes('Intern') || job.title.includes('Junior'));
                    } else if (isSeniorLevel) {
                        return hasMatchingSkills && job.title.includes('Senior');
                    }

                    return hasMatchingSkills;
                });

                // If no matches, return some generic recommendations
                if (recommendedJobs.length === 0) {
                    recommendedJobs = mockJobs.slice(0, 3);
                }

                return recommendedJobs;
            }

            // Display job recommendations
            function displayJobRecommendations(jobs) {
                const jobsContainer = document.getElementById('job-recommendations');
                jobsContainer.innerHTML = '';

                if (jobs.length === 0) {
                    jobsContainer.innerHTML = '<div class="no-jobs">No job recommendations found based on your profile.</div>';
                    return;
                }

                jobs.forEach(job => {
                            const jobCard = document.createElement('div');
                            jobCard.className = 'job-card';
                            jobCard.dataset.portal = job.portal;

                            jobCard.innerHTML = `
                <div class="job-header">
                    <h3>${job.title}</h3>
                    <span class="job-portal ${job.portal}">${job.portal.charAt(0).toUpperCase() + job.portal.slice(1)}</span>
                </div>
                <div class="job-company">${job.company}</div>
                <div class="job-meta">
                    <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span class="job-salary"><i class="fas fa-rupee-sign"></i> ${job.salary}</span>
                    <span class="job-posted"><i class="far fa-clock"></i> ${job.posted}</span>
                </div>
                <div class="job-description">${job.description}</div>
                <div class="job-skills">
                    <div class="skills-container">
                        ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <a href="${job.url}" target="_blank" class="job-apply">Apply Now</a>
            `;

            jobsContainer.appendChild(jobCard);
        });

        // Add event listeners to portal filter buttons
        document.querySelectorAll('.portal-tab').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.portal-tab').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const portal = button.dataset.portal;
                const jobCards = document.querySelectorAll('.job-card');

                jobCards.forEach(card => {
                    if (portal === 'all' || card.dataset.portal === portal) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Display analysis results
    function displayAnalysisResults(skills, experience, education) {
        const skillsContainer = document.getElementById('skills-found');
        const experienceContainer = document.getElementById('experience-level');
        const educationContainer = document.getElementById('education-level');

        // Clear previous skills
        skillsContainer.innerHTML = '';

        // Display skills
        skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsContainer.appendChild(skillTag);
        });

        // Display experience
        experienceContainer.textContent = experience;

        // Display education
        educationContainer.textContent = education;
    }

    // Display course recommendations
    function displayCourseRecommendations(skills, experience) {
        const recommendationsContainer = document.getElementById('course-recommendations');
        recommendationsContainer.innerHTML = '';

        // Course data - in a real app, this would come from an API
        const courses = [{
                id: 1,
                title: "Advanced React and Redux",
                provider: "Udemy",
                description: "Dive deep into React hooks, context API, and Redux middleware to build scalable applications.",
                duration: "22 hours",
                level: "Intermediate",
                category: "skill",
                image: "https://img-c.udemycdn.com/course/480x270/705264_caa9_11.jpg"
            },
            {
                id: 2,
                title: "Node.js: The Complete Guide",
                provider: "Udemy",
                description: "Master Node.js and build fast, scalable network applications with this complete guide.",
                duration: "40 hours",
                level: "Intermediate",
                category: "skill",
                image: "https://img-c.udemycdn.com/course/480x270/1879018_95b6.jpg"
            },
            {
                id: 3,
                title: "Python for Data Science",
                provider: "Coursera",
                description: "Learn Python for data analysis, visualization, and machine learning with real-world projects.",
                duration: "6 weeks",
                level: "Beginner",
                category: "skill",
                image: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/83/e258e0532611e5a5072321239ff4d4/jhep-coursera-course4.png"
            },
            {
                id: 4,
                title: "Leadership for Engineers",
                provider: "LinkedIn Learning",
                description: "Develop leadership skills to transition from individual contributor to tech lead roles.",
                duration: "5 hours",
                level: "Advanced",
                category: "career",
                image: "https://media-exp1.licdn.com/dms/image/C560DAQGvDkXy3l0yJg/learning-public-crop_288_512/0/1581615031036?e=2147483647&v=beta&t=1w2Nl3kC4B8yf2z7Q4Y9Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4Q4"
            },
            {
                id: 5,
                title: "AWS Certified Developer",
                provider: "A Cloud Guru",
                description: "Prepare for the AWS Certified Developer exam with hands-on labs and practice tests.",
                duration: "30 hours",
                level: "Advanced",
                category: "certification",
                image: "https://acloudguru-content-assets-production.s3-accelerate.amazonaws.com/1594919619-course-image-aws-certified-developer-associate.png"
            },
            {
                id: 6,
                title: "Advanced JavaScript Concepts",
                provider: "Udemy",
                description: "Master advanced JavaScript concepts like closures, prototypal inheritance, and async programming.",
                duration: "18 hours",
                level: "Advanced",
                category: "skill",
                image: "https://img-c.udemycdn.com/course/480x270/1409142_1879_8.jpg"
            }
        ];

        // Filter courses based on skills and experience
        let recommendedCourses = courses;

        // In a real app, you would have more sophisticated filtering logic
        if (skills.includes('React')) {
            recommendedCourses = recommendedCourses.concat([courses[0]]);
        }

        if (skills.includes('Node.js')) {
            recommendedCourses = recommendedCourses.concat([courses[1]]);
        }

        if (skills.includes('Python')) {
            recommendedCourses = recommendedCourses.concat([courses[2]]);
        }

        if (experience.includes('Mid-level')) {
            recommendedCourses = recommendedCourses.concat([courses[3]]);
        }

        // Remove duplicates
        recommendedCourses = [...new Set(recommendedCourses)];

        // Display courses
        recommendedCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.dataset.category = course.category;

            courseCard.innerHTML = `
                <div class="course-image" style="background-image: url('${course.image}')"></div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <p class="course-provider">${course.provider}</p>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <span class="course-duration"><i class="far fa-clock"></i> ${course.duration}</span>
                        <span class="course-level"><i class="fas fa-signal"></i> ${course.level}</span>
                    </div>
                    <a href="#" class="course-link">View Course</a>
                </div>
            `;

            recommendationsContainer.appendChild(courseCard);
        });

        // Add event listeners to filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;
                const courseCards = document.querySelectorAll('.course-card');

                courseCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // HR Dashboard Initialization
    function initHRDashboard() {
        // Modal controls
        addJobBtn.addEventListener('click', () => {
            jobProfileModal.classList.remove('hidden');
        });

        closeModalBtn.addEventListener('click', () => {
            jobProfileModal.classList.add('hidden');
        });

        cancelJobProfileBtn.addEventListener('click', () => {
            jobProfileModal.classList.add('hidden');
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === jobProfileModal) {
                jobProfileModal.classList.add('hidden');
            }
        });

        // Job profile form submission
        jobProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you would save this to your database
            alert('Job profile saved successfully!');
            jobProfileModal.classList.add('hidden');
            jobProfileForm.reset();
            document.getElementById('selected-skills').innerHTML = '';
        });

        // Skill input functionality
        document.getElementById('add-skill-btn').addEventListener('click', () => {
            const skillInput = document.getElementById('required-skills-input');
            const skill = skillInput.value.trim();

            if (skill) {
                addSkillToJobProfile(skill);
                skillInput.value = '';
            }
        });

        // Filter controls
        applyFiltersBtn.addEventListener('click', loadCandidates);
        resetFiltersBtn.addEventListener('click', () => {
            document.getElementById('job-profile-filter').value = 'all';
            document.getElementById('experience-filter').value = 'all';
            document.getElementById('status-filter').value = 'all';
            loadCandidates();
        });

        // Load initial candidates
        loadCandidates();
    }

    // Add skill to job profile form
    function addSkillToJobProfile(skill) {
        const selectedSkills = document.getElementById('selected-skills');
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <button class="remove-skill" data-skill="${skill}">
                <i class="fas fa-times"></i>
            </button>
        `;
        selectedSkills.appendChild(skillTag);

        // Add remove skill functionality
        skillTag.querySelector('.remove-skill').addEventListener('click', (e) => {
            e.preventDefault();
            skillTag.remove();
        });
    }

    // Load candidates for HR dashboard
    function loadCandidates() {
        // In a real app, you would fetch this from your API with filters
        const jobProfileFilter = document.getElementById('job-profile-filter').value;
        const experienceFilter = document.getElementById('experience-filter').value;
        const statusFilter = document.getElementById('status-filter').value;

        // Mock data for demonstration
        const mockCandidates = [{
                id: 1,
                name: "VARSHA JHA",
                jobProfile: "Frontend Developer",
                experience: "Mid-level (3-5 years)",
                skills: ["JavaScript", "React", "HTML5", "CSS3"],
                status: "new",
                rating: 0,
                resumeFile: "varsha_resume.pdf"
            },
            {
                id: 2,
                name: "AMAN KUMAR",
                jobProfile: "Backend Developer",
                experience: "Senior (5+ years)",
                skills: ["Node.js", "Python", "SQL", "AWS"],
                status: "reviewed",
                rating: 4,
                resumeFile: "aman_resume.pdf"
            },
            {
                id: 3,
                name: "PARAS MISHRA",
                jobProfile: "Full Stack Developer",
                experience: "Mid-level (3-5 years)",
                skills: ["JavaScript", "React", "Node.js", "MongoDB"],
                status: "shortlisted",
                rating: 5,
                resumeFile: "paras_resume.pdf"
            },
            {
                id: 4,
                name: "Sagar thakur",
                jobProfile: "Data Scientist",
                experience: "Entry Level (0-2 years)",
                skills: ["Python", "R", "SQL", "Machine Learning"],
                status: "new",
                rating: 0,
                resumeFile: "sagar.pdf"
            },
            {
                id: 5,
                name: "Michael Brown",
                jobProfile: "Frontend Developer",
                experience: "Senior (5+ years)",
                skills: ["JavaScript", "React", "TypeScript", "Redux"],
                status: "reviewed",
                rating: 3,
                resumeFile: "michael_brown_resume.pdf"
            }
        ];

        // Filter candidates based on selected filters
        let filteredCandidates = mockCandidates.filter(candidate => {
            let matches = true;

            if (jobProfileFilter !== 'all') {
                const jobProfile = candidate.jobProfile.toLowerCase();
                matches = matches && jobProfile.includes(jobProfileFilter);
            }

            if (experienceFilter !== 'all') {
                if (experienceFilter === 'entry') {
                    matches = matches && candidate.experience.includes('Entry Level');
                } else if (experienceFilter === 'mid') {
                    matches = matches && candidate.experience.includes('Mid-level');
                } else if (experienceFilter === 'senior') {
                    matches = matches && candidate.experience.includes('Senior');
                }
            }

            if (statusFilter !== 'all') {
                matches = matches && candidate.status === statusFilter;
            }

            return matches;
        });

        // Display filtered candidates
        displayCandidates(filteredCandidates);
    }

    // Display candidates in the HR dashboard
    function displayCandidates(candidates) {
        candidatesListBody.innerHTML = '';

        if (candidates.length === 0) {
            candidatesListBody.innerHTML = '<div class="no-candidates">No candidates match your filters</div>';
            return;
        }

        candidates.forEach(candidate => {
            const candidateRow = document.createElement('div');
            candidateRow.className = 'candidate-item';
            candidateRow.innerHTML = `
                <div class="item name">
                    <div class="candidate-avatar">${getInitials(candidate.name)}</div>
                    <div class="candidate-name">${candidate.name}</div>
                </div>
                <div class="item job">${candidate.jobProfile}</div>
                <div class="item exp">${candidate.experience}</div>
                <div class="item skills">
                    <div class="skills-container">
                        ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="item status">
                    <span class="status-badge ${candidate.status}">${capitalizeFirstLetter(candidate.status)}</span>
                </div>
                <div class="item rating">
                    <div class="star-rating" data-candidate-id="${candidate.id}">
                        ${getStarRatingHTML(candidate.rating)}
                    </div>
                </div>
                <div class="item actions">
                    <button class="action-btn view-resume" data-resume="${candidate.resumeFile}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="action-btn download-resume" data-resume="${candidate.resumeFile}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
            
            candidatesListBody.appendChild(candidateRow);
        });
        
        // Initialize star rating functionality
        initializeStarRatings();
        
        // Initialize action buttons
        initializeActionButtons();
    }

    // Add a new candidate to the HR dashboard (for demo purposes)
    function addCandidateToHRDashboard(candidate) {
        // In a real app, you would add this to your database
        const candidatesListBody = document.getElementById('candidates-list-body');
        const noCandidates = document.querySelector('.no-candidates');
        
        if (noCandidates) {
            noCandidates.remove();
        }
        
        const candidateRow = document.createElement('div');
        candidateRow.className = 'candidate-item';
        candidateRow.innerHTML = `
            <div class="item name">
                <div class="candidate-avatar">${getInitials(candidate.name)}</div>
                <div class="candidate-name">${candidate.name}</div>
            </div>
            <div class="item job">${candidate.jobProfile}</div>
            <div class="item exp">${candidate.experience}</div>
            <div class="item skills">
                <div class="skills-container">
                    ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="item status">
                <span class="status-badge ${candidate.status}">${capitalizeFirstLetter(candidate.status)}</span>
            </div>
            <div class="item rating">
                <div class="star-rating" data-candidate-id="demo">
                    ${getStarRatingHTML(candidate.rating)}
                </div>
            </div>
            <div class="item actions">
                <button class="action-btn view-resume" data-resume="${candidate.resumeFile}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn download-resume" data-resume="${candidate.resumeFile}">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        `;
        
        candidatesListBody.prepend(candidateRow);
        
        // Initialize star rating functionality
        initializeStarRatings();
        
        // Initialize action buttons
        initializeActionButtons();
    }

    // Helper function to get initials from name
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Helper function to generate star rating HTML
    function getStarRatingHTML(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star" data-rating="' + i + '"></i>';
            } else {
                stars += '<i class="far fa-star" data-rating="' + i + '"></i>';
            }
        }
        return stars;
    }

    // Initialize star rating functionality
    function initializeStarRatings() {
        document.querySelectorAll('.star-rating i').forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                const starContainer = this.parentElement;
                
                // Update star display
                starContainer.innerHTML = getStarRatingHTML(rating);
                
                // In a real app, you would save this rating to your database
                const candidateId = starContainer.getAttribute('data-candidate-id');
                console.log(`Rating ${rating} saved for candidate ${candidateId}`);
                
                // Reinitialize event listeners
                initializeStarRatings();
            });
        });
    }

    // Initialize action buttons
    function initializeActionButtons() {
        document.querySelectorAll('.view-resume').forEach(btn => {
            btn.addEventListener('click', function() {
                const resumeFile = this.getAttribute('data-resume');
                alert(`Viewing resume: ${resumeFile}\nIn a real app, this would open the resume viewer.`);
            });
        });
        
        document.querySelectorAll('.download-resume').forEach(btn => {
            btn.addEventListener('click', function() {
                const resumeFile = this.getAttribute('data-resume');
                alert(`Downloading resume: ${resumeFile}\nIn a real app, this would download the file.`);
            });
        });
    }
});
