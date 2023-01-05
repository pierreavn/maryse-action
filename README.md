# Maryse action

This action generate index (cookbook.yml) for a Maryse repository.

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
        - uses: pierreavn/maryse-action@main
```
