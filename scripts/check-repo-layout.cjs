#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

const FORBIDDEN_ROOT_FILES = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock'
]

const FORBIDDEN_WORKFLOWS = [
  '.github/workflows/deploy.yml'
]

const errors = []

for (const fileName of FORBIDDEN_ROOT_FILES) {
  if (fs.existsSync(path.join(ROOT, fileName))) {
    errors.push(
      `Repository root must not contain ${fileName}. Move Node.js dev projects to workspaces/<project-name>/.`
    )
  }
}

for (const workflowPath of FORBIDDEN_WORKFLOWS) {
  if (fs.existsSync(path.join(ROOT, workflowPath))) {
    errors.push(
      `Remove ${workflowPath}. Prototype Hub deploys only through .github/workflows/deploy-pages.yml.`
    )
  }
}

if (errors.length > 0) {
  console.error('Repository layout check failed:\n')
  errors.forEach((message) => console.error(`  - ${message}`))
  process.exit(1)
}

console.log('Repository layout check passed.')
