[![test](https://github.com/actions-mn/compile/actions/workflows/test.yml/badge.svg)](https://github.com/actions-mn/compile/actions/workflows/test.yml)

# compile

Perform `metanorma compile`, like this

```yml
- uses: actions-mn/compile@main
  with:
    input-file: README.adoc
    type: iso
    extensions: html
    output-dir: ./result1
    no-install-fonts: true
```

The action expects that metanorma-cli is already installed.

You can install it by defferent ways:
- `actions-mn/setup@master`
- `gem install metanorma-cli`
- with metanorma docker image

> NOTE: if `metanorma-cli` installed with `bundle install` make sure to path `use-bundler: true` to the action