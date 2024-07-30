# City of Helsinki - ELO Drupal project

ELO (Yritykset ja työ, formerly known as Työ ja yrittäminen) covers topics related to work and entrepreneurship.

## Environments

Env | Branch | Drush alias | URL
--- | ------ | ----------- | ---
development | * | - | https://helfi-elo.docker.so/
production | main | @main | https://hel.fi/fi/yritykset-ja-tyo

## Requirements

You need to have these applications installed to operate on all environments:

- [Docker](https://github.com/druidfi/guidelines/blob/master/docs/docker.md)
- [Stonehenge](https://github.com/druidfi/stonehenge)
- For the new person: Your SSH public key needs to be added to servers

## Create and start the environment

For the first time (new project):

``
$ make new
``

And following times to start the environment:

``
$ make up
``

NOTE: Change these according of the state of your project.

## Login to Drupal container

This will log you inside the app container:

```
$ make shell
```

## Instance specific features

ELO has no instance specific features.
