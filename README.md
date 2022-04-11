# PR text checker

This action can check Pull Request caption and description. Based on [TypeScript action template](https://github.com/actions/typescript-action)

Action parameters: string, which should contain (or not contain) PR caption, and string for
PR Description (string can start from `regex:`, then it will tested against regular expression).

Also action allows using custom error messages.
