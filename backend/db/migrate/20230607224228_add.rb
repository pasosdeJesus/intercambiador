class Add < ActiveRecord::Migration[7.0]
  def change
    add_column :anuncioventa, :referencia_para_pago, :string, limit: 64
    add_column :anuncioventa, :nombre_referencia, :string, limit: 255
  end
end
