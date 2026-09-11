(function () {
  'use strict'

  const ARCHIVED = 'Archived'
  const ACTIVE_STATUSES = ['Draft', 'In Review', 'Testing', 'Approved']

  const state = {
    prototypes: [],
    filtered: []
  }

  const elements = {
    summaryTotal: document.getElementById('summary-total'),
    summaryPatient: document.getElementById('summary-patient'),
    summaryProvider: document.getElementById('summary-provider'),
    summaryProjects: document.getElementById('summary-projects'),
    summaryOwners: document.getElementById('summary-owners'),
    searchInput: document.getElementById('search-input'),
    filterCategory: document.getElementById('filter-category'),
    filterStatus: document.getElementById('filter-status'),
    filterProject: document.getElementById('filter-project'),
    filterOwner: document.getElementById('filter-owner'),
    sortBy: document.getElementById('sort-by'),
    groupRadios: document.querySelectorAll('input[name="group-by"]'),
    results: document.getElementById('catalog-results'),
    errorState: document.getElementById('catalog-error'),
    emptyState: document.getElementById('catalog-empty'),
    noResultsState: document.getElementById('catalog-no-results'),
    resultsPanel: document.querySelector('.results-panel')
  }

  function statusClass(status) {
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`
  }

  function categoryClass(category) {
    return category === 'Patient' ? 'pill-patient' : 'pill-provider'
  }

  function populateSelect(select, values) {
    const current = select.value
    select.innerHTML = `<option value="All">All ${select.id.includes('project') ? 'projects' : 'owners'}</option>`
    values.forEach((value) => {
      const option = document.createElement('option')
      option.value = value
      option.textContent = value
      select.appendChild(option)
    })
    if ([...select.options].some((option) => option.value === current)) {
      select.value = current
    }
  }

  function getGroupBy() {
    const checked = [...elements.groupRadios].find((radio) => radio.checked)
    return checked ? checked.value : 'all'
  }

  function matchesSearch(item, query) {
    if (!query) return true
    const haystack = [
      item.name,
      item.project,
      item.owner,
      item.description,
      ...(item.tags || [])
    ].join(' ').toLowerCase()
    return haystack.includes(query)
  }

  function matchesStatus(item, statusFilter) {
    if (statusFilter === 'All') return true
    if (statusFilter === 'Active') return ACTIVE_STATUSES.includes(item.status)
    return item.status === statusFilter
  }

  function applyFilters() {
    const query = elements.searchInput.value.trim().toLowerCase()
    const category = elements.filterCategory.value
    const status = elements.filterStatus.value
    const project = elements.filterProject.value
    const owner = elements.filterOwner.value

    state.filtered = state.prototypes.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (!matchesStatus(item, status)) return false
      if (project !== 'All' && item.project !== project) return false
      if (owner !== 'All' && item.owner !== owner) return false
      if (!matchesSearch(item, query)) return false
      return true
    })

    sortFiltered()
    renderSummary()
    renderResults()
  }

  function sortFiltered() {
    const sortBy = elements.sortBy.value
    const sorters = {
      recent: (a, b) => b.lastUpdated.localeCompare(a.lastUpdated),
      name: (a, b) => a.name.localeCompare(b.name),
      project: (a, b) => a.project.localeCompare(b.project) || a.name.localeCompare(b.name),
      owner: (a, b) => a.owner.localeCompare(b.owner) || a.name.localeCompare(b.name),
      status: (a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name)
    }
    state.filtered.sort(sorters[sortBy] || sorters.recent)
  }

  function renderSummary() {
    const visible = state.filtered
    const projects = new Set(visible.map((item) => item.project))
    const owners = new Set(visible.map((item) => item.owner))

    elements.summaryTotal.textContent = String(visible.length)
    elements.summaryPatient.textContent = String(visible.filter((item) => item.category === 'Patient').length)
    elements.summaryProvider.textContent = String(visible.filter((item) => item.category === 'Provider').length)
    elements.summaryProjects.textContent = String(projects.size)
    elements.summaryOwners.textContent = String(owners.size)
  }

  function createCard(item) {
    const article = document.createElement('article')
    article.className = 'prototype-card'
    article.innerHTML = `
      <div class="card-header">
        <h3>${escapeHtml(item.name)}</h3>
        <span class="pill ${categoryClass(item.category)}">${escapeHtml(item.category)}</span>
      </div>
      <p class="card-meta"><strong>Project:</strong> ${escapeHtml(item.project)}</p>
      <p class="card-meta"><strong>Owner:</strong> ${escapeHtml(item.owner)}</p>
      <span class="pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span>
      <p class="card-description">${escapeHtml(item.description)}</p>
      <p class="card-meta"><strong>Version:</strong> ${escapeHtml(item.version)}</p>
      <div class="card-tags">${(item.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
      <div class="card-footer">
        <span class="card-updated">Updated ${escapeHtml(item.lastUpdated)}</span>
        <a class="btn" href="${escapeHtml(item.url)}">Open Prototype</a>
      </div>
    `
    return article
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  function renderGrouped(items, key) {
    const groups = new Map()
    items.forEach((item) => {
      const groupKey = item[key]
      if (!groups.has(groupKey)) groups.set(groupKey, [])
      groups.get(groupKey).push(item)
    })

    const fragment = document.createDocumentFragment()
    [...groups.keys()].sort((a, b) => a.localeCompare(b)).forEach((groupName) => {
      const section = document.createElement('section')
      section.className = 'group-block'
      section.innerHTML = `<h2 class="group-title">${escapeHtml(groupName)}</h2>`
      const grid = document.createElement('div')
      grid.className = 'cards-grid'
      groups.get(groupName).forEach((item) => grid.appendChild(createCard(item)))
      section.appendChild(grid)
      fragment.appendChild(section)
    })
    return fragment
  }

  function renderResults() {
    elements.errorState.hidden = true
    elements.emptyState.hidden = true
    elements.noResultsState.hidden = true
    elements.results.innerHTML = ''

    if (state.prototypes.length === 0) {
      elements.emptyState.hidden = false
      return
    }

    if (state.filtered.length === 0) {
      elements.noResultsState.hidden = false
      return
    }

    const groupBy = getGroupBy()
    if (groupBy === 'project') {
      elements.results.appendChild(renderGrouped(state.filtered, 'project'))
      return
    }

    if (groupBy === 'owner') {
      elements.results.appendChild(renderGrouped(state.filtered, 'owner'))
      return
    }

    const grid = document.createElement('div')
    grid.className = 'cards-grid'
    state.filtered.forEach((item) => grid.appendChild(createCard(item)))
    elements.results.appendChild(grid)
  }

  function bindEvents() {
    elements.searchInput.addEventListener('input', applyFilters)
    elements.filterCategory.addEventListener('change', applyFilters)
    elements.filterStatus.addEventListener('change', applyFilters)
    elements.filterProject.addEventListener('change', applyFilters)
    elements.filterOwner.addEventListener('change', applyFilters)
    elements.sortBy.addEventListener('change', applyFilters)
    elements.groupRadios.forEach((radio) => radio.addEventListener('change', applyFilters))
  }

  async function loadCatalog() {
    try {
      const response = await fetch('./generated/catalog.json')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      state.prototypes = Array.isArray(data.prototypes) ? data.prototypes : []

      populateSelect(elements.filterProject, [...new Set(state.prototypes.map((item) => item.project))].sort())
      populateSelect(elements.filterOwner, [...new Set(state.prototypes.map((item) => item.owner))].sort())

      applyFilters()
    } catch (error) {
      elements.errorState.hidden = false
      elements.results.innerHTML = ''
      console.error('Failed to load catalog:', error)
    } finally {
      elements.resultsPanel.setAttribute('aria-busy', 'false')
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents()
    loadCatalog()
  })
})()
