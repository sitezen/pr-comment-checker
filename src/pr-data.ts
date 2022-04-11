// import * as core from '@actions/core'
import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'

export function getPRComment(): string {
  const payload: WebhookPayload = getPRPayload()
  const pull_request = payload.pull_request
  //  core.debug(`Pull Request: ${JSON.stringify(github.context.payload)}`)
  if (pull_request === undefined || pull_request.body === undefined) {
    throw new Error('This action should only be run with Pull Request Events')
  }
  return pull_request.body
}

export function getPRCaption(): string {
  const payload: WebhookPayload = getPRPayload()
  const pull_request = payload.pull_request
  if (pull_request === undefined || pull_request.title === undefined) {
    throw new Error('This action should only be run with Pull Request Events')
  }
  return pull_request.title
}

function getPRPayload(): WebhookPayload {
  return github.context.payload
}
