# Maryse action
This action generate index (cookbook.yml) for a Maryse repository.  
More information here: https://github.com/pierreavn/maryse

## Usage

Create a file called `.github/workflows/build-maryse.yml` in your repository, with following content:

```yaml
name: Build Maryse

on:
  push:
    branches:
      - '*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Build Maryse
        uses: pierreavn/maryse-action@v1
      - name: Commit & Push
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Update cookbook.yml
```
