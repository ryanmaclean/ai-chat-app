#!/usr/bin/env node
const assert = require('assert')

// Helper function to simulate fetching models with timeout handling
async function fetchModelsWithTimeout(url, timeout = 2000) {
  const fetchPromise = fetch(url)
  const timeoutPromise = new Promise((
