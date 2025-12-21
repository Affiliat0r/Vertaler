/**
 * Beëdigd Vertaler - Marwan Mrait
 * Main JavaScript functionality
 */

(function() {
  'use strict';

  // Supabase Configuration
  const SUPABASE_URL = 'https://knwpwdbqosdjwxfmwnro.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtud3B3ZGJxb3Nkand4Zm13bnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDkxNDksImV4cCI6MjA4MTQ4NTE0OX0.GzacLND_vgezceshT7hSe7FREAaEfeaj73cFmC47f38';

  // Initialize Supabase client (will be set after library loads)
  let supabase = null;

  // DOM Ready
  document.addEventListener('DOMContentLoaded', function() {
    initSupabase();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initFileUpload();
    initContactForm();
    initAnimations();
    initTypewriter();
    initTheme();
  });

  /**
   * Initialize theme toggle functionality
   */
  function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');

    // Determine the base path for images (different for subfolders)
    const isSubfolder = window.location.pathname.includes('/en/') || window.location.pathname.includes('/ar/');
    const imgBasePath = isSubfolder ? '../images/' : 'images/';

    function updateLogos(theme) {
      const logoImages = document.querySelectorAll('.logo-icon');
      const logoSrc = theme === 'dark'
        ? imgBasePath + 'logo-vectorized.svg'
        : imgBasePath + 'logo-vectorized-light.svg';

      logoImages.forEach(img => {
        img.src = logoSrc;
      });
    }

    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateLogos(newTheme);
    }

    // Update logos on initial load based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateLogos(currentTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    if (themeToggleMobile) {
      themeToggleMobile.addEventListener('click', toggleTheme);
    }
  }

  /**
   * Initialize Supabase client
   */
  function initSupabase() {
    if (window.supabase) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  }

  /**
   * Header scroll effect
   */
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      // Add scrolled class for shadow
      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  /**
   * Mobile menu toggle
   */
  function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');

      // Toggle aria-expanded
      const isExpanded = navMenu.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const headerHeight = 70;

    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * FAQ Accordion
   */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');

      if (!question) return;

      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(function(otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle current item
        item.classList.toggle('active');
        question.setAttribute('aria-expanded', !isActive);
      });

      // Keyboard support
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  /**
   * File upload preview
   */
  function initFileUpload() {
    const fileInput = document.getElementById('files');
    const fileList = document.getElementById('fileList');
    const fileUpload = document.querySelector('.file-upload');

    if (!fileInput || !fileList) return;

    // Handle file selection
    fileInput.addEventListener('change', function() {
      displayFiles(this.files);
    });

    // Drag and drop
    if (fileUpload) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
        fileUpload.addEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(function(eventName) {
        fileUpload.addEventListener(eventName, function() {
          fileUpload.classList.add('dragover');
        }, false);
      });

      ['dragleave', 'drop'].forEach(function(eventName) {
        fileUpload.addEventListener(eventName, function() {
          fileUpload.classList.remove('dragover');
        }, false);
      });

      fileUpload.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        displayFiles(files);
      }, false);
    }

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function displayFiles(files) {
      fileList.innerHTML = '';

      if (files.length === 0) return;

      const list = document.createElement('ul');
      list.style.cssText = 'margin-top: 1rem; padding: 0; list-style: none;';

      Array.from(files).forEach(function(file, index) {
        const item = document.createElement('li');
        item.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e9ecef; font-size: 0.875rem;';

        const fileInfo = document.createElement('span');
        fileInfo.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';
        fileInfo.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ${file.name} (${formatFileSize(file.size)})
        `;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.innerHTML = '&times;';
        removeBtn.style.cssText = 'background: none; border: none; color: #dc3545; font-size: 1.25rem; cursor: pointer; padding: 0 0.5rem;';
        removeBtn.setAttribute('aria-label', 'Remove file');
        removeBtn.addEventListener('click', function() {
          item.remove();
          // Note: Cannot modify FileList directly, would need DataTransfer for full implementation
        });

        item.appendChild(fileInfo);
        item.appendChild(removeBtn);
        list.appendChild(item);
      });

      fileList.appendChild(list);
    }

    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }

  /**
   * Contact form handling with Supabase integration
   */
  function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Basic validation
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      // Check privacy checkbox
      const privacyCheckbox = document.getElementById('privacy');
      if (privacyCheckbox && !privacyCheckbox.checked) {
        isValid = false;
        showModal(getLocalizedText('pleaseAcceptPrivacy'));
        return;
      }

      // Check that source and target language are different
      const sourceLangSelect = document.getElementById('source-lang');
      const targetLangSelect = document.getElementById('target-lang');
      if (sourceLangSelect && targetLangSelect &&
          sourceLangSelect.value && targetLangSelect.value &&
          sourceLangSelect.value === targetLangSelect.value) {
        isValid = false;
        showModal(getLocalizedText('sameLanguageError'));
        return;
      }

      if (!isValid) {
        showModal(getLocalizedText('fillRequiredFields'));
        return;
      }

      // Get form data
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = getLocalizedText('sending');

      try {
        // Upload files to Supabase Storage (if any)
        const fileUrls = [];
        const fileInput = document.getElementById('files');

        if (fileInput && fileInput.files.length > 0 && supabase) {
          const timestamp = Date.now();

          for (let i = 0; i < fileInput.files.length; i++) {
            const file = fileInput.files[i];
            const fileName = `${timestamp}_${i}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

            const { data, error } = await supabase.storage
              .from('documents')
              .upload(fileName, file);

            if (error) {
              console.error('File upload error:', error);
            } else if (data) {
              // Construct full public URL for the uploaded file
              const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/documents/${data.path}`;
              fileUrls.push(publicUrl);
            }
          }
        }

        // Prepare submission data
        const sourceLang = formData.get('source_language');
        const targetLang = formData.get('target_language');
        const languageDirection = sourceLang && targetLang ? `${sourceLang} → ${targetLang}` : null;

        const submissionData = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || null,
          document_type: null,
          language_direction: languageDirection,
          message: formData.get('message') || '',
          whatsapp_followup: false,
          file_urls: fileUrls,
          status: 'new'
        };

        // Submit to Supabase
        if (supabase) {
          const { error } = await supabase
            .from('contact_submissions')
            .insert([submissionData]);

          if (error) {
            console.error('Submission error:', error);
            // Fall back to WhatsApp if database fails
            throw new Error('Database submission failed');
          }
        }

        // Send email notification via Vercel API
        try {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: submissionData.name,
              email: submissionData.email,
              phone: submissionData.phone,
              languageDirection: submissionData.language_direction,
              message: submissionData.message,
              fileUrls: submissionData.file_urls
            })
          });

          if (!emailResponse.ok) {
            console.error('Email notification failed:', await emailResponse.text());
          }
        } catch (emailError) {
          console.error('Email notification error:', emailError);
          // Don't fail the form submission if email fails
        }

        // Success
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        form.reset();

        // Clear file list
        const fileList = document.getElementById('fileList');
        if (fileList) {
          fileList.innerHTML = '';
        }

        // Show success message, then ask about WhatsApp
        await showModal(getLocalizedText('formSuccess'));

        // Optional: Open WhatsApp with pre-filled message
        const openWhatsApp = await showModal(getLocalizedText('openWhatsApp'), 'confirm');
        if (openWhatsApp) {
          const name = submissionData.name;
          const langDir = submissionData.language_direction || '';
          const message = encodeURIComponent(
            `Hallo, ik wil graag een vertaling aanvragen.\n\nNaam: ${name}\nRichting: ${langDir}`
          );
          window.open(`https://wa.me/31610218737?text=${message}`, '_blank');
        }

      } catch (error) {
        console.error('Form submission error:', error);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Fallback: Open WhatsApp directly if Supabase fails
        const confirmWhatsApp = await showModal(getLocalizedText('submissionErrorWhatsApp'), 'confirm');
        if (confirmWhatsApp) {
          const name = formData.get('name');
          const email = formData.get('email');
          const messageText = formData.get('message');
          const whatsappMessage = encodeURIComponent(
            `Hallo, ik wil graag een vertaling aanvragen.\n\nNaam: ${name}\nEmail: ${email}\nBericht: ${messageText}`
          );
          window.open(`https://wa.me/31610218737?text=${whatsappMessage}`, '_blank');
        }
      }
    });

    // Clear error state on input
    form.querySelectorAll('input, textarea, select').forEach(function(field) {
      field.addEventListener('input', function() {
        this.classList.remove('error');
      });
    });
  }

  /**
   * Get localized text based on page language
   */
  function getLocalizedText(key) {
    const lang = document.documentElement.lang || 'nl';

    const texts = {
      nl: {
        pleaseAcceptPrivacy: 'Ga akkoord met de privacyverklaring om door te gaan.',
        fillRequiredFields: 'Vul alle verplichte velden in.',
        sameLanguageError: 'Bron- en doeltaal mogen niet hetzelfde zijn.',
        sending: 'Versturen...',
        formSuccess: 'Bedankt voor uw aanvraag! U ontvangt zo snel mogelijk een reactie.',
        openWhatsApp: 'Wilt u ook via WhatsApp contact opnemen voor een snellere reactie?',
        submissionErrorWhatsApp: 'Er is iets misgegaan. Wilt u uw aanvraag via WhatsApp versturen?'
      },
      en: {
        pleaseAcceptPrivacy: 'Please accept the privacy policy to continue.',
        fillRequiredFields: 'Please fill in all required fields.',
        sameLanguageError: 'Source and target language cannot be the same.',
        sending: 'Sending...',
        formSuccess: 'Thank you for your request! You will receive a response as soon as possible.',
        openWhatsApp: 'Would you also like to contact via WhatsApp for a faster response?',
        submissionErrorWhatsApp: 'Something went wrong. Would you like to send your request via WhatsApp?'
      },
      ar: {
        pleaseAcceptPrivacy: 'يرجى الموافقة على سياسة الخصوصية للمتابعة.',
        fillRequiredFields: 'يرجى ملء جميع الحقول المطلوبة.',
        sameLanguageError: 'لا يمكن أن تكون لغة المصدر والهدف متطابقتين.',
        sending: 'جاري الإرسال...',
        formSuccess: 'شكراً لطلبك! ستتلقى رداً في أقرب وقت ممكن.',
        openWhatsApp: 'هل تريد أيضاً التواصل عبر واتساب للحصول على رد أسرع؟',
        submissionErrorWhatsApp: 'حدث خطأ ما. هل تريد إرسال طلبك عبر واتساب؟'
      }
    };

    return texts[lang]?.[key] || texts.nl[key] || key;
  }

  /**
   * Custom modal dialog (replaces browser alert/confirm)
   * @param {string} message - The message to display
   * @param {string} type - 'alert' or 'confirm'
   * @returns {Promise<boolean>} - Resolves to true/false for confirm, always true for alert
   */
  function showModal(message, type = 'alert') {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.className = 'custom-modal-overlay';

      // Create modal container
      const modal = document.createElement('div');
      modal.className = 'custom-modal';

      // Create message
      const messageEl = document.createElement('p');
      messageEl.className = 'custom-modal-message';
      messageEl.textContent = message;

      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'custom-modal-buttons';

      // OK button
      const okBtn = document.createElement('button');
      okBtn.className = 'custom-modal-btn custom-modal-btn-primary';
      okBtn.textContent = 'OK';
      okBtn.onclick = () => {
        closeModal();
        resolve(true);
      };

      buttonContainer.appendChild(okBtn);

      // Cancel button (only for confirm)
      if (type === 'confirm') {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'custom-modal-btn custom-modal-btn-secondary';
        const lang = document.documentElement.lang || 'nl';
        cancelBtn.textContent = lang === 'ar' ? 'إلغاء' : (lang === 'en' ? 'Cancel' : 'Annuleren');
        cancelBtn.onclick = () => {
          closeModal();
          resolve(false);
        };
        buttonContainer.insertBefore(cancelBtn, okBtn);
      }

      modal.appendChild(messageEl);
      modal.appendChild(buttonContainer);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Focus OK button
      okBtn.focus();

      // Close on escape key
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          resolve(type === 'confirm' ? false : true);
        }
      };
      document.addEventListener('keydown', handleKeydown);

      function closeModal() {
        document.removeEventListener('keydown', handleKeydown);
        overlay.classList.add('closing');
        setTimeout(() => {
          overlay.remove();
        }, 200);
      }

      // Animate in
      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });
    });
  }

  // Make showModal available globally for form handling
  window.showModal = showModal;

  /**
   * Typewriter effect for hero title
   * Uses substring approach to preserve Arabic letter connections
   */
  function initTypewriter() {
    var element = document.querySelector('.typewriter');
    if (!element) return;

    var text = element.textContent;
    element.textContent = '';

    // Create text span to hold the typed text
    var textSpan = document.createElement('span');
    element.appendChild(textSpan);

    // Create cursor element
    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    element.appendChild(cursor);

    var index = 0;
    var speed = 80; // ms per character

    function type() {
      if (index <= text.length) {
        // Use substring to preserve Arabic letter connections
        textSpan.textContent = text.substring(0, index);
        index++;
        if (index <= text.length) {
          setTimeout(type, speed);
        }
      }
      // Keep cursor blinking infinitely after typing is done
    }

    // Start typing after a short delay
    setTimeout(type, 500);
  }

  /**
   * Scroll animations
   */
  function initAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll(
      '.benefit-card, .document-tag, .process-step, .faq-item'
    );

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function(el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  /**
   * Add CSS for animations and error states
   */
  (function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .form-group input.error,
      .form-group textarea.error,
      .form-group select.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
      }

      .file-upload.dragover {
        border-color: var(--color-primary);
        background: rgba(30, 58, 95, 0.05);
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
      }

      .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      .menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }

      /* Custom Modal Styles */
      .custom-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .custom-modal-overlay.active {
        opacity: 1;
      }

      .custom-modal-overlay.closing {
        opacity: 0;
      }

      .custom-modal {
        background: #111;
        border: 2px solid #FFD700;
        border-radius: 12px;
        padding: 2rem;
        max-width: 90%;
        width: 400px;
        text-align: center;
        transform: scale(0.9);
        transition: transform 0.2s ease;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
      }

      .custom-modal-overlay.active .custom-modal {
        transform: scale(1);
      }

      .custom-modal-message {
        color: #fff;
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 0 0 1.5rem 0;
      }

      .custom-modal-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      .custom-modal-btn {
        padding: 0.75rem 2rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
      }

      .custom-modal-btn-primary {
        background: #FFD700;
        color: #000;
        border-color: #FFD700;
      }

      .custom-modal-btn-primary:hover {
        background: #fff;
        border-color: #fff;
      }

      .custom-modal-btn-secondary {
        background: transparent;
        color: #fff;
        border-color: #666;
      }

      .custom-modal-btn-secondary:hover {
        border-color: #FFD700;
        color: #FFD700;
      }

      .custom-modal-btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.5);
      }
    `;
    document.head.appendChild(style);
  })();

})();
