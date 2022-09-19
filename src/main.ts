import * as core from '@actions/core'
import * as gh from '@actions/github'
import * as exec from '@actions/exec'
import {findIssueNumber, buildNewDescription} from './helpers'

async function run(): Promise<void> {
  try {
    if (!gh.context.payload.pull_request) {
      throw Error('This action is applicable only to PRs')
    }
    const token = core.getInput('token')
    if (!token) {
      throw Error('Missing github token')
    }
    const commitMessage = await getCommitMessage()
    const prDescription = gh.context.payload.pull_request.body
    const issue = findIssueNumber(commitMessage)
    if (!issue) {
      core.info('Issue is not present in last commit message. PR will not be connected to Issue.')
      return;
    }
    const newDescription = buildNewDescription(issue, prDescription)
    const response = await gh.getOctokit(token).rest.pulls.update({
      owner: gh.context.repo.owner,
      repo: gh.context.repo.repo,
      pull_number: gh.context.payload.pull_request.number,
      body: newDescription
    })
    if (response.status >= 300) {
      throw Error(
        `Something went wrong. Can not update PR. Resposne code: ${response.status}`
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function getCommitMessage(): Promise<string> {
  let commitMessage = ''
  const options: exec.ExecOptions = {}
  options.listeners = {
    stdout: (data: Buffer) => {
      commitMessage = data.toString()
    }
  }
  await exec.exec('git log -1 --pretty=%B', [], options)
  return commitMessage
}

run()
