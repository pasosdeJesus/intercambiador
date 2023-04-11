class AgregaUsuarioDireccion < ActiveRecord::Migration[7.0]
  def change
    add_column :usuario, :direccion, :string, limit: 1024
    add_index :usuario, :direccion, unique: true
  end
end
