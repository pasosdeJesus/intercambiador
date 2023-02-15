source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.0"

gem "bcrypt", "~> 3.1.7"

gem "bootsnap", require: false

gem "cancancan" 

gem "devise"                     # Autenticación

gem "devise-i18n"                # Localización e Internacionalización

gem "dotenv-rails"               # Configuración de servidor en .env

gem "jbuilder"

gem "nokogiri"                   # Procesamiento XML

gem "pg", "~> 1.1"

gem "puma", "~> 5.0"

gem "rails", "~> 7.0.4", ">= 7.0.4.2"

gem "rails-i18n"                 # Localización e Internacionalización

gem "twitter_cldr"               # Localiación e internacionalización

gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

#### Motores que sobrecargan o basados en MSIP en orden de apilamento
gem "msip",                       # SI estilo Pasos de Jesús
  #git: "https://gitlab.com/pasosdeJesus/msip.git"
  path: "../msip"



group :development, :test do
  gem "code-scanning-rubocop"   # Busca fallas de seguridad

  gem "colorize"

  gem "debug"                   # Depura

  gem "rails-erd"               # Genera diagrama entidad asociación
end

group :test do
  gem "minitest"                # Pruebas automáticas de regresión con minitest

  gem "rails-controller-testing"

  gem "simplecov"
end

