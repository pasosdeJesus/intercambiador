class CreateMetododepago < ActiveRecord::Migration[7.0]
  def up
    create_table :metododepago do |t|
      t.string :nombre, limit: 500, null: false
      t.string :observaciones, limit: 5000
      t.date :fechacreacion, null: false
      t.date :fechadeshabilitacion

      t.timestamps
    end
    Msip::SqlHelper.cambiar_cotejacion(
      'metododepago', 'nombre', 500, 'es_co_utf_8')
    execute <<-SQL
      INSERT INTO metododepago(id, nombre, 
        fechacreacion, created_at, updated_at) VALUES (
        1, 'NEQUI', '2023-05-12', '2023-05-12', '2023-05-12');
      INSERT INTO metododepago(id, nombre, 
        fechacreacion, created_at, updated_at) VALUES (
        2, 'Daviplata', '2023-05-12', '2023-05-12', '2023-05-12');
    SQL
  end

  def down
    drop_table :metododepago

  end
end
