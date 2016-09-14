# Contributing

Contributions are **welcome** and will be fully **credited**.

We accept contributions via Pull Requests on [Github](https://github.com/delivered/chargify-zendesk).

## Local Development

Recommended reading:

* [Official Documentation](https://developer.zendesk.com/apps/docs/agent/introduction)
  * Pay close attention the the [supported libraries](https://developer.zendesk.com/apps/docs/agent/supported_libraries) and their (older) versions as they drive the user interface.
    * [Bootstrap v2.3.2](http://getbootstrap.com/2.3.2/components.html)
* [Helpful Series of Articles](https://support.zendesk.com/hc/en-us/articles/203691256)

Getting started:

* Install the zat gem - `$ gem install zendesk_apps_tools`
* Run the server - `$ zat server`
* Preview the app - bring up zendesk, find a user or ticket, and add `zat=true` query string parameters to the url, like this:
 * https://{your-subdomain}.zendesk.com/agent/users/{user-id}/requested_tickets?zat=true
 * NOTE: if a shield icon appears in the browser, click on on and allow the script to run
 * reload the app to make changes active

Packaging and deploying:

* Validate the app - `$ zat validate`
* Package the app - `$ zat package`
* [Install the app](https://github.com/delivered/chargify-zendesk#installation)

Please enter issues as you see fit.

## Pull Requests

- **Document any change in behaviour** - Make sure the README and any other relevant documentation are kept up-to-date.

- **Consider our release cycle** - We try to follow SemVer. Randomly breaking public APIs is not an option.

- **Create topic branches** - Don't ask us to pull from your master branch.

- **One pull request per feature** - If you want to do more than one thing, send multiple pull requests.

- **Send coherent history** - Make sure each individual commit in your pull request is meaningful. If you had to make multiple intermediate commits while developing, please squash them before submitting.

- **Ensure no coding standards violations** - Please run PHP Code Sniffer using the PSR-2 standard (see below) before submitting your pull request. A violation will cause the build to fail, so please make sure there are no violations. We can't accept a patch if the build fails.


## Validating your work

``` bash
$ zat validate
```

**Happy coding**!
