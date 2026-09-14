#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const { CATEGORIES } = require('./prototype-categories')

const ROOT = process.env.PROTOTYPES_ROOT
  ? path.resolve(process.env.PROTOTYPES_ROOT)
  : path.join(__dirname, '..', 'Prototypes')
const VALID_STATUSES = ['Draft', 'In Review', 'Testing', 'Approved', 'Archived']
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/
const LOCAL_PATH_PATTERNS = [
  /C:\\Users\\/i,
  /\/Users\//,
  /file:\/\//i
]
const CREDENTIAL_PATTERNS = [
  /ghp_[a-zA-Z0-9]+/,
  /sk-[a-zA-Z0-9]+/,
  /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
  /password\s*[:=]\s*['"][^'"]+['"]/i,
  /secret\s*[:=]\s*['"][^'"]+['"]/i,
  /token\s*[:=]\s*['"][^'"]+['"]/i
]

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

const TEXT_EXTENSIONS = new Set([
  '.html', '.htm', '.css', '.js', '.json', '.md', '.svg', '.txt'
])

let errorCount = 0

function error(message) {
  console.error(`ERROR: ${message}`)
  errorCount += 1
}

function readPrototypeJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (err) {
    error(`Invalid JSON at ${filePath}: ${err.message}`)
    return null
  }
}

function scanTextFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files

  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const COMPILED_DIRS = new Set(['generated', 'node_modules', 'assets', 'sb-addons', 'sb-manager', 'sb-common-assets'])
      if (COMPILED_DIRS.has(entry.name)) return
      scanTextFiles(fullPath, files)
      return
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (TEXT_EXTENSIONS.has(ext)) {
      files.push(fullPath)
    }
  })

  return files
}

function validateLocalPathsAndCredentials(prototypePath) {
  const files = scanTextFiles(prototypePath)
  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8')
    LOCAL_PATH_PATTERNS.forEach((pattern) => {
      if (pattern.test(content)) {
        error(`Possible local file path reference in ${path.relative(ROOT, filePath)}`)
      }
    })
    CREDENTIAL_PATTERNS.forEach((pattern) => {
      if (pattern.test(content)) {
        error(`Possible credential pattern in ${path.relative(ROOT, filePath)}`)
      }
    })
  })
}

function validateStructure() {
  const pathsSeen = new Set()
  const urlsSeen = new Set()
  let prototypeCount = 0

  CATEGORIES.forEach((category) => {
    const categoryPath = path.join(ROOT, category)
    if (!fs.existsSync(categoryPath)) return

    const projects = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))

    projects.forEach((projectDir) => {
      const projectSlug = projectDir.name
      const projectPath = path.join(categoryPath, projectSlug)

      if (!KEBAB.test(projectSlug)) {
        error(`Project folder "${projectSlug}" must use lowercase kebab-case`)
      }

      const prototypes = fs.readdirSync(projectPath, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('.'))

      if (prototypes.length === 0) {
        error(`Empty project folder: ${path.relative(ROOT, projectPath)}`)
      }

      prototypes.forEach((prototypeDir) => {
        const prototypeSlug = prototypeDir.name
        const prototypePath = path.join(projectPath, prototypeSlug)
        const metaPath = path.join(prototypePath, 'prototype.json')

        if (!KEBAB.test(prototypeSlug)) {
          error(`Prototype folder "${prototypeSlug}" must use lowercase kebab-case`)
        }

        if (!fs.existsSync(metaPath)) {
          error(`Missing prototype.json in ${path.relative(ROOT, prototypePath)}`)
          return
        }

        const meta = readPrototypeJson(metaPath)
        if (!meta) return

        REQUIRED_FIELDS.forEach((field) => {
          if (meta[field] === undefined || meta[field] === null || meta[field] === '') {
            error(`Missing required field "${field}" in ${metaPath}`)
          }
        })

        if (!CATEGORIES.includes(meta.category)) {
          error(`Invalid category "${meta.category}" in ${metaPath}. Must be one of: ${CATEGORIES.join(', ')}`)
        }

        if (meta.category !== category) {
          error(`Category mismatch in ${metaPath}`)
        }

        if (!VALID_STATUSES.includes(meta.status)) {
          error(`Invalid status in ${metaPath}`)
        }

        if (!Array.isArray(meta.tags)) {
          error(`Tags must be an array in ${metaPath}`)
        }

        const entryPoint = path.join(prototypePath, meta.entryPoint)
        if (!fs.existsSync(entryPoint)) {
          error(`Missing entryPoint "${meta.entryPoint}" in ${path.relative(ROOT, prototypePath)}`)
        }

        const relativePath = `${category}/${projectSlug}/${prototypeSlug}`
        const url = `./${relativePath}/`

        if (pathsSeen.has(relativePath)) {
          error(`Duplicate prototype path: ${relativePath}`)
        }
        pathsSeen.add(relativePath)

        if (urlsSeen.has(url)) {
          error(`Duplicate prototype URL: ${url}`)
        }
        urlsSeen.add(url)

        validateLocalPathsAndCredentials(prototypePath)
        prototypeCount += 1
      })
    })
  })

  return prototypeCount
}

function main() {
  console.log('Validating prototypes...')
  const count = validateStructure()

  if (errorCount > 0) {
    console.error(`Validation failed with ${errorCount} error(s).`)
    process.exit(1)
  }

  console.log(`Validation passed. ${count} prototype(s) found.`)
}

main()
