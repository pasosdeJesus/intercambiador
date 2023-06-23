class AgregaNombrecomercialUsuario < ActiveRecord::Migration[7.0]
  def change
    add_column :anuncioventa, :nombrecomercial, :string, limit: 255
  end
end
