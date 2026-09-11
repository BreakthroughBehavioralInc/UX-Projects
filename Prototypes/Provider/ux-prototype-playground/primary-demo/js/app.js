/**
 * UX Prototype Playground — The UX Avengers
 * Core application logic: theme, navigation, counters, generator, projects, forms.
 */

(function () {
  'use strict'

  const STORAGE_KEY_THEME = 'ux-avengers-theme'

  const UX_FIX_MESSAGES = [
    '✅ Accessibility Improved',
    '✅ Workflow Simplified',
    '✅ Stakeholder Alignment Achieved',
    '✅ User Frustration Reduced',
    '✅ Journey Map Completed',
    '✅ Forms Made Less Annoying',
    '✅ Unnecessary Clicks Eliminated',
    '✅ Empty State Filled With Purpose',
    '✅ Error Message Humanized',
    '✅ Navigation Demystified'
  ]

  /** Initialize all modules when DOM is ready */
  document.addEventListener('DOMContentLoaded', init)

  function init() {
    initTheme()
    initNavigation()
    initCounters()
    initUxGenerator()
    initProjects()
    initContactForm()
    setActiveNavLink()
  }

  /** Dark mode: read preference, apply, toggle, persist */
  function initTheme() {
    const toggle = document.getElementById('theme-toggle')
    const saved = localStorage.getItem(STORAGE_KEY_THEME)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }

    if (toggle) {
      toggle.addEventListener('click', handleThemeToggle)
      toggle.setAttribute('aria-label', 'Toggle dark mode')
    }
  }

  function handleThemeToggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

    if (isDark) {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem(STORAGE_KEY_THEME, 'light')
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem(STORAGE_KEY_THEME, 'dark')
    }
  }

  /** Mobile navigation toggle */
  function initNavigation() {
    const toggle = document.getElementById('nav-toggle')
    const nav = document.getElementById('main-nav')

    if (!toggle || !nav) return

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open')
      toggle.setAttribute('aria-expanded', String(isOpen))
    })

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open')
        toggle.setAttribute('aria-expanded', 'false')
      })
    })
  }

  /** Highlight current page in navigation */
  function setActiveNavLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html'
    document.querySelectorAll('.main-nav a').forEach((link) => {
      const href = link.getAttribute('href')
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active')
      }
    })
  }

  /** Animated count-up statistics on home page */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]')
    if (!counters.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            animateCounter(entry.target)
            entry.target.dataset.animated = 'true'
          }
        })
      },
      { threshold: 0.3 }
    )

    counters.forEach((el) => observer.observe(el))
  }

  function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10)
    const suffix = element.dataset.suffix || ''
    const duration = 2000
    const start = performance.now()

    function update(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * target)

      element.textContent = current.toLocaleString() + suffix

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }

  /** Random UX improvement message generator */
  function initUxGenerator() {
    const button = document.getElementById('ux-fix-btn')
    const result = document.getElementById('ux-fix-result')

    if (!button || !result) return

    button.addEventListener('click', () => {
      const message = UX_FIX_MESSAGES[Math.floor(Math.random() * UX_FIX_MESSAGES.length)]
      result.textContent = message
      result.classList.remove('visible')

      void result.offsetWidth
      result.classList.add('visible')
    })
  }

  /** Projects page: load JSON, render cards, search, modal */
  function initProjects() {
    const grid = document.getElementById('projects-grid')
    if (!grid) return

    fetch('data/projects.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects')
        return res.json()
      })
      .then((projects) => {
        renderProjects(projects, grid)
        initProjectSearch(projects)
        initProjectModal()
      })
      .catch(() => {
        grid.innerHTML = '<p class="no-results visible">Unable to load projects. Please try again later.</p>'
      })
  }

  function renderProjects(projects, grid) {
    grid.innerHTML = projects
      .map(
        (project) => `
        <article class="project-card" data-project-id="${project.id}" data-search="${buildSearchText(project)}">
          <div class="project-image">
            <img src="${project.image}" alt="${project.title} preview" loading="lazy">
          </div>
          <div class="project-body">
            <div class="project-header">
              <h3>${project.title}</h3>
              <span class="status-pill ${project.statusClass}">${project.status}</span>
            </div>
            <p>${project.description}</p>
            <div class="project-tags">
              ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <button type="button" class="btn btn-primary btn-sm view-prototype-btn" data-project-id="${project.id}">
              View Prototype
            </button>
          </div>
        </article>
      `
      )
      .join('')

    grid.dataset.projects = JSON.stringify(projects)
  }

  function buildSearchText(project) {
    return [project.title, project.description, ...project.tags, project.status]
      .join(' ')
      .toLowerCase()
  }

  function initProjectSearch() {
    const searchInput = document.getElementById('project-search')
    const grid = document.getElementById('projects-grid')
    const noResults = document.getElementById('no-results')

    if (!searchInput || !grid) return

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase()
      const cards = grid.querySelectorAll('.project-card')
      let visibleCount = 0

      cards.forEach((card) => {
        const searchText = card.dataset.search || ''
        const matches = !query || searchText.includes(query)
        card.classList.toggle('hidden', !matches)
        if (matches) visibleCount++
      })

      if (noResults) {
        noResults.classList.toggle('visible', visibleCount === 0)
      }
    })
  }

  function initProjectModal() {
    const overlay = document.getElementById('project-modal')
    if (!overlay) return

    const closeBtn = overlay.querySelector('.modal-close')
    const grid = document.getElementById('projects-grid')

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-prototype-btn')
      if (!btn) return

      const projects = JSON.parse(grid.dataset.projects || '[]')
      const project = projects.find((p) => p.id === btn.dataset.projectId)
      if (project) openModal(project, overlay)
    })

    closeBtn.addEventListener('click', () => closeModal(overlay))

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay)
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeModal(overlay)
      }
    })
  }

  function openModal(project, overlay) {
    overlay.querySelector('.modal-title').textContent = project.title
    overlay.querySelector('.modal-image').src = project.image
    overlay.querySelector('.modal-image').alt = project.title
    overlay.querySelector('.modal-description').textContent = project.longDescription
    overlay.querySelector('.modal-status').textContent = project.status
    overlay.querySelector('.modal-status').className = `status-pill ${project.statusClass}`
    overlay.querySelector('.modal-timeline').textContent = project.timeline
    overlay.querySelector('.modal-stakeholders').textContent = project.stakeholders.join(', ')
    overlay.querySelector('.modal-impact').textContent = project.impact

    const tagsContainer = overlay.querySelector('.modal-tags')
    tagsContainer.innerHTML = project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')

    overlay.classList.add('open')
    overlay.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }

  function closeModal(overlay) {
    overlay.classList.remove('open')
    overlay.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  /** Contact form validation and mock submission */
  function initContactForm() {
    const form = document.getElementById('contact-form')
    if (!form) return

    form.addEventListener('submit', handleFormSubmit)
  }

  function handleFormSubmit(e) {
    e.preventDefault()

    const form = e.target
    const fields = [
      { id: 'name', message: 'Name is required.' },
      { id: 'email', message: 'A valid email is required.', validate: isValidEmail },
      { id: 'project', message: 'Please select a project.' },
      { id: 'request-type', message: 'Please select a request type.' },
      { id: 'message', message: 'Please include a message.' }
    ]

    let isValid = true

    fields.forEach(({ id, message, validate }) => {
      const input = form.querySelector(`#${id}`)
      const errorEl = form.querySelector(`#${id}-error`)
      const value = input.value.trim()
      let fieldValid = value.length > 0

      if (fieldValid && validate && !validate(value)) {
        fieldValid = false
        errorEl.textContent = message
      } else if (!fieldValid) {
        errorEl.textContent = message
      }

      input.classList.toggle('error', !fieldValid)
      errorEl.classList.toggle('visible', !fieldValid)

      if (!fieldValid) isValid = false
    })

    if (!isValid) return

    form.style.display = 'none'
    const success = document.getElementById('form-success')
    success.classList.add('visible')
    success.setAttribute('tabindex', '-1')
    success.focus()
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
})()
