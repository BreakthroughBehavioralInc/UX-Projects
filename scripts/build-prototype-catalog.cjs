#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const { CATEGORIES } = require('./prototype-categories.cjs')

const ROOT = path.join(__dirname, '..', 'Prototypes')
const OUTPUT = path.join(ROOT, 'generated', 'catalog.json')
const VALID_STATUSES = ['Draft', 'In Review', 'Testing', 'Approved', 'Archived']
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

const REQUIRED_FIELDS = [
  'name',
  'project',
  'category',
  'owner',
  'status',
  'description',
  'version',
  'lastUpdated',
  'entryPoint',
  'tags'
]

function fail(message) {
  console.error(`ERROR: ${message}`)
  process.exit(1)
}

function readPrototypeJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    fail(`Invalid JSON at ${filePath}: ${error.message}`)
  }
}

function validateMetadata(meta, filePath, category, projectSlug, prototypeSlug) {
  REQUIRED_FIELDS.forEach((field) => {
    if (meta[field] === undefined || meta[field] === null || meta[field] === '') {
      fail(`Missing required field "${field}" in ${filePath}`)
    }
  })

  if (!CATEGORIES.includes(meta.category)) {
    fail(`Invalid category in ${filePath}. Must be one of: ${CATEGORIES.join(', ')}`)
  }

  if (meta.category !== category) {
    fail(`Category mismatch in ${filePath}. Folder is ${category}, metadata says ${meta.category}.`)
  }

  if (!VALID_STATUSES.includes(meta.status)) {
    fail(`Invalid status in ${filePath}. Must be one of: ${VALID_STATUSES.join(', ')}`)
  }

  if (!Array.isArray(meta.tags)) {
    fail(`Tags must be an array in ${filePath}`)
  }

  if (!KEBAB.test(projectSlug)) {
    fail(`Project folder "${projectSlug}" must use lowercase kebab-case`)
  }

  if (!KEBAB.test(prototypeSlug)) {
    fail(`Prototype folder "${prototypeSlug}" must use lowercase kebab-case`)
  }
}

function scanPrototypes() {
  const entries = []
  const pathsSeen = new Set()
  const urlsSeen = new Set()

  CATEGORIES.forEach((category) => {
    const categoryPath = path.join(ROOT, category)
    if (!fs.existsSync(categoryPath)) return

    const projects = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))

    if (projects.length === 0) {
      return
    }

    projects.forEach((projectDir) => {
      const projectSlug = projectDir.name
      const projectPath = path.join(categoryPath, projectSlug)

      const prototypes = fs.readdirSync(projectPath, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('.'))

      if (prototypes.length === 0) {
        fail(`Empty project folder: ${path.relative(ROOT, projectPath)}`)
      }

      prototypes.forEach((prototypeDir) => {
        const prototypeSlug = prototypeDir.name
        const prototypePath = path.join(projectPath, prototypeSlug)
        const metaPath = path.join(prototypePath, 'prototype.json')

        if (!fs.existsSync(metaPath)) {
          fail(`Missing prototype.json in ${path.relative(ROOT, prototypePath)}`)
        }

        const meta = readPrototypeJson(metaPath)
        validateMetadata(meta, metaPath, category, projectSlug, prototypeSlug)

        const entryPoint = path.join(prototypePath, meta.entryPoint)
        if (!fs.existsSync(entryPoint)) {
          fail(`Missing entryPoint "${meta.entryPoint}" in ${path.relative(ROOT, prototypePath)}`)
        }

        const relativePath = `${category}/${projectSlug}/${prototypeSlug}`
        const url = `./${relativePath}/`

        if (pathsSeen.has(relativePath)) {
          fail(`Duplicate prototype path: ${relativePath}`)
        }
        pathsSeen.add(relativePath)

        if (urlsSeen.has(url)) {
          fail(`Duplicate prototype URL: ${url}`)
        }
        urlsSeen.add(url)

        entries.push({
          name: meta.name,
          project: meta.project,
          category: meta.category,
          owner: meta.owner,
          status: meta.status,
          description: meta.description,
          version: meta.version,
          lastUpdated: meta.lastUpdated,
          tags: meta.tags,
          url,
          path: relativePath,
          projectSlug,
          prototypeSlug
        })
      })
    })
  })

  return entries
}

function sortCatalog(entries) {
  return entries.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    if (a.project !== b.project) return a.project.localeCompare(b.project)
    return a.name.localeCompare(b.name)
  })
}

function printSummary(entries) {
  const counts = {
    total: entries.length,
    Patient: 0,
    Provider: 0,
    CSA: 0,
    Draft: 0,
    'In Review': 0,
    Testing: 0,
    Approved: 0,
    Archived: 0
  }

  entries.forEach((entry) => {
    counts[entry.category] += 1
    counts[entry.status] += 1
  })

  console.log('Prototype catalog built successfully.')
  console.log(`Total prototypes: ${counts.total}`)
  console.log(`Patient prototypes: ${counts.Patient}`)
  console.log(`Provider prototypes: ${counts.Provider}`)
  console.log(`CSA prototypes: ${counts.CSA}`)
  console.log(`Draft: ${counts.Draft}`)
  console.log(`In Review: ${counts['In Review']}`)
  console.log(`Testing: ${counts.Testing}`)
  console.log(`Approved: ${counts.Approved}`)
  console.log(`Archived: ${counts.Archived}`)
}

function main() {
  const entries = scanPrototypes()
  const sorted = sortCatalog(entries)

  const outputDir = path.dirname(OUTPUT)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    count: sorted.length,
    prototypes: sorted.map(({ path: _p, projectSlug: _ps, prototypeSlug: _ts, ...rest }) => rest)
  }

  fs.writeFileSync(OUTPUT, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT)}`)
  printSummary(sorted)
}

main()
