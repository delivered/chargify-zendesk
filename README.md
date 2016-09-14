# Zendesk App for Chargify

Access your Chargify subscription data from within Zendesk.

## Installation

1. [Download the latest app package](https://github.com/delivered/chargify-zendesk/releases/latest).
2. Browse to your Zendesk Apps Management Screen (https://{your-subdomain}.zendesk.com/agent/admin/apps/manage) - [Screenshot](https://cl.ly/010k3C3E3k1s)
3. Click "Upload private app"
4. Enter the name of the app - "Chargify" is recommended - [Screenshot](https://cl.ly/061o2q0l322y)
5. Choose the zip file downloaded in step 1
6. Click "Upload"
7. Approve the terms and conditions by clicking a second "Upload" - [Screenshot](https://cl.ly/0T0E2I3o2F2u)
8. Enter your Chargify API key and Chargify Subdomain - [Screenshot](https://cl.ly/0Z2q2R241A02)
9. Click "Install"

## Usage

After the app has been successfully installed and enabled, it will show up in the right pane of the User and Ticket views within Zendesk.

Upon initial load of the User Profile or Ticket, the app will search for customer records in your Chargify account associated with the User's primary email address or Ticket Requestors email address.

When no customer records are found in Chargify, then the UI will display an alert.

When one customer record is found in Chargify, then the UI will display basic customer information as well as a list of each subscription associated with that customer.

When more than one customer records are found in Chargify, then the UI will display a menu containing each customer record. Selecting a menu item will display display basic customer information as well as a list of each subscription associated with that customer, as well as a menu item to return to the full customer menu.

## Contributing

Please see [CONTRIBUTING](https://github.com/delivered/chargify-zendesk/blob/master/CONTRIBUTING.md) for details.

## Credits

- [Steven Maguire](https://github.com/stevenmaguire)
- [All Contributors](https://github.com/delivered/chargify-zendesk/contributors)

## License

The MIT License (MIT). Please see [License File](https://github.com/delivered/chargify-zendesk/blob/master/LICENSE) for more information.



