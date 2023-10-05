class MueveAUsuario < ActiveRecord::Migration[7.0]
  def change
    add_column :usuario, :nombrecomercial, :string, limit: 255
    create_table :metododepago_usuario do |t|
      t.integer :metododepago_id, null: false
      t.integer :usuario_id, null: false
      t.string :referencia_para_pago, limit: 64
      t.string :nombre_referencia, limit: 255
    end
    add_foreign_key :metododepago_usuario, :metododepago
    add_foreign_key :metododepago_usuario, :usuario
    remove_column :anuncioventa, :nombrecomercial, :string, limit: 255
    remove_column :anuncioventa, :referencia_para_pago, :string, limit: 64
    remove_column :anuncioventa, :nombre_referencia, :string, limit: 255
  end
end
