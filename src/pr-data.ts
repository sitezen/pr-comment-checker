import * as core from '@actions/core'
import * as github from '@actions/github'

export function getPRComment(): string {
  const pull_request = github.context.payload.pull_request
  core.debug(
    `Pull Request: ${JSON.stringify(github.context.payload.pull_request)}`
  )
  if (pull_request === undefined || pull_request.body === undefined) {
    throw new Error('This action should only be run with Pull Request Events')
  }
  return pull_request.body;
}
