import {readFileSync} from 'fs'
import * as github from '@actions/github'
import {isCaptionValid, isDescriptionValid} from '../src/main'
import {getPRCaption, getPRComment} from '../src/pr-data'
import * as process from 'process'
import {expect, test} from '@jest/globals'

describe('get PR data', () => {
  it('gets a pull request comment', () => {
    process.env['GITHUB_EVENT_PATH'] = __dirname + '/pr1.json'
    github.context.payload = JSON.parse(
      readFileSync(process.env.GITHUB_EVENT_PATH, {encoding: 'utf8'})
    )
    const pr_comment = getPRComment()
    expect(pr_comment).toEqual('Test PR comment\r\n123')
  })

  it('gets a pull request caption', () => {
    process.env['GITHUB_EVENT_PATH'] = __dirname + '/pr1.json'
    github.context.payload = JSON.parse(
      readFileSync(process.env.GITHUB_EVENT_PATH, {encoding: 'utf8'})
    )
    const pr_comment = getPRCaption()
    expect(pr_comment).toEqual('Test PR')
  })

  it('throws an error if the event is not a pull_request type', () => {
    process.env['GITHUB_EVENT_PATH'] = __dirname + '/not_pr.json'
    github.context.payload = JSON.parse(
      readFileSync(process.env.GITHUB_EVENT_PATH, {encoding: 'utf8'})
    )
    expect(getPRComment).toThrowError(
      'This action should only be run with Pull Request Events'
    )
  })
})

describe('PR checkers', () => {
  it('Should return correct result for isCaptionValid without params passed', () => {
    expect(isCaptionValid('Some PR caption')).toBeTruthy()
  })

  it('returns correct result for isCaptionValid when params provided', () => {
    process.env[`INPUT_${'pr_caption_should_contain'.toUpperCase()}`] =
      'some value'
    expect(isCaptionValid('Some PR caption')).toBeFalsy()
    expect(isCaptionValid('Some PR caption containing some value')).toBeTruthy()
    process.env[`INPUT_${'pr_caption_should_contain'.toUpperCase()}`] = ''
    process.env[`INPUT_${'pr_caption_should_not_contain'.toUpperCase()}`] =
      'ZZz'
    expect(isCaptionValid('Some PR caption')).toBeTruthy()
    expect(isCaptionValid('Some PR caption containing ZZz')).toBeFalsy()
    process.env[`INPUT_${'pr_caption_should_contain'.toUpperCase()}`] = '123'
    expect(isCaptionValid('123Some PR caption')).toBeTruthy()
  })

  it('Should return correct result for isDescriptionValid without params passed', () => {
    expect(isDescriptionValid('Some PR description')).toBeTruthy()
  })

  it('returns correct result for isDescriptionValid when params provided', () => {
    process.env[`INPUT_${'pr_description_should_contain'.toUpperCase()}`] =
      'some value'
    expect(isDescriptionValid('Some PR description')).toBeFalsy()
    expect(
      isDescriptionValid('Some PR description containing some value')
    ).toBeTruthy()
    process.env[`INPUT_${'pr_description_should_contain'.toUpperCase()}`] =
      'regex:\\d{2}'
    expect(
      isDescriptionValid('Some PR description containing 33 (2 digits)')
    ).toBeTruthy()
    process.env[`INPUT_${'pr_description_should_contain'.toUpperCase()}`] = ''
    process.env[`INPUT_${'pr_description_should_not_contain'.toUpperCase()}`] =
      'ZZz'
    expect(isDescriptionValid('Some PR description')).toBeTruthy()
    expect(isDescriptionValid('Some PR description containing ZZz')).toBeFalsy()
    process.env[`INPUT_${'pr_description_should_contain'.toUpperCase()}`] =
      'regex:^\\d{3}'
    expect(isDescriptionValid('123Some PR description')).toBeTruthy()
  })
})
