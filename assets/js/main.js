import 'alpinejs';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode from local storage or system preference
  initTheme();
  
  // Initialize typewriter effect
  initTypewriter();
  
  // Ensure mobile menu is closed by default
  if (window.Alpine) {
    document.querySelectorAll('[x-data]').forEach(el => {
      if (el.__x && el.__x.$data && 'mobileMenuOpen' in el.__x.$data) {
        el.__x.$data.mobileMenuOpen = false;
      }
    });
  }
  
  // Fetch GitHub projects
  fetchGitHubProjects();
  
  // Fetch Medium articles
  fetchMediumPosts();


  // Handle contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Form submission logic would go here
      alert('Form submission functionality would be implemented on the backend.');
      this.reset();
    });
  }
  
  // Theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  
  // Mobile theme toggle button
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  }
});

// Initialize theme based on user preference or system preference
function initTheme() {
  // Check if theme is stored in localStorage
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set theme based on stored preference or system preference
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
    updateThemeIcons(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcons(false);
  }
}

// Toggle between light and dark theme
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcons(isDark);
}

// Update theme toggle button icons
function updateThemeIcons(isDark) {
  const sunIcon = document.getElementById('theme-toggle-light-icon');
  const moonIcon = document.getElementById('theme-toggle-dark-icon');
  
  // Also update mobile icons
  const mobileSunIcon = document.querySelector('#mobile-theme-toggle .fa-sun');
  const mobileMoonIcon = document.querySelector('#mobile-theme-toggle .fa-moon');
  
  if (sunIcon && moonIcon) {
    if (isDark) {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }
  
  if (mobileSunIcon && mobileMoonIcon) {
    if (isDark) {
      mobileSunIcon.classList.remove('hidden');
      mobileMoonIcon.classList.add('hidden');
    } else {
      mobileSunIcon.classList.add('hidden');
      mobileMoonIcon.classList.remove('hidden');
    }
  }
}

// Initialize typewriter effect
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const titles = [
    'Berkay İnam',
    'DevOps Engineer', 
    'Linux System Administrator',
    'Container Specialist',
    'CI/CD Expert',
    'Automation Engineer',
    'Infrastructure Developer',
    'Tech Enthusiast',
    'Problem Solver',
    'Cloud Engineer',
  ];

  let currentTitleIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100; // Base typing speed
  let deletingSpeed = 50; // Base deleting speed
  let pauseBeforeDelete = 1000; // Pause before starting to delete
  let pauseBeforeNextWord = 200; // Pause before typing next word

  function type() {
    const currentTitle = titles[currentTitleIndex];
    
    if (isDeleting) {
      // Deleting text
      currentCharIndex--;
      typingSpeed = deletingSpeed;
    } else {
      // Typing text
      currentCharIndex++;
      typingSpeed = 100;
    }

    // Update the text
    typewriterElement.textContent = currentTitle.substring(0, currentCharIndex);

    // If we've finished typing the word
    if (!isDeleting && currentCharIndex === currentTitle.length) {
      typingSpeed = pauseBeforeDelete;
      isDeleting = true;
    }

    // If we've finished deleting the word
    if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentTitleIndex = (currentTitleIndex + 1) % titles.length;
      typingSpeed = pauseBeforeNextWord;
    }

    setTimeout(type, typingSpeed);
  }

  // Start the typewriter effect
  type();
}

