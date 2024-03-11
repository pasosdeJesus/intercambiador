require_relative "boot"

require "rails"
# Elige los marcos de trabajo que necesitas:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
# require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
# require "action_mailbox/engine"
# require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
require "rails/test_unit/railtie"


# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CoptonRails
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.

    config.load_defaults Rails::VERSION::STRING.to_f

    config.autoload_lib(ignore: %w(assets tasks))

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

    config.api_only = ENV.fetch("MSIP_API", "1").to_i == 1

    config.x.origen_cors = ENV.fetch('ORIGEN_CORS','').split(',')
    puts "config.x.origen_cors=#{config.x.origen_cors.inspect}"

    config.relative_url_root = ENV.fetch("RUTA_RELATIVA", "mipunto/demontaje/")

    # El siguiente es para validar, no fijar aquí, usar ENV
    puts ENV.fetch('HS256_SECRET')

  end
end
