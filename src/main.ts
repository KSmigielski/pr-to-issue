import * as core from '@actions/core'
import * as gh from '@actions/github'
import * as exec from '@actions/exec'
import { findIssueNumber } from './issueFinder'


async function run(): Promise<void> {
  try {

    if (!core.getInput("token")) {
      throw Error("Missing github token")
    }

    if (!gh.context.payload.pull_request) {
      throw Error("This action is applicable only to PRs")
    }


    let commitMessage = '';
    
    const options: exec.ExecOptions = {};
    options.listeners = {
      stdout: (data: Buffer) => {
        commitMessage = data.toString();
      },
    };
    await exec.exec("git log -1 --pretty=%B", [], options)
    
    const prDescription = gh.context.payload.pull_request.body 
    const issue = findIssueNumber(commitMessage)
    let newDescription = ''
    if (prDescription) {
      newDescription = `${prDescription}\r\n\r\nResolve ${issue}` 
    } else {
      newDescription = `Resolve ${issue}` 
    }

    gh.getOctokit(core.getInput("token")).rest.pulls.update({
      owner: gh.context.repo.owner,
      repo: gh.context.repo.repo,
      pull_number: gh.context.payload.pull_request.number,
      body: newDescription
    }).then( response => {
      if (response.status >= 400) {
        throw Error(`Something went wrong. Can not update PR. Resposne code: ${response.status}`)
      }
    })

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