// Fetch GitHub projects
async function fetchGitHubProjects() {
  const username = 'berkayinam';
  const projectsContainer = document.getElementById('projects-container');
  
  if (!projectsContainer) return;
  
  try {
    // GraphQL query to get pinned repositories
    const response = await axios.post('https://api.github.com/graphql', {
      query: `{
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                languages(first: 1) {
                  nodes {
                    name
                  }
                }
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }`
    }, {
      headers: {
        'Authorization': `bearer ${process.env.GITHUB_TOKEN}`
      }
    });

    const projects = response.data.data.user.pinnedItems.nodes;
    
    // Clear loading placeholders
    projectsContainer.innerHTML = '';
    
    if (projects.length === 0) {
      projectsContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No projects found.</p>';
      return;
    }
    
    // Add projects to the container
    for (const project of projects) {
      try {
        const projectElement = document.createElement('div');
        projectElement.className = 'card flex flex-col';
        
        const language = project.languages.nodes[0]?.name || '';
        const topics = project.repositoryTopics.nodes.map(node => node.topic.name);
        
        // Fetch language statistics
        const languageStatsResponse = await axios.get(`https://api.github.com/repos/${username}/${project.name}/languages`);
        const languageStats = languageStatsResponse.data;
        
        // Calculate total bytes
        const totalBytes = Object.values(languageStats).reduce((a, b) => a + b, 0);
        
        // Create language bar HTML
        const languageBarHtml = Object.entries(languageStats)
          .map(([lang, bytes]) => {
            const percentage = (bytes / totalBytes) * 100;
            const color = getLanguageColor(lang);
            return `<div class="h-full" style="width: ${percentage}%; background-color: ${color};" title="${lang}: ${percentage.toFixed(1)}%"></div>`;
          })
          .join('');
        
        projectElement.innerHTML = `
          <div class="h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <img src="https://opengraph.githubassets.com/1/${username}/${project.name}" alt="${project.name}" class="w-full h-full object-cover">
          </div>
          <div class="h-1 flex overflow-hidden">
            ${languageBarHtml}
          </div>
          <div class="p-4 flex flex-col flex-grow">
            <h3 class="text-xl font-bold mb-2 dark:text-white">${project.name}</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-3 flex-grow">${project.description || 'No description available.'}</p>
            <div class="flex flex-wrap gap-2 mb-4 mt-auto">
              ${language ? `<span class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs rounded inline-block">${language}</span>` : ''}
              ${topics.map(topic => `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded inline-block">${topic}</span>`).join('')}
            </div>
            <a href="${project.url}" target="_blank" class="btn inline-block">
              <i class="fab fa-github mr-2"></i> View Project
            </a>
          </div>
        `;
        
        projectsContainer.appendChild(projectElement);
      } catch (error) {
        console.error(`Error creating project element for ${project.name}:`, error);
      }
    }
    
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    // Fallback to REST API if GraphQL fails
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      const projects = response.data;
      
      // Clear loading placeholders
      projectsContainer.innerHTML = '';
      
      if (projects.length === 0) {
        projectsContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No projects found.</p>';
        return;
      }
      
      // Add projects to the container
      for (const project of projects) {
        try {
          const projectElement = document.createElement('div');
          projectElement.className = 'card flex flex-col';
          
          // Fetch language statistics
          const languageStatsResponse = await axios.get(`https://api.github.com/repos/${username}/${project.name}/languages`);
          const languageStats = languageStatsResponse.data;
          
          // Calculate total bytes
          const totalBytes = Object.values(languageStats).reduce((a, b) => a + b, 0);
          
          // Create language bar HTML
          const languageBarHtml = Object.entries(languageStats)
            .map(([lang, bytes]) => {
              const percentage = (bytes / totalBytes) * 100;
              const color = getLanguageColor(lang);
              return `<div class="h-full" style="width: ${percentage}%; background-color: ${color};" title="${lang}: ${percentage.toFixed(1)}%"></div>`;
            })
            .join('');
          
          projectElement.innerHTML = `
            <div class="h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img src="https://opengraph.githubassets.com/1/${username}/${project.name}" alt="${project.name}" class="w-full h-full object-cover">
            </div>
            <div class="h-1 flex overflow-hidden">
              ${languageBarHtml}
            </div>
            <div class="p-4 flex flex-col flex-grow">
              <h3 class="text-xl font-bold mb-2 dark:text-white">${project.name}</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-3 flex-grow">${project.description || 'No description available.'}</p>
              <div class="flex flex-wrap gap-2 mb-4 mt-auto">
                ${project.language ? `<span class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs rounded inline-block">${project.language}</span>` : ''}
                ${project.topics ? project.topics.map(topic => `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded inline-block">${topic}</span>`).join('') : ''}
              </div>
              <a href="${project.html_url}" target="_blank" class="btn inline-block">
                <i class="fab fa-github mr-2"></i> View Project
              </a>
            </div>
          `;
          
          projectsContainer.appendChild(projectElement);
        } catch (error) {
          console.error(`Error creating project element for ${project.name}:`, error);
        }
      }
    } catch (fallbackError) {
      console.error('Error fetching GitHub projects (fallback):', fallbackError);
      projectsContainer.innerHTML = '<p class="col-span-full text-center text-red-500">Error loading projects. Please try again later.</p>';
    }
  }
}

// Language colors mapping function
function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C#': '#178600',
    PHP: '#4F5D95',
    Ruby: '#701516',
    CSS: '#563d7c',
    HTML: '#e34c26',
    Go: '#00ADD8',
    Shell: '#89e051',
    Vue: '#41b883',
    React: '#61dafb',
    'C++': '#f34b7d',
    C: '#555555'
  };
  
  return colors[language] || '#858585';
}

// Fetch Medium posts
async function fetchMediumPosts() {
  const mediumUsername = 'berkayinam';
  const mediumPostsContainer = document.getElementById('medium-posts');
  
  if (!mediumPostsContainer) return;
  
  try {
    // Use RSS2JSON API to convert Medium RSS feed to JSON
    const corsProxy = 'https://api.rss2json.com/v1/api.json';
    const mediumRssFeed = `https://medium.com/feed/@${mediumUsername}`;
    const response = await axios.get(`${corsProxy}?rss_url=${encodeURIComponent(mediumRssFeed)}`);
    
    // Check if the request was successful
    if (response.data.status !== 'ok') {
      throw new Error('Could not fetch Medium posts');
    }
    
    // Limit to 6 posts
    const posts = response.data.items.slice(0, 6);
    
    // Clear loading placeholders
    mediumPostsContainer.innerHTML = '';
    
    if (posts.length === 0) {
      mediumPostsContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No Medium posts found.</p>';
      return;
    }
    
    // Process and add posts to the container
    posts.forEach(post => {
      // Extract the first image from the content as thumbnail, or use a placeholder
      let thumbnail = 'https://via.placeholder.com/600x400?text=Medium+Post';
      const imgRegex = /<img[^>]+src="([^">]+)"/;
      const imgMatch = post.content.match(imgRegex);
      if (imgMatch && imgMatch[1]) {
        thumbnail = imgMatch[1];
      }
      
      // Create excerpt from content
      let description = post.content.replace(/<[^>]*>/g, '');
      description = description.substring(0, 160) + (description.length > 160 ? '...' : '');
      
      const postElement = document.createElement('div');
      postElement.className = 'card overflow-hidden';
      
      postElement.innerHTML = `
        <div class="h-48 overflow-hidden">
          <img src="${thumbnail}" alt="${post.title}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500">
        </div>
        <div class="p-4">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${new Date(post.pubDate).toLocaleDateString('tr-TR')}</p>
          <h3 class="text-xl font-bold mb-2 dark:text-white">${post.title}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>
          <a href="${post.link}" target="_blank" class="btn inline-block">
            <i class="fas fa-book-open mr-2"></i> Devamını Oku
          </a>
        </div>
      `;
      
      mediumPostsContainer.appendChild(postElement);
    });
    
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    // If API call fails, use the sample data as fallback
    fetchSampleMediumPosts(mediumPostsContainer);
  }
}

