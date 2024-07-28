const fs = require('fs')
const path = require('path')
const { Octokit } = require('@octokit/rest')

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const owner = 'toFrankie'
const repo = 'github-blogger-test'

async function getRecentIssues() {
  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state: 'all',
    sort: 'updated',
    direction: 'desc',
    per_page: 10,
  })

  return issues
}

async function updateRecentUpdates() {
  const issues = await getRecentIssues()

  const lines = ['# Recent Updates', '', 'Here are the 5-10 most recently updated articles:', '']

  for (const issue of issues) {
    const year = new Date(issue.updated_at).getFullYear()
    const filePath = `archives/${year}/${issue.number}.md`
    lines.push(`- [${issue.title}](${filePath})`)
  }

  const content = lines.join('\n')
  const filePath = path.join(__dirname, 'docs', 'recent-update.md')
  fs.writeFileSync(filePath, content, 'utf8')
}

updateRecentUpdates().catch(err => {
  console.error(err)
  process.exit(1)
})
