class PesosportonController < Msip::ModelosController
  helper ::ApplicationHelper

  before_action :set_pesoporton, 
    only: [:show, :edit, :update, :destroy]
  load_and_authorize_resource  class: ::Pesoporton

  def clase 
    "::Pesoporton"
  end

  def atributos_index
    [
      :id
    ]
  end

  def atributos_form
    [
      :id
    ]
  end

  def index_reordenar(registros)
    return registros.reorder(:id)
  end

  def new_modelo_path(o)
    return new_pesoporton_path()
  end

  def genclase
    return 'F'
  end


  private

  def set_pesoporton
    @registro = @pesoporton = ::Pesoporton.find(
      ::Pesoporton.connection.quote_string(params[:id]).to_i
    )
  end

  # No confiar parametros a Internet, sólo permitir lista blanca
  def pesoporton_params
    params.require(:pesoporton).permit(*atributos_form)
  end

end
