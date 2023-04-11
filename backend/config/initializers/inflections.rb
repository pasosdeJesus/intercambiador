# frozen_string_literal: true

ActiveSupport::Inflector.inflections do |inflect|
  inflect.irregular("anuncioventa", "anunciosventa")
  inflect.irregular("anunciocompra", "anuncioscompra")
end
