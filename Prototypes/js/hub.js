(function () {
  'use strict'

  const ARCHIVED = 'Archived'
  const ACTIVE_STATUSES = ['Draft', 'In Review', 'Testing', 'Approved']
  const CATALOG_URL = './generated/catalog.json'
  const HUB_NAME = 'Prototype Hub'
  const DATE_DISPLAY_FALLBACK = '—'

  const FIELD_HELP = {
    project: 'The larger initiative or workstream.',
    category: 'The primary audience, Patient or Provider.',
    status: "The prototype's current lifecycle stage.",
    tags: 'Keywords used to describe and find the prototype.',
    owner: 'The person or team responsible for the prototype.',
    version: "The prototype's recorded version.",
    updated: 'The last recorded update date.'
  }

  const state = {
    prototypes: [],
    filtered: [],
    loadState: 'loading'
  }

  const manageState = {
    item: null,
    mode: 'changes',
    view: 'form',
    previousFocus: null,
    originalTags: [],
    workingTags: []
  }

  let elements = {}

  function cacheElements() {
    elements = {
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
      loadingState: document.getElementById('catalog-loading'),
      errorState: document.getElementById('catalog-error'),
      emptyState: document.getElementById('catalog-empty'),
      noResultsState: document.getElementById('catalog-no-results'),
      resultsPanel: document.querySelector('.results-panel'),
      resultsSummary: document.getElementById('results-summary'),
      resultsMeta: document.getElementById('results-meta'),
      clearFilters: document.getElementById('clear-filters'),
      manageOverlay: document.getElementById('manage-overlay'),
      manageDialog: document.getElementById('manage-dialog'),
      manageClose: document.getElementById('manage-close'),
      manageSubtitle: document.getElementById('manage-dialog-subtitle'),
      manageFormView: document.getElementById('manage-form-view'),
      manageReviewView: document.getElementById('manage-review-view'),
      manageTabChanges: document.getElementById('manage-tab-changes'),
      manageTabDiagnose: document.getElementById('manage-tab-diagnose'),
      manageChangesPanel: document.getElementById('manage-changes-panel'),
      manageDiagnosePanel: document.getElementById('manage-diagnose-panel'),
      manageFormError: document.getElementById('manage-form-error'),
      manageOverview: document.getElementById('manage-overview'),
      manageCurrentStatus: document.getElementById('manage-current-status'),
      manageNewStatus: document.getElementById('manage-new-status'),
      manageTagChips: document.getElementById('manage-tag-chips'),
      manageTagInput: document.getElementById('manage-tag-input'),
      manageOtherChanges: document.getElementById('manage-other-changes'),
      manageArchiveBlock: document.getElementById('manage-archive-block'),
      manageRestoreBlock: document.getElementById('manage-restore-block'),
      manageArchiveInclude: document.getElementById('manage-archive-include'),
      manageArchiveConfirmBlock: document.getElementById('manage-archive-confirm-block'),
      manageArchiveConfirm: document.getElementById('manage-archive-confirm'),
      manageArchiveConfirmError: document.getElementById('manage-archive-confirm-error'),
      manageArchiveBlockedMsg: document.getElementById('manage-archive-blocked-msg'),
      manageArchiveActiveMsg: document.getElementById('manage-archive-active-msg'),
      manageStatusSection: document.getElementById('manage-status-section'),
      manageTagsSection: document.getElementById('manage-tags-section'),
      manageOtherSection: document.getElementById('manage-other-section'),
      manageRestoreInclude: document.getElementById('manage-restore-include'),
      manageRestoreOptions: document.getElementById('manage-restore-options'),
      manageRestoreStatus: document.getElementById('manage-restore-status'),
      manageDiagnoseInput: document.getElementById('manage-diagnose-input'),
      manageChangeSummary: document.getElementById('manage-change-summary'),
      manageFinalTags: document.getElementById('manage-final-tags'),
      managePromptOutput: document.getElementById('manage-prompt-output'),
      manageCopyStatus: document.getElementById('manage-copy-status'),
      manageFooterForm: document.getElementById('manage-footer-form'),
      manageFooterReview: document.getElementById('manage-footer-review'),
      manageFooterDiagnose: document.getElementById('manage-footer-diagnose'),
      manageChangeCount: document.getElementById('manage-change-count'),
      manageCancel: document.getElementById('manage-cancel'),
      manageReviewBtn: document.getElementById('manage-review-btn'),
      manageBackEdit: document.getElementById('manage-back-edit'),
      manageCopy: document.getElementById('manage-copy'),
      manageCancelDiagnose: document.getElementById('manage-cancel-diagnose'),
      manageReviewDiagnoseBtn: document.getElementById('manage-review-diagnose-btn')
    }
  }

  function validateElements() {
    const required = [
      'summaryTotal',
      'summaryPatient',
      'summaryProvider',
      'summaryProjects',
      'summaryOwners',
      'searchInput',
      'filterCategory',
      'filterStatus',
      'filterProject',
      'filterOwner',
      'sortBy',
      'results',
      'loadingState',
      'errorState',
      'emptyState',
      'noResultsState',
      'resultsPanel',
      'resultsSummary',
      'resultsMeta',
      'clearFilters'
    ]

    const missing = required.filter((key) => !elements[key])
    if (missing.length > 0) {
      console.error(`${HUB_NAME}: missing required DOM elements:`, missing.join(', '))
      return false
    }

    return true
  }

  function statusClass(status) {
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`
  }

  function categoryClass(category) {
    return category === 'Patient' ? 'label-patient' : 'label-provider'
  }

  function isValidIsoDateParts(year, month, day) {
    if (month < 1 || month > 12 || day < 1) return false

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    const maxDay = month === 2 && isLeapYear ? 29 : daysInMonth[month - 1]
    return day <= maxDay
  }

  function formatDisplayDate(value) {
    if (value === null || value === undefined) return DATE_DISPLAY_FALLBACK

    const trimmed = String(value).trim()
    if (!trimmed) return DATE_DISPLAY_FALLBACK

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
    if (!isoMatch) return DATE_DISPLAY_FALLBACK

    const year = Number(isoMatch[1])
    const month = Number(isoMatch[2])
    const day = Number(isoMatch[3])
    if (!isValidIsoDateParts(year, month, day)) return DATE_DISPLAY_FALLBACK

    return `${isoMatch[2]}/${isoMatch[3]}/${isoMatch[1]}`
  }

  function normalizeCatalog(data) {
    if (Array.isArray(data)) {
      return data
    }

    if (data && Array.isArray(data.prototypes)) {
      return data.prototypes
    }

    return []
  }

  function getCatalogFetchUrl() {
    return new URL(CATALOG_URL, window.location.href).href
  }

  function populateSelect(select, values, allLabel) {
    const current = select.value
    select.innerHTML = `<option value="All">${allLabel}</option>`
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

  function getGroupByLabel() {
    const groupBy = getGroupBy()
    if (groupBy === 'project') return 'Project'
    if (groupBy === 'owner') return 'Owner'
    return 'Show all'
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

  function setSummaryPlaceholder() {
    elements.summaryTotal.textContent = '—'
    elements.summaryPatient.textContent = '—'
    elements.summaryProvider.textContent = '—'
    elements.summaryProjects.textContent = '—'
    elements.summaryOwners.textContent = '—'
    renderResultsToolbar()
  }

  function hasActiveFilters() {
    return (
      elements.searchInput.value.trim() !== '' ||
      elements.filterCategory.value !== 'All' ||
      elements.filterStatus.value !== 'Active' ||
      elements.filterProject.value !== 'All' ||
      elements.filterOwner.value !== 'All' ||
      elements.sortBy.value !== 'recent' ||
      getGroupBy() !== 'all'
    )
  }

  function getActiveFilterSummary() {
    const parts = []

    if (elements.searchInput.value.trim()) {
      parts.push(`Search: "${elements.searchInput.value.trim()}"`)
    }
    if (elements.filterCategory.value !== 'All') {
      parts.push(`Category: ${elements.filterCategory.value}`)
    }
    if (elements.filterStatus.value !== 'Active') {
      parts.push(`Status: ${elements.filterStatus.value}`)
    }
    if (elements.filterProject.value !== 'All') {
      parts.push(`Project: ${elements.filterProject.value}`)
    }
    if (elements.filterOwner.value !== 'All') {
      parts.push(`Owner: ${elements.filterOwner.value}`)
    }

    return parts.length > 0 ? parts.join(' · ') : 'No active filters'
  }

  function renderResultsToolbar() {
    if (state.loadState !== 'loaded') {
      elements.resultsSummary.textContent = 'Showing — prototypes'
      elements.resultsMeta.textContent = 'Grouped by: Show all'
      elements.clearFilters.disabled = true
      return
    }

    const count = state.filtered.length
    elements.resultsSummary.textContent = `Showing ${count} prototype${count === 1 ? '' : 's'}`
    elements.resultsMeta.textContent = `Grouped by: ${getGroupByLabel()} · ${getActiveFilterSummary()}`
    elements.clearFilters.disabled = !hasActiveFilters()
  }

  function clearFilters() {
    elements.searchInput.value = ''
    elements.filterCategory.value = 'All'
    elements.filterStatus.value = 'Active'
    elements.filterProject.value = 'All'
    elements.filterOwner.value = 'All'
    elements.sortBy.value = 'recent'
    const allRadio = [...elements.groupRadios].find((radio) => radio.value === 'all')
    if (allRadio) allRadio.checked = true
    applyFilters()
  }

  function applyFilters() {
    if (state.loadState !== 'loaded') return

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
    renderResultsToolbar()
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
    const owners = new Set(visible.filter((item) => item.owner).map((item) => item.owner))

    elements.summaryTotal.textContent = String(visible.length)
    elements.summaryPatient.textContent = String(visible.filter((item) => item.category === 'Patient').length)
    elements.summaryProvider.textContent = String(visible.filter((item) => item.category === 'Provider').length)
    elements.summaryProjects.textContent = String(projects.size)
    elements.summaryOwners.textContent = String(owners.size)
  }

  function createCard(item) {
    const article = document.createElement('article')
    article.className = 'prototype-record'
    article.dataset.prototypeName = item.name
    article.innerHTML = `
      <div class="record-header">
        <h3>${escapeHtml(item.name)}</h3>
        <span class="status-label ${statusClass(item.status)}" title="${escapeHtml(FIELD_HELP.status)}">${escapeHtml(item.status)}</span>
      </div>
      <div class="record-meta-row">
        <span class="record-project field-help" title="${escapeHtml(FIELD_HELP.project)}">${escapeHtml(item.project)}</span>
        <span class="label ${categoryClass(item.category)}" title="${escapeHtml(FIELD_HELP.category)}">${escapeHtml(item.category)}</span>
      </div>
      <div class="record-body">
        <p class="record-description">${escapeHtml(item.description)}</p>
        <dl class="record-details">
          <div>
            <dt class="field-help" title="${escapeHtml(FIELD_HELP.owner)}">Owner</dt>
            <dd>${escapeHtml(item.owner)}</dd>
          </div>
          <div>
            <dt class="field-help" title="${escapeHtml(FIELD_HELP.version)}">Version</dt>
            <dd>${escapeHtml(item.version)}</dd>
          </div>
          <div>
            <dt class="field-help" title="${escapeHtml(FIELD_HELP.updated)}">Updated</dt>
            <dd>${escapeHtml(formatDisplayDate(item.lastUpdated))}</dd>
          </div>
        </dl>
        <div class="record-tags" title="${escapeHtml(FIELD_HELP.tags)}">${(item.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('') || '<span class="record-tags-empty">No tags</span>'}</div>
      </div>
      <div class="record-actions">
        <a class="btn-primary" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open Prototype</a>
        <button type="button" class="btn-secondary manage-open-btn" data-prototype-name="${escapeHtml(item.name)}" aria-label="Manage ${escapeHtml(item.name)}">Manage</button>
      </div>
    `
    const manageButton = article.querySelector('.manage-open-btn')
    manageButton.addEventListener('click', () => openManagePanel(item, manageButton))
    return article
  }

  function buildPromptHeader(item, action) {
    return `@manage-prototype\n\nPrototype: ${item.name}\nAction: ${action}\n`
  }

  function buildDiagnosePrompt(item, description) {
    return `${buildPromptHeader(item, 'Diagnose')}\nI am experiencing:\n${description}\n\nInspect first without changing files. Explain the issue in plain language and show the safest proposed next step.`
  }

  function formatTagBullets(tags) {
    return tags.map((tag) => `  - ${tag}`).join('\n')
  }

  function initializeTagsFromCatalog(item) {
    const tags = Array.isArray(item?.tags) ? item.tags.map((tag) => String(tag).trim()).filter(Boolean) : []
    manageState.originalTags = [...tags]
    manageState.workingTags = [...tags]
  }

  function resetManageFormFields() {
    manageState.mode = 'changes'
    manageState.view = 'form'
    if (elements.manageNewStatus) {
      elements.manageNewStatus.value = ''
      elements.manageNewStatus.disabled = false
    }
    if (elements.manageTagInput) {
      elements.manageTagInput.value = ''
      elements.manageTagInput.disabled = false
    }
    if (elements.manageOtherChanges) {
      elements.manageOtherChanges.value = ''
      elements.manageOtherChanges.disabled = false
    }
    if (elements.manageDiagnoseInput) elements.manageDiagnoseInput.value = ''
    if (elements.manageArchiveInclude) {
      elements.manageArchiveInclude.checked = false
      elements.manageArchiveInclude.disabled = false
    }
    if (elements.manageArchiveConfirm) elements.manageArchiveConfirm.checked = false
    if (elements.manageRestoreInclude) elements.manageRestoreInclude.checked = false
    if (elements.manageRestoreStatus) elements.manageRestoreStatus.value = 'Draft'
    if (elements.managePromptOutput) elements.managePromptOutput.value = ''
    if (elements.manageCopyStatus) elements.manageCopyStatus.textContent = ''
    if (elements.manageFinalTags) {
      elements.manageFinalTags.hidden = true
      elements.manageFinalTags.textContent = ''
    }
    if (elements.manageArchiveBlockedMsg) elements.manageArchiveBlockedMsg.hidden = true
    if (elements.manageArchiveActiveMsg) elements.manageArchiveActiveMsg.hidden = true
    if (elements.manageArchiveConfirmBlock) elements.manageArchiveConfirmBlock.hidden = true
    clearManageFormError()
    setManageMode('changes')
    setManageView('form')
  }

  function resetManageFormState() {
    manageState.originalTags = []
    manageState.workingTags = []
    resetManageFormFields()
  }

  function updateManageFooters() {
    const isReview = manageState.view === 'review'
    const isChanges = manageState.mode === 'changes'
    elements.manageFooterReview.hidden = !isReview
    elements.manageFooterForm.hidden = isReview || !isChanges
    elements.manageFooterDiagnose.hidden = isReview || isChanges
  }

  function setManageMode(mode) {
    manageState.mode = mode
    const isChanges = mode === 'changes'
    elements.manageTabChanges.classList.toggle('is-active', isChanges)
    elements.manageTabDiagnose.classList.toggle('is-active', !isChanges)
    elements.manageTabChanges.setAttribute('aria-selected', String(isChanges))
    elements.manageTabDiagnose.setAttribute('aria-selected', String(!isChanges))
    elements.manageChangesPanel.hidden = !isChanges
    elements.manageDiagnosePanel.hidden = isChanges
    if (manageState.view === 'form') {
      clearManageFormError()
    }
    updateManageFooters()
    updateManageFooterState()
  }

  function setManageView(view) {
    manageState.view = view
    const isReview = view === 'review'
    elements.manageFormView.hidden = isReview
    elements.manageReviewView.hidden = !isReview
    updateManageFooters()
    if (!isReview) {
      updateManageFooterState()
    }
  }

  function renderManageOverview(item) {
    elements.manageOverview.innerHTML = `
      <div class="manage-overview-item"><dt title="${escapeHtml(FIELD_HELP.project)}">Project</dt><dd>${escapeHtml(item.project)}</dd></div>
      <div class="manage-overview-item"><dt title="${escapeHtml(FIELD_HELP.category)}">Category</dt><dd>${escapeHtml(item.category)}</dd></div>
      <div class="manage-overview-item"><dt title="${escapeHtml(FIELD_HELP.owner)}">Owner</dt><dd>${escapeHtml(item.owner)}</dd></div>
      <div class="manage-overview-item"><dt title="${escapeHtml(FIELD_HELP.version)}">Version</dt><dd>${escapeHtml(item.version)}</dd></div>
      <div class="manage-overview-item"><dt title="${escapeHtml(FIELD_HELP.updated)}">Updated</dt><dd>${escapeHtml(formatDisplayDate(item.lastUpdated))}</dd></div>
    `
    elements.manageCurrentStatus.innerHTML = `<span class="status-label ${statusClass(item.status)}">${escapeHtml(item.status)}</span>`
  }

  function populateManageSelects(item) {
    const statusOptions = ['<option value="">No change</option>']
      .concat(ACTIVE_STATUSES.map((status) => `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`))
      .join('')
    elements.manageNewStatus.innerHTML = statusOptions

    const restoreOptions = ACTIVE_STATUSES.map((status) => {
      const selected = status === 'Draft' ? ' selected' : ''
      return `<option value="${escapeHtml(status)}"${selected}>${escapeHtml(status)}</option>`
    }).join('')
    elements.manageRestoreStatus.innerHTML = restoreOptions

    const isArchived = item.status === ARCHIVED
    elements.manageArchiveBlock.hidden = isArchived
    elements.manageRestoreBlock.hidden = !isArchived
  }

  function getWorkingTags() {
    return [...manageState.workingTags]
  }

  function getTagDiff() {
    const original = manageState.originalTags
    const working = manageState.workingTags
    const addedTags = working.filter((tag) => !original.includes(tag))
    const removedTags = original.filter((tag) => !working.includes(tag))
    const unchangedTags = original.filter((tag) => working.includes(tag))
    return { addedTags, removedTags, unchangedTags }
  }

  function hasTagChanges() {
    const { addedTags, removedTags } = getTagDiff()
    return addedTags.length > 0 || removedTags.length > 0
  }

  function getStatusChange() {
    const value = elements.manageNewStatus.value
    if (!value || !manageState.item) return null
    if (value === manageState.item.status) return null
    return value
  }

  function hasOtherChanges() {
    return elements.manageOtherChanges.value.trim().length > 0
  }

  function isArchiveSelected() {
    return Boolean(elements.manageArchiveInclude?.checked) && manageState.item?.status !== ARCHIVED
  }

  function isArchiveConfirmed() {
    return Boolean(elements.manageArchiveConfirm?.checked)
  }

  function isArchiveConfirmedAndSelected() {
    return isArchiveSelected() && isArchiveConfirmed()
  }

  function isArchivePendingConfirmation() {
    return isArchiveSelected() && !isArchiveConfirmed()
  }

  function countNonArchiveChanges() {
    let count = 0
    if (getStatusChange()) count += 1
    if (hasTagChanges()) count += 1
    if (hasOtherChanges()) count += 1
    return count
  }

  function countReviewableChanges() {
    if (isArchiveConfirmedAndSelected()) return 1
    if (isRestoreSelected()) return 1
    return countNonArchiveChanges()
  }

  function isRestoreSelected() {
    return Boolean(elements.manageRestoreInclude?.checked) && manageState.item?.status === ARCHIVED
  }

  function hasMetadataChangesBesidesLifecycle() {
    return Boolean(getStatusChange() || hasTagChanges() || hasOtherChanges())
  }

  function hasRestoreConflict() {
    return isRestoreSelected() && hasMetadataChangesBesidesLifecycle()
  }

  function isRoutineEditingLocked() {
    return isArchiveConfirmedAndSelected()
  }

  function clearArchiveSelection() {
    if (elements.manageArchiveInclude) elements.manageArchiveInclude.checked = false
    if (elements.manageArchiveConfirm) {
      elements.manageArchiveConfirm.checked = false
      elements.manageArchiveConfirm.removeAttribute('aria-invalid')
    }
    if (elements.manageArchiveConfirmError) {
      elements.manageArchiveConfirmError.hidden = true
      elements.manageArchiveConfirmError.textContent = ''
    }
    if (elements.manageArchiveConfirmBlock) {
      elements.manageArchiveConfirmBlock.hidden = true
    }
  }

  function updateArchiveExclusiveMessages() {
    if (!elements.manageArchiveBlockedMsg || !elements.manageArchiveActiveMsg) return

    elements.manageArchiveBlockedMsg.hidden = true
    elements.manageArchiveActiveMsg.hidden = true

    if (isArchiveConfirmedAndSelected()) {
      elements.manageArchiveActiveMsg.hidden = false
      return
    }

    if (hasMetadataChangesBesidesLifecycle() && !isArchiveSelected()) {
      elements.manageArchiveBlockedMsg.hidden = false
    }
  }

  function updateManageFormEditingState() {
    const archiveLocked = isRoutineEditingLocked()
    const blockArchiveInclude = hasMetadataChangesBesidesLifecycle() && !isArchiveSelected()

    if (elements.manageNewStatus) elements.manageNewStatus.disabled = archiveLocked
    if (elements.manageTagInput) elements.manageTagInput.disabled = archiveLocked
    if (elements.manageOtherChanges) elements.manageOtherChanges.disabled = archiveLocked
    if (elements.manageArchiveInclude) elements.manageArchiveInclude.disabled = blockArchiveInclude

    if (elements.manageStatusSection) {
      elements.manageStatusSection.classList.toggle('is-readonly', archiveLocked)
    }
    if (elements.manageTagsSection) {
      elements.manageTagsSection.classList.toggle('is-readonly', archiveLocked)
    }
    if (elements.manageOtherSection) {
      elements.manageOtherSection.classList.toggle('is-readonly', archiveLocked)
    }

    elements.manageTagChips?.querySelectorAll('.manage-tag-chip-remove').forEach((button) => {
      button.disabled = archiveLocked
    })
  }

  function handleMetadataChange() {
    if (isArchiveSelected() && hasMetadataChangesBesidesLifecycle()) {
      clearArchiveSelection()
    }
    updateManageFormState()
  }

  function handleArchiveIncludeChange() {
    if (elements.manageArchiveInclude?.checked && hasMetadataChangesBesidesLifecycle()) {
      elements.manageArchiveInclude.checked = false
      updateManageFormState()
      return
    }

    const show = isArchiveSelected()
    elements.manageArchiveConfirmBlock.hidden = !show
    if (!show) {
      if (elements.manageArchiveConfirm) {
        elements.manageArchiveConfirm.checked = false
        elements.manageArchiveConfirm.removeAttribute('aria-invalid')
      }
      if (elements.manageArchiveConfirmError) {
        elements.manageArchiveConfirmError.hidden = true
        elements.manageArchiveConfirmError.textContent = ''
      }
    }
    updateManageFormState()
  }

  function updateManageFormState() {
    updateManageFormEditingState()
    updateArchiveExclusiveMessages()
    updateManageFooterState()
  }

  function renderTagChips() {
    const tags = getWorkingTags()
    const archiveLocked = isRoutineEditingLocked()
    if (tags.length === 0) {
      if (manageState.originalTags.length === 0) {
        elements.manageTagChips.innerHTML = '<p class="manage-tag-empty">No tags have been added.</p>'
      } else {
        elements.manageTagChips.innerHTML = ''
      }
      return
    }
    elements.manageTagChips.innerHTML = tags.map((tag) => `
      <span class="manage-tag-chip">
        <span class="manage-tag-chip-label">${escapeHtml(tag)}</span>
        <button type="button" class="manage-tag-chip-remove" data-tag="${escapeHtml(tag)}" aria-label="Remove tag ${escapeHtml(tag)}"${archiveLocked ? ' disabled' : ''}>
          <span aria-hidden="true">&times;</span>
        </button>
      </span>
    `).join('')
  }

  function addTagFromInput() {
    if (isRoutineEditingLocked()) return

    const tag = elements.manageTagInput.value.trim()
    elements.manageTagInput.value = ''
    if (!tag) return

    if (manageState.workingTags.includes(tag)) {
      showManageFormError(`The tag "${tag}" is already in the list.`)
      return
    }

    clearManageFormError()
    manageState.workingTags = [...manageState.workingTags, tag]
    renderTagChips()
    handleMetadataChange()
  }

  function removeTag(tag) {
    if (isRoutineEditingLocked()) return

    manageState.workingTags = manageState.workingTags.filter((item) => item !== tag)
    renderTagChips()
    handleMetadataChange()
  }

  function buildChangeSummaryLines() {
    const lines = []
    const item = manageState.item
    if (!item) return lines

    if (isArchiveConfirmedAndSelected()) {
      lines.push('Archive this prototype. The prototype will be hidden from the default Hub view but will not be deleted.')
      return lines
    }

    const statusChange = getStatusChange()
    if (statusChange) {
      lines.push(`Change status from ${item.status} to ${statusChange}`)
    }

    const { addedTags, removedTags } = getTagDiff()

    if (addedTags.length === 1) {
      lines.push(`Add tag: ${addedTags[0]}`)
    } else if (addedTags.length > 1) {
      lines.push(`Add tags: ${addedTags.join(', ')}`)
    }

    if (removedTags.length === 1) {
      lines.push(`Remove tag: ${removedTags[0]}`)
    } else if (removedTags.length > 1) {
      lines.push(`Remove tags: ${removedTags.join(', ')}`)
    }

    if (hasOtherChanges()) {
      lines.push('Update other prototype details based on your request')
    }

    if (isRestoreSelected()) {
      lines.push(`Restore this prototype with status ${elements.manageRestoreStatus.value}`)
    }

    return lines
  }

  function getSelectedChangeCount() {
    if (manageState.mode === 'diagnose') {
      return elements.manageDiagnoseInput.value.trim() ? 1 : 0
    }
    return countReviewableChanges()
  }

  function clearManageFormError() {
    elements.manageFormError.hidden = true
    elements.manageFormError.textContent = ''
  }

  function showManageFormError(message) {
    elements.manageFormError.hidden = false
    elements.manageFormError.textContent = message
  }

  function updateArchiveConfirmError() {
    if (!elements.manageArchiveConfirmError || !elements.manageArchiveConfirm) return

    const showError = isArchivePendingConfirmation()
    elements.manageArchiveConfirmError.hidden = !showError
    elements.manageArchiveConfirmError.textContent = showError
      ? 'Confirm that you understand the prototype will be hidden from the default Hub view.'
      : ''

    if (showError) {
      elements.manageArchiveConfirm.setAttribute('aria-invalid', 'true')
    } else {
      elements.manageArchiveConfirm.removeAttribute('aria-invalid')
    }
  }

  function updateManageFooterState() {
    clearManageFormError()
    updateArchiveConfirmError()

    if (manageState.mode === 'diagnose') {
      const hasText = elements.manageDiagnoseInput.value.trim().length > 0
      elements.manageReviewDiagnoseBtn.disabled = !hasText
      return
    }

    const totalCount = countReviewableChanges()
    const archivePending = isArchivePendingConfirmation()

    if (hasRestoreConflict()) {
      showManageFormError('Restore cannot be combined with other metadata changes in one request. Use Restore only, or make other edits separately.')
    }

    if (archivePending && !isRestoreSelected()) {
      elements.manageChangeCount.textContent = 'Archive confirmation required'
    } else if (totalCount === 0) {
      elements.manageChangeCount.textContent = 'No changes selected'
    } else {
      elements.manageChangeCount.textContent = `${totalCount} change${totalCount === 1 ? '' : 's'} selected`
    }

    let canReview = totalCount > 0 && !hasRestoreConflict()
    if (archivePending && !isRestoreSelected()) {
      canReview = false
    }
    elements.manageReviewBtn.disabled = !canReview
  }

  function buildCombinedPrompt() {
    const item = manageState.item
    if (!item) return ''

    if (manageState.mode === 'diagnose') {
      return buildDiagnosePrompt(item, elements.manageDiagnoseInput.value.trim())
    }

    if (isRestoreSelected() && !hasRestoreConflict()) {
      const restoreStatus = elements.manageRestoreStatus.value
      return `${buildPromptHeader(item, 'Restore')}\nRestore this prototype with status ${restoreStatus}.\n\nHelp me validate the change and show the updated Prototype Hub preview before committing or pushing.`
    }

    if (isArchiveConfirmedAndSelected()) {
      return `${buildPromptHeader(item, 'Archive')}\nExplain what archiving will do, validate the change, and show the updated Prototype Hub preview before committing or pushing.`
    }

    const bullets = []
    const statusChange = getStatusChange()
    if (statusChange) {
      bullets.push(`- Change the status from ${item.status} to ${statusChange}.`)
    }

    const { addedTags, removedTags, unchangedTags } = getTagDiff()

    if (addedTags.length > 0) {
      bullets.push('- Add these tags:')
      bullets.push(formatTagBullets(addedTags))
    }
    if (removedTags.length > 0) {
      bullets.push('- Remove these tags:')
      bullets.push(formatTagBullets(removedTags))
    }
    if (addedTags.length > 0 && removedTags.length > 0 && unchangedTags.length > 0) {
      bullets.push('- Preserve these existing tags:')
      bullets.push(formatTagBullets(unchangedTags))
    }

    if (hasOtherChanges()) {
      bullets.push('- Update other prototype details based on this request:')
      bullets.push(`  ${elements.manageOtherChanges.value.trim()}`)
    }

    if (bullets.length === 0) return ''

    return `${buildPromptHeader(item, 'Update')}\nMake these changes:\n\n${bullets.join('\n')}\n\nPreserve all unrelated prototype content and metadata.\n\nShow the proposed changes and updated Prototype Hub card in a local preview before committing or pushing.`
  }

  function goToReview() {
    const prompt = buildCombinedPrompt()
    if (!prompt) return

    const lines = buildChangeSummaryLines()
    elements.manageChangeSummary.innerHTML = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')
    if (hasTagChanges() && elements.manageFinalTags) {
      elements.manageFinalTags.textContent = `Final tags: ${getWorkingTags().join(', ') || 'None'}`
      elements.manageFinalTags.hidden = false
    } else if (elements.manageFinalTags) {
      elements.manageFinalTags.hidden = true
      elements.manageFinalTags.textContent = ''
    }
    elements.managePromptOutput.value = prompt
    elements.manageCopyStatus.textContent = ''
    setManageView('review')
    elements.managePromptOutput.focus()
  }

  function goBackToEdit() {
    setManageView('form')
    updateManageFooterState()
  }

  function openManagePanel(item, trigger) {
    if (!elements.manageOverlay) return

    manageState.item = item
    manageState.previousFocus = trigger || document.activeElement

    document.getElementById('manage-dialog-title').textContent = 'Manage prototype'
    elements.manageSubtitle.textContent = item.name

    initializeTagsFromCatalog(item)
    resetManageFormFields()
    renderManageOverview(item)
    populateManageSelects(item)
    renderTagChips()
    updateArchiveConfirmVisibility()
    updateRestoreOptionsVisibility()
    updateManageFormState()

    elements.manageOverlay.hidden = false
    document.body.classList.add('manage-open')
    elements.manageClose.focus()
  }

  function closeManagePanel() {
    if (!elements.manageOverlay) return

    elements.manageOverlay.hidden = true
    document.body.classList.remove('manage-open')
    resetManageFormState()
    manageState.item = null

    if (manageState.previousFocus && typeof manageState.previousFocus.focus === 'function') {
      manageState.previousFocus.focus()
    }
    manageState.previousFocus = null
  }

  function updateArchiveConfirmVisibility() {
    const show = isArchiveSelected()
    elements.manageArchiveConfirmBlock.hidden = !show
    if (!show && elements.manageArchiveConfirm) {
      elements.manageArchiveConfirm.checked = false
      elements.manageArchiveConfirm.removeAttribute('aria-invalid')
      if (elements.manageArchiveConfirmError) {
        elements.manageArchiveConfirmError.hidden = true
        elements.manageArchiveConfirmError.textContent = ''
      }
    }
  }

  function updateRestoreOptionsVisibility() {
    const show = isRestoreSelected()
    elements.manageRestoreOptions.hidden = !show
    updateManageFooterState()
  }

  async function copyManagePrompt() {
    const text = elements.managePromptOutput.value
    if (!text) return

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        elements.managePromptOutput.select()
        document.execCommand('copy')
      }
      elements.manageCopyStatus.textContent = 'Prompt copied. Open the complete UX-Projects repository in Cursor, start a new chat, and paste the prompt.'
    } catch (error) {
      elements.manageCopyStatus.textContent = 'Copy failed. Select the prompt text and copy it manually.'
    }
  }

  function handleManageOverlayKeydown(event) {
    if (elements.manageOverlay.hidden) return

    if (event.key === 'Escape') {
      event.preventDefault()
      closeManagePanel()
      return
    }

    if (event.key !== 'Tab' || !elements.manageDialog) return

    const focusable = elements.manageDialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function bindManageEvents() {
    if (!elements.manageOverlay) return

    elements.manageClose.addEventListener('click', closeManagePanel)
    elements.manageCancel.addEventListener('click', closeManagePanel)
    elements.manageCancelDiagnose.addEventListener('click', closeManagePanel)
    elements.manageReviewBtn.addEventListener('click', goToReview)
    elements.manageReviewDiagnoseBtn.addEventListener('click', goToReview)
    elements.manageBackEdit.addEventListener('click', goBackToEdit)
    elements.manageCopy.addEventListener('click', copyManagePrompt)

    elements.manageTabChanges.addEventListener('click', () => setManageMode('changes'))
    elements.manageTabDiagnose.addEventListener('click', () => setManageMode('diagnose'))

    elements.manageNewStatus.addEventListener('change', handleMetadataChange)
    elements.manageOtherChanges.addEventListener('input', handleMetadataChange)
    elements.manageDiagnoseInput.addEventListener('input', updateManageFooterState)

    elements.manageTagInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        addTagFromInput()
      }
    })

    elements.manageTagChips.addEventListener('click', (event) => {
      const button = event.target.closest('.manage-tag-chip-remove')
      if (!button) return
      removeTag(button.dataset.tag)
    })

    elements.manageArchiveInclude.addEventListener('change', handleArchiveIncludeChange)
    elements.manageArchiveConfirm.addEventListener('change', updateManageFormState)

    elements.manageRestoreInclude.addEventListener('change', () => {
      updateRestoreOptionsVisibility()
    })
    elements.manageRestoreStatus.addEventListener('change', updateManageFooterState)

    elements.manageOverlay.addEventListener('click', (event) => {
      if (event.target === elements.manageOverlay) {
        closeManagePanel()
      }
    })

    document.addEventListener('keydown', handleManageOverlayKeydown)
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
    Array.from(groups.keys()).sort((a, b) => a.localeCompare(b)).forEach((groupName) => {
      const section = document.createElement('section')
      section.className = 'group-block'
      section.innerHTML = `<h2 class="group-title">${escapeHtml(groupName)}</h2>`
      const grid = document.createElement('div')
      grid.className = 'records-grid'
      groups.get(groupName).forEach((item) => grid.appendChild(createCard(item)))
      section.appendChild(grid)
      fragment.appendChild(section)
    })
    return fragment
  }

  function hideAllStates() {
    elements.loadingState.hidden = true
    elements.errorState.hidden = true
    elements.emptyState.hidden = true
    elements.noResultsState.hidden = true
  }

  function showLoadingState() {
    hideAllStates()
    elements.loadingState.hidden = false
    elements.results.innerHTML = ''
    setSummaryPlaceholder()
  }

  function showErrorState(message) {
    state.loadState = 'error'
    hideAllStates()
    elements.errorState.hidden = false
    elements.errorState.querySelector('p').textContent = message
    elements.results.innerHTML = ''
    setSummaryPlaceholder()
  }

  function renderResults() {
    hideAllStates()
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
    grid.className = 'records-grid'
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
    elements.clearFilters.addEventListener('click', clearFilters)
  }

  async function loadCatalog() {
    showLoadingState()

    const catalogUrl = getCatalogFetchUrl()

    try {
      const response = await fetch(catalogUrl, {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Catalog request failed with HTTP ${response.status} (${catalogUrl})`)
      }

      const rawText = await response.text()
      let data

      try {
        data = JSON.parse(rawText)
      } catch (parseError) {
        throw new Error(`Catalog response is not valid JSON (${catalogUrl})`)
      }

      state.prototypes = normalizeCatalog(data)

      if (state.prototypes.length === 0) {
        state.loadState = 'loaded'
        renderSummary()
        renderResultsToolbar()
        renderResults()
        console.warn(`${HUB_NAME}: catalog loaded but contains no prototypes.`)
        return
      }

      populateSelect(
        elements.filterProject,
        [...new Set(state.prototypes.map((item) => item.project))].sort(),
        'All projects'
      )
      populateSelect(
        elements.filterOwner,
        [...new Set(state.prototypes.map((item) => item.owner))].sort(),
        'All owners'
      )

      state.loadState = 'loaded'
      applyFilters()
    } catch (error) {
      console.error(`${HUB_NAME}: failed to load catalog:`, error)
      showErrorState(`Unable to load ${HUB_NAME}. Refresh the page or ask Cursor to diagnose the issue.`)
    } finally {
      elements.resultsPanel.setAttribute('aria-busy', 'false')
    }
  }

  function init() {
    cacheElements()

    if (!validateElements()) {
      return
    }

    setSummaryPlaceholder()
    bindEvents()
    bindManageEvents()
    loadCatalog()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
