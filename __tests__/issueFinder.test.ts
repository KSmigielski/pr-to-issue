import { findIssueNumber } from '../src/issueFinder'

import { expect, test } from '@jest/globals'


test('Should throw Error if message is empty', () => {
    expect(() => findIssueNumber('')).toThrowError(Error)
})

test('Should throw Error if message does not contain issue', () =>{
    expect(() => findIssueNumber('This is some message')).toThrowError(Error)
})

test('Should return issue number when is from same repo (1)', () => {
    expect(findIssueNumber("#1")).toEqual('#1')
})

test('Should return issue number when is from same repo (2)', () => {
    expect(findIssueNumber("#2 number at begining")).toEqual('#2')
})

test('Should return issue number when is from same repo (3)', () => {
    expect(findIssueNumber("issue number at the end #3")).toEqual('#3')
})

test('Should return issue number when is from same repo (4)', () => {
    expect(findIssueNumber("issue number #4 in middle")).toEqual('#4')
})

test('Should return issue number when is from external repo (1)', () => {
    expect(findIssueNumber("organization/repo/#1")).toEqual('organization/repo/#1')
})

test('Should return issue number when is from external repo (2)', () => {
    expect(findIssueNumber("organization/repo/#2 number at begining")).toEqual('organization/repo/#2')
})

test('Should return issue number when is from external repo (3)', () => {
    expect(findIssueNumber("issue number at the end organization/repo/#3")).toEqual('organization/repo/#3')
})

test('Should return issue number when is from external repo (4)', () => {
    expect(findIssueNumber("issue number organization/repo/#4 in middle")).toEqual('organization/repo/#4')
})