// Fallback function to show sample Medium posts if API fails
function fetchSampleMediumPosts(container) {
  const posts = [
    {
      title: "Cloud Teknolojileri 101",
      pubDate: "2024-07-21",
      link: "https://medium.com/@berkayinam/cloud-teknolojileri-101",
      thumbnail: "https://via.placeholder.com/600x400?text=Cloud+Teknolojileri",
      description: "Cloud hizmet türleri, popüler cloud uygulamaları ve avantaj & dezavantajlarından bahsedeceğiz."
    },
    {
      title: "DevOps 101",
      pubDate: "2024-07-08",
      link: "https://medium.com/@berkayinam/devops-101",
      thumbnail: "https://via.placeholder.com/600x400?text=DevOps+101",
      description: "DevOps Tarihi, Uygulamaları ve İlk Bakışlar"
    },
    {
      title: "Cloud Nedir? Geçmişten Günümüze Cloud Tarihçesi",
      pubDate: "2024-07-08",
      link: "https://medium.com/@berkayinam/cloud-nedir-gecmisten-gunumuze-cloud-tarihcesi",
      thumbnail: "https://via.placeholder.com/600x400?text=Cloud+Tarihcesi",
      description: "1963'ten itibaren cloud ve bilgisayar teknolojilerinin doğuşuna bakacağız. 2024'e kadar Bilgisayar bilimi ve cloud yolcusuyuz."
    }
  ].slice(0, 6); // Ensure we only show up to 6 sample posts
  
  // Clear loading placeholders
  container.innerHTML = '';
  
  // Add posts to the container
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'card overflow-hidden';
    
    postElement.innerHTML = `
      <div class="h-48 overflow-hidden">
        <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500">
      </div>
      <div class="p-4">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${new Date(post.pubDate).toLocaleDateString('tr-TR')}</p>
        <h3 class="text-xl font-bold mb-2 dark:text-white">${post.title}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">${post.description}</p>
        <a href="${post.link}" target="_blank" class="btn inline-block">
          <i class="fas fa-book-open mr-2"></i> Devamını Oku
        </a>
      </div>
    `;
    
    container.appendChild(postElement);
  });
}