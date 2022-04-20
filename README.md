# PR text checker

This action can check Pull Request caption and description. Based on [TypeScript action template](https://github.com/actions/typescript-action)

Action parameters: string, which should contain (or not contain) PR caption, and string for
PR Description (string can start from `regex:`, then it will tested against regular expression).

Also action allows using custom error messages.

For example, we have branches with names like "feature/task/something-done-here", and delelopers
may forget to edit default PR caption coming from branch name. To prevent this, we can check what
PR caption does not contain "/feature".

Another thing, lets our PR template contains text: "Place link to Asana task here", and we want 
to check what this placeholder changed to real Asana link.

For these actions, we can create .yml file which should placed into `.github/workflows` directory, 
containing something like this:


    name: Run PR check

    on:
    pull_request:
    branches: [ master ]
    types: [opened, synchronize, edited, ready_for_review]

    jobs:
    test:
        runs-on: ubuntu-latest

        strategy:
          matrix:
            node-version: [12.x]
    
        steps:
          - uses: actions/checkout@v2
          - name: PR comment and caption checker
            uses: sitezen/pr-comment-checker@v1.0.0
            with:
              pr_caption_should_not_contain: 'feature/'
              pr_description_should_contain: 'asana.com/'
              pr_description_should_not_contain: 'Place link to Asana task here'
              wrong_pr_description_message: 'Please make sure what you have added link to Asana task in you PR description'
`
