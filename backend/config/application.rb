require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CoptonRails
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    config.active_record.schema_format = :sql
    config.railties_order = [:main_app, Msip::Engine, :all]

    config.time_zone = 'America/Bogota'
    config.i18n.default_locale = :es

    config.x.formato_fecha = ENV.fetch('MSIP_FORMATO_FECHA', 'dd/M/yyyy')
    config.hosts.concat(
      ENV.fetch('CONFIG_HOSTS', '127.0.0.1').downcase.split(',')
    )
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = ENV.fetch('MSIP_API', true)

    config.x.origen_cors = ENV.fetch('ORIGEN_CORS','').split(',')
    puts "config.x.origen_cors=#{config.x.origen_cors.inspect}"

  end
end
