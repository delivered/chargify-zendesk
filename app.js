(function() {

  return {
    resources: {
      DOMAIN_PATTERN: /[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/,
      DATE_FORMAT: 'MMMM Do YYYY'
    },

    events: {
      'app.activated': 'showSearch',
      'click .action': 'handleClick'
    },

    requests: {
      fetchCustomer: function (customerId) {
        return {
          url: 'https://'+this.settings.subdomain+'.chargify.com/customers/'+customerId+'.json',
          type:'GET',
          username: this.settings.api_key,
          password: 'x',
          dataType: 'json'
        };
      },
      fetchCustomersByEmail: function(email) {
        return {
          url: 'https://'+this.settings.subdomain+'.chargify.com/customers.json?q='+email,
          type:'GET',
          username: this.settings.api_key,
          password: 'x',
          dataType: 'json'
        };
      },
      fetchCustomerSubscriptions: function(customerId) {
        return {
          url: 'https://'+this.settings.subdomain+'.chargify.com/subscriptions.json?customer_id='+customerId,
          type:'GET',
          username: this.settings.api_key,
          password: 'x',
          dataType: 'json'
        };
      }
    },

    buildCustomerFromChargifyCustomer: function (chargifyCustomer) {
      if (chargifyCustomer && chargifyCustomer.hasOwnProperty('customer')) {
        var customer = chargifyCustomer.customer;
        customer.has_sibling_accounts = this.cacheFetch('customerIds', []).length > 1;
        customer.full_name = [customer.first_name, customer.last_name].join(' ').trim();
        customer.formatted_portal_customer_created_at = this.formatDateString(customer.portal_customer_created_at);
        customer.subscriptions = [];
        customer.subscriptions_loading = true;
        return customer;
      }
    },

    buildSubscriptionFromChargifySubscription: function (chargifySubscription) {
      if (chargifySubscription && chargifySubscription.hasOwnProperty('subscription')) {
        var subscription = chargifySubscription.subscription;
        subscription.total_revenue_in_dollars = subscription.total_revenue_in_cents / 100;
        subscription.formatted_activated_at = this.formatDateString(subscription.activated_at);
        subscription.formatted_created_at = this.formatDateString(subscription.created_at);
        subscription.formatted_cancelled_at = this.formatDateString(subscription.cancelled_at);
        subscription.formatted_expires_at = this.formatDateString(subscription.expires_at);
        subscription.formatted_trial_started_at = this.formatDateString(subscription.trial_started_at);
        subscription.formatted_trial_ended_at = this.formatDateString(subscription.trial_ended_at);
        subscription.formatted_current_period_started_at = this.formatDateString(subscription.current_period_started_at);
        subscription.formatted_current_period_ends_at = this.formatDateString(subscription.current_period_ends_at);
        subscription.formatted_next_assessment_at = this.formatDateString(subscription.next_assessment_at);
        subscription.formatted_total_revenue_in_dollars = this.formatMoney(subscription.total_revenue_in_dollars);
        subscription.balance_in_dollars = subscription.balance_in_cents / 100;
        subscription.formatted_balance_in_dollars = this.formatMoney(subscription.balance_in_dollars);
        if (subscription.product && typeof subscription.product.price_in_cents != 'undefined') {
          subscription.product.price_in_dollars = subscription.product.price_in_cents / 100;
          subscription.product.formatted_price_in_dollars = this.formatMoney(subscription.product.price_in_dollars);
        }
        if (subscription.credit_card) {
          var masked_cc = subscription.credit_card.masked_card_number;
          subscription.credit_card.full_name = [subscription.credit_card.first_name, subscription.credit_card.last_name].join(' ').trim();
          subscription.credit_card.last_four = masked_cc.substr(masked_cc.length - 4);
        }
        return subscription;
      }
    },

    cache: function (key, data) {
      this.store(key, data);
    },

    cacheChargifyCustomerSearch: function (chargifyCustomers) {
      var customerIds = [];
      for (var i = chargifyCustomers.length - 1; i >= 0; i--) {
        var customer = this.buildCustomerFromChargifyCustomer(chargifyCustomers[i]);
        customerIds.push(customer.id);
      }
      this.cache('customerIds', customerIds);
    },

    cacheClear: function (key) {

    },

    cacheFetch: function (key, default_value) {
      default_value = default_value || null;
      try {
        var value = this.store(key);
        return value ? value : default_value;
      } catch (error) {
        return default_value;
      }
    },

    clone: function(obj) {
      if (null == obj || "object" != typeof obj) {
        return obj;
      }
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    },

    formatDateString: function (date_string, format) {
      format = format || this.resources.DATE_FORMAT;
      return moment(date_string).format(format);
    },

    formatMoney: function (number) {
      return '$' + parseFloat(Math.round(number * 100) / 100).toFixed(2);
    },

    getCustomerEmail: function () {
        if (this.currentLocation() === 'ticket_sidebar') {
            return this.ticket().requester().email();
        } else if (this.currentLocation() === 'user_sidebar') {
            return this.user().email();
        }
        return;
    },

    getDomainFromURL: function(baseURI) {
      var regexResult = this.resources.DOMAIN_PATTERN.exec(baseURI);
      return regexResult[0];
    },

    handleClick: function (e, data) {
      e.preventDefault();
      var link = this.$(e.target);
      switch (true) {
        case link.is('.show-customer'):
          this.showCustomer(e, link.data());
          break;
        case link.is('.show-search'):
          this.showSearch(e, link.data());
          break;
        case link.is('.show-settings'):
          this.showAppSettings(e, link.data());
          break;
      }
    },

    showAppSettings: function(e, data) {
      var approvedSettings = this.clone(this.settings);
      if (approvedSettings.api_key) {
        var original = approvedSettings.api_key;
        var masked = original.substring(3, original.length);
        approvedSettings.api_key = original.replace(masked, Array(masked.length).join('x'));
      }
      var pageData = {
        title: this.I18n.t('settingsPage.title'),
        settings: approvedSettings,
        email: this.currentUser().email(),
        uri: this.getDomainFromURL(e.currentTarget.baseURI),
        installation_id: this.installationId()
      };
      this.switchTo('settingsPage', pageData);
    },

    showCustomer: function(e, data) {
      if (this.verifyConfiguration(e, data)) {
        var app = this;
        var pageData = {
          title: app.I18n.t('customerPage.title'),
          customer: null
        };
        app.switchTo('loading');
        app.ajax('fetchCustomer', data.customerId)
          .done(function (data) {
            pageData.customer = app.buildCustomerFromChargifyCustomer(data);
            app.switchTo('customerPage', pageData);
            app.ajax('fetchCustomerSubscriptions', pageData.customer.id)
              .done(function (data) {
                for (var i = data.length - 1; i >= 0; i--) {
                  pageData.customer.subscriptions.push(
                    app.buildSubscriptionFromChargifySubscription(data[i])
                  );
                }
                pageData.customer.subscriptions_loading = false;
                app.switchTo('customerPage', pageData);
              });
          });
      }
    },

    showSearch: function(e, data) {
      if (this.verifyConfiguration(e, data)) {
        var app = this;
        var pageData = {
          title: app.I18n.t('searchPage.title'),
          customers: []
        };
        app.switchTo('loading');
        app.ajax('fetchCustomersByEmail', app.getCustomerEmail())
          .done(function (data) {
            this.cacheChargifyCustomerSearch(data);
            if (data.length == 1) {
              var customer = app.buildCustomerFromChargifyCustomer(data[0]);
              this.showCustomer(e, {customerId: customer.id});
            } else {
              for (var i = data.length - 1; i >= 0; i--) {
                pageData.customers.push(
                  app.buildCustomerFromChargifyCustomer(data[i])
                );
              }
              app.switchTo('searchPage', pageData);
            }
          });
      }
    },

    verifyConfiguration: function (e, data) {
      if (this.settings.api_key && this.settings.api_key) {
        return true;
      }
      this.showAppSettings(e, data);
      return false;
    }
  };

}());
