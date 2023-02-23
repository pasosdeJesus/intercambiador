Msip.setup do |config|
  config.ruta_anexos = ENV.fetch(
    "MSIP_RUTA_ANEXOS", "#{Rails.root}/archivos/anexos/")
  config.ruta_volcados = ENV.fetch(
    "MSIP_RUTA_VOLCADOS", "#{Rails.root}/archivos/bd/")
  config.titulo = "Aplicación mínima que usa MSIP"
end
