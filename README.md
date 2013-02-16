# deployasaur.us
Automatic Deployments with Travis CI

## How does it work?

1. Add an `after_success` script to your `.travis.yml` file.

    ```yaml
    after_success:
     - curl -s "http://www.deployasaur.us/deploy.sh" | bash
    ```

2. Log in with your GitHub credentials to [deployasaur.us](http://www.deployasaur.us) and create a new deployment script for your repository.

    Deployment scripts are executed `./your-script` style on one of your Travis workers. You can use any language that Travis will understand (be sure to include a [shebang](http://en.wikipedia.org/wiki/Shebang_%28Unix%29)), and Travis gives your script root access through sudo.

3. Push to your repository!

Assuming that you have [Travis CI already configured](http://about.travis-ci.org/docs/user/getting-started/), pushing to your repository on GitHub will trigger a new build on Travis, and Travis will trigger deployasaurus to run your deployment script if your tests pass. Like magic!

## Why not just write deployment into `.travis.yml`?

The `after_success` script is run on every travis worker after your tests complete successfully. If you have more than one build configuration (and your build matrix expands into more than one test run), your `after_success` script will be run more than once. I don't know about you, but I don't like deploying the same code more than once!

Deployasaur.us understands your build matrix and will run your deployment script only once. Check your logs after deploying; some of your travis workers will no-op due to incomplete runs.

## What can I use automatic deployments for?

Everything! Deploy a web application to Heroku. Or maybe generate documentation from your source code and deploy it automatically to your repository’s GitHub pages.

## How can I contribute?

Feel free to take a look at the [issue list](https://github.com/adunkman/deployasaur.us/issues) and contribute like crazy, pull requests are more than welcome. Please open an issue before creating a pull request, especially if it's a large code change.

To launch an instance of deployasaur.us, install [vagrant](http://vagrantup.com) and run `vagrant up` from the deployasaur.us directory. This will start a VM with deployasaur.us configured as it is in production, on port 3000.

If you have issues getting started, please [chime in](https://github.com/adunkman/deployasaur.us/issues/16).
