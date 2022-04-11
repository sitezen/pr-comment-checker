import * as core from '@actions/core'
import {getPRCaption, getPRComment} from './pr-data'

async function run(): Promise<void> {
  try {
    let failureMessage
    if (!isCaptionValid(getPRCaption())) {
      failureMessage = core.getInput('wrong_pr_caption_message')
    }
    if (!isDescriptionValid(getPRComment())) {
      failureMessage = core.getInput('wrong_pr_description_message')
    }

    if (failureMessage) {
      core.error(failureMessage)
      core.setFailed(failureMessage)
      return
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export function isCaptionValid(caption: string): boolean {
  const shouldContain: string = core.getInput('pr_caption_should_contain')
  if (shouldContain && !caption.includes(shouldContain)) {
    core.debug(`Caption should contain ${shouldContain} but it doesn't`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    return false
  }
  const shouldNotContain: string = core.getInput(
    'pr_caption_should_not_contain'
  )
  return !(shouldNotContain && caption.includes(shouldNotContain))
}

function containsStrOrRegex(
  description: string,
  shouldContain: string
): boolean {
  if (shouldContain) {
    if (shouldContain.startsWith('regex:')) {
      // regexp
      const regex = new RegExp(shouldContain.replace('regex:', ''))
      if (!description.match(regex)) {
        core.debug(
          `Description (regex) should contain ${shouldContain} but it doesn't`
        )
        return false
      }
    } else {
      if (!description.includes(shouldContain)) {
        core.debug(
          `Description (string) should contain ${shouldContain} but it doesn't`
        )
        return false
      }
    }
  }
  return true
}

export function isDescriptionValid(description: string): boolean {
  if (
    !containsStrOrRegex(
      description,
      core.getInput('pr_description_should_contain')
    )
  ) {
    return false
  }
  const shouldNotContain = core.getInput('pr_description_should_not_contain')
  if (shouldNotContain && containsStrOrRegex(description, shouldNotContain)) {
    return false
  }
  return true
}

run()
