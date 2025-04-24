import 'alpinejs';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode from local storage or system preference
  initTheme();
  
  // Fetch GitHub projects
  fetchGitHubProjects();
  
  // Fetch Medium articles
  fetchMediumPosts();
  
  // Create signature image
  createSignatureImage();

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

// Fetch GitHub projects
async function fetchGitHubProjects() {
  const username = 'berkayinam';
  const projectsContainer = document.getElementById('projects-container');
  
  if (!projectsContainer) return;
  
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
    projects.forEach(project => {
      const tags = [];
      
      // Determine category tags based on topics or other properties
      if (project.topics && project.topics.includes('devops')) {
        tags.push('devops');
      }
      
      if (project.topics && (project.topics.includes('programming') || project.language)) {
        tags.push('programming');
      }
      
      if (project.name.includes('42-') || project.name.toLowerCase().includes('ft_')) {
        tags.push('42');
      }
      
      // If no tags are assigned, mark as 'other'
      if (tags.length === 0) {
        tags.push('other');
      }
      
      // Always include 'all' tag
      tags.push('all');
      
      const projectElement = document.createElement('div');
      projectElement.className = 'card';
      projectElement.dataset.tags = tags.join(' ');
      
      const imageUrl = `https://via.placeholder.com/600x400?text=${encodeURIComponent(project.name)}`;
      
      projectElement.innerHTML = `
        <div class="h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img src="${imageUrl}" alt="${project.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-4">
          <h3 class="text-xl font-bold mb-2 dark:text-white">${project.name}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-3">${project.description || 'No description available.'}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${project.language ? `<span class="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs rounded">${project.language}</span>` : ''}
            ${project.topics ? project.topics.map(topic => `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">${topic}</span>`).join('') : ''}
          </div>
          <a href="${project.html_url}" target="_blank" class="btn inline-block">
            <i class="fab fa-github mr-2"></i> View Project
          </a>
        </div>
      `;
      
      projectsContainer.appendChild(projectElement);
    });
    
    // Set up filtering
    setupFilterHandlers();
    
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    projectsContainer.innerHTML = '<p class="col-span-full text-center text-red-500">Error loading projects. Please try again later.</p>';
  }
}

// Set up project filter handlers
function setupFilterHandlers() {
  const allProjects = document.querySelectorAll('#projects-container .card');
  
  // Add event listener for Alpine.js data changes
  document.addEventListener('alpine:init', () => {
    Alpine.data('projectFilter', () => ({
      activeTab: 'all',
      filterProjects() {
        allProjects.forEach(project => {
          const tags = project.dataset.tags.split(' ');
          if (this.activeTab === 'all' || tags.includes(this.activeTab)) {
            project.classList.remove('hidden');
          } else {
            project.classList.add('hidden');
          }
        });
      }
    }));
  });
  
  // Filter projects when tab buttons are clicked
  document.querySelectorAll('[x-data]').forEach(el => {
    if (el.getAttribute('x-data').includes('activeTab')) {
      // Initialize Alpine.js with event watcher
      el.__x = new Proxy({activeTab: 'all'}, {
        set(target, key, value) {
          target[key] = value;
          if (key === 'activeTab') {
            filterProjectsByTag(value);
          }
          return true;
        }
      });
    }
  });
}

// Filter projects by tag
function filterProjectsByTag(tag) {
  const allProjects = document.querySelectorAll('#projects-container .card');
  
  allProjects.forEach(project => {
    const tags = project.dataset.tags ? project.dataset.tags.split(' ') : [];
    if (tag === 'all' || tags.includes(tag)) {
      project.style.display = '';
    } else {
      project.style.display = 'none';
    }
  });
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
    
    const posts = response.data.items;
    
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
  ];
  
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

// Create a custom signature image in the contact form
function createSignatureImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 60;
  canvas.height = 30;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw AI pattern
  ctx.fillStyle = '#2563eb'; // theme-primary color
  
  // Draw a stylized "AI" pattern
  // Letter A
  ctx.beginPath();
  ctx.moveTo(10, 25);
  ctx.lineTo(20, 5);
  ctx.lineTo(30, 25);
  ctx.stroke();
  
  // Cross bar for A
  ctx.beginPath();
  ctx.moveTo(15, 15);
  ctx.lineTo(25, 15);
  ctx.stroke();
  
  // Letter I 
  ctx.fillRect(35, 5, 5, 20);
  
  // Dots representing assistant
  ctx.beginPath();
  ctx.arc(50, 10, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(50, 20, 2, 0, Math.PI * 2); 
  ctx.fill();
  
  // Create image from canvas
  const signatureImg = document.createElement('img');
  signatureImg.src = canvas.toDataURL('image/png');
  signatureImg.alt = 'AI Assistant Signature';
  signatureImg.className = 'inline-block ml-2 -mt-1';
  signatureImg.style.width = '30px';
  signatureImg.style.height = '15px';
  
  // Add image to submit button
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.appendChild(signatureImg);
  }
} 